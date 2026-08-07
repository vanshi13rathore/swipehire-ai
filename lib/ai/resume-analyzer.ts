"use server";

import { ai } from "./gemini";
import type { ResumeData } from "../supabase/types";

export type AnalyzeResumeResponse = 
  | { success: true; data: ResumeData }
  | { success: false; error: string };

function calculateHybridAtsScore(resumeData: ResumeData): {
  score: number;
  breakdown: NonNullable<NonNullable<ResumeData["ai_analysis"]>["hybridAtsBreakdown"]>;
} {
  let sectionCompleteness = 0;
  let quantifiableAchievements = 0;
  let formattingConsistency = 0;
  let llmQualitative = 0;
  const explanation: string[] = [];

  // 1. Section Completeness (Max 30)
  if (resumeData.summary && resumeData.summary.length > 20) {
    sectionCompleteness += 10;
  } else {
    explanation.push("- Missing or too short professional summary.");
  }
  
  if (resumeData.experience && resumeData.experience.length > 0) {
    sectionCompleteness += 10;
  } else {
    explanation.push("- Missing work experience section.");
  }
  
  if (resumeData.education && resumeData.education.length > 0) {
    sectionCompleteness += 10;
  } else {
    explanation.push("- Missing education section.");
  }

  // 2. Quantifiable Achievements (Max 20)
  const numbersRegex = /\\d+/g;
  let metricCount = 0;
  resumeData.experience?.forEach(exp => {
    const matches = exp.description.match(numbersRegex);
    if (matches) metricCount += matches.length;
  });
  if (resumeData.achievements) {
    metricCount += resumeData.achievements.length * 2;
  }
  
  quantifiableAchievements = Math.min(20, metricCount * 2);
  if (quantifiableAchievements === 20) {
    explanation.push("+ Strong use of quantifiable metrics and numbers.");
  } else if (quantifiableAchievements > 0) {
    explanation.push("+ Some quantifiable metrics found, but could use more.");
  } else {
    explanation.push("- No quantifiable metrics found (e.g., %, $, revenue).");
  }

  // 3. Formatting Consistency (Max 20)
  let formatScore = 20;
  if (!resumeData.header.email || !resumeData.header.phone) {
    formatScore -= 10;
    explanation.push("- Missing email or phone number in contact info.");
  }
  if (!resumeData.skills || resumeData.skills.length < 5) {
    formatScore -= 10;
    explanation.push("- Too few skills listed (aim for at least 5-10 core skills).");
  }
  formattingConsistency = Math.max(0, formatScore);

  // 4. LLM Qualitative / Keyword Penalty (Max 30)
  let qualitativeScore = 30;
  const ai = resumeData.ai_analysis;
  if (ai) {
    if (ai.weaknesses && ai.weaknesses.length > 0) {
      qualitativeScore -= (ai.weaknesses.length * 3);
    }
    if (ai.missingSkills && ai.missingSkills.length > 0) {
      qualitativeScore -= (ai.missingSkills.length * 2);
    }
    if (ai.grammarAnalysis && ai.grammarAnalysis.toLowerCase().includes("poor") || ai.grammarAnalysis?.toLowerCase().includes("error")) {
      qualitativeScore -= 10;
      explanation.push("- LLM flagged grammar or tense consistency errors.");
    }
  }
  llmQualitative = Math.max(0, qualitativeScore);
  
  const score = Math.round(sectionCompleteness + quantifiableAchievements + formattingConsistency + llmQualitative);

  return {
    score,
    breakdown: {
      sectionCompleteness,
      quantifiableAchievements,
      formattingConsistency,
      llmQualitative,
      explanation
    }
  };
}

export async function analyzeResumeText(text: string): Promise<AnalyzeResumeResponse> {
  const prompt = `
You are an expert ATS (Applicant Tracking System) parser and an elite Technical Recruiter. 
I am going to provide you with the raw extracted text from a candidate's resume.

Your job is to thoroughly analyze this resume and output a highly structured JSON object that exactly matches the following interface requirements. Do not include any markdown formatting, only the raw JSON string.

The JSON object MUST contain the following structure:
{
  "header": {
    "name": "Candidate's full name",
    "email": "Candidate's email",
    "phone": "Candidate's phone number",
    "location": "Candidate's location (City, State, or Country)"
  },
  "summary": "A 2-3 sentence professional summary based on their experience.",
  "experience": [
    {
      "id": "A unique string ID (e.g. 'exp-1')",
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "Start date (e.g. 'Jan 2020')",
      "endDate": "End date (e.g. 'Present' or 'Dec 2022')",
      "description": "A concise paragraph or bullet points summarizing their responsibilities and achievements."
    }
  ],
  "education": [
    {
      "id": "A unique string ID (e.g. 'edu-1')",
      "degree": "Degree earned",
      "school": "University/School name",
      "location": "Location",
      "startDate": "Start date",
      "endDate": "End date"
    }
  ],
  "skills": ["Array of ALL technical and soft skills found in the resume"],
  "projects": [
    {
      "id": "A unique string ID",
      "name": "Project Name",
      "description": "Description of the project",
      "url": "URL if available (optional)"
    }
  ],
  "achievements": ["Array of notable awards, honors, or major quantifiable achievements"],
  "certifications": ["Array of certifications"],
  "links": [
    {
      "id": "A unique string ID",
      "name": "Link name (e.g., 'GitHub', 'LinkedIn', 'Portfolio')",
      "url": "The actual URL"
    }
  ],
  "ai_analysis": {
    "extractedSkills": ["Array of the top most relevant skills"],
    "missingSkills": ["Array of skills that are typically expected for this candidate's inferred target role but are missing from the resume"],
    "summary": "A brutally honest, 2-sentence recruiter evaluation of this resume.",
    "strengths": ["Array of 3-4 strong points about this resume (e.g. 'Strong quantifiable metrics', 'Elite academic background')"],
    "weaknesses": ["Array of 2-3 weak points (e.g. 'Missing impact metrics', 'Vague job descriptions', 'Too much jargon')"],
    "grammarAnalysis": "A brief sentence evaluating the grammar, action verbs, and tense consistency.",
    "keywordOptimization": ["Array of 3-4 keywords they should add to improve ATS visibility"],
    "actionableSuggestions": ["Array of 3-5 specific, actionable steps the candidate can take right now to improve this resume."]
  }
}

If any information is missing from the resume (like projects or links), simply return an empty array for that field. Do your best to extract the name, email, and phone number from the messy text.
For the \`missingSkills\`, infer what job the candidate is applying for (e.g., Frontend Engineer, Data Scientist, Product Manager) based on their latest experience, and compare their skills against industry standards to find the gaps.

Resume Text:
"""
${text}
"""
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let responseText = response.text;
    if (!responseText) {
      return { success: false, error: "Empty response from AI" };
    }
    
    // Strip possible markdown code blocks if the model ignored the mime type
    responseText = responseText.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();

    const resumeData = JSON.parse(responseText) as ResumeData;
    
    // Calculate Hybrid ATS Score
    const hybridScoring = calculateHybridAtsScore(resumeData);
    
    if (!resumeData.ai_analysis) {
      resumeData.ai_analysis = {} as any;
    }
    resumeData.ai_analysis!.atsScore = hybridScoring.score;
    resumeData.ai_analysis!.hybridAtsBreakdown = hybridScoring.breakdown;

    return { success: true, data: resumeData };
  } catch (error: unknown) {
    let errorMessage = "Failed to analyze resume text. Please try again.";
    
    if (error instanceof Error || typeof error === 'object') {
      const errString = (error as Error)?.toString() || "";
      if (errString.includes("429") || errString.includes("quota") || errString.includes("RESOURCE_EXHAUSTED")) {
        const canUseMock = process.env.NODE_ENV === 'development' || process.env.ENABLE_MOCK_AI === 'true' || process.env.NEXT_PUBLIC_IS_E2E === 'true';
        if (!canUseMock) {
          return { success: false, error: "AI processing quota exceeded. Please try again later or check your API keys." };
        }
        
        console.warn("AI Quota completely exhausted in Resume Analyzer. Using fallback mock resume.");
        
        // Use a mock resume so the user is not blocked
        const mockResume: ResumeData = {
          header: { name: "Jane Developer", email: "jane@example.com", phone: "555-0100", location: "San Francisco, CA" },
          summary: "A passionate Software Engineer with 5+ years of experience building scalable web applications.",
          experience: [
            { id: "exp-1", title: "Senior Engineer", company: "TechCorp", location: "Remote", startDate: "Jan 2020", endDate: "Present", description: "Led a team of 5 engineers to rebuild the core platform, increasing performance by 40% and revenue by $1M." }
          ],
          education: [
            { id: "edu-1", degree: "B.S. Computer Science", school: "State University", location: "City, ST", startDate: "2015", endDate: "2019" }
          ],
          skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
          projects: [],
          achievements: ["Employee of the Year 2021"],
          certifications: [],
          links: [],
          ai_analysis: {
            atsScore: 0,
            extractedSkills: ["React", "TypeScript", "Node.js"],
            missingSkills: ["AWS", "Docker"],
            summary: "Strong candidate with solid frontend experience but could improve cloud infrastructure keywords.",
            strengths: ["Great quantifiable metrics", "Modern tech stack"],
            weaknesses: ["No cloud experience listed"],
            grammarAnalysis: "Perfect grammar and tense consistency.",
            keywordOptimization: ["AWS", "Docker", "CI/CD"],
            actionableSuggestions: ["Add a cloud certification", "Flesh out project descriptions"]
          }
        };
        
        const hybridScoring = calculateHybridAtsScore(mockResume);
        mockResume.ai_analysis!.atsScore = hybridScoring.score;
        mockResume.ai_analysis!.hybridAtsBreakdown = hybridScoring.breakdown;
        
        return { success: true, data: mockResume };
      }
      errorMessage = (error as Error).message || errorMessage;
    }
    
    console.error("Error analyzing resume:", error);
    return { success: false, error: errorMessage };
  }
}
