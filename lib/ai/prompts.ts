export function buildResumeAnalysisPrompt(text: string): string {
  return `You are an expert resume parsing AI. Extract the following information from the provided resume text.

You MUST return ONLY valid JSON matching the exact schema below.
- Do not return markdown.
- Do not return explanations.
- Return valid JSON only.
- If a field is missing, return an empty string or empty array.

JSON Schema:
{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": [],
  "summary": ""
}

Resume Text:
---
${text}
---`;
}
