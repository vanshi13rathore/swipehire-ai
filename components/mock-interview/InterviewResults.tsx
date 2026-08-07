"use client";

import React from 'react';
import Link from 'next/link';
import { Download, ChevronLeft, Target, Lightbulb, AlertTriangle, MessageSquare, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from "@/components/shared";
import type { InterviewSession } from "@/lib/supabase/types";
import type { JobWithScores } from "@/lib/ai/types";
import { RecommendationsList } from "@/components/recommendations/recommendations-list";

interface Props {
  session: InterviewSession;
  topJobs?: JobWithScores[];
}

export function InterviewResults({ session, topJobs }: Props) {
  const { feedback } = session;
  if (!feedback) return null;

  const scoreCategories = [
    { label: "Communication", score: feedback.communication },
    { label: "Technical Accuracy", score: feedback.technicalAccuracy },
    { label: "Problem Solving", score: feedback.problemSolving },
    { label: "Confidence", score: feedback.confidence },
    { label: "Depth", score: feedback.depth },
  ];

  const getRecommendationColor = (rec: string) => {
    if (rec.includes("Strong Hire")) return "text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800";
    if (rec === "Hire") return "text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800";
    if (rec === "Leaning Hire") return "text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800";
    if (rec.includes("No Hire")) return "text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800";
    return "text-secondary-foreground bg-secondary border-border";
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:m-0 print:w-full print:max-w-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/mock-interview" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">FAANG Evaluation Report</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span>{session.role} at {session.company || "Top Tier Company"}</span>
            <span className="text-xs px-2 py-0.5 bg-secondary rounded-full font-medium">{session.mode} Interview</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">SwipeHire FAANG Evaluation</h1>
        <p className="text-lg text-muted-foreground mt-2">{session.role} ({session.mode}) - {new Date(session.created_at).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scores */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className={`px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide uppercase mb-6 ${getRecommendationColor(feedback.hiringRecommendation)}`}>
              Decision: {feedback.hiringRecommendation}
            </div>
            
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-[10px] border-secondary">
              <div 
                className="absolute inset-[-10px] rounded-full transition-all duration-1000 ease-out" 
                style={{ background: `conic-gradient(var(--primary) ${feedback.overallScore}%, transparent 0)`, WebkitMask: 'radial-gradient(transparent 55%, black 56%)' }}
              />
              <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{feedback.overallScore}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Overall</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">FAANG Rubric Breakdown</h3>
            {scoreCategories.map(cat => (
              <div key={cat.label} className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground/90">{cat.label}</span>
                  <span className="text-primary">{cat.score}/100</span>
                </div>
                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${cat.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Feedback */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
              <h3 className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <Target className="w-4 h-4" /> Strong Signals
              </h3>
              <ul className="space-y-3">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start text-sm text-foreground/80 leading-relaxed">
                    <ChevronRight className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-2xl">
              <h3 className="text-rose-700 dark:text-rose-400 font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Red Flags / Gaps
              </h3>
              <ul className="space-y-3">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start text-sm text-foreground/80 leading-relaxed">
                    <ChevronRight className="w-4 h-4 mr-2 text-rose-500 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex-1">
            <h3 className="font-bold flex items-center gap-2 mb-5 text-sm uppercase tracking-wider text-primary">
              <Lightbulb className="w-4 h-4" /> Recommended Improvement Plan
            </h3>
            <div className="space-y-4">
              <ul className="space-y-4">
                {feedback.improvementPlan.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Review */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-border bg-secondary/30">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Interview Transcript Review
          </h3>
        </div>
        <div className="divide-y divide-border">
          {session.turns.map((turn, idx) => (
            <div key={turn.id} className="p-6 md:p-8 space-y-6">
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-xs text-primary">
                  Q{idx + 1}
                </div>
                <div className="flex-1 bg-secondary/50 rounded-2xl rounded-tl-none p-4 text-foreground text-sm leading-relaxed border border-border/50">
                  {turn.question}
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600 dark:text-blue-400">
                  You
                </div>
                <div className="flex-1 bg-blue-500/10 rounded-2xl rounded-tr-none p-4 text-foreground text-sm leading-relaxed border border-blue-500/20">
                  {turn.answer || <span className="italic text-muted-foreground">No answer provided.</span>}
                </div>
              </div>
              
              {turn.evaluation && (
                <div className="ml-12 pl-4 border-l-2 border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Answer Score: {turn.evaluation.metrics.technical}/100</span>
                  </div>
                  <p className="text-sm text-foreground/90 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                    {turn.evaluation.feedback}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Ideal Response</span>
                    <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-border">
                      {turn.evaluation.idealAnswer}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations Integration */}
      {topJobs && topJobs.length > 0 && (
        <div className="mt-12 space-y-6 print:hidden">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" /> Recommended Roles
            </h2>
            <p className="text-muted-foreground mt-2">Based on your mock interview performance, here are roles you are highly qualified for.</p>
          </div>
          <RecommendationsList topJobs={topJobs} />
        </div>
      )}

    </div>
  );
}
