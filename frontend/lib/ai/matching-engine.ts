import type { ResumeData, Job, CareerMatch } from "../supabase/types";
import { ai } from "./gemini";

// Helper function to extract all keywords from a text
function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text.toLowerCase().match(/\b(\w+)\b/g) || [];
}

/**
 * Calculates fast, numeric heuristic match scores without an AI call.
 * This can be run in bulk over thousands of jobs.
 */
export function calculateHeuristicMatch(resume: ResumeData, job: Job) {
  // 1. Skills Match (40%)
  const resumeSkills = (resume.ai_analysis?.extractedSkills || resume.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
  
  let skillsScore = 0;
  if (jobSkills.length > 0) {
    const matchedSkills = jobSkills.filter((js: string) => resumeSkills.some((rs: string) => rs.includes(js) || js.includes(rs)));
    skillsScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  } else {
    skillsScore = 100; // No requirements = perfect match
  }

  // 2. Keyword Match (30%) - TF-IDF style presence in summary and experience
  const resumeText = `${resume.summary} ${(resume.experience || []).map(e => e.description).join(" ")}`.toLowerCase();
  const jobKeywords = extractKeywords(`${job.title} ${(job.skills || []).join(" ")}`);
  
  let keywordScore = 0;
  if (jobKeywords.length > 0) {
    const uniqueJobKeywords = Array.from(new Set(jobKeywords)).filter(k => k.length > 3); // Filter short words
    let matches = 0;
    for (const kw of uniqueJobKeywords) {
      if (resumeText.includes(kw)) matches++;
    }
    // Cap keyword score, we don't expect 100% keyword overlap
    keywordScore = Math.min(100, Math.round((matches / Math.max(1, uniqueJobKeywords.length)) * 200)); 
  }

  // 3. Experience Score (20%) - Very basic heuristic based on length of experience array
  // In a real app, you'd parse dates to get exact years.
  const yearsExp = (resume.experience || []).length * 1.5; 
  let experienceScore = 50; // Default
  if (job.experienceLevel.toLowerCase().includes("senior") && yearsExp > 4) experienceScore = 90;
  else if (job.experienceLevel.toLowerCase().includes("junior") && yearsExp < 3) experienceScore = 90;
  else if (yearsExp > 2) experienceScore = 75;

  // 4. Education Score (10%)
  let educationScore = 50;
  const hasDegree = (resume.education || []).some(e => e.degree && e.degree.toLowerCase().includes("bachelor"));
  if (hasDegree) educationScore = 90;

  // Calculate Overall Score (Weighted)
  const overall_score = Math.round(
    (skillsScore * 0.40) + 
    (keywordScore * 0.30) + 
    (experienceScore * 0.20) + 
    (educationScore * 0.10)
  );

  return {
    overall_score: Math.min(100, Math.max(0, overall_score)),
    skills_score: Math.min(100, Math.max(0, skillsScore)),
    experience_score: Math.min(100, Math.max(0, experienceScore)),
    education_score: Math.min(100, Math.max(0, educationScore)),
    keyword_score: Math.min(100, Math.max(0, keywordScore)),
  };
}

/**
 * Calls Gemini to generate a human-readable explanation and improvement plan.
 * Used ONLY on-demand when the user views the detailed chemistry dashboard.
 */
export async function generateAIExplanation(resume: ResumeData, job: Job) {
  const prompt = `
You are an expert technical recruiter and career coach.
Analyze the match between a candidate's resume and a job description.

Candidate Skills: ${(resume.ai_analysis?.extractedSkills || []).join(", ")}
Candidate Experience: ${(resume.experience || []).map(e => e.title).join(", ")}
Job Role: ${job.title}
Job Skills: ${(job.skills || []).join(", ")}

Generate a structured analysis of why this candidate is a good fit, what they are missing, and an actionable plan to improve their chances.
You MUST output ONLY a valid JSON object matching this exact schema:
{
  "matchReasoning": [ "✓ Array of strings explaining why they match well" ],
  "missingRequirements": [ "Array of strings showing what they lack" ],
  "improvementPlan": [ "Array of actionable strings on how to improve" ]
}
Do not include any markdown formatting or code blocks. Just the raw JSON string.
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let responseText = response.text;
    if (!responseText) throw new Error("Empty response from AI");
    
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(responseText) as CareerMatch['explanation'];
    return parsed;
  } catch (error) {
    console.error("Error generating AI explanation:", error);
    throw new Error(`AI Generation Error: Failed to generate career chemistry explanation. ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
