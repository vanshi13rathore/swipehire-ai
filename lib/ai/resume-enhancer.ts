"use server";

import { ai } from "./gemini";
import { 
  buildImproveSummaryPrompt, 
  buildImproveExperiencePrompt, 
  buildImproveProjectPrompt, 
  buildImproveSkillsPrompt, 
  buildGenerateSummaryPrompt, 
  buildTailorResumePrompt 
} from "./prompts/resume";
import type { TailorResumeResponse } from "./types";
import type { ResumeData } from "../supabase/types";

async function callGemini(prompt: string): Promise<Record<string, unknown>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(`Gemini returned invalid JSON: ${error.message}`);
    }
    throw new Error(`AI Enhancement failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function improveSummary(summary: string): Promise<{ summary: string }> {
  const prompt = buildImproveSummaryPrompt(summary);
  return (await callGemini(prompt)) as { summary: string };
}

export async function improveExperience(experience: ResumeData['experience'][number]): Promise<{ description: string }> {
  const prompt = buildImproveExperiencePrompt(experience);
  return (await callGemini(prompt)) as { description: string };
}

export async function improveProject(project: ResumeData['projects'][number]): Promise<{ description: string }> {
  const prompt = buildImproveProjectPrompt(project);
  return (await callGemini(prompt)) as { description: string };
}

export async function improveSkills(skills: string[]): Promise<{ skills: string[] }> {
  const prompt = buildImproveSkillsPrompt(skills);
  return (await callGemini(prompt)) as { skills: string[] };
}

export async function generateProfessionalSummary(resumeData: ResumeData): Promise<{ summary: string }> {
  const prompt = buildGenerateSummaryPrompt(resumeData);
  return (await callGemini(prompt)) as { summary: string };
}

export async function tailorResumeForJob(resumeData: ResumeData, jobDescription: string): Promise<TailorResumeResponse> {
  const prompt = buildTailorResumePrompt(resumeData, jobDescription);
  return (await callGemini(prompt)) as unknown as TailorResumeResponse;
}
