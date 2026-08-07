"use client";

import * as React from "react";
import { getApplications, updateApplicationStatus, deleteApplication } from "@/lib/supabase/applications";
import type { Application, ApplicationStatus } from "@/lib/supabase/types";
import type { Job } from "@/lib/ai/types";
import { Button } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCcw, Building2, Trash2, Calendar, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Interview: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Assessment: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Offer: "bg-green-500/10 text-green-500 border-green-500/20",
  Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  Accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Withdrawn: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const statuses: ApplicationStatus[] = [
  "Applied", "Interview", "Assessment", "Offer", "Rejected", "Accepted", "Withdrawn"
];

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplications();
      setApplications(data);
    } catch (err: unknown) {
      console.error("Failed to load applications", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while loading your applications.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      // Optimistic UI update
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      await updateApplicationStatus(id, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      loadData(); // Revert on error
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Optimistic UI update
      setApplications(prev => prev.filter(app => app.id !== id));
      await deleteApplication(id);
    } catch (err) {
      console.error("Failed to delete application:", err);
      loadData(); // Revert on error
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} loading className="h-32" />
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
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Failed to load applications</h3>
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
          <h1 className="text-3xl font-bold tracking-tight">Applications Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your job applications in one place.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-3xl border-border bg-secondary/5 max-w-3xl mx-auto mt-8 w-full">
            <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
              <Send className="w-10 h-10 text-muted-foreground ml-1" />
            </div>
            <h3 className="text-2xl font-black mb-3">No applications yet</h3>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
              Start applying to jobs to track your progress here. Let AI help you find the perfect match.
            </p>
            <Link href="/jobs">
               <Button size="xl" className="font-bold shadow-lg shadow-primary/20">Explore Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const job = app.job_data as unknown as Job;
              return (
                <Card key={app.id} variant="elevated" className="overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-secondary/50 border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
                        {job.company.logo ? (
                          <Image src={job.company.logo} alt={job.company.name} fill className="object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span className="font-medium text-foreground/80">{job.company.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> 
                            {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", statusColors[app.status])}>
                          {app.status}
                        </span>
                        
                        <select 
                          className="bg-secondary/50 border border-border text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10 border-destructive/20 ml-auto md:ml-0"
                        onClick={() => handleDelete(app.id)}
                        aria-label="Remove application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
