import { redirect } from "next/navigation";
import { getInterviewSession } from "@/lib/supabase/mock-interview";
import { InterviewRunner } from "@/components/mock-interview/InterviewRunner";
import { createClient } from "@/lib/supabase/server";
import { getJobsServer } from "@/lib/jobs/api";
import { calculateHeuristicMatch } from "@/lib/ai/matching-engine";
import type { Job, JobWithScores } from "@/lib/ai/types";

export const metadata = {
  title: "Interview Session | SwipeHire",
};

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function InterviewSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  let session;
  let error;
  
  try {
    session = await getInterviewSession(sessionId);
  } catch (err) {
    console.error(err);
    error = err;
  }

  if (error || !session) {
    redirect("/mock-interview");
  }

  // Fetch top jobs for Smart Recommendations integration
  let topJobs: JobWithScores[] = [];
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: resumeVersion } = await supabase
        .from("resume_versions")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (resumeVersion && resumeVersion.resume_data) {
        const realJobs = await getJobsServer();
        const scoredJobs = realJobs.map(job => {
          const scores = calculateHeuristicMatch(resumeVersion.resume_data, job as unknown as Job);
          return {
            ...job,
            heuristicScores: scores,
          } as JobWithScores;
        });
        topJobs = scoredJobs
          .sort((a, b) => b.heuristicScores!.overall_score - a.heuristicScores!.overall_score)
          .slice(0, 5); // Take top 5 for interview results
      }
    }
  } catch (jobsErr) {
    console.error("Failed to fetch jobs for interview session:", jobsErr);
  }

  return <InterviewRunner initialSession={session} topJobs={topJobs} />;
}
