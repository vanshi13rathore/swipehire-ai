"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import type { JobWithScores } from "@/lib/ai/types";
import { getOrGenerateSmartRecommendation } from "@/lib/actions/smart-recommendations";
import type { SmartRecommendation } from "@/lib/supabase/types";

export function RecommendationsList({ topJobs }: { topJobs: JobWithScores[] }) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [recommendationsData, setRecommendationsData] = useState<Record<string, SmartRecommendation>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const toggleExpand = async (job: JobWithScores) => {
    if (expandedJobId === job.id) {
      setExpandedJobId(null);
      return;
    }

    setExpandedJobId(job.id);

    if (!recommendationsData[job.id]) {
      setLoadingMap(prev => ({ ...prev, [job.id]: true }));
      try {
        const smartRec = await getOrGenerateSmartRecommendation(job);
        if (smartRec) {
          setRecommendationsData(prev => ({ ...prev, [job.id]: smartRec }));
        }
      } catch (err) {
        console.error("Failed to generate smart recommendation", err);
      } finally {
        setLoadingMap(prev => ({ ...prev, [job.id]: false }));
      }
    }
  };

  if (topJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-muted/50 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Strong Matches Yet</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any jobs that strongly match your profile right now. Try updating your Career DNA or checking back later as new jobs are added daily!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Smart Recommendations
        </h1>
        <p className="text-muted-foreground mt-2">
          Jobs hand-picked for your Career DNA with actionable insights on how to land them.
        </p>
      </div>

      <div className="space-y-4">
        {topJobs.map((job, index) => {
          const isExpanded = expandedJobId === job.id;
          const isLoading = loadingMap[job.id];
          const recData = recommendationsData[job.id]?.explanation;
          const overallScore = job.heuristicScores?.overall_score || 0;

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border overflow-hidden transition-all duration-300 ${isExpanded ? "border-purple-500/50 shadow-lg shadow-purple-500/10 bg-card/60" : "border-border/50 bg-card/40 hover:border-purple-500/30"}`}>
                <div 
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onClick={() => toggleExpand(job)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        {overallScore}% Match
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location || "Remote"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company.name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs text-muted-foreground">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          +{job.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center md:flex-col justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                    {job.salary && (
                      <div className="text-sm font-medium flex items-center text-green-400">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="w-full md:w-auto text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                      {isExpanded ? (
                        <><ChevronUp className="w-4 h-4 mr-2" /> Hide Insights</>
                      ) : (
                        <><BrainCircuit className="w-4 h-4 mr-2" /> Reveal Insights</>
                      )}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-muted/20 border-t border-border/30"
                    >
                      <div className="p-6">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <BrainCircuit className="w-8 h-8 text-purple-500 animate-pulse" />
                            <p className="text-sm text-muted-foreground animate-pulse">Generating Smart Recommendation...</p>
                          </div>
                        ) : recData ? (
                          <div className="space-y-8">
                            
                            {/* Insight Banner */}
                            {recData.insight && (
                              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-purple-200 leading-relaxed">{recData.insight}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Why you match */}
                              <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2 text-green-400">
                                  <TrendingUp className="w-4 h-4" /> Why you're a fit
                                </h4>
                                <ul className="space-y-3">
                                  {recData.matchReasoning.map((reason, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                      <span className="text-green-500">•</span> {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Missing Requirements */}
                              <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2 text-orange-400">
                                  <AlertCircle className="w-4 h-4" /> Skill Gaps
                                </h4>
                                <ul className="space-y-3">
                                  {recData.missingRequirements.map((req, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                      <span className="text-orange-500">•</span> {req}
                                    </li>
                                  ))}
                                  {recData.missingRequirements.length === 0 && (
                                    <li className="text-sm text-muted-foreground">You perfectly match all requirements!</li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Dynamic Roadmap */}
                            {recData.dynamicRoadmap && recData.dynamicRoadmap.length > 0 && (
                              <div className="border-t border-border/50 pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold flex items-center gap-2 text-blue-400">
                                    <Briefcase className="w-4 h-4" /> Action Plan to Land This
                                  </h4>
                                  {recData.estimatedLearningTime && (
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                                      <Clock className="w-3 h-3 mr-1" /> {recData.estimatedLearningTime}
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-3">
                                  {recData.dynamicRoadmap.map((step, i) => (
                                    <div key={i} className="flex gap-4 p-3 rounded bg-background/50 border border-border/50">
                                      <div className="text-xs font-bold text-blue-400 shrink-0 w-16 pt-0.5">{step.timeframe}</div>
                                      <div className="text-sm text-muted-foreground leading-relaxed">{step.action}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="text-center text-red-400 py-4">Failed to load insights.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
