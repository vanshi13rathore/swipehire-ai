"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared";
import { Card } from "@/components/ui";
import { MatchScore, CareerChemistry } from "@/components/ai";
import { MapPin, DollarSign, Briefcase, Clock, Building, Bookmark, AlertCircle } from "lucide-react";

import type { Job, MatchedJob } from "@/lib/ai/types";
import type { CareerMatch } from "@/lib/supabase/types";
import Image from "next/image";

import { getAppliedJobIds, applyToJob, isApplied } from "@/lib/supabase/applications";

export interface JobDetailsProps {
  id: string;
  job?: Job | MatchedJob;
  chemistry?: CareerMatch | null;
  loading?: boolean;
  error?: string | null;
  hasResume?: boolean;
}

export function JobDetails({ 
  id, 
  job: propJob, 
  chemistry, 
  loading = false, 
  error = null, 
  hasResume = true 
}: JobDetailsProps) {
  const router = useRouter();
  if (!propJob) return null;
  const job = propJob;
  const score = 'score' in job ? (job as MatchedJob).score : 0;
  
  const [applied, setApplied] = React.useState(false);

  React.useEffect(() => {
    async function checkApplied() {
      try {
        const appliedIds = await getAppliedJobIds();
        setApplied(isApplied(id, appliedIds));
      } catch (err) {
        console.error("Failed to load application state:", err);
      }
    }
    checkApplied();
  }, [id]);

  const handleApply = async () => {
    if (applied) return;
    
    // Optimistic UI update
    setApplied(true);

    try {
      await applyToJob(job as Job);
    } catch (err) {
      console.error("Failed to apply to job:", err);
      // Revert on error
      setApplied(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-secondary/10 border border-border flex items-center justify-center shrink-0 shadow-sm p-4 relative overflow-hidden">
              {job.company.logo ? (
                <Image src={job.company.logo} alt={job.company.name} fill className="object-contain" />
              ) : (
                <Building className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium text-sm sm:text-base">
                <span className="text-foreground font-bold">{job.company.name}</span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> {job.employmentType}
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Briefcase className="w-3.5 h-3.5" /> {job.experienceLevel}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-border/50" />

          <section className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">About the Role</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We are looking for an exceptional {job.title} to join our team. 
                In this role, you will be responsible for building highly scalable, responsive, and beautifully 
                designed applications. You will collaborate closely with cross-functional teams including 
                design, product, and backend engineering to deliver world-class user experiences.
              </p>
              <p>
                As an integral member of our team, you will have the opportunity to architect new features 
                from scratch, optimize application performance, and mentor junior developers.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Key Responsibilities</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Architect and implement highly responsive user interface components.",
                "Collaborate with backend engineers to integrate scalable APIs.",
                "Optimize applications for maximum speed and scalability.",
                "Participate in code reviews to maintain high code quality and best practices.",
                "Translate Figma designs into high-quality, pixel-perfect code."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-sm shadow-primary/50" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Requirements</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                `Minimum of ${job.experienceLevel} in software development.`,
                "Deep understanding of modern JavaScript, TypeScript, and React ecosystems.",
                "Experience with state management libraries and RESTful/GraphQL APIs.",
                "Strong foundation in HTML5, CSS3, and responsive design principles.",
                "Excellent problem-solving skills and attention to detail."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-foreground mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 pt-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Required Skills</h3>
            <div className="flex flex-wrap gap-2.5">
              {job.skills.map((skill) => (
                <span key={skill} className="px-4 py-2 bg-secondary/30 border border-border/50 text-sm rounded-xl font-semibold shadow-sm text-foreground/80 hover:text-foreground transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-8 space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur-md border-border/50 shadow-xl space-y-6 rounded-[2rem]">
              <div className="flex flex-col items-center justify-center pb-6 border-b border-border/50 gap-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Overall Match</span>
                {loading ? (
                  <div className="w-32 h-32 rounded-full bg-secondary animate-pulse" />
                ) : (
                  <MatchScore 
                    score={'recommendationScore' in job ? (job as unknown as { recommendationScore: number }).recommendationScore : ('score' in job ? (job as MatchedJob).score : null)} 
                    hasResume={hasResume}
                    className="w-32 h-32 border-[3px]" 
                  />
                )}
              </div>
              <div className="space-y-4">
                <Button 
                  size="xl" 
                  fullWidth 
                  className={cn("font-bold text-base shadow-lg shadow-primary/20", applied && "text-muted-foreground border-border")} 
                  variant={applied ? "outline" : "primary"}
                  disabled={applied}
                  onClick={handleApply}
                >
                  {applied ? "Applied ✓" : "Apply Now"}
                </Button>
                <Button variant="outline" size="xl" fullWidth className="font-bold text-base shadow-sm" leftIcon={<Bookmark className="w-4 h-4" />}>
                  Save Job
                </Button>
              </div>
            </Card>

            {loading ? (
              <Card className="w-full max-w-lg mx-auto border-primary/20 shadow-lg p-6 space-y-4">
                <div className="flex flex-col items-center justify-center space-y-3 pb-4">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">Calculating Career Chemistry...</p>
                </div>
                <div className="h-20 w-full bg-secondary animate-pulse rounded-xl" />
                <div className="h-20 w-full bg-secondary animate-pulse rounded-xl" />
              </Card>
            ) : !hasResume ? (
              <Card className="w-full max-w-lg mx-auto border-primary/20 shadow-lg p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">Upload your resume to unlock AI Career Chemistry.</p>
                  <Button onClick={() => router.push("/resume")} variant="outline" size="sm">
                    Go to Resume Upload
                  </Button>
                </div>
              </Card>
            ) : error ? (
              <Card className="w-full max-w-lg mx-auto border-primary/20 shadow-lg p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="text-destructive font-medium">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              </Card>
            ) : (
              <CareerChemistry 
                score={chemistry ? chemistry.overall_score : 0}
                skillsScore={chemistry ? chemistry.skills_score : 0}
                experienceScore={chemistry ? chemistry.experience_score : 0}
                educationScore={chemistry ? chemistry.education_score : 0}
                keywordScore={chemistry ? chemistry.keyword_score : 0}
                missingSkills={(() => { const { matchReasoning = [], missingRequirements = [], improvementPlan = [] } = chemistry?.explanation || {}; return missingRequirements; })()}
                matchReasoning={(() => { const { matchReasoning = [], missingRequirements = [], improvementPlan = [] } = chemistry?.explanation || {}; return matchReasoning; })()}
                improvementPlan={(() => { const { matchReasoning = [], missingRequirements = [], improvementPlan = [] } = chemistry?.explanation || {}; return improvementPlan; })()}
              />
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
