"use client";

import * as React from "react";
import { JobDetails } from "@/components/jobs";
import { supabase } from "@/lib/supabase/client";
import { getResumeAnalysis } from "@/lib/ai/pipeline";
import { matchResumeToJob } from "@/lib/ai/job-matcher";
import { generateCareerChemistry, type CareerChemistryResult } from "@/lib/ai/career-chemistry";
import { mockJobs } from "@/components/jobs/mock-jobs";
import type { MatchedJob } from "@/lib/ai/types";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [chemistry, setChemistry] = React.useState<CareerChemistryResult | null>(null);
  const [matchedJob, setMatchedJob] = React.useState<MatchedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hasResume, setHasResume] = React.useState(true);

  const job = mockJobs.find((j) => j.id === params.id) || mockJobs[0];

  React.useEffect(() => {
    async function loadChemistry() {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasResume(false);
          return;
        }

        const { data: files } = await supabase.storage
          .from("resumes")
          .list(user.id, { sortBy: { column: "created_at", order: "desc" } });

        const latestResume = files?.find((f) => f.name.endsWith(".pdf"));
        if (!latestResume) {
          setHasResume(false);
          return;
        }

        const { data: blob } = await supabase.storage
          .from("resumes")
          .download(`${user.id}/${latestResume.name}`);

        if (!blob) {
          setHasResume(false);
          return;
        }

        const file = new File([blob], latestResume.name, { type: "application/pdf" });
        
        const updatedTime = latestResume.updated_at 
          ? new Date(latestResume.updated_at as string).getTime() 
          : new Date(latestResume.created_at as string).getTime();

        const analysis = await getResumeAnalysis({
          file,
          userId: user.id,
          filename: latestResume.name,
          updatedTime
        });
        
        const matchResult = matchResumeToJob(analysis, job);
        const fullMatchedJob: MatchedJob = {
          ...job,
          score: matchResult.score,
          matchedSkills: matchResult.matchedSkills,
          missingSkills: matchResult.missingSkills,
          reasons: matchResult.reasons,
        };
        
        const chemistryResult = generateCareerChemistry(analysis, fullMatchedJob);
        
        setMatchedJob(fullMatchedJob);
        setChemistry(chemistryResult);
        setHasResume(true);
      } catch (err) {
        console.error("Failed to load chemistry", err);
        setError("Failed to analyze resume. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadChemistry();
  }, [job]);

  return (
    <div className="min-h-screen bg-background">
      <JobDetails 
        id={params.id} 
        job={matchedJob || job}
        chemistry={chemistry}
        loading={loading}
        error={error}
        hasResume={hasResume}
      />
    </div>
  );
}
