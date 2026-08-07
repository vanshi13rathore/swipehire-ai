"use client";

import React from "react";
import { SmartRecommendationCard } from "@/components/jobs/smart-recommendation-card";
import type { Job } from "@/lib/ai/types";

interface JobWithCategory extends Job {
  category?: string;
  heuristicScores?: any;
}

export function JobCategorySection({ title, icon, jobs, categoryName }: { title: string, icon: React.ReactNode, jobs: JobWithCategory[], categoryName: string }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-secondary/30 rounded-xl shadow-sm border border-border/50">
          {icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <span className="bg-secondary/50 text-muted-foreground text-xs font-bold px-3 py-1 rounded-full ml-2">
          {jobs.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {jobs.slice(0, 3).map(job => (
          <SmartRecommendationCard 
            key={job.id} 
            job={job} 
            heuristicScore={job.heuristicScores.overall_score} 
            category={categoryName}
          />
        ))}
      </div>
    </div>
  );
}
