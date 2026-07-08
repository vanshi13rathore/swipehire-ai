"use client";

import { useSwipe } from "@/hooks/use-swipe";
import { SwipeCard } from "@/components/dashboard/swipe-card";
import { ActionButtons } from "@/components/dashboard/action-buttons";
import { AISidebar } from "@/components/dashboard/ai-sidebar";

export default function SwipeArena() {
  const { currentJob, handleSwipe } = useSwipe();

  return (
    <div className="flex-1 flex flex-col md:flex-row relative">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <SwipeCard job={currentJob} onSwipe={handleSwipe} />
        <ActionButtons onSwipe={handleSwipe} disabled={!currentJob} />
      </div>

      <AISidebar currentJob={currentJob} />
    </div>
  );
}
