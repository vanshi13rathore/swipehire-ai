import { extractTextFromPDF } from "./pdf";
import { cleanResumeText } from "./clean";
import { analyzeResume } from "./analyze";
import type { ResumeAnalysis, ResumeAnalysisRequest } from "./types";
import { generateResumeInsights, type ResumeInsights } from "./insights";
import { getCachedResumeAnalysis, saveResumeAnalysis as saveToMemoryCache } from "./cache";
import { getStoredResumeAnalysis, saveResumeAnalysis as saveToPersistentStorage } from "@/lib/supabase/resume-analysis";

export async function getResumeAnalysis(
  request: ResumeAnalysisRequest
): Promise<ResumeAnalysis> {
  const { userId, filename, updatedTime } = request;

  // 1. Check in-memory cache
  const memoryCached = getCachedResumeAnalysis(userId, filename, updatedTime);
  if (memoryCached) {
    return memoryCached;
  }

  // 2. Check persistent storage cache
  const storedAnalysis = await getStoredResumeAnalysis(userId, filename, updatedTime);
  if (storedAnalysis) {
    // Restore to memory cache and return
    saveToMemoryCache(userId, filename, updatedTime, storedAnalysis);
    return storedAnalysis;
  }

  // 3. Fallback to Gemini
  const rawText = await extractTextFromPDF(request.file);
  const cleanedText = cleanResumeText(rawText);
  const analysis = await analyzeResume(cleanedText);

  // 4. Save to both cache layers
  await saveToPersistentStorage(userId, filename, updatedTime, analysis);
  saveToMemoryCache(userId, filename, updatedTime, analysis);

  return analysis;
}

export async function getResumeInsights(
  request: ResumeAnalysisRequest
): Promise<ResumeInsights> {
  const analysis = await getResumeAnalysis(request);
  return generateResumeInsights(analysis);
}
