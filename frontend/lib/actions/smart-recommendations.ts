"use server";

import { createClient } from "../supabase/server";
import { generateSmartRecommendation } from "../ai/recommendation-engine";
import { calculateHeuristicMatch } from "../ai/matching-engine";
import type { Job } from "../ai/types";
import type { ResumeData, SmartRecommendation } from "../supabase/types";

/**
 * Fetches or generates a Smart Recommendation for a specific job.
 * Caches the result in the smart_recommendations table.
 */
export async function getOrGenerateSmartRecommendation(job: Job): Promise<SmartRecommendation | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Check Cache
  const { data: cached } = await supabase
    .from("smart_recommendations")
    .select("*")
    .eq("user_id", user.id)
    .eq("job_id", job.id)
    .gte("expires_at", new Date().toISOString())
    .single();

  if (cached) {
    return cached as SmartRecommendation;
  }

  // 2. Fetch Resume
  const { data: resumeVersion } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!resumeVersion || !resumeVersion.resume_data) {
    throw new Error("Missing Requirement: You must upload a resume to generate smart recommendations.");
  }

  const resumeData = resumeVersion.resume_data as unknown as ResumeData;

  // 3. Generate Heuristic Score
  const heuristic = calculateHeuristicMatch(resumeData, job);

  // 4. Generate AI Explanation
  const explanation = await generateSmartRecommendation(resumeData, job, heuristic.overall_score);

  // 5. Save to Cache
  const { data: inserted, error } = await supabase
    .from("smart_recommendations")
    .insert({
      user_id: user.id,
      job_id: job.id,
      score: heuristic.overall_score,
      explanation
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to cache recommendation:", error);
    // Return generated data anyway so UI doesn't break
    return {
      id: "temp-id",
      user_id: user.id,
      job_id: job.id,
      score: heuristic.overall_score,
      explanation,
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return inserted as SmartRecommendation;
}
