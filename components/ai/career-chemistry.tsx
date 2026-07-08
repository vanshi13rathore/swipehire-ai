import * as React from "react";
import { MatchScore } from "./match-score";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2, MapPin, DollarSign, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisItemProps {
  icon: React.ElementType;
  title: string;
  percentage: number;
  explanation: string;
}

function AnalysisItem({ icon: Icon, title, percentage, explanation }: AnalysisItemProps) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background shadow-sm border border-border">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <span className="font-bold text-success text-sm bg-success/10 px-2.5 py-0.5 rounded-full">
          {percentage}%
        </span>
      </div>
      <p className="text-sm text-muted-foreground ml-12">
        {explanation}
      </p>
    </div>
  );
}

export function CareerChemistry({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className={cn("w-full max-w-lg mx-auto border-primary/20 shadow-lg relative overflow-hidden", className)} {...props}>
      {/* Decorative gradient blur */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-xl" />

      <CardHeader className="text-center pb-8 border-b border-border/50">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Career Chemistry™
        </h2>
        <p className="text-muted-foreground text-sm">Why this job matches you</p>
        
        <div className="mt-8 flex justify-center">
          <MatchScore score={95} className="w-40 h-40 border-[4px]" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-8">
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-4 px-1">
          Detailed Analysis
        </h3>
        
        <div className="space-y-3">
          <AnalysisItem 
            icon={CheckCircle2}
            title="Skills Match"
            percentage={98}
            explanation="You have 8/9 required skills, including React, TypeScript, and Node.js."
          />
          <AnalysisItem 
            icon={Briefcase}
            title="Experience Match"
            percentage={92}
            explanation="Your 4 years as a Senior Frontend Engineer aligns perfectly with the requirement."
          />
          <AnalysisItem 
            icon={DollarSign}
            title="Salary Match"
            percentage={100}
            explanation="The offered $150k-$180k range exceeds your target salary of $140k."
          />
          <AnalysisItem 
            icon={MapPin}
            title="Location Match"
            percentage={90}
            explanation="Fully remote role fits your preference for flexible working hours."
          />
        </div>
      </CardContent>
    </Card>
  );
}
