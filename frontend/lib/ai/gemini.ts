import { GoogleGenAI } from "@google/genai";
import { env } from "@/env.mjs";

const apiKey = env.GOOGLE_API_KEY || env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Environment Variable: GOOGLE_API_KEY or GEMINI_API_KEY must be set in .env.local");
}

export const ai = new GoogleGenAI({ apiKey });
