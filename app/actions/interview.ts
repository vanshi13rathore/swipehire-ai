"use server";

import { generateFirstQuestion, processInterviewAnswer, generateFinalEvaluation } from "@/lib/ai/mock-interview";
import { createInterviewSession, updateInterviewSession, getInterviewSession } from "@/lib/supabase/mock-interview";
import { getResumeVersions } from "@/lib/supabase/resume-builder";
import type { InterviewMode, InterviewSession, InterviewTurn } from "@/lib/supabase/types";

export async function setupInterviewAction(
  mode: InterviewMode,
  role: string,
  company: string,
  difficulty: "Easy" | "Medium" | "Hard",
  jobDescription: string
): Promise<{ id?: string; error?: string }> {
  try {
    const resumes = await getResumeVersions().catch(() => []);
    const defaultResume = resumes.find(r => r.is_default) || resumes[0];
    const context = {
      resumeData: defaultResume ? defaultResume.resume_data : null,
    };

    const firstQuestion = await generateFirstQuestion(mode, role, company, difficulty, jobDescription, context);

    const initialTurn: InterviewTurn = {
      id: "turn_1",
      question: firstQuestion,
      answer: ""
    };

    const session = await createInterviewSession({
      mode,
      role,
      company,
      difficulty,
      job_description: jobDescription,
      turns: [initialTurn],
      status: 'In Progress'
    });

    return { id: session.id };
  } catch (error) {
    console.error("Failed to setup interview action:", error);
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

export async function chatInterviewAction(
  sessionId: string,
  userAnswer: string
): Promise<{ data?: InterviewSession; error?: string }> {
  try {
    const session = await getInterviewSession(sessionId);
    if (!session || session.turns.length === 0) throw new Error("Invalid session");

    // Update latest turn with user's answer
    const currentTurn = session.turns[session.turns.length - 1];
    currentTurn.answer = userAnswer;

    // Process answer to get evaluation & next question
    const { evaluation, nextQuestion } = await processInterviewAnswer(
      session.mode,
      session.role,
      session.difficulty,
      session.turns.slice(0, -1), // Transcript prior to current turn
      userAnswer
    );

    currentTurn.evaluation = evaluation;

    // Create next turn
    const newTurn: InterviewTurn = {
      id: `turn_${session.turns.length + 1}`,
      question: nextQuestion,
      answer: ""
    };

    const updatedSession = await updateInterviewSession(sessionId, {
      turns: [...session.turns, newTurn]
    });

    return { data: updatedSession };
  } catch (error) {
    console.error("Failed to process chat:", error);
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

export async function finishInterviewAction(
  sessionId: string
): Promise<{ data?: InterviewSession; error?: string }> {
  try {
    const session = await getInterviewSession(sessionId);
    
    // Filter out the last turn if it doesn't have an answer
    const completedTurns = session.turns.filter(t => t.answer.trim().length > 0);
    
    if (completedTurns.length === 0) {
      throw new Error("Cannot finish an interview with no answers.");
    }

    const feedback = await generateFinalEvaluation(session.mode, session.role, completedTurns);

    const updated = await updateInterviewSession(sessionId, {
      feedback,
      status: 'Completed'
    });

    return { data: updated };
  } catch (error) {
    console.error("Failed to submit interview:", error);
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}