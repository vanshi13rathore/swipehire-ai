"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/shared";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Briefcase, GraduationCap, FileCheck } from "lucide-react";
import { uploadResume } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

export function ResumeUpload() {
  const router = useRouter();

  const [isUploading, setIsUploading] = React.useState(false);
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

    setIsUploading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      await uploadResume(file, user.id);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
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
                Resume uploaded successfully!
              </div>
            )}
            
            <label className={`w-full rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center py-16 px-4 text-center cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} disabled={isUploading} />
              
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <UploadCloud className={`w-10 h-10 ${isUploading ? 'animate-bounce' : ''}`} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3 text-foreground">
                {isUploading ? "Uploading..." : "Drag & Drop your Resume"}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-8 tracking-wide">PDF ONLY • Maximum 5 MB</p>
              <Button variant="outline" size="lg" className="font-bold shadow-sm pointer-events-none">
                {isUploading ? "Uploading..." : "Browse File"}
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
