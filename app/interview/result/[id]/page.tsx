import React from 'react';
import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/shared";
import { Trophy, ArrowLeft, Target, Lightbulb, AlertTriangle, BookOpen, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default async function InterviewResultPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session || !session.feedback) {
    redirect("/dashboard");
  }

  const { feedback, role, difficulty } = session;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4 text-sm font-medium transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              Interview Results <Trophy className="w-10 h-10 text-primary" />
            </h1>
            <p className="text-xl text-muted-foreground font-medium mt-2">
              {role} • {difficulty} Level
            </p>
          </div>
          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[200px]">
            <div className="text-5xl font-black text-primary">{feedback.overallScore}%</div>
            <div className="text-sm font-bold text-primary/80 uppercase tracking-widest mt-1">Overall Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Breakdown */}
          <Card className="md:col-span-2 border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {[
                  { label: "Communication", score: feedback.communication },
                  { label: "Technical Depth", score: feedback.technicalDepth },
                  { label: "Problem Solving", score: feedback.problemSolving },
                  { label: "Confidence", score: feedback.confidence },
                  { label: "STAR Format", score: feedback.starFormat },
                  { label: "Professionalism", score: feedback.professionalism }
                ].map(metric => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>{metric.label}</span>
                      <span className="text-primary">{metric.score}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${metric.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Side Highlights */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm rounded-3xl bg-success/5 border-success/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-success">
                  <Lightbulb className="w-5 h-5" /> Top Strengths
                </h3>
                <ul className="space-y-3">
                  {feedback.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                      <span className="text-success mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-3xl bg-destructive/5 border-destructive/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" /> Areas to Improve
                </h3>
                <ul className="space-y-3">
                  {feedback.weaknesses.map((w: string, i: number) => (
                    <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span> {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Detailed Question Feedback */}
        <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" /> Detailed Question Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border/50">
            {session.questions.map((q: { id: string; text: string; category: string }, idx: number) => (
              <div key={q.id} className="p-6 md:p-8 hover:bg-secondary/5 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        Q{idx + 1}
                      </span>
                      <h4 className="font-bold text-lg">{q.text}</h4>
                    </div>
                    <div className="pl-11">
                      <p className="text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border/50">
                        <span className="font-semibold block mb-1 text-foreground">Your Answer:</span>
                        {session.answers[q.id] || "No answer provided."}
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/3 bg-primary/5 p-5 rounded-2xl border border-primary/10 h-fit">
                    <h5 className="font-bold text-sm mb-2 text-primary flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" /> AI Feedback
                    </h5>
                    <p className="text-sm leading-relaxed">
                      {feedback.questionFeedback[q.id] || "No specific feedback generated."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Plan */}
        <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-secondary/20">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div className="max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold">Recommended Topics to Study</h3>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {feedback.missedConcepts.map((concept: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-semibold shadow-sm">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="font-bold shadow-md">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
