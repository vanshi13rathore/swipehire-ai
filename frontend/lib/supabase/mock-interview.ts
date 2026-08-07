

import { createClient } from "./server";
import type { InterviewSession } from "./types";

export async function getInterviewSessions(): Promise<InterviewSession[]> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  
  return data.map((session: Record<string, unknown>) => ({
    ...session,
    mode: (session.answers as Record<string, string>)?._mode || 'Technical',
    turns: session.questions || [],
  })) as InterviewSession[];
}

export async function getInterviewSession(id: string): Promise<InterviewSession> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  
  const session = data as Record<string, unknown>;
  return {
    ...session,
    mode: (session.answers as Record<string, string>)?._mode || 'Technical',
    turns: session.questions || [],
  } as InterviewSession;
}

export async function createInterviewSession(payload: Partial<InterviewSession>): Promise<InterviewSession> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const dbPayload: Record<string, unknown> = {
    ...payload,
    user_id: user.id,
  };
  
  if (payload.turns) {
    dbPayload.questions = payload.turns;
    delete dbPayload.turns;
  }
  if (payload.mode) {
    dbPayload.answers = { _mode: payload.mode };
    delete dbPayload.mode;
  }

  const { data, error } = await supabase
    .from("interview_sessions")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  const session = data as Record<string, unknown>;
  return {
    ...session,
    mode: (session.answers as Record<string, string>)?._mode || 'Technical',
    turns: session.questions || [],
  } as InterviewSession;
}

export async function updateInterviewSession(id: string, updates: Partial<InterviewSession>): Promise<InterviewSession> {
  const supabase = await createClient();
  
  const dbUpdates: Record<string, unknown> = { ...updates };
  if (updates.turns !== undefined) {
    dbUpdates.questions = updates.turns;
    delete dbUpdates.turns;
  }
  if (updates.mode !== undefined) {
    dbUpdates.answers = { _mode: updates.mode };
    delete dbUpdates.mode;
  }

  const { data, error } = await supabase
    .from("interview_sessions")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  const session = data as Record<string, unknown>;
  return {
    ...session,
    mode: (session.answers as Record<string, string>)?._mode || 'Technical',
    turns: session.questions || [],
  } as InterviewSession;
}

export async function deleteInterviewSession(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("interview_sessions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
