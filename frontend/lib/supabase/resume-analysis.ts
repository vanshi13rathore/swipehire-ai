import { supabase } from "./client";
import type { ResumeAnalysis } from "@/lib/ai/types";

export async function getStoredResumeAnalysis(
  userId: string,
  filename: string,
  updatedTime: number
): Promise<ResumeAnalysis | null> {
  const { data, error } = await supabase
    .from("resume_analyses")
    .select("analysis")
    .eq("user_id", userId)
    .eq("resume_filename", filename)
    .eq("resume_updated_at", new Date(updatedTime).toISOString())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.analysis as ResumeAnalysis;
}

export async function saveResumeAnalysis(
  userId: string,
  filename: string,
  updatedTime: number,
  analysis: ResumeAnalysis
): Promise<void> {
  const { error } = await supabase
    .from("resume_analyses")
    .upsert(
      {
        user_id: userId,
        resume_filename: filename,
        resume_updated_at: new Date(updatedTime).toISOString(),
        analysis: analysis,
      },
      {
        onConflict: "user_id,resume_filename,resume_updated_at",
      }
    );

  if (error) {
    console.error("Failed to save resume analysis to DB", error);
  }
}

export async function deleteResumeAnalysis(
  userId: string,
  filename: string,
  updatedTime: number
): Promise<void> {
  const { error } = await supabase
    .from("resume_analyses")
    .delete()
    .eq("user_id", userId)
    .eq("resume_filename", filename)
    .eq("resume_updated_at", new Date(updatedTime).toISOString());

  if (error) {
    console.error("Failed to delete resume analysis from DB", error);
  }
}
