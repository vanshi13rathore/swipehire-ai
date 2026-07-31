import { ai } from "./gemini";
import type { Job } from "./types";
import type { ResumeData, SmartRecommendation } from "../supabase/types";
import { Type, Schema } from "@google/genai";

/**
 * Generates a Smart Recommendation using Gemini.
 * This takes the resume and job, and returns the complex JSON explanation
 * required for Phase 3 (roadmap, estimated learning time, missed skills, insights).
 */
export async function generateSmartRecommendation(
  resume: ResumeData, 
  job: Job,
  baseScore: number
): Promise<SmartRecommendation["explanation"]> {
  
  const prompt = `
You are an expert AI Career Coach powering a Smart Recommendation Engine.
Analyze the candidate's resume against the target job description.

Candidate Summary: ${resume.summary || "No summary provided."}
Candidate Skills: ${(resume.ai_analysis?.extractedSkills || resume.skills || []).join(", ")}
Candidate Experience: ${(resume.experience || []).map(e => e.title).join(", ")}
Candidate Education: ${(resume.education || []).map(e => e.degree).join(", ")}

Job Title: ${job.title}
Job Role: ${job.title}
Job Skills: ${(job.skills || []).join(", ")}

The base heuristic match score is ${baseScore}/100.

Generate a highly structured AI explanation for this recommendation.
You must output a JSON object matching this schema exactly. Do not include markdown formatting.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchReasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedLearningTime: { type: Type.STRING },
            dynamicRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING },
                  action: { type: Type.STRING }
                }
              }
            },
            insight: { type: Type.STRING }
          }
        } as Schema
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating Smart Recommendation:", error);
    // Fallback if generation fails
    return {
      matchReasoning: ["Heuristic match score indicates a potential fit."],
      missingRequirements: [],
      improvementPlan: ["Review the job description to identify specific skill gaps."],
      estimatedLearningTime: "Unknown",
      dynamicRoadmap: [
        { timeframe: "Today", action: "Review job description" }
      ],
      insight: "Unable to generate AI insight at this time.",
    };
  }
}

export async function generateWeeklyInsight(resume: ResumeData): Promise<string> {
  const prompt = `
You are an expert AI Career Coach. 
Analyze the candidate's profile and provide a 2-3 sentence "Weekly Insight".
Be specific about their strongest fit and the single biggest skill gap holding them back from adjacent roles.

Candidate Skills: ${(resume.ai_analysis?.extractedSkills || resume.skills || []).join(", ")}
Candidate Experience: ${(resume.experience || []).map(e => e.title).join(", ")}

Generate only the insight text. No markdown.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING }
          }
        } as Schema
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return parsed.text || "Keep building your skills.";
  } catch {
    return "Based on your profile, focusing on modern frameworks and cloud technologies will expand your opportunities.";
  }
}

/**
 * Utility to categorize a job into one of the discovery buckets based on heuristic scores.
 */
export function categorizeJob(job: Job, heuristicScores: { overall_score: number; experience_score: number; skills_score: number }) {
  const { overall_score, experience_score, skills_score } = heuristicScores;
  
  if (overall_score >= 85) return "Best Matches";
  if (overall_score >= 65 && experience_score < 70) return "Best Learning Opportunity";
  if (overall_score >= 70 && job.salary && (job.salary.includes("150") || job.salary.includes("200"))) return "Highest Salary";
  if (overall_score >= 75 && skills_score >= 90) return "Quick Apply";
  
  return "High Growth";
}
