/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { generateDashboardInsights } from "@/lib/ai/analytics";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata = {
  title: "Career Dashboard | SwipeHire",
  description: "Track your career progress, insights, and goals.",
};

export default async function DashboardPage() {
  let aggregatedData;
  let insights;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // Parallel fetching directly from DB to avoid client-only helpers breaking on the server
    const [
      { data: resumesData },
      { data: savedJobsData },
      { data: applicationsData },
      { data: interviewsData },
      { data: chatsData },
      { data: goalsData }
    ] = await Promise.all([
      supabase.from("resume_versions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("saved_jobs").select("*").eq("user_id", user.id),
      supabase.from("applications").select("*").eq("user_id", user.id),
      supabase.from("interview_sessions").select("*").eq("user_id", user.id),
      supabase.from("career_copilot_chats").select("*").eq("user_id", user.id),
      supabase.from("career_goals").select("*").eq("user_id", user.id)
    ]);

    const resumes = resumesData || [];
    const savedJobs = savedJobsData || [];
    const applications = applicationsData || [];
    const interviews = interviewsData || [];
    const chats = chatsData || [];
    const goals = goalsData || [];

    const defaultResume = resumes.find((r: any) => r.is_default) || resumes[0];

    const completedInterviews = interviews.filter((i: any) => i.status === 'Completed' && i.overall_score != null);
    const avgInterviewScore = completedInterviews.length > 0
      ? Math.round(completedInterviews.reduce((acc: number, curr: any) => acc + ((curr.overall_score as number) || 0), 0) / completedInterviews.length)
      : 0;

    // Build context for AI
    const context = {
      resumes,
      defaultResume,
      savedJobs,
      applications,
      interviews,
      avgInterviewScore,
      chats
    };

    // Lazy generation on server to avoid blocking the whole page, 
    // but in a Server Component we await it.
    insights = await generateDashboardInsights(context);

    aggregatedData = {
      resumesCount: resumes.length,
      savedJobsCount: savedJobs.length,
      applicationsCount: applications.length,
      interviewsCount: interviews.length,
      avgInterviewScore,
      applications,
      interviews,
      savedJobs,
      goals
    };
  } catch (error) {
    console.error(error);
    redirect("/jobs");
  }

  return <DashboardView data={aggregatedData} insights={insights} />;
}

export const dynamic = "force-dynamic";
