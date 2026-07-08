"use client";

import * as React from "react";
import { useState } from "react";
import { JobCard } from "./job-card";
import { mockJobs } from "./mock-jobs";
import { Button } from "@/components/shared";
import { X, Heart, Star, RotateCcw } from "lucide-react";

export function SwipeStack() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  if (currentIndex >= mockJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full max-w-lg mx-auto h-[600px]">
        <h3 className="text-2xl font-bold mb-4">No more jobs today</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          You&apos;ve seen all the available opportunities in your area. Check back later for more!
        </p>
        <Button onClick={handleReset} size="lg" leftIcon={<RotateCcw className="w-4 h-4" />}>
          Start Again
        </Button>
      </div>
    );
  }

  const currentJob = mockJobs[currentIndex];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
      <JobCard 
        job={currentJob} 
        matchPercentage={currentJob.matchPercentage}
        featured={currentJob.featured}
      />
      
      <div className="flex items-center justify-center gap-6">
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 p-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm"
          onClick={handleNext}
          aria-label="Skip"
        >
          <X className="w-8 h-8" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full w-20 h-20 p-0 border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors shadow-md"
          onClick={handleNext}
          aria-label="Dream Job"
        >
          <Star className="w-10 h-10" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 p-0 border-success text-success hover:bg-success/10 hover:text-success transition-colors shadow-sm"
          onClick={handleNext}
          aria-label="Interested"
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
