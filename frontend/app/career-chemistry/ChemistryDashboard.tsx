"use client";

import * as React from "react";
import { getCareerChemistry } from "@/lib/actions/career-chemistry";
import { CareerChemistry } from "@/components/ai";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/shared";
import { Loader2, Briefcase, ChevronRight, Building, MapPin } from "lucide-react";
import type { CareerMatch } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

import type { Job } from "@/lib/ai/types";

export interface JobWithScores extends Job {
  chemistryScore: number;
  heuristicScores: {
    overall_score: number;
    skills_score: number;
    experience_score: number;
    education_score: number;
    keyword_score: number;
  };
}

interface ChemistryDashboardProps {
  initialJobs: JobWithScores[];
}

export function ChemistryDashboard({ initialJobs }: ChemistryDashboardProps) {
  const [selectedJob, setSelectedJob] = React.useState<JobWithScores | null>(initialJobs[0] || null);
  const [detailedChemistry, setDetailedChemistry] = React.useState<CareerMatch | null>(null);
  const [isLoadingDetailed, setIsLoadingDetailed] = React.useState(false);

  React.useEffect(() => {
    if (!selectedJob) return;

    async function loadDetailed() {
      setIsLoadingDetailed(true);
      try {
        const result = await getCareerChemistry(selectedJob!.id);
        setDetailedChemistry(result);
      } catch (err) {
        console.error("Failed to fetch detailed chemistry", err);
      } finally {
        setIsLoadingDetailed(false);
      }
    }

    loadDetailed();
  }, [selectedJob]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Top Matching Jobs</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Based on our fast heuristic engine, these jobs are your strongest potential fits. 
          Select one to generate deep AI insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Job List */}
        <div className="lg:col-span-4 space-y-4 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
          {initialJobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <Card 
                key={job.id} 
                className={cn(
                  "p-4 cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden",
                  isSelected ? "border-primary shadow-md bg-primary/5" : "bg-card/50"
                )}
                onClick={() => setSelectedJob(job)}
              >
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base leading-tight text-foreground">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Building className="w-3.5 h-3.5" /> {job.company.name}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-secondary shrink-0 border border-border">
                    <span className="font-black text-sm">{job.chemistryScore}%</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="bg-secondary/50 px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  <span className="bg-secondary/50 px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {job.experienceLevel}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Detailed Chemistry */}
        <div className="lg:col-span-8">
          {selectedJob ? (
            <div className="sticky top-8">
              {isLoadingDetailed ? (
                <Card className="w-full h-[600px] flex flex-col items-center justify-center bg-card/50 border-dashed border-2">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="font-medium text-muted-foreground">Running Gemini 2.5 Flash...</p>
                  <p className="text-sm text-muted-foreground mt-2">Computing explanations and improvement roadmap</p>
                </Card>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CareerChemistry 
                    score={detailedChemistry?.overall_score || selectedJob.chemistryScore}
                    skillsScore={detailedChemistry?.skills_score || selectedJob.heuristicScores.skills_score}
                    experienceScore={detailedChemistry?.experience_score || selectedJob.heuristicScores.experience_score}
                    educationScore={detailedChemistry?.education_score || selectedJob.heuristicScores.education_score}
                    keywordScore={detailedChemistry?.keyword_score || selectedJob.heuristicScores.keyword_score}
                    missingSkills={detailedChemistry?.explanation?.missingRequirements || []}
                    matchReasoning={detailedChemistry?.explanation?.matchReasoning || []}
                    improvementPlan={detailedChemistry?.explanation?.improvementPlan || []}
                    className="max-w-none shadow-xl border-primary/30"
                  />
                  
                  <div className="flex justify-center pt-4">
                     <Button 
                        size="xl" 
                        onClick={() => window.location.href = `/jobs/${selectedJob.id}`}
                        className="font-bold shadow-lg shadow-primary/20"
                     >
                        View Full Job Details <ChevronRight className="w-5 h-5 ml-1" />
                     </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="w-full h-full min-h-[400px] flex items-center justify-center bg-secondary/10 border-dashed">
              <p className="text-muted-foreground font-medium">Select a job to view detailed Career Chemistry™</p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
