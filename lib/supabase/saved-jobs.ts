import { supabase } from "./client";
import type { Job } from "@/lib/ai/types";

export async function saveJob(job: Job): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be authenticated to save jobs.");

  const { error } = await supabase
    .from('saved_jobs')
    .insert([{ user_id: user.id, job_id: job.id, job_data: job }]);

  // Ignore unique constraint violation (code 23505) as it means it's already saved
  if (error && error.code !== '23505') {
    throw new Error(error.message);
  }
}

export async function unsaveJob(jobId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be authenticated to unsave jobs.");

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('user_id', user.id)
    .eq('job_id', jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getSavedJobIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching saved job IDs:", error);
    return [];
  }

  return data.map(row => row.job_id);
}

export async function getSavedJobs(): Promise<Job[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_jobs')
    .select('job_data')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error("Error fetching saved jobs data:", error);
    return [];
  }

  return data.map(row => row.job_data as Job);
}

export function isJobSaved(jobId: string, savedJobs: string[]): boolean {
  return savedJobs.includes(jobId);
}
