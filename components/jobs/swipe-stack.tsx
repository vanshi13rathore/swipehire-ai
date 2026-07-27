"use client";

import * as React from "react";
import { useState } from "react";
import { JobCard } from "./job-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared";
import { X, Heart, Star, RotateCcw, Loader2 } from "lucide-react";
import { useSwipe } from "@/hooks/use-swipe";

export function SwipeStack() {
  const { currentJob, handleSwipe, handleReset, loading, decisions } = useSwipe();
  const [direction, setDirection] = useState<"left" | "right" | "up" | null>(null);

  const handleNext = (dir: "left" | "right" | "up") => {
    if (direction || !currentJob) return; // Prevent multiple clicks
    
    setDirection(dir);
    
    setTimeout(() => {
      handleSwipe(dir);
      setDirection(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full max-w-lg mx-auto h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Finding the best matches for you...</p>
      </div>
    );
  }

  if (!currentJob) {
    const interestedCount = decisions.filter(d => d.action === "interested").length;
    const skippedCount = decisions.filter(d => d.action === "skip").length;
    const dreamJobCount = decisions.filter(d => d.action === "dream-job").length;
    const totalDecisions = decisions.length;

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full max-w-lg mx-auto h-[600px] animate-[fade-in_0.5s_ease-out]">
        <h3 className="text-2xl font-bold mb-2">🎉 You&apos;ve viewed all available jobs.</h3>
        <p className="text-muted-foreground mb-8">
          Check back later for new opportunities.
        </p>

        <div className="bg-background border border-border rounded-lg p-6 w-full max-w-xs mb-8 space-y-3 text-sm text-left shadow-sm">
          <h4 className="font-semibold text-base mb-4 border-b border-border pb-2">Swipe Summary</h4>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Interested:</span>
            <span className="font-medium">{interestedCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Skipped:</span>
            <span className="font-medium">{skippedCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Dream Jobs:</span>
            <span className="font-medium">{dreamJobCount}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
            <span className="font-semibold text-foreground">Total Decisions:</span>
            <span className="font-bold text-foreground">{totalDecisions}</span>
          </div>
        </div>

        <Button onClick={handleReset} size="lg" leftIcon={<RotateCcw className="w-4 h-4" />}>
          View Summary
        </Button>
      </div>
    );
  }

  const getCardStyle = () => {
    if (direction === "left") return "-translate-x-[150%] rotate-[-15deg] opacity-0";
    if (direction === "right") return "translate-x-[150%] rotate-[15deg] opacity-0";
    if (direction === "up") return "-translate-y-[150%] scale-90 opacity-0";
    return "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100";
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8 overflow-hidden px-4 py-4">
      <div 
        className={cn(
          "origin-bottom",
          direction ? "transition-all duration-300 ease-out" : "transition-none",
          getCardStyle()
        )}
      >
        <JobCard 
          job={currentJob} 
        />
      </div>
      
      <div className="flex items-center justify-center gap-6">
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 p-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm"
          onClick={() => handleNext("left")}
          aria-label="Skip"
          disabled={!!direction}
        >
          <X className="w-8 h-8" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full w-20 h-20 p-0 border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors shadow-md"
          onClick={() => handleNext("up")}
          aria-label="Dream Job"
          disabled={!!direction}
        >
          <Star className="w-10 h-10" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 p-0 border-success text-success hover:bg-success/10 hover:text-success transition-colors shadow-sm"
          onClick={() => handleNext("right")}
          aria-label="Interested"
          disabled={!!direction}
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
