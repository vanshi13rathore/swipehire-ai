import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface MatchScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
}

export function MatchScore({ score, className, ...props }: MatchScoreProps) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  let colorClass = "text-red-700 bg-red-100/50 dark:bg-red-950/30 dark:text-red-400";
  let ringClass = "border-red-500 shadow-red-500/20";
  
  if (clampedScore >= 90) {
    colorClass = "text-green-700 bg-green-100/50 dark:bg-green-950/30 dark:text-green-400";
    ringClass = "border-green-500 shadow-green-500/20";
  } else if (clampedScore >= 70) {
    colorClass = "text-blue-700 bg-blue-100/50 dark:bg-blue-950/30 dark:text-blue-400";
    ringClass = "border-blue-500 shadow-blue-500/20";
  } else if (clampedScore >= 50) {
    colorClass = "text-yellow-700 bg-yellow-100/50 dark:bg-yellow-950/30 dark:text-yellow-400";
    ringClass = "border-yellow-500 shadow-yellow-500/20";
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-full border-[6px] aspect-square shadow-lg",
        ringClass,
        colorClass,
        className
      )}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`AI Match Score: ${clampedScore}%`}
      {...props}
    >
      <div className="flex items-center gap-1 mb-1 opacity-80">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="text-xs uppercase font-extrabold tracking-wider">AI Match</span>
      </div>
      <span className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums">
        {clampedScore}%
      </span>
    </div>
  );
}
