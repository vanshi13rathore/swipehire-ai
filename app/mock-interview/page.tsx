import { redirect } from "next/navigation";
import { getInterviewSessions } from "@/lib/supabase/mock-interview";
import { MockInterviewDashboard } from "@/components/mock-interview/MockInterviewDashboard";
import type { InterviewSession } from "@/lib/supabase/types";

export const metadata = {
  title: "AI Mock Interview | SwipeHire",
  description: "Practice your interview skills with SwipeHire AI.",
};

export default async function MockInterviewPage() {
  let sessions: InterviewSession[] = [];
  try {
    sessions = await getInterviewSessions().catch(() => []);
  } catch (error) {
    console.error(error);
    redirect("/dashboard");
  }
  
  return <MockInterviewDashboard sessions={sessions} />;
}
