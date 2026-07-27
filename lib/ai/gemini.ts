import { GoogleGenAI } from "@google/genai";
import { env } from "@/env.mjs";

const apiKey = env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({ apiKey });
