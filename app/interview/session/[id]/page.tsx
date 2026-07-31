"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/shared";
import { BrainCircuit, Mic, Loader2, Send, Clock } from "lucide-react";
import { initializeInterview, submitInterviewAnswers } from "@/lib/actions/mock-interview";
import type { InterviewQuestion } from "@/lib/supabase/types";

export default function InterviewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const q = await initializeInterview(id);
        setQuestions(q);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to initialize interview.");
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, [id]);

  const handleNext = async () => {
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished
      setIsSubmitting(true);
      try {
        await submitInterviewAnswers(id, newAnswers);
        router.push(`/interview/result/${id}`);
      } catch (err) {
        console.error(err);
        setError("Failed to submit answers.");
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Mic className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">AI is preparing your interview...</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your profile and generating questions
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center animate-bounce shadow-xl shadow-primary/20">
          <BrainCircuit className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Evaluating your performance...</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Generating AI feedback and scores
          </p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                {currentQ.category} Question
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Take your time</span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-3xl font-bold leading-tight">
              {currentQ.text}
            </h2>

            {/* Answer Input */}
            <div className="space-y-3 pt-4">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here as if you were speaking to an interviewer..."
                className="w-full h-48 p-5 bg-secondary/20 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-base resize-none transition-all placeholder:text-muted-foreground/50"
              />
              <p className="text-xs text-muted-foreground text-right px-2">
                * In the future, this will support voice input.
              </p>
            </div>

          </div>
          
          <div className="bg-secondary/10 p-6 md:px-12 border-t border-border/50 flex justify-between items-center">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setCurrentAnswer("")}>
              Clear
            </Button>
            <Button 
              size="lg" 
              className="font-bold shadow-lg group" 
              onClick={handleNext}
              disabled={currentAnswer.trim().length < 10}
            >
              {isLast ? "Complete Interview" : "Next Question"}
              {!isLast && <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
