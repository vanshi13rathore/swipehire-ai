"use server";

import { ai } from "./gemini";
import type { ResumeData } from "../supabase/types";

export type AnalyzeResumeResponse = 
  | { success: true; data: ResumeData }
  | { success: false; error: string };

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
    "atsScore": A number from 0 to 100 indicating how well this resume would pass an ATS filter (based on formatting clarity, keyword density, and quantifiable results).,
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
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const resumeData = JSON.parse(responseText) as ResumeData;
    return { success: true, data: resumeData };
  } catch (error: unknown) {
    console.error("Error analyzing resume:", error);
    let errorMessage = "Failed to analyze resume text. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
        errorMessage = "AI processing quota exceeded. Please try again later or check your API keys.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}
