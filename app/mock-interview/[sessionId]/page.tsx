import { redirect } from "next/navigation";
import { getInterviewSession } from "@/lib/supabase/mock-interview";
import { InterviewRunner } from "@/components/mock-interview/InterviewRunner";

export const metadata = {
  title: "Interview Session | SwipeHire",
};

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function InterviewSessionPage({ params }: PageProps) {
  let session;
  
  try {
    const { sessionId } = await params;
    session = await getInterviewSession(sessionId);
  } catch (error) {
    console.error(error);
    redirect("/mock-interview");
  }

  return <InterviewRunner initialSession={session} />;
}
