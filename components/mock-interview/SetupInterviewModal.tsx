"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Play } from 'lucide-react';
import { Button } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { setupInterviewAction } from "@/app/actions/interview";

interface SetupInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupInterviewModal({ isOpen, onClose }: SetupInterviewModalProps) {
  const router = useRouter();
  
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [jobDescription, setJobDescription] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStart = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const sessionId = await setupInterviewAction(role, company, difficulty, jobDescription);
      router.push(`/mock-interview/${sessionId}`);
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

        <div className="p-6 space-y-4">
          {error && <div className="text-sm text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</div>}
          
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
            <label className="text-sm font-medium">Job Description (Optional)</label>
            <textarea 
              value={jobDescription} 
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste job description to tailor questions..."
              className="w-full h-32 p-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/10">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleStart} disabled={loading || !role.trim()}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {loading ? "Generating Questions..." : "Start Interview"}
          </Button>
        </div>
      </div>
    </div>
  );
}
