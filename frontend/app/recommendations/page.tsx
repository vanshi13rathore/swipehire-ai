import { Navbar, Footer } from "@/components/landing";
import { RecommendationsList } from "@/components/recommendations/recommendations-list";
import { getJobsServer } from "@/lib/jobs/api";
import { calculateHeuristicMatch } from "@/lib/ai/matching-engine";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileWarning } from "lucide-react";
import type { Job, JobWithScores } from "@/lib/ai/types";

export const metadata = {
  title: "Smart Recommendations - SwipeHire",
  description: "AI-curated jobs tailored to your Career DNA.",
};

export default async function RecommendationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let topJobs: JobWithScores[] = [];
  let hasResume = false;

  try {
    const { data: resumeVersion } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (resumeVersion && resumeVersion.resume_data) {
      hasResume = true;
      const realJobs = await getJobsServer();
      
      const scoredJobs = realJobs.map(job => {
        const scores = calculateHeuristicMatch(resumeVersion.resume_data, job as unknown as Job);
        return {
          ...job,
          heuristicScores: scores,
        } as JobWithScores;
      });

      // Sort by overall score descending and take top 10
      topJobs = scoredJobs
        .sort((a, b) => b.heuristicScores!.overall_score - a.heuristicScores!.overall_score)
        .slice(0, 10);
    }
  } catch (error) {
    console.error("Failed to fetch jobs or resume for Recommendations", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        {hasResume ? (
          <RecommendationsList topJobs={topJobs} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 px-4">
            <div className="p-6 bg-muted/50 rounded-full">
              <FileWarning className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No Resume Found</h2>
            <p className="text-muted-foreground max-w-md">
              We need a resume to analyze your Career DNA before we can recommend jobs. Upload one now to get started.
            </p>
            <Link href="/profile">
              <Button size="lg" className="mt-4">
                Upload Resume
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";
