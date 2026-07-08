"use client";

import * as React from "react";
import { useState } from "react";
import { JobCard } from "./job-card";
import { mockJobs } from "./mock-jobs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared";
import { X, Heart, Star, RotateCcw } from "lucide-react";

export function SwipeStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | "up" | null>(null);

  const handleNext = (dir: "left" | "right" | "up") => {
    if (direction) return; // Prevent multiple clicks during animation
    setDirection(dir);
    
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setDirection(null);
  };

  if (currentIndex >= mockJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full max-w-lg mx-auto h-[600px] animate-[fade-in_0.5s_ease-out]">
        <h3 className="text-2xl font-bold mb-4">🎉 You&apos;ve viewed all available jobs.</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          Check back later for new opportunities.
        </p>
        <Button onClick={handleReset} size="lg" leftIcon={<RotateCcw className="w-4 h-4" />}>
          Start Again
        </Button>
      </div>
    );
  }

  const currentJob = mockJobs[currentIndex];

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
          matchPercentage={currentJob.matchPercentage}
          featured={currentJob.featured}
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
