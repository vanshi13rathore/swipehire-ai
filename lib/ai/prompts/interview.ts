import type { InterviewQuestion } from "../../supabase/types";

export function buildGenerateQuestionsPrompt(
  role: string,
  company: string | null,
  difficulty: string,
  jobDescription: string | null,
  context: Record<string, unknown>
): string {
  return `You are an expert technical interviewer for ${company || 'a top tier company'}.
Your task is to generate 8-12 tailored interview questions for a candidate applying for the role of "${role}" with difficulty "${difficulty}".

Context about the candidate:
Resume: ${context.resumeData ? JSON.stringify(context.resumeData) : 'Not provided'}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Instructions:
1. Provide a mix of Behavioral, Technical, Resume-based, and Job-specific questions.
2. The difficulty should heavily influence the depth of the questions.
3. Keep the questions realistic and challenging.
4. Output strictly a JSON array of questions, where each question has an "id" (unique string), "text" (the question itself), and "category" (one of 'Behavioral', 'Technical', 'Resume-based', 'Job-specific').

Example output:
[
  {
    "id": "q1",
    "text": "Tell me about a time you resolved a conflict within your engineering team.",
    "category": "Behavioral"
  },
  {
    "id": "q2",
    "text": "Explain how you would design a rate limiter.",
    "category": "Technical"
  }
]

Respond ONLY with valid JSON array.`;
}

export function buildEvaluateInterviewPrompt(
  role: string,
  questions: InterviewQuestion[],
  answers: Record<string, string>
): string {
  return `You are an expert technical interviewer and hiring manager.
The candidate has just finished their mock interview for the role of "${role}".
Your task is to evaluate their answers and provide comprehensive feedback.

Interview Transcript:
${questions.map((q) => `
Question [${q.category}]: ${q.text}
Answer: ${answers[q.id] || '(Skipped)'}
`).join("\n")}

Instructions:
1. Evaluate the candidate on Communication, Technical Depth, Confidence, Problem Solving, STAR format usage (for behavioral), Grammar, and Professionalism.
2. Score each category from 0 to 100.
3. Calculate an overall score (0 to 100).
4. Identify strengths and weaknesses.
5. Highlight missed concepts and provide actionable suggested improvements.
6. Provide specific, constructive feedback for EACH question.
7. Output strictly a JSON object matching this structure:

{
  "communication": 85,
  "technicalDepth": 75,
  "confidence": 80,
  "problemSolving": 70,
  "starFormat": 60,
  "grammar": 90,
  "professionalism": 95,
  "overallScore": 80,
  "strengths": ["Clear communication", "Good understanding of React"],
  "weaknesses": ["Lacked depth in system design", "Did not use STAR format"],
  "missedConcepts": ["Rate limiting algorithms", "Database indexing"],
  "suggestedImprovements": ["Practice STAR method for behavioral questions", "Review basic system design patterns"],
  "recommendedResources": ["Grokking the System Design Interview", "STAR method guide"],
  "questionFeedback": {
    "q1": "Great example, but try to focus more on your specific impact rather than the team's.",
    "q2": "You missed the token bucket algorithm. Review rate limiting strategies."
  }
}

Respond ONLY with the valid JSON object.`;
}
