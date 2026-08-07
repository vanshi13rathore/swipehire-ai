

import { ai } from "./gemini";
import { buildFirstQuestionPrompt, buildFollowUpPrompt, buildFinalEvaluationPrompt } from "./prompts/interview";
import type { InterviewMode, InterviewTurn, InterviewFeedback } from "../supabase/types";

async function callGeminiJSON(prompt: string, retries = 3, delay = 10000): Promise<unknown> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: unknown) {
    const errString = (error as Error)?.toString() || "";
    if (errString.includes("429") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("quota")) {
      const canUseMock = process.env.NODE_ENV === 'development' || process.env.ENABLE_MOCK_AI === 'true' || process.env.NEXT_PUBLIC_IS_E2E === 'true';
      if (!canUseMock) {
        throw new Error("AI Quota Exceeded. Please try again later.");
      }
      
      console.warn("AI Quota completely exhausted. Using immediate fallback mock response.");
      // Fallback responses based on prompt heuristics
      if (prompt.includes("Ask the very first question")) {
        return { question: "Can you tell me about a challenging project you worked on recently and how you overcame the obstacles?" };
      } else if (prompt.includes("Evaluate the candidate's latest answer")) {
        return { 
          evaluation: { feedback: "Good answer, but could be more specific.", idealAnswer: "A perfect answer would mention scalability and fault tolerance.", metrics: { technical: 85, communication: 90, confidence: 80, problemSolving: 75 } },
          nextQuestion: "How did you ensure the solution was scalable?" 
        };
      } else if (prompt.includes("final Hiring Recommendation")) {
        return {
          communication: 85,
          technicalAccuracy: 75,
          problemSolving: 80,
          confidence: 90,
          depth: 70,
          overallScore: 80,
          strengths: ["Clear communication", "Good grasp of concepts"],
          weaknesses: ["Lacked depth in design", "Missed edge cases"],
          improvementPlan: ["Practice designing distributed systems", "Use STAR method"],
          hiringRecommendation: "Leaning Hire"
        };
      }
      throw new Error("AI Quota Exceeded and no fallback available.");
    }
    throw new Error((error as Error)?.message || "Failed to process AI request");
  }
}

export async function generateFirstQuestion(
  mode: InterviewMode,
  role: string,
  company: string | null,
  difficulty: string,
  jobDescription: string | null,
  context: Record<string, unknown>
): Promise<string> {
  const prompt = buildFirstQuestionPrompt(mode, role, company, difficulty, jobDescription, context);
  const data = await callGeminiJSON(prompt) as { question: string };
  if (!data || !data.question) {
    throw new Error("Failed to generate first question.");
  }
  return data.question;
}

export async function processInterviewAnswer(
  mode: InterviewMode,
  role: string,
  difficulty: string,
  transcript: InterviewTurn[],
  latestAnswer: string
): Promise<{ evaluation: NonNullable<InterviewTurn["evaluation"]>, nextQuestion: string }> {
  const prompt = buildFollowUpPrompt(mode, role, difficulty, transcript, latestAnswer);
  const data = await callGeminiJSON(prompt) as { evaluation: unknown, nextQuestion: string };
  if (!data || !data.evaluation || !data.nextQuestion) {
    throw new Error("Failed to process answer and generate follow-up.");
  }
  return data as { evaluation: NonNullable<InterviewTurn["evaluation"]>, nextQuestion: string };
}

export async function generateFinalEvaluation(
  mode: InterviewMode,
  role: string,
  transcript: InterviewTurn[]
): Promise<InterviewFeedback> {
  const prompt = buildFinalEvaluationPrompt(mode, role, transcript);
  const data = await callGeminiJSON(prompt);
  return data as InterviewFeedback;
}
