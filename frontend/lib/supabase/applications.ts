import { supabase } from "./client";
import type { Job } from "@/lib/ai/types";
import type { Application, ApplicationStatus } from "./types";

export async function applyToJob(job: Job): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be authenticated to apply to jobs.");

  const { error } = await supabase
    .from('applications')
    .insert([{ user_id: user.id, job_id: job.id, job_data: job }]);

  // Ignore unique constraint violation (code 23505) as it means already applied
  if (error && error.code !== '23505') {
    throw new Error(error.message);
  }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be authenticated.");

  const { error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be authenticated.");

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getApplications(): Promise<Application[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return data as Application[];
}

export async function getAppliedJobIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('applications')
    .select('job_id')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching applied job IDs:", error);
    return [];
  }

  return data.map(row => row.job_id);
}

export async function getApplication(jobId: string): Promise<Application | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .eq('job_id', jobId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching application:", error);
    return null;
  }

  return data as Application | null;
}

export function isApplied(jobId: string, appliedJobIds: string[]): boolean {
  return appliedJobIds.includes(jobId);
}
