"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/shared";
import { Mic, Briefcase, BrainCircuit, Target, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const ROLES = [
  "Software Engineer",
  "Data Scientist",
  "AI Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "UX Designer"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const TYPES = [
  { id: "Technical", label: "Technical", desc: "System design, algorithms, coding concepts", icon: BrainCircuit },
  { id: "Behavioral", label: "Behavioral", desc: "Past experiences, teamwork, conflict resolution", icon: Target },
  { id: "HR", label: "HR", desc: "Culture fit, salary expectations, motivations", icon: Briefcase },
  { id: "Resume Based", label: "Resume-Based", desc: "Deep dive into your past projects and skills", icon: Mic },
  { id: "Mixed", label: "Mixed", desc: "A realistic blend of all interview types", icon: BrainCircuit }
];

export default function InterviewConfigPage() {
  const router = useRouter();
  const [role, setRole] = useState(ROLES[0]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [type, setType] = useState("Mixed");
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create a pending interview session in DB
      const { data, error } = await supabase
        .from("interview_sessions")
        .insert({
          user_id: user.id,
          role,
          difficulty,
          status: "Not Started",
          answers: {},
          questions: [],
          job_description: type // Storing type in job_description temporarily or add new column
        })
        .select()
        .single();
        
      if (error) throw error;
      
      router.push(`/interview/session/${data.id}`);
    } catch (err) {
      console.error(err);
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center transform rotate-3">
            <Mic className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">AI Mock Interview</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Practice in a stress-free environment. Choose your settings and let the AI evaluate your performance.
          </p>
        </div>

        <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-12">
            
            {/* Target Role */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> 1. Target Role
              </h3>
              <div className="flex flex-wrap gap-3">
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      role === r 
                        ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-105'
                        : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-border/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> 2. Difficulty Level
              </h3>
              <div className="flex flex-wrap gap-3">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      difficulty === d 
                        ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-105'
                        : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-border/50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> 3. Interview Focus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`text-left p-5 rounded-2xl border transition-all ${
                      type === t.id 
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                        : 'border-border/50 bg-secondary/20 hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${type === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        <t.icon className="w-5 h-5" />
                      </div>
                      <span className={`font-bold ${type === t.id ? 'text-primary' : 'text-foreground'}`}>
                        {t.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
          <div className="bg-secondary/10 p-8 border-t border-border/50 flex justify-end">
            <Button size="xl" className="font-bold shadow-lg shadow-primary/20 group" onClick={handleStart} disabled={isStarting}>
              {isStarting ? "Preparing Interview Questions..." : "Enter Interview Room"}
              {!isStarting && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
