"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/shared";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Briefcase, GraduationCap, FileCheck } from "lucide-react";

export function ResumeUpload() {
  const router = useRouter();

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
            <div className="w-full rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center py-16 px-4 text-center cursor-pointer group">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3 text-foreground">Drag & Drop your Resume</h3>
              <p className="text-sm font-medium text-muted-foreground mb-8 tracking-wide">PDF or DOCX • Maximum 5 MB</p>
              <Button variant="outline" size="lg" className="font-bold pointer-events-none shadow-sm">
                Browse File
              </Button>
            </div>
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
        <Button onClick={() => router.push("/dev/job-feed")} size="xl" className="w-full max-w-sm font-bold shadow-lg shadow-primary/20 text-base">
          Continue
        </Button>
      </div>

    </div>
  );
}
