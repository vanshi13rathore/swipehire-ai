"use server";

import { createClient } from "../supabase/server";
import { ai } from "../ai/gemini";
import type { InterviewQuestion } from "../supabase/types";
import { Type, Schema } from "@google/genai";

export async function initializeInterview(sessionId: string): Promise<InterviewQuestion[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch session
  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Session not found");
  if (session.questions && session.questions.length > 0) return session.questions;

  // Fetch user's default resume for context
  const { data: resumeVersion } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .limit(1)
    .single();

  const resumeText = resumeVersion ? JSON.stringify(resumeVersion.resume_data) : "No resume provided.";

  // Generate Questions via Gemini
  const prompt = `
    You are an expert technical recruiter interviewing a candidate.
    Role: ${session.role}
    Difficulty: ${session.difficulty}
    Interview Type: ${session.job_description} // using this field temporarily for type
    
    Candidate Resume Summary:
    ${resumeText.substring(0, 2000)}
    
    Generate exactly 5 interview questions tailored to this role, difficulty, and type.
    Mix behavioral, technical, and resume-based questions appropriately.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                category: { type: Type.STRING, description: "Behavioral, Technical, Resume-based, or Job-specific" }
              }
            }
          }
        }
      } as Schema
    }
  });

  const object = JSON.parse(response.text || "{}");
  const questions = object.questions || [];

  // Save to DB
  await supabase
    .from("interview_sessions")
    .update({ 
      questions,
      status: "In Progress"
    })
    .eq("id", sessionId);

  return questions;
}

export async function submitInterviewAnswers(sessionId: string, answers: Record<string, string>): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) throw new Error("Session not found");

  // Generate Feedback via Gemini
  const transcript = session.questions.map((q: { id: string; text: string; category: string }) => `
    Question (${q.category}): ${q.text}
    Candidate Answer: ${answers[q.id] || "No answer provided."}
  `).join("\n\n");

  const prompt = `
    You are an expert technical recruiter evaluating an interview transcript.
    Role: ${session.role}
    Difficulty: ${session.difficulty}
    
    Transcript:
    ${transcript}
    
    Evaluate the candidate's performance. Be highly critical but constructive.
    Provide scores from 0-100 for each metric, identifying strengths and weaknesses.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          communication: { type: Type.INTEGER },
          technicalDepth: { type: Type.INTEGER },
          confidence: { type: Type.INTEGER },
          problemSolving: { type: Type.INTEGER },
          starFormat: { type: Type.INTEGER },
          grammar: { type: Type.INTEGER },
          professionalism: { type: Type.INTEGER },
          overallScore: { type: Type.INTEGER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          missedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
          questionFeedback: { type: Type.OBJECT }
        }
      } as Schema
    }
  });

  const object = JSON.parse(response.text || "{}");

  // Save feedback and mark completed
  await supabase
    .from("interview_sessions")
    .update({
      answers,
      feedback: object,
      overall_score: object.overallScore,
      status: "Completed"
    })
    .eq("id", sessionId);
}
