import type { InterviewMode, InterviewTurn } from "../../supabase/types";

export function buildFirstQuestionPrompt(
  mode: InterviewMode,
  role: string,
  company: string | null,
  difficulty: string,
  jobDescription: string | null,
  context: Record<string, unknown>
): string {
  return `You are a Senior Staff Interviewer at a top-tier FAANG company (${company || 'Google/Microsoft/Amazon'}).
Your task is to conduct a professional "${mode}" interview for a candidate applying for "${role}" (Difficulty: ${difficulty}).

Candidate Resume Context:
${context.resumeData ? JSON.stringify(context.resumeData) : 'Not provided'}

${jobDescription ? `Job Description:\n${jobDescription}` : ''}

Instructions:
1. Start the interview by introducing yourself briefly as Sarah, a Senior Software Engineer at the company.
2. The question must be highly tailored to the candidate's resume and the selected Interview Mode (${mode}).
3. Ask the very first question. Make it sound like a natural, conversational video call opening.

Output exactly a JSON object:
{
  "question": "The interview question here"
}
Respond ONLY with the valid JSON object.`;
}

export function buildFollowUpPrompt(
  mode: InterviewMode,
  role: string,
  difficulty: string,
  transcript: InterviewTurn[],
  latestAnswer: string
): string {
  const previousTurns = transcript.map((t, i) => `Turn ${i + 1}:\nInterviewer: ${t.question}\nCandidate: ${t.answer}`).join("\n\n");
  
  const lastQuestion = transcript.length > 0 ? transcript[transcript.length - 1].question : "N/A";

  return `You are a Senior Staff Interviewer conducting a "${mode}" interview for "${role}" (Difficulty: ${difficulty}).

Here is the transcript of the interview so far:
${previousTurns}

The interviewer just asked:
"${lastQuestion}"

The candidate just answered:
"${latestAnswer}"

Instructions:
1. Evaluate the candidate's latest answer. Score their Technical Ability, Communication, Confidence, and Problem Solving from 0-100.
2. Explain what was missing or could be improved in the feedback.
3. Provide the ideal, FAANG-level answer.
4. Generate ONE conversational follow-up question acting as Sarah. React naturally to their answer (e.g. "That's an interesting approach. What about...").

Output exactly a JSON object:
{
  "evaluation": {
    "feedback": "Short feedback on what they did well and what was missing.",
    "idealAnswer": "A concise example of what a perfect answer would look like.",
    "metrics": {
      "technical": 85,
      "communication": 90,
      "confidence": 80,
      "problemSolving": 75
    }
  },
  "nextQuestion": "Your conversational response and next question for the candidate."
}
Respond ONLY with the valid JSON object.`;
}

export function buildFinalEvaluationPrompt(
  mode: InterviewMode,
  role: string,
  transcript: InterviewTurn[]
): string {
  const fullTranscript = transcript.map((t, i) => `Turn ${i + 1}:\nInterviewer: ${t.question}\nCandidate: ${t.answer}`).join("\n\n");

  return `You are a Senior Staff Hiring Committee Member at a top-tier FAANG company.
Review this transcript for a "${mode}" interview for the "${role}" position.

Transcript:
${fullTranscript}

Instructions:
1. Evaluate the candidate across these FAANG rubrics: Communication, Technical Accuracy, Problem Solving, Confidence, and Depth.
2. Score each from 0 to 100. Calculate an overall average score.
3. Identify 3 strengths and 3 weaknesses.
4. Provide a 3-step concrete improvement plan.
5. Provide a final Hiring Recommendation: "Strong Hire", "Hire", "Leaning Hire", "Leaning No Hire", "No Hire", or "Strong No Hire".

Output exactly a JSON object matching this structure:
{
  "communication": 85,
  "technicalAccuracy": 75,
  "problemSolving": 80,
  "confidence": 90,
  "depth": 70,
  "overallScore": 80,
  "strengths": ["Clear communication", "Good grasp of React"],
  "weaknesses": ["Lacked depth in system design", "Missed edge cases"],
  "improvementPlan": ["Practice designing distributed systems", "Review rate limiting", "Use STAR method"],
  "hiringRecommendation": "Leaning Hire"
}
Respond ONLY with the valid JSON object.`;
}
