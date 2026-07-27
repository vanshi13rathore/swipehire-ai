"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, Activity, Briefcase, GraduationCap, Award, FolderGit2 } from "lucide-react";
import type { ResumeInsights } from "@/lib/ai/insights";
import type { ResumeAnalysis } from "@/lib/ai/types";

export interface ResumeReportProps {
  analysis: ResumeAnalysis;
  insights: ResumeInsights;
}

export function ResumeReport({ analysis, insights }: ResumeReportProps) {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "High": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Low": default: return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case "High": return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "Medium": return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "Low": default: return <AlertCircle className="w-6 h-6 text-red-600" />;
    }
  };

  // Calculate ATS Score deterministically based on missing sections
  let atsScore = 100;
  if (insights.missingSections.includes("Summary")) atsScore -= 10;
  if (insights.missingSections.includes("Skills")) atsScore -= 20;
  if (insights.missingSections.includes("Experience")) atsScore -= 30;
  if (insights.missingSections.includes("Education")) atsScore -= 15;
  if (insights.missingSections.includes("Projects")) atsScore -= 10;
  if (insights.missingSections.includes("Certifications")) atsScore -= 5;
  
  if (analysis.skills && analysis.skills.length < 5) atsScore -= 5;
  atsScore = Math.max(0, atsScore);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1 & 2 & 3 & 11: Header, Scores, Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 sm:p-12 flex flex-col justify-center h-full space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
                <Sparkles className="w-8 h-8 text-primary" />
                Resume Report
              </h2>
              <p className="text-muted-foreground text-lg font-medium">
                {analysis.summary || "Your comprehensive AI career analysis."}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile Strength</span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStrengthColor(insights.profileStrength)}`}>
                  {getStrengthIcon(insights.profileStrength)}
                  <span className="font-bold">{insights.profileStrength}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS Score</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Target className="w-5 h-5" />
                  <span className="font-bold">{atsScore}/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Big Circular Score */}
        <Card className="col-span-1 border-border/50 bg-primary/5 shadow-lg rounded-[2rem] flex flex-col items-center justify-center p-8">
          <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-8 border-primary/20 bg-background shadow-inner">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8%"
                className="text-primary"
                strokeDasharray={`${(atsScore / 100) * 289} 289`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-5xl font-black text-foreground">{atsScore}</span>
              <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 9: Missing Sections */}
        <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Missing Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.missingSections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {insights.missingSections.map((section, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm font-semibold rounded-full bg-destructive text-destructive-foreground">
                    {section}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No missing sections!
              </p>
            )}
          </CardContent>
        </Card>

        {/* 4: Detected Skills */}
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Detected Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.skills && analysis.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm font-semibold rounded-full bg-secondary text-secondary-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No skills identified.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5: Experience */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="w-5 h-5 text-primary" />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis.experience && analysis.experience.length > 0 ? (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {analysis.experience.map((exp, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-background shadow-sm">
                    <p className="text-sm font-medium text-foreground">{exp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No experience identified.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 7: Education */}
        <Card className="col-span-1 border-border/50 bg-card/40 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.education && analysis.education.length > 0 ? (
              <ul className="space-y-3">
                {analysis.education.map((edu, idx) => (
                  <li key={idx} className="text-sm p-3 rounded-lg bg-secondary/10 border border-secondary/20">{edu}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">None</p>}
          </CardContent>
        </Card>

        {/* 6: Projects */}
        <Card className="col-span-1 border-border/50 bg-card/40 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <FolderGit2 className="w-5 h-5 text-primary" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.projects && analysis.projects.length > 0 ? (
              <ul className="space-y-3">
                {analysis.projects.map((proj, idx) => (
                  <li key={idx} className="text-sm p-3 rounded-lg bg-secondary/10 border border-secondary/20">{proj}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">None</p>}
          </CardContent>
        </Card>

        {/* 8: Certifications */}
        <Card className="col-span-1 border-border/50 bg-card/40 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Award className="w-5 h-5 text-primary" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.certifications && analysis.certifications.length > 0 ? (
              <ul className="space-y-3">
                {analysis.certifications.map((cert, idx) => (
                  <li key={idx} className="text-sm p-3 rounded-lg bg-secondary/10 border border-secondary/20">{cert}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">None</p>}
          </CardContent>
        </Card>
      </div>

      {/* 10: AI Recommendations */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Actionable Recommendations</CardTitle>
          <CardDescription>Follow these steps to improve your resume score.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-4">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-foreground font-medium">
                <span className="ml-2">{rec}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
