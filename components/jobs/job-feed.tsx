"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { JobCard } from "./job-card";
import type { RecommendedJob, Job } from "@/lib/ai/types";
import { getSavedJobIds, saveJob, unsaveJob, isJobSaved } from "@/lib/supabase/saved-jobs";
import { getAppliedJobIds, applyToJob, isApplied } from "@/lib/supabase/applications";

export interface JobFeedProps {
  jobs?: ((RecommendedJob | Job) & { featured?: boolean })[];
  loading?: boolean;
}

export function JobFeed({ jobs = [], loading = false }: JobFeedProps) {
  const router = useRouter();
  const [savedJobIds, setSavedJobIds] = React.useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = React.useState<string[]>([]);
  const [loadingState, setLoadingState] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [savedIds, appliedIds] = await Promise.all([
          getSavedJobIds(),
          getAppliedJobIds()
        ]);
        setSavedJobIds(savedIds);
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Failed to load user state:", err);
      } finally {
        setLoadingState(false);
      }
    }
    loadData();
  }, []);

  const handleSaveToggle = async (job: Job | RecommendedJob) => {
    const currentlySaved = isJobSaved(job.id, savedJobIds);
    
    // Optimistic UI update
    setSavedJobIds(prev => 
      currentlySaved ? prev.filter(id => id !== job.id) : [...prev, job.id]
    );

    try {
      if (currentlySaved) {
        await unsaveJob(job.id);
      } else {
        await saveJob(job as Job);
      }
    } catch (err) {
      console.error("Failed to toggle saved job:", err);
      // Revert on error
      setSavedJobIds(prev => 
        currentlySaved ? [...prev, job.id] : prev.filter(id => id !== job.id)
      );
    }
  };

  const handleApply = async (job: Job | RecommendedJob) => {
    if (isApplied(job.id, appliedJobIds)) return;

    // Optimistic UI update
    setAppliedJobIds(prev => [...prev, job.id]);

    try {
      await applyToJob(job as Job);
    } catch (err) {
      console.error("Failed to apply to job:", err);
      // Revert on error
      setAppliedJobIds(prev => prev.filter(id => id !== job.id));
    }
  };

  if (loading || loadingState) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCard key={`skeleton-${i}`} loading />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn&apos;t find any opportunities matching your current preferences. Try updating your filters or career DNA.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          matchPercentage={'recommendationScore' in job ? (job as RecommendedJob).recommendationScore : undefined}
          featured={'featured' in job ? (job as { featured?: boolean }).featured : false}
          saved={isJobSaved(job.id, savedJobIds)}
          applied={isApplied(job.id, appliedJobIds)}
          onSave={() => handleSaveToggle(job)}
          onApply={() => handleApply(job)}
          onClick={() => router.push(`/jobs/${job.id}`)}
          onView={() => router.push(`/jobs/${job.id}`)}
          className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
        />
      ))}
    </div>
  );
}
