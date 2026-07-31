import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar, Footer } from "@/components/landing";
import { AnalysisDashboard } from "@/components/resume/analysis-dashboard";

export const metadata = {
  title: "AI Resume Analysis | SwipeHire",
  description: "View your AI-powered resume analysis.",
};

export default async function ResumeAnalysisPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: resume, error } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !resume || !resume.resume_data) {
    redirect("/resume");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <AnalysisDashboard resumeData={resume.resume_data} />
      </main>
      <Footer />
    </div>
  );
}
