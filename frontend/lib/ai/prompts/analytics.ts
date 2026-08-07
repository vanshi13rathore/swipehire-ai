/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AnalyticsContext {
  resumes: unknown[];
  defaultResume?: any;
  savedJobs: unknown[];
  applications: unknown[];
  interviews: unknown[];
  avgInterviewScore: number;
  chats: unknown[];
}

export function buildGenerateInsightsPrompt(context: AnalyticsContext): string {
  return `You are an expert AI Career Coach.
Analyze the user's recent career data to provide actionable insights.

Context:
- Resumes: ${context.resumes.length} (Default: ${context.defaultResume?.title || 'None'})
- Saved Jobs: ${context.savedJobs.length}
- Applications: ${context.applications.length}
- Interview Sessions: ${context.interviews.length} (Avg Score: ${context.avgInterviewScore}%)
- Career Copilot Chats: ${context.chats.length}

User's Default Resume Summary:
${context.defaultResume ? JSON.stringify(context.defaultResume.resume_data) : 'No resume data.'}

Your task is to generate a comprehensive career insight report strictly as a JSON object matching this schema:

{
  "weeklySummary": "A 2-3 sentence encouraging summary of their overall progress.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weakestAreas": ["Area 1", "Area 2"],
  "topMissingSkills": ["Skill 1", "Skill 2"],
  "suggestedCertifications": ["Cert 1", "Cert 2"],
  "learningRoadmap": [
    { "step": 1, "title": "Focus Area", "description": "What to do" }
  ],
  "recommendedJobs": [
    { "title": "Job Title", "reason": "Why it's a good fit" }
  ]
}

Respond ONLY with valid JSON.`;
}
