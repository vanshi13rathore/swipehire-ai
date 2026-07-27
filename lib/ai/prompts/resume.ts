import type { ResumeData } from "../../supabase/types";

export function buildImproveSummaryPrompt(summary: string): string {
  return `You are an expert resume writer and career coach.
Improve the following professional summary. Make it punchy, impactful, and ATS-friendly.
Focus on achievements and value proposition rather than just stating responsibilities.
Fix any grammar or spelling mistakes.

Current Summary:
${summary}

Respond ONLY with a JSON object in the following format:
{
  "summary": "The improved professional summary here"
}`;
}

export function buildImproveExperiencePrompt(experience: ResumeData['experience'][number]): string {
  return `You are an expert resume writer and career coach.
Improve the following work experience entry. 
Rewrite the description to be impactful, using strong action verbs and quantifying results where possible (even if you have to suggest placeholders like X%).
Ensure ATS keywords are naturally integrated. Fix grammar and maintain a professional tone.

Job Title: ${experience.title}
Company: ${experience.company}
Description:
${experience.description}

Respond ONLY with a JSON object in the following format:
{
  "description": "The improved experience description with bullet points using • character"
}`;
}

export function buildImproveProjectPrompt(project: ResumeData['projects'][number]): string {
  return `You are an expert resume writer and career coach.
Improve the following project description for a resume.
Rewrite the description to highlight technical skills, impact, and the problem solved using strong action verbs.
Fix grammar and maintain a professional tone.

Project Name: ${project.name}
Description:
${project.description}

Respond ONLY with a JSON object in the following format:
{
  "description": "The improved project description with bullet points using • character"
}`;
}

export function buildImproveSkillsPrompt(skills: string[]): string {
  return `You are an expert technical recruiter and resume writer.
I will provide a raw list of skills. Your task is to:
1. Deduplicate the skills.
2. Group them into appropriate categories (e.g., Frontend, Backend, AI, Cloud, Databases, Tools, Soft Skills).
3. Standardize the naming (e.g., "reactjs" to "React").

Raw Skills:
${skills.join(", ")}

Respond ONLY with a JSON object in the following format:
{
  "skills": ["Category 1: Skill A, Skill B", "Category 2: Skill C, Skill D"]
}`;
}

export function buildGenerateSummaryPrompt(resumeData: ResumeData): string {
  return `You are an expert resume writer and career coach.
Generate a strong, compelling professional summary for this person based on their experience and skills.
It should be 2-3 sentences long, highlight their primary expertise, and state their professional value.

Experience:
${JSON.stringify(resumeData.experience, null, 2)}

Skills:
${JSON.stringify(resumeData.skills, null, 2)}

Education:
${JSON.stringify(resumeData.education, null, 2)}

Respond ONLY with a JSON object in the following format:
{
  "summary": "The generated professional summary here"
}`;
}

export function buildTailorResumePrompt(resumeData: ResumeData, jobDescription: string): string {
  return `You are an expert technical recruiter and resume tailor.
Your task is to analyze the user's resume against the provided job description and tailor the resume to maximize the ATS match score and appeal to recruiters.

CRITICAL SAFEGUARDS (DO NOT VIOLATE):
- NEVER hallucinate or invent new experience.
- NEVER add fake jobs, companies, or education.
- NEVER invent technologies the user hasn't used if it doesn't align with their actual experience.
- Only strengthen wording, relevance, and ordering.
- If the user lacks sufficient experience to match the JD, state it honestly in the feedback.

Instructions:
1. Rewrite the "Summary" to highlight relevance to the job.
2. Rewrite "Experience" bullets using strong action verbs, keeping them truthful but tailored.
3. Rewrite "Projects" to emphasize relevant technical skills.
4. Reorder "Skills" so the most relevant ones appear first.
5. Calculate the ATS match score BEFORE and AFTER your tailoring (0-100).
6. Provide an explanation for the score change.
7. List any critical missing skills from the JD.
8. Provide constructive feedback (strengths, weaknesses, recommendations, missing keywords).

Job Description:
${jobDescription}

Original Resume Data:
${JSON.stringify(resumeData, null, 2)}

Respond ONLY with a valid JSON object in the EXACT following structure:
{
  "tailoredData": { ... full updated ResumeData object ... },
  "atsScore": {
    "before": 65,
    "after": 85,
    "explanation": "Why the score changed"
  },
  "missingSkills": ["Docker", "AWS"],
  "feedback": {
    "strengths": ["Strong React background", "Good leadership"],
    "weaknesses": ["Lacks cloud infrastructure experience"],
    "recommendations": ["Highlight your AWS certification more prominently"],
    "missingKeywords": ["CI/CD", "Kubernetes"]
  }
}`;
}
