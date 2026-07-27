"use server";

import { generateInterviewQuestions, evaluateInterview } from "@/lib/ai/mock-interview";
import { createInterviewSession, updateInterviewSession } from "@/lib/supabase/mock-interview";
import { getResumeVersions } from "@/lib/supabase/resume-builder";
import type { InterviewSession } from "@/lib/supabase/types";

export async function setupInterviewAction(
  role: string,
  company: string,
  difficulty: "Easy" | "Medium" | "Hard",
  jobDescription: string
): Promise<string> {
  // 1. Fetch user context
  const resumes = await getResumeVersions().catch(() => []);
  const defaultResume = resumes.find(r => r.is_default) || resumes[0];
  const context = {
    resumeData: defaultResume ? defaultResume.resume_data : null,
  };

  // 2. Generate Questions
  const questions = await generateInterviewQuestions(role, company, difficulty, jobDescription, context);

  // 3. Create Session in DB
  const session = await createInterviewSession({
    role,
    company,
    difficulty,
    job_description: jobDescription,
    questions,
    answers: {},
    status: 'Not Started'
  });

  return session.id;
}

export async function submitInterviewAction(
  sessionId: string,
  session: InterviewSession
): Promise<InterviewSession> {
  // 1. Evaluate
  const feedback = await evaluateInterview(session.role, session.questions, session.answers);

  // 2. Save back to DB
  const updated = await updateInterviewSession(sessionId, {
    feedback,
    overall_score: feedback.overallScore,
    status: 'Completed'
  });

  return updated;
}
