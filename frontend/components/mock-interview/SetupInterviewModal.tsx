"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Play } from 'lucide-react';
import { Button } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { setupInterviewAction } from "@/app/actions/interview";
import type { InterviewMode } from "@/lib/supabase/types";

interface SetupInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODES: InterviewMode[] = [
  'HR', 'Technical', 'Behavioral', 'System Design', 'DSA', 'AI/ML', 'Resume Deep Dive'
];

export function SetupInterviewModal({ isOpen, onClose }: SetupInterviewModalProps) {
  const router = useRouter();
  
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [mode, setMode] = useState<InterviewMode>("Technical");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [duration, setDuration] = useState<string>("30");
  const [jobDescription, setJobDescription] = useState("");
  
  const [enableCamera, setEnableCamera] = useState(false);
  const [enableMic, setEnableMic] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStart = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await setupInterviewAction(mode, role, company, difficulty, jobDescription);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.id) {
        const queryParams = new URLSearchParams();
        if (enableCamera) queryParams.set('camera', 'true');
        if (enableMic) queryParams.set('mic', 'true');
        queryParams.set('duration', duration);
        router.push(`/mock-interview/${response.id}?${queryParams.toString()}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate interview");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">New Mock Interview</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <div className="text-sm text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Interview Mode *</label>
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value as InterviewMode)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Target Role *</label>
            <Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Frontend Engineer" disabled={loading} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Target Company (Optional)</label>
            <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" disabled={loading} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex items-center gap-2">
              {['Easy', 'Medium', 'Hard'].map(lvl => (
                <button 
                  key={lvl} 
                  type="button"
                  onClick={() => setDifficulty(lvl as "Easy" | "Medium" | "Hard")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${difficulty === lvl ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-secondary border-input'}`}
                  disabled={loading}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Duration</label>
            <div className="flex items-center gap-2">
              {['15', '30', '60'].map(mins => (
                <button 
                  key={mins} 
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${duration === mins ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-secondary border-input'}`}
                  disabled={loading}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Job Description (Optional)</label>
            <textarea 
              value={jobDescription} 
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste job description to tailor questions..."
              className="w-full h-32 p-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
              disabled={loading}
            />
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium border-b border-border pb-2">Simulator Settings</h4>
            
            <label className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/10 cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Enable Microphone</p>
                <p className="text-xs text-muted-foreground">Answer questions using your voice.</p>
              </div>
              <input type="checkbox" checked={enableMic} onChange={e => setEnableMic(e.target.checked)} className="w-4 h-4 rounded text-primary" disabled={loading} />
            </label>

            <label className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/10 cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Enable Webcam</p>
                <p className="text-xs text-muted-foreground">Practice eye contact and presence.</p>
              </div>
              <input type="checkbox" checked={enableCamera} onChange={e => setEnableCamera(e.target.checked)} className="w-4 h-4 rounded text-primary" disabled={loading} />
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/10">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleStart} disabled={loading || !role.trim()}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {loading ? "Preparing Interview..." : "Start Interview"}
          </Button>
        </div>
      </div>
    </div>
  );
}
