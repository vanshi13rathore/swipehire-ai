"use client";

import { MatchScore } from "@/components/ai";

export default function MatchScoreDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-32 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-16 text-center">Match Score Component</h1>

      <div className="flex flex-wrap items-center justify-center gap-12 max-w-5xl">
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-semibold text-muted-foreground tracking-wide">95% (Green)</h2>
          <MatchScore score={95} className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-semibold text-muted-foreground tracking-wide">90% (Green)</h2>
          <MatchScore score={90} className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-semibold text-muted-foreground tracking-wide">75% (Blue)</h2>
          <MatchScore score={75} className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-semibold text-muted-foreground tracking-wide">50% (Yellow)</h2>
          <MatchScore score={50} className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-semibold text-muted-foreground tracking-wide">25% (Red)</h2>
          <MatchScore score={25} className="w-48 h-48" />
        </div>
      </div>
    </div>
  );
}
