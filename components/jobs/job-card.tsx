import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter, CardBadge } from "@/components/ui";
import { Button } from "@/components/shared";
import { MatchScore } from "@/components/ai";
import { 
  Building2, MapPin, DollarSign, Briefcase, 
  Clock, Bookmark, BookmarkCheck, CheckCircle2, 
  Globe, Zap 
} from "lucide-react";

import type { Job, MatchedJob } from "@/lib/ai/types";
import Image from "next/image";

export type { Job, MatchedJob };

const jobCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      featured: "border-primary/50 ring-1 ring-primary/20 shadow-md",
      compact: "",
      saved: "border-success/50",
    }
  },
  defaultVariants: {
    variant: "default",
  }
});

export interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  job?: Job | MatchedJob;
  matchPercentage?: number;
  hasResume?: boolean;
  saved?: boolean;
  applied?: boolean;
  featured?: boolean;
  loading?: boolean;
  variant?: "default" | "featured" | "compact" | "saved";
  onSave?: (id: string) => void;
  onApply?: (jobId: string) => void;
  onView?: (id: string) => void;
}

export function JobCard({
  job,
  matchPercentage,
  hasResume = true,
  saved = false,
  applied = false,
  featured = false,
  loading = false,
  variant = "default",
  onSave,
  onApply,
  onView,
  className,
  ...props
}: JobCardProps) {
  
  const activeVariant = featured ? "featured" : saved ? "saved" : variant;
  const isCompact = variant === "compact";

  if (loading || !job) {
    return <Card loading className={cn(isCompact ? "h-48" : "h-96", "w-full max-w-lg mx-auto", className)} {...props} />;
  }

  return (
    <Card 
      variant={activeVariant === "featured" ? "gradient" : "elevated"} 
      className={cn(jobCardVariants({ variant: activeVariant }), "relative overflow-hidden w-full max-w-lg mx-auto group", className)}
      {...props}
    >
      {featured && (
        <CardBadge className="bg-primary text-primary-foreground absolute top-4 left-4 right-auto z-10">
          <Zap className="w-3 h-3 mr-1" /> Featured
        </CardBadge>
      )}

      {matchPercentage !== undefined && (
        <div className="absolute top-4 right-4 z-10 transform scale-50 sm:scale-[0.6] origin-top-right pointer-events-none">
          <MatchScore score={matchPercentage} hasResume={hasResume} />
        </div>
      )}

      <CardHeader className={cn("pb-4", featured ? "pt-12" : "pt-6")}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/50 border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
              {job.company.logo ? (
                <Image src={job.company.logo} alt={job.company.name} fill className="object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <span>{job.company.name}</span>
                {job.company.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(job.id);
            }}
            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            aria-label={saved ? "Remove bookmark" : "Bookmark job"}
          >
            {saved ? <BookmarkCheck className="w-6 h-6 text-primary fill-primary/20" /> : <Bookmark className="w-6 h-6" />}
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.employmentType}</span>
          </div>
        </div>

        {!isCompact && (
          <div className="flex flex-wrap gap-2 pt-2">
            {job.isRemote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <Globe className="w-3 h-3" /> Remote
              </span>
            )}
            {job.skills.slice(0, 3).map(skill => (
              <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-secondary/30 text-secondary-foreground hover:bg-secondary/50 transition-colors">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground cursor-help"
                title={job.skills.slice(3).join(', ')}
              >
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t border-border/50 bg-secondary/5 mt-auto">
        {!isCompact && (
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
            Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
          </span>
        )}
        <div className={cn("flex items-center gap-2 w-full", !isCompact && "sm:w-auto sm:ml-auto")}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(job.id);
            }}
          >
            View Details
          </Button>
          <Button 
            variant={applied ? "outline" : (activeVariant === "saved" ? "secondary" : "primary")}
            size="sm" 
            className={cn("w-full sm:w-auto", applied && "text-muted-foreground border-border")}
            disabled={applied}
            onClick={(e) => {
              e.stopPropagation();
              if (!applied) onApply?.(job.id);
            }}
          >
            {applied ? "Applied ✓" : "Apply Now"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
