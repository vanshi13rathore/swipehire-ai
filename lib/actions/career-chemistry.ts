"use server";

import { createClient } from "../supabase/server";
import { getJobsServer } from "@/lib/jobs/api";
import type { CareerMatch, Job, ResumeVersion } from "../supabase/types";
import { calculateHeuristicMatch, generateAIExplanation } from "../ai/matching-engine";

export async function getCareerChemistry(jobId: string): Promise<CareerMatch> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch Job
  const allJobs = await getJobsServer();
  const job = allJobs.find(j => j.id === jobId) as Job | undefined;
  if (!job) {
    throw new Error("Job not found");
  }

  // 2. Fetch User's Default (or latest) Resume Analysis
  const { data: resumeVersion, error: resumeError } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (resumeError || !resumeVersion) {
    throw new Error("NO_RESUME");
  }

  const resume = resumeVersion as ResumeVersion;

  // 3. Check Cache in career_matches table
  const { data: existingMatch } = await supabase
    .from("career_matches")
    .select("*")
    .eq("user_id", user.id)
    .eq("resume_version_id", resume.id)
    .eq("job_id", jobId)
    .single();

  // If we have a cached match AND it has the AI explanation, return it immediately.
  if (existingMatch && existingMatch.explanation) {
    return existingMatch as CareerMatch;
  }

  // 4. Calculate Heuristics
  let scores = existingMatch;
  if (!scores) {
    scores = calculateHeuristicMatch(resume.resume_data, job);
  }

  // 5. Generate AI Explanation
  const explanation = await generateAIExplanation(resume.resume_data, job);

  // 6. Save or Update in Database
  const matchData = {
    user_id: user.id,
    resume_version_id: resume.id,
    job_id: job.id,
    overall_score: scores.overall_score,
    skills_score: scores.skills_score,
    experience_score: scores.experience_score,
    education_score: scores.education_score,
    keyword_score: scores.keyword_score,
    explanation,
  };

  if (existingMatch) {
    const { data: updatedMatch, error: updateError } = await supabase
      .from("career_matches")
      .update(matchData)
      .eq("id", existingMatch.id)
      .select()
      .single();
      
    if (updateError) throw updateError;
    return updatedMatch as CareerMatch;
  } else {
    const { data: newMatch, error: insertError } = await supabase
      .from("career_matches")
      .insert([matchData])
      .select()
      .single();
      
    if (insertError) throw insertError;
    return newMatch as CareerMatch;
  }
}
