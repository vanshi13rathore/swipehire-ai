import { createClient } from "@/lib/supabase/server";
import { getJobsServer } from "@/lib/jobs/api";
import { calculateHeuristicMatch } from "@/lib/ai/matching-engine";
import { ChemistryDashboard } from "./ChemistryDashboard";
import { redirect } from "next/navigation";
import type { Job } from "@/lib/ai/types";
import { Button } from "@/components/shared";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Career Chemistry™ | SwipeHire",
  description: "Your personalized AI career matching engine.",
};

export default async function CareerChemistryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get Default Resume
  const { data: resumeVersion, error } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !resumeVersion) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-3">No Resume Found</h1>
        <p className="text-muted-foreground max-w-md text-center mb-8 text-lg">
          Career Chemistry™ needs your resume to analyze your skills and match you with perfect opportunities.
        </p>
        <Link href="/resume">
          <Button size="xl" className="font-bold shadow-lg shadow-primary/20">
            Upload Resume
          </Button>
        </Link>
      </div>
    );
  }

  // Handle case where resume exists but hasn't finished processing or AI failed
  const isProcessing = !resumeVersion.resume_data || Object.keys(resumeVersion.resume_data).length === 0 || !resumeVersion.resume_data.skills;
  
  if (isProcessing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
          <AlertCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-3 text-center">Resume Analysis Processing</h1>
        <p className="text-muted-foreground max-w-md text-center mb-8 text-lg">
          We&apos;re still extracting your Career DNA. Please wait a moment for the AI to finish analyzing your resume.
        </p>
        <Link href="/career-chemistry">
          <Button size="xl" variant="outline" className="font-bold shadow-sm">
            Refresh Status
          </Button>
        </Link>
      </div>
    );
  }

  // Fetch real jobs
  const realJobs = await getJobsServer();

  // Bulk process heuristics for all jobs
  const jobsWithScores = realJobs.map(job => {
    const scores = calculateHeuristicMatch(resumeVersion.resume_data, job as unknown as Job);
    return {
      ...job,
      chemistryScore: scores.overall_score,
      heuristicScores: scores
    };
  }).sort((a, b) => b.chemistryScore - a.chemistryScore);

  return (
    <div className="min-h-screen bg-background">
      <ChemistryDashboard initialJobs={jobsWithScores} />
    </div>
  );
}
