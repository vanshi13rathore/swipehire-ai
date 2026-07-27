"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import type { Application, InterviewSession } from "@/lib/supabase/types";

interface Props {
  data: {
    applications: Application[];
    interviews: InterviewSession[];
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DashboardCharts = React.memo(function DashboardCharts({ data }: Props) {
  
  // Prepare Applications over time data
  const appsOverTime = useMemo(() => {
    const dates = data.applications.reduce((acc: Record<string, number>, app) => {
      const dateString = app.applied_at;
      if (!dateString) return acc;
      const date = new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(dates).map(([date, count]) => ({ date, count })).slice(-7);
  }, [data.applications]);

  // Prepare Applications by Status data
  const appsByStatus = useMemo(() => {
    const statuses = data.applications.reduce((acc: Record<string, number>, app) => {
      const status = (app.status as string) || 'Applied';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [data.applications]);

  // Prepare Interview Scores (Radar)
  const interviewScores = useMemo(() => {
    if (!data.interviews || data.interviews.length === 0) return [];
    
    // Aggregate feedback from all completed interviews
    const completed = data.interviews.filter((i) => i.status === 'Completed' && i.feedback);
    if (completed.length === 0) return [];

    const totals = completed.reduce((acc: Record<string, number>, i) => {
      const fb = i.feedback;
      if (!fb) return acc;
      acc.Communication = (acc.Communication || 0) + (fb.communication || 0);
      acc.Technical = (acc.Technical || 0) + (fb.technicalDepth || 0);
      acc.Confidence = (acc.Confidence || 0) + (fb.confidence || 0);
      acc.STAR = (acc.STAR || 0) + (fb.starFormat || 0);
      acc['Problem Solving'] = (acc['Problem Solving'] || 0) + (fb.problemSolving || 0);
      acc.Professionalism = (acc.Professionalism || 0) + (fb.professionalism || 0);
      return acc;
    }, {});

    return Object.entries(totals).map(([subject, total]) => ({
      subject,
      A: Math.round(total / completed.length),
      fullMark: 100,
    }));
  }, [data.interviews]);

  return (
    <div className="space-y-6">
      
      {/* Applications Over Time */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" /> Applications Activity
        </h3>
        <div className="h-[300px] w-full">
          {appsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appsOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Not enough data. Start applying to jobs!
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Applications by Status */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-semibold flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-primary" /> Application Pipeline
          </h3>
          <div className="h-[250px] w-full flex-1">
            {appsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No pipeline data yet.
              </div>
            )}
          </div>
        </div>

        {/* Interview Radar */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-semibold flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" /> Interview Skills
          </h3>
          <div className="h-[250px] w-full flex-1">
            {interviewScores.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={interviewScores}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm text-center px-4">
                Complete a mock interview to see your skill radar.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
});
