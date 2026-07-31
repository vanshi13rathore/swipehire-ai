import * as React from "react";
import { MatchScore } from "./match-score";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2, TrendingUp, GraduationCap, FileText, ArrowUpRight, CheckCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricRowProps {
  icon: React.ElementType;
  title: string;
  percentage: number;
  iconColor: string;
}

function MetricRow({ icon: Icon, title, percentage, iconColor }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-background shadow-sm border border-border", iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">{title}</span>
      </div>
      <span className="font-bold text-sm bg-secondary/50 px-2.5 py-1 rounded-full">
        {percentage}%
      </span>
    </div>
  );
}

export interface CareerChemistryProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  skillsScore?: number;
  experienceScore?: number;
  educationScore?: number;
  keywordScore?: number;
  missingSkills?: string[];
  matchReasoning?: string[];
  improvementPlan?: string[];
}

export function CareerChemistry({ 
  score = 0,
  skillsScore = 0,
  experienceScore = 0,
  educationScore = 0,
  keywordScore = 0,
  missingSkills = [],
  matchReasoning = [],
  improvementPlan = [],
  className, 
  ...props 
}: CareerChemistryProps) {
  return (
    <Card className={cn("w-full max-w-lg mx-auto border-primary/20 shadow-lg relative overflow-hidden", className)} {...props}>
      {/* Decorative gradient blur */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-xl" />

      <CardHeader className="text-center pb-6 border-b border-border/50">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-inner">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Career Chemistry™
        </h2>
        <p className="text-muted-foreground text-sm font-medium">AI-powered fit analysis</p>
        
        <div className="mt-8 flex justify-center">
          <MatchScore score={score} className="scale-125 my-4" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        
        {/* Breakdown */}
        <div className="space-y-1 bg-secondary/5 p-2 rounded-2xl border border-border/50 shadow-inner">
          <MetricRow icon={CheckCircle2} title="Skills Match" percentage={skillsScore} iconColor="text-green-500" />
          <MetricRow icon={TrendingUp} title="Experience Match" percentage={experienceScore} iconColor="text-blue-500" />
          <MetricRow icon={GraduationCap} title="Education Match" percentage={educationScore} iconColor="text-purple-500" />
          <MetricRow icon={FileText} title="Keyword Optimization" percentage={keywordScore} iconColor="text-orange-500" />
        </div>

        {/* Strengths (Reasoning) */}
        {matchReasoning.length > 0 && (
          <div>
            <h3 className="font-bold text-base text-foreground mb-3 px-1 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Why you&apos;re a fit
            </h3>
            <ul className="space-y-2 px-1">
              {matchReasoning.map((reason, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2 bg-green-500/5 p-2.5 rounded-lg border border-green-500/10">
                  <span className="text-green-500 font-bold shrink-0 mt-0.5">•</span>
                  {reason.replace(/^✓\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <h3 className="font-bold text-base text-foreground mb-3 px-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-destructive" /> Missing Requirements
              </div>
              <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">{missingSkills.length} Total</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 px-1">
              {missingSkills.map((skill) => (
                <li key={skill} className="text-sm font-medium text-muted-foreground flex items-center gap-2 bg-secondary/30 p-2 rounded-lg border border-border/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="truncate">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actionable Roadmap */}
        {improvementPlan.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-base text-primary mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" /> Improvement Roadmap
            </h3>
            <ul className="space-y-3 relative before:absolute before:inset-y-0 before:left-2 before:w-[2px] before:bg-primary/20">
              {improvementPlan.map((step, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed flex gap-4 relative">
                  <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex-shrink-0 mt-0.5 z-10" />
                  <span className="font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
