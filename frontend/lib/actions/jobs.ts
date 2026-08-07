"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Job } from "@/lib/ai/types";

export async function saveJobAction(job: Job): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("saved_jobs")
      .insert([{ user_id: user.id, job_id: job.id, job_data: job }]);

    if (error && error.code !== "23505") { // Ignore unique violation (already saved)
      console.error("Error saving job:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/saved-jobs");
    revalidatePath("/jobs");
    
    return { success: true };
  } catch (error: any) {
    console.error("Save job error:", error);
    return { success: false, error: error.message };
  }
}
