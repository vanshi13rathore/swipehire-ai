import { supabase } from "./client";
import type { ResumeVersion, ResumeData } from "./types";

export const defaultResumeData: ResumeData = {
  header: {
    name: "",
    email: "",
    phone: "",
    location: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
  links: [],
};

export async function getResumeVersions(): Promise<ResumeVersion[]> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as ResumeVersion[];
}

export async function getResume(id: string): Promise<ResumeVersion> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as ResumeVersion;
}

export async function createResume(title: string, resumeData: ResumeData = defaultResumeData, isDefault = false): Promise<ResumeVersion> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase.rpc('create_resume_atomic', {
    p_title: title,
    p_resume_data: resumeData,
    p_is_default: isDefault
  });

  if (error) {
    console.error(`[UPLOAD ERROR] Transaction failed:`, error);
    throw error;
  }

  return data as ResumeVersion;
}

export async function updateResume(id: string, updates: Partial<{ title: string; resume_data: ResumeData; is_default: boolean }>): Promise<ResumeVersion> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("resume_versions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as ResumeVersion;
}

export async function deleteResume(id: string): Promise<void> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("resume_versions")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    throw error;
  }
}

export async function duplicateResume(id: string, newTitle: string): Promise<ResumeVersion> {
  const original = await getResume(id);
  return createResume(newTitle, original.resume_data, false);
}

export async function setDefaultResume(id: string): Promise<void> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.rpc('set_default_resume_atomic', {
    p_resume_id: id
  });

  if (error) {
    console.error(`[ATOMIC DEFAULT ERROR] Transaction failed for setting default:`, error);
    throw error;
  }
}
