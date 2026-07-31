"use client";

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, TrendingUp, PieChart as PieChartIcon, Eye, Briefcase, PhoneCall, ChevronRight, Play } from 'lucide-react';
import type { Application, InterviewSession } from "@/lib/supabase/types";
import { Button } from "@/components/shared";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

interface Props {
  data: {
    applications: Application[];
    interviews: InterviewSession[];
    savedJobs: unknown[];
  };
}

export const DashboardCharts = React.memo(function DashboardCharts({ data }: Props) {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  // Prepare Applications over time data
  const appsOverTime = useMemo(() => {
    const days = parseInt(timeRange);
    const now = new Date();
    
    // Initialize array with past N days
    const dateMap: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dateMap[dateString] = 0;
    }

    data.applications.forEach(app => {
      const appDateStr = app.applied_at;
      if (appDateStr) {
        const d = new Date(appDateStr);
        // Only count if within timeframe
        const diffTime = Math.abs(now.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays <= days) {
           const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
           if (dateMap[dateString] !== undefined) {
             dateMap[dateString]++;
           }
        }
      }
    });

    return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
  }, [data.applications, timeRange]);

  const summaryMetrics = useMemo(() => {
    const totalApps = data.applications.length;
    const interviews = data.applications.filter(a => a.status === 'Interview').length;
    const interviewRate = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;
    
    return {
      applicationsSent: totalApps,
      savedJobs: data.savedJobs?.length || 0,
      interviewsScheduled: interviews,
      interviewRate: `${interviewRate}%`
    };
  }, [data.applications, data.savedJobs?.length]);

  // Pipeline Data
  const pipelineData = useMemo(() => {
    const counts = {
      Saved: data.savedJobs?.length || 0,
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0
    };
    
    data.applications.forEach(app => {
       const status = app.status as string;
       if (status in counts) counts[status as keyof typeof counts]++;
       else counts.Applied++; // Fallback
    });
    
    return counts;
  }, [data.applications, data.savedJobs]);

  const pipelineKeys = Object.keys(pipelineData) as (keyof typeof pipelineData)[];

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
      acc['Problem Solving'] = (acc['Problem Solving'] || 0) + (fb.problemSolving || 0);
      return acc;
    }, {});

    return Object.entries(totals).map(([subject, total]) => ({
      subject,
      A: Math.round(total / completed.length),
      fullMark: 100,
    }));
  }, [data.interviews]);

  const overallMockScore = useMemo(() => {
    if (interviewScores.length === 0) return null;
    return Math.round(interviewScores.reduce((acc, score) => acc + score.A, 0) / interviewScores.length);
  }, [interviewScores]);


  return (
    <div className="space-y-6">
      
      {/* Applications Activity */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Applications Activity
          </h3>
          <div className="flex bg-secondary/50 p-1 rounded-xl w-fit">
            {(['7', '30', '90'] as const).map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  timeRange === range ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Last {range} Days
              </button>
            ))}
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 text-muted-foreground mb-1"><Briefcase className="w-4 h-4"/> <span className="text-xs font-medium">Applications Sent</span></div>
             <div className="text-2xl font-bold">{summaryMetrics.applicationsSent}</div>
           </div>
           <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 text-muted-foreground mb-1"><Eye className="w-4 h-4"/> <span className="text-xs font-medium">Saved Jobs</span></div>
             <div className="text-2xl font-bold">{summaryMetrics.savedJobs}</div>
           </div>
           <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 text-muted-foreground mb-1"><PhoneCall className="w-4 h-4"/> <span className="text-xs font-medium">Interviews</span></div>
             <div className="text-2xl font-bold">{summaryMetrics.interviewsScheduled}</div>
           </div>
           <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 text-muted-foreground mb-1"><Target className="w-4 h-4"/> <span className="text-xs font-medium">Interview Rate</span></div>
             <div className="text-2xl font-bold text-success">{summaryMetrics.interviewRate}</div>
           </div>
        </div>

        <div className="h-[250px] w-full">
          {appsOverTime.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                />
                <Bar dataKey="count" name="Applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {appsOverTime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl bg-secondary/10">
              No applications tracked in this period.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Application Pipeline */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-semibold flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-primary" /> Application Pipeline
          </h3>
          <div className="flex-1 flex flex-col justify-center">
             <div className="space-y-1 w-full max-w-sm mx-auto">
                {pipelineKeys.map((stage, idx) => {
                  const count = pipelineData[stage];
                  // Calculate dynamic width based on max stage (usually Saved or Applied)
                  const maxCount = Math.max(...Object.values(pipelineData)) || 1;
                  const widthPercent = Math.max((count / maxCount) * 100, 15); // min 15% for visibility
                  
                  return (
                    <div key={stage} className="relative group cursor-pointer" onClick={() => router.push(`/applications?status=${stage}`)}>
                      {idx !== 0 && (
                        <div className="h-3 flex justify-center text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                           <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border transition-all relative overflow-hidden">
                         <div 
                           className="absolute left-0 top-0 bottom-0 bg-primary/10 rounded-xl transition-all duration-500" 
                           style={{ width: `${widthPercent}%` }}
                         />
                         <span className="font-medium text-sm relative z-10 flex items-center gap-2">
                           {stage}
                         </span>
                         <span className="font-bold relative z-10">{count}</span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Interview Readiness */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-semibold flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" /> Interview Readiness
          </h3>
          
          <div className="flex-1 flex flex-col h-full">
            {interviewScores.length > 0 ? (
              <>
                <div className="flex items-end gap-3 mb-2 px-4">
                  <div className="text-4xl font-black text-primary">{overallMockScore}%</div>
                  <div className="text-sm font-medium text-muted-foreground pb-1">Overall Score</div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={interviewScores}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))', fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => router.push('/interview')}>
                  Practice Again
                </Button>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <h4 className="text-lg font-bold mb-2">Mock Interview</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Practice with an AI interviewer. Improve your communication, technical skills, and confidence.
                </p>
                <ul className="text-xs text-muted-foreground text-left space-y-2 mb-6 font-medium">
                  <li>• Technical Interview</li>
                  <li>• HR Interview</li>
                  <li>• Behavioral Interview</li>
                  <li>• Resume-Based Interview</li>
                </ul>
                <Button size="lg" className="w-full font-bold shadow-lg shadow-primary/20" onClick={() => router.push('/interview')}>
                  Start Mock Interview
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
});
