"use client";

import * as React from "react";
import { JobFeed } from "@/components/jobs/job-feed";
import { supabase } from "@/lib/supabase/client";
import { getResumeAnalysis } from "@/lib/ai/pipeline";
import { recommendJobs } from "@/lib/ai/recommender";
import { getJobs } from "@/lib/jobs/api";
import type { ResumeAnalysis, RecommendedJob } from "@/lib/ai/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function JobsPage() {
  const [recommendedJobs, setRecommendedJobs] = React.useState<RecommendedJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let analysis: ResumeAnalysis | null = null;
      
      // 1. Fetch real jobs from API
      const realJobs = await getJobs();
      
      // 2. Fetch user's latest resume analysis
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: files } = await supabase.storage
          .from('resumes')
          .list(user.id, { sortBy: { column: 'created_at', order: 'desc' } });
          
        const latestResume = files?.find(f => f.name.endsWith('.pdf'));
        
        if (latestResume) {
          const { data: blob } = await supabase.storage
            .from('resumes')
            .download(`${user.id}/${latestResume.name}`);
            
          if (blob) {
            const file = new File([blob], latestResume.name, { type: 'application/pdf' });
            const updatedTime = latestResume.updated_at 
              ? new Date(latestResume.updated_at as string).getTime() 
              : new Date(latestResume.created_at as string).getTime();
              
            analysis = await getResumeAnalysis({
              file,
              userId: user.id,
              filename: latestResume.name,
              updatedTime
            });
          }
        }
      }

      // 3. Process jobs through recommendation engine
      const recommendations = recommendJobs(analysis, realJobs);
      setRecommendedJobs(recommendations);
    } catch (err: unknown) {
      console.error("Failed to load jobs or analysis", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while loading your job feed.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 rounded-3xl shadow-sm text-center">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Failed to load jobs</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline"
              size="lg" 
              className="mt-4 w-full rounded-xl border-destructive/20 hover:bg-destructive/10"
              onClick={loadData}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Job Feed</h1>
          <p className="text-muted-foreground mt-2">
            AI-matched opportunities based on your profile and preferences.
          </p>
        </div>
        
        <JobFeed jobs={recommendedJobs} loading={loading} />
      </div>
    </main>
  );
}
