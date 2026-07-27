"use server";

import { ai } from "./gemini";
import { buildGenerateQuestionsPrompt, buildEvaluateInterviewPrompt } from "./prompts/interview";
import type { InterviewQuestion, InterviewFeedback } from "../supabase/types";

async function callGeminiJSON(prompt: string): Promise<unknown> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to process AI request");
  }
}

export async function generateInterviewQuestions(
  role: string,
  company: string | null,
  difficulty: string,
  jobDescription: string | null,
  context: Record<string, unknown>
): Promise<InterviewQuestion[]> {
  const prompt = buildGenerateQuestionsPrompt(role, company, difficulty, jobDescription, context);
  const data = await callGeminiJSON(prompt);
  if (!Array.isArray(data)) {
    throw new Error("Invalid format returned by AI for questions");
  }
  return data as InterviewQuestion[];
}

export async function evaluateInterview(
  role: string,
  questions: InterviewQuestion[],
  answers: Record<string, string>
): Promise<InterviewFeedback> {
  const prompt = buildEvaluateInterviewPrompt(role, questions, answers);
  const data = await callGeminiJSON(prompt);
  return data as InterviewFeedback;
}
