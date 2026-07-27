"use client";

import React from 'react';
import Link from 'next/link';
import { Download, ChevronLeft, Target, Lightbulb, AlertTriangle, BookOpen, MessageSquare } from 'lucide-react';
import { Button } from "@/components/shared";
import type { InterviewSession } from "@/lib/supabase/types";

interface Props {
  session: InterviewSession;
}

export function InterviewResults({ session }: Props) {
  const { feedback } = session;
  if (!feedback) return null;

  const scoreCategories = [
    { label: "Communication", score: feedback.communication },
    { label: "Technical Depth", score: feedback.technicalDepth },
    { label: "Confidence", score: feedback.confidence },
    { label: "Problem Solving", score: feedback.problemSolving },
    { label: "STAR Format", score: feedback.starFormat },
    { label: "Professionalism", score: feedback.professionalism },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:m-0 print:w-full print:max-w-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/mock-interview" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Interview Results</h1>
          <p className="text-muted-foreground mt-1">{session.role} at {session.company || "General"}</p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" /> Download Report
        </Button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-4xl font-bold">SwipeHire Mock Interview Report</h1>
        <p className="text-lg text-muted-foreground mt-2">{session.role} - {new Date(session.created_at).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scores */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Overall Score</h3>
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center rounded-full border-8 border-secondary">
              {/* Circular progress visual illusion via conic gradient */}
              <div 
                className="absolute inset-[-8px] rounded-full" 
                style={{ background: `conic-gradient(hsl(var(--primary)) ${feedback.overallScore}%, transparent 0)`, WebkitMask: 'radial-gradient(transparent 55%, black 56%)' }}
              />
              <span className="text-4xl font-bold">{feedback.overallScore}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {feedback.overallScore >= 80 ? "Excellent performance!" : feedback.overallScore >= 60 ? "Good effort, room for improvement." : "Needs more practice."}
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-semibold mb-2">Detailed Breakdown</h3>
            {scoreCategories.map(cat => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>{cat.label}</span>
                  <span>{cat.score}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${cat.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success/5 border border-success/20 p-5 rounded-2xl">
              <h3 className="text-success font-semibold flex items-center gap-2 mb-3">
                <Target className="w-5 h-5" /> Strengths
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-success-foreground opacity-90">
                {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            
            <div className="bg-warning/5 border border-warning/20 p-5 rounded-2xl">
              <h3 className="text-warning font-semibold flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" /> Areas to Improve
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-warning-foreground opacity-90">
                {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
              <Lightbulb className="w-5 h-5" /> Actionable Advice
            </h3>
            <div className="space-y-4">
              {feedback.missedConcepts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Missed Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.missedConcepts.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-secondary text-xs rounded-md">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                  {feedback.suggestedImprovements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {feedback.recommendedResources.map((r, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-xs rounded-md">
                      <BookOpen className="w-3 h-3" /> {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question by Question Feedback */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Question Review
          </h3>
        </div>
        <div className="divide-y divide-border">
          {session.questions.map((q, idx) => (
            <div key={q.id} className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md mb-2 inline-block">{q.category}</span>
                  <h4 className="font-semibold text-foreground leading-relaxed">{q.text}</h4>
                </div>
              </div>
              
              <div className="pl-11 space-y-4">
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Your Answer:</p>
                  <p className="text-sm opacity-90 whitespace-pre-wrap">{session.answers[q.id] || "No answer provided."}</p>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                  <p className="text-sm font-medium text-primary mb-1">AI Feedback:</p>
                  <p className="text-sm opacity-90">{feedback.questionFeedback[q.id]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
