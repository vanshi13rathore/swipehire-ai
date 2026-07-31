"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/shared";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Briefcase, GraduationCap, FileCheck } from "lucide-react";
import { uploadResume } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

import { extractTextFromPDF } from "@/lib/ai/pdf";
import { analyzeResumeText } from "@/lib/ai/resume-analyzer";
import { createResume } from "@/lib/supabase/resume-builder";
import { revalidateMatches } from "@/lib/actions/revalidate";

export function ResumeUpload() {
  const router = useRouter();

  const [uploadState, setUploadState] = React.useState<"idle" | "uploading" | "extracting" | "analyzing" | "saving" | "redirecting">("idle");
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF file.");
      setSuccess(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size must be less than 5MB.");
      setSuccess(false);
      return;
    }

    setUploadState("uploading");
    setErrorMsg("");
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      // 1. Upload file to Storage
      setUploadState("uploading");
      await uploadResume(file, user.id);
      
      // 2. Extract text locally in browser
      setUploadState("extracting");
      const text = await extractTextFromPDF(file);
      
      // 3. Run AI Analysis on Server
      setUploadState("analyzing");
      const resumeData = await analyzeResumeText(text);
      
      // 4. Save structured result to Database
      setUploadState("saving");
      const newResume = await createResume(file.name, resumeData, true);
      
      // 5. Invalidate matching cache
      await revalidateMatches();
      
      setSuccess(true);
      setUploadState("redirecting");
      
      // 6. Redirect to new beautiful analysis page
      router.push(`/resume/analysis/${newResume.id}`);
    } catch (err: unknown) {
      console.error("Upload process error:", err);
      // Supabase errors are often plain objects with a message property, not Error instances
      const errorText = (err instanceof Error ? err.message : null) 
        ?? (typeof err === "object" && err !== null && "error_description" in err ? String((err as { error_description: string }).error_description) : null)
        ?? (typeof err === 'string' ? err : "Upload failed due to an unknown error.");
      setErrorMsg(`Error: ${errorText}`);
      setUploadState("idle");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      
      {/* Upload Section */}
      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Upload Your Resume</h2>
          <p className="text-muted-foreground text-lg font-medium">Help AI understand your experience.</p>
        </div>
        
        <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 sm:p-12">
            {errorMsg && (
              <div className="mb-6 p-4 text-sm font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                {errorMsg}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 text-sm font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl">
                Resume analyzed successfully! Redirecting...
              </div>
            )}
            
            <label className={`w-full rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center py-16 px-4 text-center cursor-pointer group ${uploadState !== "idle" ? 'opacity-50 pointer-events-none' : ''}`}>
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} disabled={uploadState !== "idle"} />
              
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <UploadCloud className={`w-10 h-10 ${uploadState !== "idle" ? 'animate-bounce' : ''}`} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3 text-foreground">
                {uploadState === "idle" && "Drag & Drop your Resume"}
                {uploadState === "uploading" && "Uploading document..."}
                {uploadState === "extracting" && "Extracting text..."}
                {uploadState === "analyzing" && "Analyzing Career DNA..."}
                {uploadState === "saving" && "Saving profile..."}
                {uploadState === "redirecting" && "Complete! Redirecting..."}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-8 tracking-wide">PDF ONLY • Maximum 5 MB</p>
              <Button variant="outline" size="lg" className="font-bold shadow-sm pointer-events-none">
                {uploadState !== "idle" ? "Processing..." : "Browse File"}
              </Button>
            </label>
          </CardContent>
        </Card>
      </section>

      {/* AI Analysis Preview */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold tracking-tight text-center text-foreground">Future AI Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="p-3.5 bg-secondary/80 rounded-xl shrink-0 text-foreground shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Skills Extraction</h4>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Automatically identifies and tags your technical and soft skills.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="p-3.5 bg-secondary/80 rounded-xl shrink-0 text-foreground shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Experience Detection</h4>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Maps your work history to match you with relevant roles.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="p-3.5 bg-secondary/80 rounded-xl shrink-0 text-foreground shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Education Recognition</h4>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Extracts degrees, certifications, and academic achievements.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="p-3.5 bg-secondary/80 rounded-xl shrink-0 text-foreground shadow-sm">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">ATS Compatibility Score</h4>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Rates how well your resume performs against automated systems.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex justify-center pt-8 pb-16">
        <Button onClick={() => router.push("/dashboard")} size="xl" className="w-full max-w-sm font-bold shadow-lg shadow-primary/20 text-base">
          Continue
        </Button>
      </div>

    </div>
  );
}
