"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, MapPin, DollarSign, BrainCircuit, 
  ChevronDown, ChevronUp, Loader2, Target, CheckCircle2, XCircle
} from "lucide-react";
import type { Job, SmartRecommendation } from "@/lib/supabase/types";
import { getOrGenerateSmartRecommendation } from "@/lib/actions/smart-recommendations";
import { CareerRoadmap } from "./career-roadmap";

interface Props {
  job: Job;
  heuristicScore: number;
  category: string;
}

export function SmartRecommendationCard({ job, heuristicScore, category }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [aiData, setAiData] = useState<SmartRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded && !aiData && !loading) {
      setLoading(true);
      try {
        const result = await getOrGenerateSmartRecommendation(job);
        setAiData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 bg-card/60 backdrop-blur-xl">
      <CardContent className="p-0">
        
        {/* Top Summary Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                {category}
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight">{job.title}</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                <Building2 className="w-4 h-4" /> {job.company.name}
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4" /> {job.location}
              </div>
              {job.salary && job.salary !== "Competitive" && (
                <div className="flex items-center gap-1.5 bg-success/10 text-success px-3 py-1.5 rounded-full">
                  <DollarSign className="w-4 h-4" /> {job.salary}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {(job.skills || []).slice(0, 4).map((skill, i) => (
                <Badge key={i} variant="outline" className="border-border/50 bg-background/50">
                  {skill}
                </Badge>
              ))}
              {(job.skills || []).length > 4 && (
                <Badge variant="outline" className="border-border/50 bg-background/50 text-muted-foreground">
                  +{(job.skills || []).length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-secondary/20 p-6 rounded-3xl min-w-[140px] border border-border/50">
            <div className="text-4xl font-black text-primary">{heuristicScore}%</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Match</div>
          </div>
        </div>

        {/* AI Action Bar */}
        <div className="px-6 md:px-8 py-4 bg-secondary/10 border-t border-border/50 flex flex-wrap gap-4 items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-primary font-semibold hover:bg-primary/10 hover:text-primary gap-2"
            onClick={handleExpand}
          >
            <BrainCircuit className="w-4 h-4" /> 
            {expanded ? "Hide AI Analysis" : "Why am I a match?"}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-border/50 shadow-sm font-semibold">
              Save Job
            </Button>
            <Button className="flex-1 sm:flex-none shadow-md font-bold group">
              Quick Apply
            </Button>
          </div>
        </div>

        {/* Expanded AI Analysis Section */}
        {expanded && (
          <div className="border-t border-border/50 bg-background/50 p-6 md:p-8 animate-in slide-in-from-top-2 fade-in duration-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="font-medium">Generating AI Recommendation...</p>
              </div>
            ) : aiData ? (
              <div className="space-y-8">
                
                {/* Reasoning & Missing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 bg-success/5 p-6 rounded-3xl border border-success/10">
                    <h4 className="font-bold flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" /> Why You Match
                    </h4>
                    <ul className="space-y-3">
                      {aiData.explanation.matchReasoning.map((r, i) => (
                        <li key={i} className="text-sm text-foreground/90 flex items-start gap-2 leading-relaxed">
                          <span className="text-success mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 bg-destructive/5 p-6 rounded-3xl border border-destructive/10">
                    <h4 className="font-bold flex items-center gap-2 text-destructive">
                      <XCircle className="w-5 h-5" /> Missing Skills
                    </h4>
                    {aiData.explanation.missingRequirements.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {aiData.explanation.missingRequirements.map((m, i) => (
                            <Badge key={i} variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 font-semibold">
                              {m}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm font-semibold bg-background p-3 rounded-xl border border-border inline-block shadow-sm">
                          ⏱ Estimated time to learn: <span className="text-primary">{aiData.explanation.estimatedLearningTime}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic bg-background p-4 rounded-xl border border-border">
                        You meet all core requirements for this role!
                      </p>
                    )}
                  </div>
                </div>

                {/* Career Roadmap */}
                {aiData.explanation.missingRequirements.length > 0 && (
                  <div className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
                    <h4 className="font-bold flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-primary" /> Action Plan
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Follow this dynamic roadmap to reach a 98%+ match for this role.
                    </p>
                    <CareerRoadmap steps={aiData.explanation.dynamicRoadmap} />
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-8 text-destructive font-medium">
                Failed to load AI analysis. Please try again.
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
