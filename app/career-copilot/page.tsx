import { redirect } from "next/navigation";
import { getResumeVersions } from "@/lib/supabase/resume-builder";
import { getSavedJobs } from "@/lib/supabase/saved-jobs";
import { getApplications } from "@/lib/supabase/applications";
import { getCareerChats } from "@/lib/supabase/career-copilot";
import type { CareerChat } from "@/lib/supabase/types";
import { CopilotChat } from "@/components/career-copilot/CopilotChat";

export const metadata = {
  title: "AI Career Copilot | SwipeHire",
  description: "Your personalized AI career coach.",
};

export default async function CareerCopilotPage() {
  let context: Record<string, unknown>;
  let pastChats: CareerChat[] = [];

  try {
    // Fetch context in parallel
    const [resumes, savedJobs, applications, fetchedPastChats] = await Promise.all([
      getResumeVersions().catch(() => []),
      getSavedJobs().catch(() => []),
      getApplications().catch(() => []),
      getCareerChats().catch(() => [])
    ]);

    const defaultResume = resumes.find(r => r.is_default) || resumes[0];

    context = {
      resumeData: defaultResume ? defaultResume.resume_data as unknown as Record<string, unknown> : null,
      savedJobs: savedJobs.slice(0, 5) as unknown as Record<string, unknown>[], // Send top 5 to save tokens
      applications: applications.slice(0, 5) as unknown as Record<string, unknown>[],
      atsScore: null,
      tailoredResume: null
    };
    
    pastChats = fetchedPastChats;
  } catch (error) {
    console.error(error);
    redirect("/dashboard");
  }

  return (
    <CopilotChat 
      initialContext={context}
      pastChats={pastChats}
    />
  );
}
