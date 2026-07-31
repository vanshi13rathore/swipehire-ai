import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, FileWarning } from "lucide-react";

export interface MatchScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number | null;
  hasResume?: boolean;
}

export function MatchScore({ score, hasResume = true, className, ...props }: MatchScoreProps) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    // Use a micro-task to avoid synchronous setState in effect
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!hasResume || score === null || score === undefined) {
    return (
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center rounded-full aspect-square shadow-sm bg-secondary/10 border-4 border-dashed border-border/50",
          className
        )}
        style={{ width: '120px', height: '120px' }}
        title="Upload your resume to see your match score"
        {...props}
      >
        <FileWarning className="w-6 h-6 text-muted-foreground mb-2 opacity-50" />
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground text-center px-2 leading-tight">
          Resume<br/>Required
        </span>
      </div>
    );
  }

  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  let textColor = "text-red-500";
  let bgClass = "bg-red-500/10";
  let gradientId = "gradient-red";
  
  if (clampedScore >= 90) {
    textColor = "text-green-500";
    bgClass = "bg-green-500/10";
    gradientId = "gradient-green";
  } else if (clampedScore >= 80) {
    textColor = "text-emerald-500";
    bgClass = "bg-emerald-500/10";
    gradientId = "gradient-emerald";
  } else if (clampedScore >= 70) {
    textColor = "text-yellow-500";
    bgClass = "bg-yellow-500/10";
    gradientId = "gradient-yellow";
  } else if (clampedScore >= 50) {
    textColor = "text-orange-500";
    bgClass = "bg-orange-500/10";
    gradientId = "gradient-orange";
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  // Animate from 0 to clampedScore on mount
  const displayScore = mounted ? clampedScore : 0;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full aspect-square shadow-sm",
        bgClass,
        className
      )}
      style={{ width: '120px', height: '120px' }}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      title="AI Match&#10;Based on:&#10;• Skills&#10;• Experience&#10;• Education&#10;• Resume"
      {...props}
    >
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="gradient-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-muted/30"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="transition-all duration-1000 ease-out"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className={cn("relative flex flex-col items-center justify-center", textColor)}>
        <div className="flex items-center gap-1 mb-0.5 opacity-80">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] uppercase font-extrabold tracking-wider">AI Match</span>
        </div>
        <span className="text-3xl font-black tracking-tighter tabular-nums leading-none">
          {mounted ? clampedScore : 0}%
        </span>
      </div>
    </div>
  );
}

