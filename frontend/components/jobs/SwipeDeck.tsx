"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { JobCard } from "./job-card";
import { Button } from "@/components/shared";
import { X, Heart, Star, Briefcase } from "lucide-react";
import type { Job } from "@/lib/ai/types";

interface JobWithCategory extends Job {
  category?: string;
  heuristicScores?: any;
}

interface SwipeDeckProps {
  jobs: JobWithCategory[];
  onSwipe: (job: JobWithCategory, direction: "left" | "right" | "up") => void;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

export function SwipeDeck({ jobs, onSwipe, onApply, onSave, onView }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number>(0);
  const [exitY, setExitY] = useState<number>(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentJob = jobs[currentIndex];

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      handleSwipe("right");
    } else if (info.offset.x < -100) {
      handleSwipe("left");
    } else if (info.offset.y < -100) {
      handleSwipe("up");
    }
  };

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (direction === "right") setExitX(300);
    if (direction === "left") setExitX(-300);
    if (direction === "up") setExitY(-300);
    
    setTimeout(() => {
      onSwipe(currentJob, direction);
      setCurrentIndex((prev) => prev + 1);
      setExitX(0);
      setExitY(0);
      x.set(0);
      y.set(0);
    }, 200); // Wait for animation
  };

  if (!currentJob) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full max-w-lg mx-auto h-[600px] animate-[fade-in_0.5s_ease-out]">
        <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">You've swiped through all jobs!</h3>
        <p className="text-muted-foreground mb-8">
          Check back later for new opportunities tailored to your Career DNA.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8 px-4 py-4 relative h-[700px]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <span className="text-xl font-bold text-muted-foreground/30 absolute left-8">PASS</span>
         <span className="text-xl font-bold text-muted-foreground/30 absolute right-8">SAVE</span>
      </div>

      <div className="relative w-full h-[550px] z-10 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentJob.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            style={{ x, y, rotate, opacity }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: exitX, y: exitY }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          >
            <JobCard 
              job={currentJob as any}
              onApply={onApply}
              onSave={onSave}
              onView={onView} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 z-20">
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 p-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm"
          onClick={() => handleSwipe("left")}
          aria-label="Skip"
        >
          <X className="w-8 h-8" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full w-20 h-20 p-0 border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors shadow-md"
          onClick={() => handleSwipe("up")}
          aria-label="Dream Job"
        >
          <Star className="w-10 h-10" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 p-0 border-success text-success hover:bg-success/10 hover:text-success transition-colors shadow-sm"
          onClick={() => handleSwipe("right")}
          aria-label="Interested"
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
