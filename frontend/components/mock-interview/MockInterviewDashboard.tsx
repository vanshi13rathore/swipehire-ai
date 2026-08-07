"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Play, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from "@/components/shared";
import type { InterviewSession } from "@/lib/supabase/types";
import { SetupInterviewModal } from "./SetupInterviewModal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  sessions: InterviewSession[];
}

export function MockInterviewDashboard({ sessions }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter completed sessions and sort chronologically for the chart
  const chartData = useMemo(() => {
    const completed = sessions.filter(s => s.status === 'Completed' && s.feedback?.overallScore);
    
    return completed.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(s => ({
      date: new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: s.feedback?.overallScore || 0,
      role: s.role,
      difficulty: s.difficulty
    }));
  }, [sessions]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mock Interviews & History</h1>
          <p className="text-muted-foreground mt-1">Practice your skills and track your improvement over time.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
          <Plus className="w-5 h-5 mr-2" /> Start New Interview
        </Button>
      </div>

      {chartData.length > 1 && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Score Progression</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Overall Score"
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-semibold">Interview History</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map(session => (
            <div key={session.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{session.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.created_at).toLocaleDateString()} • {session.company || "General"}
                  </p>
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
                      <span className="text-sm font-medium">Score: {session.feedback?.overallScore}%</span>
                    </div>
                    <Link href={`/mock-interview/${session.id}`} className="block">
                      <Button variant="outline" fullWidth>Review Session</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">In Progress ({session.turns?.filter(t => t.answer).length || 0} / {session.turns?.length || 0})</span>
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
      </div>

      <SetupInterviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
