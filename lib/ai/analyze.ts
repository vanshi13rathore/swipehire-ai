import { ai } from './gemini';
import { cleanResumeText } from './clean';
import { buildResumeAnalysisPrompt } from './prompts';

import type { ResumeAnalysis } from "./types";

export async function analyzeResume(text: string): Promise<ResumeAnalysis> {
  const cleanedText = cleanResumeText(text);
  const prompt = buildResumeAnalysisPrompt(cleanedText);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }
    
    const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(jsonStr) as ResumeAnalysis;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(`Gemini returned invalid JSON: ${error.message}`);
    }
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
