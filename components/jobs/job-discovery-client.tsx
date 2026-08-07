"use client";

import React, { useState } from "react";
import { JobCategorySection } from "@/components/jobs/job-category-section";
import { SwipeDeck } from "@/components/jobs/SwipeDeck";
import { useRouter } from "next/navigation";
import { Flame, Rocket, DollarSign, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/shared";
import type { Job } from "@/lib/ai/types";

import { saveJobAction } from "@/lib/actions/jobs";

interface JobWithCategory extends Job {
  category?: string;
  heuristicScores?: any;
}

interface JobDiscoveryClientProps {
  categorizedJobs: Record<string, JobWithCategory[]>;
  allJobs: JobWithCategory[];
}

export function JobDiscoveryClient({ categorizedJobs, allJobs }: JobDiscoveryClientProps) {
  const [activeTab, setActiveTab] = useState("swipe");
  const router = useRouter();

  const handleSwipe = async (job: JobWithCategory, direction: "left" | "right" | "up") => {
    if (direction === "right" || direction === "up") {
      const res = await saveJobAction(job);
      if (!res.success) {
        console.error(`Failed to save job: ${res.error}`);
      }
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-center w-full mb-8">
        <div className="flex items-center p-1 bg-secondary/50 rounded-lg border border-border/50">
          <button
            onClick={() => setActiveTab("swipe")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "swipe" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Swipe View
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Grid View
          </button>
        </div>
      </div>

      {activeTab === "swipe" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SwipeDeck 
            jobs={allJobs} 
            onSwipe={handleSwipe}
            onView={(id) => router.push(`/jobs/${id}`)}
            onApply={(id) => router.push(`/jobs/${id}`)}
            onSave={async (id) => {
              const job = allJobs.find(j => j.id === id);
              if (job) await saveJobAction(job);
            }} 
          />
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-16 animate-in fade-in duration-500">
          <JobCategorySection 
            title="Best Matches" 
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            jobs={categorizedJobs["Best Matches"]}
            categoryName="Best Matches"
          />

          <JobCategorySection 
            title="High Growth" 
            icon={<Rocket className="w-6 h-6 text-indigo-500" />}
            jobs={categorizedJobs["High Growth"]}
            categoryName="High Growth"
          />

          <JobCategorySection 
            title="Highest Salary" 
            icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
            jobs={categorizedJobs["Highest Salary"]}
            categoryName="Highest Salary"
          />

          <JobCategorySection 
            title="Best Learning Opportunity" 
            icon={<BookOpen className="w-6 h-6 text-blue-500" />}
            jobs={categorizedJobs["Best Learning Opportunity"]}
            categoryName="Best Learning Opportunity"
          />

          <JobCategorySection 
            title="Quick Apply" 
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            jobs={categorizedJobs["Quick Apply"]}
            categoryName="Quick Apply"
          />
        </div>
      )}
    </div>
  );
}
