"use client";

import React, { useState } from 'react';
import { Button } from "@/components/shared";
import { Loader2, X, Target, Check, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import type { ResumeData } from "@/lib/supabase/types";
import type { TailorResumeResponse } from "@/lib/ai/types";
import { tailorResumeForJob } from "@/lib/ai/resume-enhancer";

interface TailorResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onApply: (tailoredData: ResumeData) => void;
}

export function TailorResumeModal({ isOpen, onClose, data, onApply }: TailorResumeModalProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TailorResumeResponse | null>(null);

  // Partial accept states
  const [acceptedSections, setAcceptedSections] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await tailorResumeForJob(data, jobDescription);
      setResult(res);
      setAcceptedSections({
        summary: true,
        experience: true,
        projects: true,
        skills: true,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to tailor resume");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAll = () => {
    if (!result) return;
    onApply(result.tailoredData);
    onClose();
  };

  const handleApplyPartial = () => {
    if (!result) return;
    const finalData = { ...data };
    if (acceptedSections.summary) finalData.summary = result.tailoredData.summary;
    if (acceptedSections.experience) finalData.experience = result.tailoredData.experience;
    if (acceptedSections.projects) finalData.projects = result.tailoredData.projects;
    if (acceptedSections.skills) finalData.skills = result.tailoredData.skills;
    onApply(finalData);
    onClose();
  };

  const toggleSection = (key: string, val: boolean) => {
    setAcceptedSections(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl border border-border flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Tailor Resume for Job
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error tailoring resume</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {!result ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Paste Job Description</label>
              <textarea 
                className="w-full h-64 p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />
              <Button 
                onClick={handleTailor} 
                disabled={loading || !jobDescription.trim()} 
                className="w-full h-12 text-lg font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing and Tailoring...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Tailor Resume
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* ATS Score & Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-border bg-secondary/20 flex flex-col items-center justify-center text-center space-y-2">
                  <h3 className="font-semibold text-muted-foreground">ATS Match Score</h3>
                  <div className="flex items-center gap-4 text-3xl font-bold">
                    <span className="text-muted-foreground">{result.atsScore.before}%</span>
                    <ArrowRight className="w-6 h-6 text-primary" />
                    <span className="text-primary">{result.atsScore.after}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{result.atsScore.explanation}</p>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  {result.missingSkills.length > 0 && (
                    <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
                      <h4 className="text-sm font-semibold text-warning mb-2">Missing Skills from JD</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.map(s => (
                          <span key={s} className="px-2 py-1 text-xs rounded-md bg-warning/10 text-warning-foreground border border-warning/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-success/20 bg-success/5">
                      <h4 className="text-sm font-semibold text-success mb-2">Strengths</h4>
                      <ul className="text-xs space-y-1 list-disc list-inside opacity-90">
                        {result.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                      <h4 className="text-sm font-semibold text-destructive mb-2">Weaknesses</h4>
                      <ul className="text-xs space-y-1 list-disc list-inside opacity-90">
                        {result.feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Comparisons */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold border-b border-border pb-2">Review Changes</h3>
                
                {['summary', 'experience', 'projects', 'skills'].map((sectionKey) => {
                  const isAccepted = acceptedSections[sectionKey];
                  return (
                    <div key={sectionKey} className={`p-4 rounded-xl border transition-colors ${isAccepted ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold capitalize">{sectionKey}</h4>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleSection(sectionKey, true)}
                            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${isAccepted ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-foreground'}`}
                          >
                            <Check className="w-3 h-3 inline-block mr-1" /> Accept
                          </button>
                          <button 
                            onClick={() => toggleSection(sectionKey, false)}
                            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${!isAccepted ? 'bg-destructive text-destructive-foreground' : 'bg-secondary hover:bg-secondary/80 text-foreground'}`}
                          >
                            <XCircle className="w-3 h-3 inline-block mr-1" /> Reject
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-secondary/30 text-sm overflow-y-auto max-h-48 whitespace-pre-wrap">
                          <div className="text-xs font-bold text-muted-foreground mb-2">ORIGINAL</div>
                          {sectionKey === 'summary' ? data.summary : 
                           sectionKey === 'skills' ? data.skills?.join(', ') : 
                           sectionKey === 'experience' ? data.experience?.map(e => e.description).join('\n\n') : 
                           data.projects?.map(p => p.description).join('\n\n')}
                        </div>
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm overflow-y-auto max-h-48 whitespace-pre-wrap">
                          <div className="text-xs font-bold text-primary mb-2">IMPROVED</div>
                          {sectionKey === 'summary' ? result.tailoredData.summary : 
                           sectionKey === 'skills' ? result.tailoredData.skills?.join(', ') : 
                           sectionKey === 'experience' ? result.tailoredData.experience?.map(e => e.description).join('\n\n') : 
                           result.tailoredData.projects?.map(p => p.description).join('\n\n')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div className="px-6 py-4 border-t border-border bg-secondary/10 flex items-center justify-between">
            <Button variant="ghost" onClick={() => {
              setResult(null);
              setJobDescription("");
            }}>
              Start Over
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setAcceptedSections({ summary: false, experience: false, projects: false, skills: false })}>
                Reject All
              </Button>
              <Button variant="outline" onClick={handleAcceptAll}>
                Accept All
              </Button>
              <Button onClick={handleApplyPartial}>
                Apply Selected
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
