"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, Activity } from "lucide-react";
import type { ResumeInsights } from "@/lib/ai/insights";

export function ResumeDashboard({ insights }: { insights: ResumeInsights }) {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "High":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Low":
      default:
        return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case "High":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "Medium":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "Low":
      default:
        return <AlertCircle className="w-6 h-6 text-red-600" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Overview Section */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-[2rem] overflow-hidden">
        <CardContent className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3 text-foreground">
              <Sparkles className="w-8 h-8 text-primary" />
              AI Resume Analysis
            </h2>
            <p className="text-muted-foreground text-lg font-medium">Here&apos;s how your resume stacks up.</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile Strength</span>
            <div className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getStrengthColor(insights.profileStrength)}`}>
              {getStrengthIcon(insights.profileStrength)}
              <span className="text-xl font-bold">{insights.profileStrength}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Missing Sections */}
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-destructive" />
              Missing Sections
            </CardTitle>
            <CardDescription>Areas where your resume lacks detail.</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.missingSections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {insights.missingSections.map((section, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {section}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">No missing sections! Great job.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Top Skills Detected
            </CardTitle>
            <CardDescription>The primary technical and soft skills we found.</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.topSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {insights.topSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No top skills identified.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground">Actionable Recommendations</CardTitle>
          <CardDescription>Follow these steps to improve your resume score.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
