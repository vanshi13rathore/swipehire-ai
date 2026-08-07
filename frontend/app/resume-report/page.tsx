"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ResumeReport } from "@/components/dashboard/resume-report";
import { supabase } from "@/lib/supabase/client";
import { getResumeAnalysis } from "@/lib/ai/pipeline";
import { generateResumeInsights } from "@/lib/ai/insights";
import type { ResumeAnalysis } from "@/lib/ai/types";
import type { ResumeInsights } from "@/lib/ai/insights";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, AlertCircle, RefreshCcw } from "lucide-react";

export default function ResumeReportPage() {
  const router = useRouter();
  
  const [analysis, setAnalysis] = React.useState<ResumeAnalysis | null>(null);
  const [insights, setInsights] = React.useState<ResumeInsights | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hasResume, setHasResume] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        setError(null);
        setHasResume(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasResume(false);
          setLoading(false);
          return;
        }

        const { data: files } = await supabase.storage
          .from('resumes')
          .list(user.id, { sortBy: { column: 'created_at', order: 'desc' } });
          
        const latestResume = files?.find(f => f.name.endsWith('.pdf'));
        if (!latestResume) {
          setHasResume(false);
          setLoading(false);
          return;
        }

        const { data: blob } = await supabase.storage
          .from('resumes')
          .download(`${user.id}/${latestResume.name}`);
          
        if (!blob) {
          throw new Error("Failed to download resume from storage.");
        }

        const file = new File([blob], latestResume.name, { type: 'application/pdf' });
        const updatedTime = latestResume.updated_at 
          ? new Date(latestResume.updated_at as string).getTime() 
          : new Date(latestResume.created_at as string).getTime();
          
        const analysisData = await getResumeAnalysis({
          file,
          userId: user.id,
          filename: latestResume.name,
          updatedTime
        });

        if (!analysisData) {
          throw new Error("Analysis failed or returned empty data.");
        }

        const insightsData = await generateResumeInsights(analysisData);

        setAnalysis(analysisData);
        setInsights(insightsData);
      } catch (err: unknown) {
        console.error("Failed to generate resume report:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while analyzing your resume.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 md:p-12">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="animate-pulse bg-muted col-span-1 lg:col-span-2 h-64 rounded-[2rem]" />
            <div className="animate-pulse bg-muted col-span-1 h-64 rounded-[2rem]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-pulse bg-muted h-40 rounded-2xl" />
            <div className="animate-pulse bg-muted h-40 rounded-2xl" />
          </div>
          <div className="animate-pulse bg-muted h-64 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="animate-pulse bg-muted h-48 rounded-2xl" />
            <div className="animate-pulse bg-muted h-48 rounded-2xl" />
            <div className="animate-pulse bg-muted h-48 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!hasResume) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-dashed border-2 border-border/50 bg-secondary/5 rounded-3xl shadow-sm text-center">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">No Resume Found</h3>
            <p className="text-muted-foreground">
              You need to upload a resume to view your personalized AI report.
            </p>
            <Button 
              size="lg" 
              className="mt-4 w-full rounded-xl"
              onClick={() => router.push("/profile")}
            >
              Upload Resume
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 rounded-3xl shadow-sm text-center">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Analysis Failed</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline"
              size="lg" 
              className="mt-4 w-full rounded-xl border-destructive/20 hover:bg-destructive/10"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!analysis || !insights) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <ResumeReport analysis={analysis} insights={insights} />
    </main>
  );
}
