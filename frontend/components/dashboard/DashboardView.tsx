"use client";

import React, { useRef } from 'react';
import { Download, Share2, Target, Lightbulb, Activity, CheckCircle, Briefcase } from 'lucide-react';
import { Button } from "@/components/shared";
import dynamic from 'next/dynamic';
import { GoalsList } from "./GoalsList";

const DashboardCharts = dynamic(
  () => import('./DashboardCharts').then(mod => mod.DashboardCharts), 
  { ssr: false, loading: () => <div className="h-[600px] w-full animate-pulse bg-card border border-border rounded-2xl shadow-sm"></div> }
);
import type { DashboardInsights } from "@/lib/ai/analytics";
import type { Job } from "@/lib/ai/types";
import type { CareerGoal, Application, InterviewSession } from "@/lib/supabase/types";

interface DashboardData {
  resumesCount: number;
  savedJobsCount: number;
  applicationsCount: number;
  interviewsCount: number;
  avgInterviewScore: number;
  applications: Application[];
  interviews: InterviewSession[];
  savedJobs: Job[];
  goals: CareerGoal[];
}

interface Props {
  data: DashboardData;
  insights: DashboardInsights;
}

export function DashboardView({ data, insights }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    alert("Share link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:w-full print:max-w-none" ref={printRef}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Career Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your unified career progress and AI insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-8">
        <h1 className="text-4xl font-bold">Career Analytics Report</h1>
        <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Applications", value: data.applicationsCount, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Interviews", value: data.interviewsCount, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Avg Score", value: `${data.avgInterviewScore}%`, icon: Target, color: "text-success", bg: "bg-success/10" },
          { label: "Saved Jobs", value: data.savedJobsCount, icon: CheckCircle, color: "text-warning", bg: "bg-warning/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardCharts data={data} />
        </div>

        {/* Right Column: AI Insights & Goals */}
        <div className="space-y-8">
          
          {/* AI Weekly Summary */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
            <h3 className="text-primary font-semibold flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5" /> Weekly Career Insight
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {insights.weeklySummary}
            </p>
          </div>

          {/* AI Actionable Advice */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Strengths & Weaknesses</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {(insights.strengths || []).map((s, i) => <span key={i} className="px-2 py-1 bg-success/10 text-success text-xs rounded-md border border-success/20">{s}</span>)}
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {(insights.weakestAreas || []).map((w, i) => <span key={i} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-md border border-destructive/20">{w}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Learning Roadmap</h4>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {(insights.learningRoadmap || []).map((step, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground z-10 shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">{step.title}</h5>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {(insights.recommendedJobs || []).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Recommended Jobs</h4>
                <div className="space-y-3">
                  {(insights.recommendedJobs || []).map((job, i) => (
                    <div key={i} className="text-sm border border-border p-3 rounded-xl bg-secondary/10">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">{job.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Goals Tracker */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" /> Active Goals
            </h3>
            <GoalsList initialGoals={data.goals} />
          </div>

        </div>
      </div>

    </div>
  );
}
