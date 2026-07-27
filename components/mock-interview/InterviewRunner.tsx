"use client";

import React, { useState } from 'react';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/shared";
import type { InterviewSession } from "@/lib/supabase/types";
import { updateInterviewSession } from "@/lib/supabase/mock-interview";
import { submitInterviewAction } from "@/app/actions/interview";
import { InterviewResults } from "./InterviewResults";

interface Props {
  initialSession: InterviewSession;
}

export function InterviewRunner({ initialSession }: Props) {
  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(() => {
    return initialSession.questions?.length > 0 ? (initialSession.answers[initialSession.questions[0].id] || "") : "";
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session.status === 'Completed' && session.feedback) {
    return <InterviewResults session={session} />;
  }

  if (!session.questions || session.questions.length === 0) {
    return <div className="p-8 text-center text-destructive">Error: No questions generated.</div>;
  }

  const q = session.questions[currentIdx];
  const isLast = currentIdx === session.questions.length - 1;
  const progress = Math.round((currentIdx / session.questions.length) * 100);

  const saveCurrentAnswer = async () => {
    if (!currentAnswer.trim()) return;
    setIsSaving(true);
    const newAnswers = { ...session.answers, [q.id]: currentAnswer };
    try {
      const updated = await updateInterviewSession(session.id, {
        answers: newAnswers,
        status: 'In Progress'
      });
      setSession(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await saveCurrentAnswer();
    if (!isLast) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setCurrentAnswer(session.answers[session.questions[nextIdx].id] || "");
    }
  };

  const handlePrev = async () => {
    await saveCurrentAnswer();
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setCurrentAnswer(session.answers[session.questions[prevIdx].id] || "");
    }
  };

  const handleFinish = async () => {
    await saveCurrentAnswer();
    setIsSubmitting(true);
    try {
      // Force the latest state to be sent
      const finalSession = { ...session, answers: { ...session.answers, [q.id]: currentAnswer } };
      const updated = await submitInterviewAction(session.id, finalSession);
      setSession(updated);
    } catch (e) {
      console.error(e);
      alert("Failed to submit interview for evaluation.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-100px)]">
      
      {/* Header & Progress */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{session.role} Interview</h1>
          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            {isSaving ? "Saving..." : "Autosaved"}
          </div>
        </div>
        
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="flex justify-between text-sm font-medium">
          <span className="text-muted-foreground">Question {currentIdx + 1} of {session.questions.length}</span>
          <span className="px-2 py-1 bg-secondary rounded-md text-xs">{q.category}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col">
        <div className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm mb-6 flex-1 flex flex-col">
          <h2 className="text-xl md:text-2xl font-medium mb-6 text-foreground leading-relaxed">
            {q.text}
          </h2>
          
          <div className="flex-1 flex flex-col space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Your Answer</label>
            <textarea
              className="flex-1 w-full p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-base leading-relaxed"
              placeholder="Type your answer here as if you were speaking to the interviewer..."
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center bg-card p-4 border border-border rounded-xl">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentIdx === 0 || isSubmitting}
        >
          Previous
        </Button>

        {isLast ? (
          <Button onClick={handleFinish} disabled={isSubmitting || !currentAnswer.trim()}>
            {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
            {isSubmitting ? "Evaluating..." : "Finish & Evaluate"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={isSubmitting || !currentAnswer.trim()}>
            Next Question <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

    </div>
  );
}
