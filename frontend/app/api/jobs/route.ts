import { NextResponse } from 'next/server';
import { normalizeJob } from '@/lib/jobs/api';
import type { RemotiveResponse } from '@/lib/jobs/types';
import { env } from "@/env.mjs";

// Cache the external response for 1 hour
export async function GET() {
  // Use the verified environment variable
  const url = env.JOBS_API_URL;
  if (!url) {
    console.error("Missing JOBS_API_URL environment variable.");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`External API error: ${response.status}`);
      return NextResponse.json({ error: "Failed to fetch from external provider" }, { status: 502 });
    }

    const data: RemotiveResponse = await response.json();

    if (!data.jobs || !Array.isArray(data.jobs)) {
      return NextResponse.json([]);
    }

    const standardizedJobs = data.jobs.map(normalizeJob);
    return NextResponse.json(standardizedJobs);
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Request to external provider timed out");
      return NextResponse.json({ error: "Request to external provider timed out" }, { status: 504 });
    }
    
    console.error("Error in jobs route handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
