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
  let error;
  try {
    const allSessions = await getInterviewSessions().catch(() => []);
    // Filter out corrupted sessions that were created without turns (e.g. during API quota errors)
    sessions = allSessions.filter(s => s.turns && s.turns.length > 0);
  } catch (err) {
    console.error(err);
    error = err;
  }
  
  if (error) {
    redirect("/dashboard");
  }
  
  return <MockInterviewDashboard sessions={sessions} />;
}
