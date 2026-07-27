"use server";

import { supabase } from "./client";
import type { InterviewSession } from "./types";

export async function getInterviewSessions(): Promise<InterviewSession[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as InterviewSession[];
}

export async function getInterviewSession(id: string): Promise<InterviewSession> {
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as InterviewSession;
}

export async function createInterviewSession(payload: Partial<InterviewSession>): Promise<InterviewSession> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("interview_sessions")
    .insert({
      user_id: user.id,
      ...payload
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as InterviewSession;
}

export async function updateInterviewSession(id: string, updates: Partial<InterviewSession>): Promise<InterviewSession> {
  const { data, error } = await supabase
    .from("interview_sessions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as InterviewSession;
}

export async function deleteInterviewSession(id: string): Promise<void> {
  const { error } = await supabase
    .from("interview_sessions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
