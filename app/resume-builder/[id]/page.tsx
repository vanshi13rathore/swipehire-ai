"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getResume, updateResume } from "@/lib/supabase/resume-builder";
import type { ResumeVersion, ResumeData } from "@/lib/supabase/types";
import { Button } from "@/components/shared";
import { ArrowLeft, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Editor } from "@/components/resume-builder/Editor";
import { LivePreview } from "@/components/resume-builder/LivePreview";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function ResumeBuilderEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [resume, setResume] = React.useState<ResumeVersion | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");

  const [localData, setLocalData] = React.useState<ResumeData | null>(null);
  const debouncedData = useDebounce(localData, 1000);

  // Load initial data
  React.useEffect(() => {
    async function load() {
      try {
        const data = await getResume(params.id);
        setResume(data);
        setLocalData(data.resume_data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load resume.");
        } else {
          setError("Failed to load resume.");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  // Debounced Auto Save
  React.useEffect(() => {
    if (!resume || !debouncedData) return;
    
    // Only save if data actually changed from original (simple check)
    if (JSON.stringify(debouncedData) === JSON.stringify(resume.resume_data)) return;

    async function save() {
      try {
        setSaveStatus("saving");
        const updated = await updateResume(params.id, { resume_data: debouncedData! });
        setResume(updated);
        setSaveStatus("saved");
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus(prev => prev === "saved" ? "idle" : prev);
        }, 2000);
      } catch (err) {
        console.error("Failed to auto-save:", err);
        setSaveStatus("idle");
      }
    }

    save();
  }, [debouncedData, params.id, resume]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !resume || !localData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">{error || "Resume not found"}</p>
        <Button onClick={() => router.push("/resume-builder")}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setResume(prev => prev ? { ...prev, title: newTitle } : null);
    try {
      await updateResume(params.id, { title: newTitle });
    } catch (err) {
      console.error("Failed to update title", err);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col overflow-hidden h-screen">
      {/* Navbar */}
      <header className="h-16 bg-background border-b border-border/50 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/resume-builder")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input 
            value={resume.title}
            onChange={handleTitleChange}
            className="font-bold text-lg bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors px-1"
          />
          <div className="text-sm font-medium ml-4">
            {saveStatus === "saving" && <span className="text-muted-foreground flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</span>}
            {saveStatus === "saved" && <span className="text-success flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
          </div>
        </div>
        <Button variant="primary" className="shadow-lg shadow-primary/20">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </Button>
      </header>

      {/* Workspace */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Left: Editor */}
        <div className="h-full overflow-y-auto p-6 bg-background custom-scrollbar">
          <Editor data={localData} onChange={setLocalData} />
        </div>

        {/* Right: Live Preview */}
        <div className="h-full overflow-y-auto p-6 bg-secondary/20 flex justify-center custom-scrollbar shadow-inner hidden lg:flex">
          <div className="transform scale-[0.6] sm:scale-75 xl:scale-90 2xl:scale-100 origin-top">
            <LivePreview data={localData} />
          </div>
        </div>
      </div>
    </div>
  );
}
