import type { ResumeAnalysis } from "./types";

interface CacheEntry {
  analysis: ResumeAnalysis;
  filename: string;
  updatedTime: number;
}

// In-memory cache to prevent duplicate Gemini calls across the SPA session
const analysisCache = new Map<string, CacheEntry>();

export function getCachedResumeAnalysis(
  userId: string,
  filename: string,
  updatedTime: number
): ResumeAnalysis | null {
  const entry = analysisCache.get(userId);
  if (!entry) return null;

  if (entry.filename === filename && entry.updatedTime === updatedTime) {
    return entry.analysis;
  }

  // Invalidate cache automatically when filename or upload timestamp changes
  invalidateResumeCache(userId);
  return null;
}

export function saveResumeAnalysis(
  userId: string,
  filename: string,
  updatedTime: number,
  analysis: ResumeAnalysis
): void {
  analysisCache.set(userId, { analysis, filename, updatedTime });
}

export function invalidateResumeCache(userId: string): void {
  analysisCache.delete(userId);
}
