"use client";

import * as React from "react";
import { JobFeed } from "@/components/jobs/job-feed";
import { getSavedJobs } from "@/lib/supabase/saved-jobs";
import type { Job, JobWithScores } from "@/lib/ai/types";
import { Button } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCcw, Bookmark } from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = React.useState<JobWithScores[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobs = await getSavedJobs();
      setSavedJobs(jobs.map((job: Job): JobWithScores => ({
        ...job,
        chemistryScore: 0,
        heuristicScores: null,
        recommendationReason: "Saved by you",
      })));
    } catch (err: unknown) {
      console.error("Failed to load saved jobs", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while loading your saved jobs.");
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
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Failed to load saved jobs</h3>
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
          <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Your personal collection of bookmarked opportunities.
          </p>
        </div>
        {savedJobs.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-3xl border-border bg-secondary/5 max-w-3xl mx-auto mt-8">
            <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
              <Bookmark className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black mb-3">No saved jobs yet</h3>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
              You haven't bookmarked any opportunities. Browse the job feed and save jobs you're interested in to review them later.
            </p>
            <Link href="/jobs">
               <Button size="xl" className="font-bold shadow-lg shadow-primary/20">Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <JobFeed jobs={savedJobs} loading={loading} />
        )}
      </div>
    </main>
  );
}
