"use server";

import { analyzeResume } from "@/lib/ai/analyze";
import type { ResumeAnalysis } from "@/lib/ai/types";

export async function analyzeResumeAction(text: string): Promise<ResumeAnalysis> {
  return await analyzeResume(text);
}
