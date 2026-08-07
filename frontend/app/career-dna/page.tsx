import { Navbar, Footer } from "@/components/landing";
import { CareerDNADashboard } from "@/components/career-dna/dashboard";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileWarning } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Career DNA - SwipeHire",
  description: "Your AI-extracted career traits and skills.",
};

export default async function CareerDNAPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let latestResume = null;
  try {
    const { data: resumes, error } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    
    if (resumes && resumes.length > 0) {
      latestResume = resumes.find((r: any) => r.is_default) || resumes[0];
    }
  } catch (error) {
    console.error("Failed to fetch resumes for Career DNA", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        {latestResume ? (
          <CareerDNADashboard resumeData={latestResume.resume_data} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 px-4">
            <div className="p-6 bg-muted/50 rounded-full">
              <FileWarning className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No Resume Found</h2>
            <p className="text-muted-foreground max-w-md">
              We need a resume to analyze and build your Career DNA. Upload one now to unlock AI-powered insights.
            </p>
            <Link href="/profile">
              <Button size="lg" className="mt-4">
                Upload Resume
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";
