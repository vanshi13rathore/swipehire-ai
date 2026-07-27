"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  getResumeVersions, 
  createResume, 
  deleteResume, 
  duplicateResume, 
  setDefaultResume 
} from "@/lib/supabase/resume-builder";
import type { ResumeVersion } from "@/lib/supabase/types";
import { Button } from "@/components/shared";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Plus, Copy, Trash2, Star, AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResumeBuilderDashboard() {
  const router = useRouter();
  const [resumes, setResumes] = React.useState<ResumeVersion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResumeVersions();
      setResumes(data);
    } catch (err: unknown) {
      console.error("Failed to load resumes", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleCreate = async () => {
    try {
      setCreating(true);
      const newResume = await createResume(`Untitled Resume ${resumes.length + 1}`);
      router.push(`/resume-builder/${newResume.id}`);
    } catch (err) {
      console.error("Failed to create resume", err);
      setCreating(false);
    }
  };

  const handleDuplicate = async (id: string, currentTitle: string) => {
    try {
      await duplicateResume(id, `${currentTitle} (Copy)`);
      loadData();
    } catch (err) {
      console.error("Failed to duplicate resume", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete resume", err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Optimistic update
      setResumes(prev => prev.map(r => ({ ...r, is_default: r.id === id })));
      await setDefaultResume(id);
    } catch (err) {
      console.error("Failed to set default", err);
      loadData(); // Revert
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} loading className="h-64" />
            ))}
          </div>
        </div>
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
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Failed to load resumes</h3>
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
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
            <p className="text-muted-foreground mt-2">
              Create, edit, and manage your ATS-friendly resumes.
            </p>
          </div>
          <Button size="lg" onClick={handleCreate} disabled={creating} className="shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" />
            Create New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No resumes found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              You haven&apos;t created any resumes yet. Start building your ATS-friendly resume to stand out.
            </p>
            <Button onClick={handleCreate} disabled={creating}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} variant="elevated" className={cn("flex flex-col h-full overflow-hidden transition-all", resume.is_default && "ring-2 ring-primary/50")}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    {resume.is_default && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-primary" /> Default
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mt-4 line-clamp-1">{resume.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span className="w-2 h-2 rounded-full bg-success" /> ATS Friendly Layout
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 bg-secondary/10 gap-2 flex-wrap">
                  <Button 
                    className="flex-1"
                    onClick={() => router.push(`/resume-builder/${resume.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-10 h-10 p-0 flex items-center justify-center shrink-0" 
                    title="Duplicate"
                    aria-label="Duplicate resume"
                    onClick={() => handleDuplicate(resume.id, resume.title)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {!resume.is_default && (
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 p-0 flex items-center justify-center shrink-0" 
                      title="Set as Default"
                      aria-label="Set as default resume"
                      onClick={() => handleSetDefault(resume.id)}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-10 h-10 p-0 flex items-center justify-center shrink-0 text-destructive hover:bg-destructive/10 border-destructive/20" 
                    title="Delete"
                    aria-label="Delete resume"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this resume?")) {
                        handleDelete(resume.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
