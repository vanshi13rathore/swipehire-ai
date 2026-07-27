"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Play, CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/shared";
import type { InterviewSession } from "@/lib/supabase/types";
import { SetupInterviewModal } from "./SetupInterviewModal";

interface Props {
  sessions: InterviewSession[];
}

export function MockInterviewDashboard({ sessions }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mock Interviews</h1>
          <p className="text-muted-foreground mt-1">Practice your skills and get AI-powered feedback.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
          <Plus className="w-5 h-5 mr-2" /> Start New Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map(session => (
          <div key={session.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{session.role}</h3>
                <p className="text-sm text-muted-foreground">{session.company || "General"}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                session.difficulty === 'Easy' ? 'bg-success/10 text-success' : 
                session.difficulty === 'Medium' ? 'bg-warning/10 text-warning' : 
                'bg-destructive/10 text-destructive'
              }`}>
                {session.difficulty}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-end space-y-4">
              {session.status === 'Completed' ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Score: {session.overall_score}%</span>
                  </div>
                  <Link href={`/mock-interview/${session.id}`} className="block">
                    <Button variant="outline" fullWidth>View Results</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">In Progress ({Object.keys(session.answers || {}).length} / {session.questions?.length || 0})</span>
                  </div>
                  <Link href={`/mock-interview/${session.id}`} className="block">
                    <Button fullWidth>Resume Interview</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl bg-secondary/5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
            <h3 className="text-lg font-semibold">No interviews yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Start your first mock interview to practice your skills and get personalized AI feedback.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>Start First Interview</Button>
          </div>
        )}
      </div>

      <SetupInterviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
