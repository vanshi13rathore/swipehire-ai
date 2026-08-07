"use client";

import * as React from "react";
import { JobDetails } from "@/components/jobs";
import { supabase } from "@/lib/supabase/client";
import { getCareerChemistry } from "@/lib/actions/career-chemistry";
import type { MatchedJob, Job } from "@/lib/ai/types";
import { getJobs } from "@/lib/jobs/api";
import type { CareerMatch } from "@/lib/supabase/types";

export function JobDetailsClient({ id }: { id: string }) {
  const [chemistry, setChemistry] = React.useState<CareerMatch | null>(null);
  const [matchedJob, setMatchedJob] = React.useState<MatchedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hasResume, setHasResume] = React.useState(true);

  const [job, setJob] = React.useState<Job | null>(null);

  React.useEffect(() => {
    async function loadJobAndChemistry() {
      try {
        setLoading(true);
        setError(null);

        // Fetch real jobs and find the one matching id
        const allJobs = await getJobs();
        const foundJob = allJobs.find(j => j.id === id) || allJobs[0];
        setJob(foundJob);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasResume(false);
          return;
        }

        const chemistryResult = await getCareerChemistry(foundJob.id);
        
        setMatchedJob({
          ...foundJob,
          score: chemistryResult.overall_score,
          matchedSkills: [],
          missingSkills: chemistryResult.explanation?.missingRequirements || [],
          reasons: chemistryResult.explanation?.matchReasoning || [],
        } as MatchedJob);
        
        setChemistry(chemistryResult as unknown as typeof chemistry);
        setHasResume(true);
      } catch (err) {
        console.error("Failed to load chemistry", err);
        const errorMsg = err instanceof Error ? err.message : "Failed to analyze resume.";
        if (errorMsg.includes("Missing Requirement")) {
           setHasResume(false);
        } else {
           setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    }

    loadJobAndChemistry();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      {job ? (
        <JobDetails 
          id={id} 
          job={matchedJob || job}
          chemistry={chemistry}
          loading={loading}
          error={error}
          hasResume={hasResume}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">Loading job details...</div>
      )}
    </div>
  );
}
