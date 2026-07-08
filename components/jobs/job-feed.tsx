import * as React from "react";
import { JobCard, type Job } from "./job-card";

export interface JobFeedProps {
  jobs?: (Job & { matchPercentage?: number; featured?: boolean })[];
  loading?: boolean;
}

export function JobFeed({ jobs = [], loading = false }: JobFeedProps) {
  if (loading) {
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
          matchPercentage={job.matchPercentage}
          featured={job.featured}
        />
      ))}
    </div>
  );
}
