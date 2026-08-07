import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, TrendingUp } from "lucide-react";

interface Props {
  insight: string;
}

export function AiCareerInsights({ insight }: Props) {
  if (!insight) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative">
      {/* Decorative background blur */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center relative z-10">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 rounded-3xl bg-background border border-primary/20 shadow-inner flex items-center justify-center rotate-3 transition-transform hover:rotate-6">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border border-border shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full mb-1">
            <TrendingUp className="w-3 h-3" />
            Weekly AI Insight
          </div>
          <p className="text-foreground/90 font-medium leading-relaxed text-sm md:text-base">
            {insight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
