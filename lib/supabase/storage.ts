import { supabase } from "./client";

export async function uploadResume(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/resume-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(filePath, file, {
      upsert: true,
    });
    
  if (error) {
    console.error("Error uploading resume:", error.message);
    throw error;
  }
  
  return data;
}

export async function deleteResume(path: string) {
  const { error } = await supabase.storage
    .from('resumes')
    .remove([path]);
    
  if (error) {
    console.error("Error deleting resume:", error.message);
    throw error;
  }
}

export function getResumePublicUrl(path: string) {
  const { data } = supabase.storage
    .from('resumes')
    .getPublicUrl(path);
    
  return data.publicUrl;
}
