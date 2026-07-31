import { createClient } from "@/lib/supabase/server";
import { getJobsServer } from "@/lib/jobs/api";
import { calculateHeuristicMatch } from "@/lib/ai/matching-engine";
import { categorizeJob, generateWeeklyInsight } from "@/lib/ai/recommendation-engine";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Flame, Rocket, DollarSign, BookOpen, Zap } from "lucide-react";

import { SmartRecommendationCard } from "@/components/jobs/smart-recommendation-card";
import { AiCareerInsights } from "@/components/jobs/ai-career-insights";
import type { Job } from "@/lib/ai/types";

export const metadata = {
  title: "Job Discovery | SwipeHire",
  description: "Smart AI Job Recommendations",
};



interface JobWithCategory extends Job {
  heuristicScores: { overall_score: number; skills_score: number; experience_score: number; education_score: number; keyword_score: number };
  category: string;
}

interface CategorizedJobs {
  "Best Matches": JobWithCategory[];
  "High Growth": JobWithCategory[];
  "Highest Salary": JobWithCategory[];
  "Best Learning Opportunity": JobWithCategory[];
  "Quick Apply": JobWithCategory[];
}

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const categorizedJobs: CategorizedJobs = {
    "Best Matches": [],
    "High Growth": [],
    "Highest Salary": [],
    "Best Learning Opportunity": [],
    "Quick Apply": []
  };
  let weeklyInsight = "";
  let errorMsg: string | null = null;
  let hasResume = false;

  try {
    const realJobs = await getJobsServer();
    
    const { data: resumeVersion } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (resumeVersion && resumeVersion.resume_data) {
       hasResume = true;
       // Generate insight
       // In a real app, you would cache this in the DB as well.
       weeklyInsight = await generateWeeklyInsight(resumeVersion.resume_data);

       // Process and categorize
       const processedJobs = realJobs.map(job => {
         const scores = calculateHeuristicMatch(resumeVersion.resume_data, job as unknown as Job);
         const category = categorizeJob(job as unknown as Job, scores);
         
         return {
           ...job,
           heuristicScores: scores,
           category
         };
       });

       processedJobs.forEach(job => {
         const cat = job.category as keyof CategorizedJobs;
         if (categorizedJobs[cat]) {
           categorizedJobs[cat].push(job);
         }
       });

       // Sort each category by overall score descending
       (Object.keys(categorizedJobs) as Array<keyof CategorizedJobs>).forEach(key => {
         categorizedJobs[key].sort((a, b) => b.heuristicScores.overall_score - a.heuristicScores.overall_score);
       });
    } else {
       // Just put everything in Quick Apply if no resume is found
       categorizedJobs["Quick Apply"] = realJobs.map(job => ({
         ...job,
         heuristicScores: { overall_score: 0, skills_score: 0, experience_score: 0, education_score: 0, keyword_score: 0 },
         category: "Quick Apply"
       }));
    }
  } catch (err: unknown) {
    console.error("Failed to load jobs", err);
    errorMsg = err instanceof Error ? err.message : "Failed to load jobs.";
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 rounded-3xl shadow-sm text-center">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Failed to load jobs</h3>
            <p className="text-muted-foreground">{errorMsg}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Discover Opportunities</h1>
            <p className="text-xl text-muted-foreground font-medium">
              Your personalized AI career recommendations.
            </p>
          </div>
          
          {hasResume && <AiCareerInsights insight={weeklyInsight} />}
        </div>

        {/* Categories */}
        <div className="space-y-16">
          
          <JobCategorySection 
            title="Best Matches" 
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            jobs={categorizedJobs["Best Matches"]}
            categoryName="Best Matches"
          />

          <JobCategorySection 
            title="High Growth" 
            icon={<Rocket className="w-6 h-6 text-indigo-500" />}
            jobs={categorizedJobs["High Growth"]}
            categoryName="High Growth"
          />

          <JobCategorySection 
            title="Highest Salary" 
            icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
            jobs={categorizedJobs["Highest Salary"]}
            categoryName="Highest Salary"
          />

          <JobCategorySection 
            title="Best Learning Opportunity" 
            icon={<BookOpen className="w-6 h-6 text-blue-500" />}
            jobs={categorizedJobs["Best Learning Opportunity"]}
            categoryName="Best Learning Opportunity"
          />

          <JobCategorySection 
            title="Quick Apply" 
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            jobs={categorizedJobs["Quick Apply"]}
            categoryName="Quick Apply"
          />

        </div>
      </div>
    </main>
  );
}

function JobCategorySection({ title, icon, jobs, categoryName }: { title: string, icon: React.ReactNode, jobs: JobWithCategory[], categoryName: string }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-secondary/30 rounded-xl shadow-sm border border-border/50">
          {icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <span className="bg-secondary/50 text-muted-foreground text-xs font-bold px-3 py-1 rounded-full ml-2">
          {jobs.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {jobs.slice(0, 3).map(job => (
          <SmartRecommendationCard 
            key={job.id} 
            job={job} 
            heuristicScore={job.heuristicScores.overall_score} 
            category={categoryName}
          />
        ))}
      </div>
    </div>
  );
}
