"use server";

import { ai } from "./gemini";
import { buildGenerateInsightsPrompt, type AnalyticsContext } from "./prompts/analytics";

import { supabase } from "../supabase/client";

export interface DashboardInsights {
  weeklySummary: string;
  strengths: string[];
  weakestAreas: string[];
  topMissingSkills: string[];
  suggestedCertifications: string[];
  learningRoadmap: { step: number; title: string; description: string }[];
  recommendedJobs: { title: string; reason: string }[];
}

export async function generateDashboardInsights(context: AnalyticsContext): Promise<DashboardInsights> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // 1. Rate Limiting Check
    const { data: rateLimit } = await supabase
      .from('api_rate_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('endpoint', 'generateDashboardInsights')
      .single();

    const now = new Date();
    if (rateLimit) {
      const windowStart = new Date(rateLimit.window_start);
      // Reset window every 24 hours
      if (now.getTime() - windowStart.getTime() > 24 * 60 * 60 * 1000) {
        await supabase.from('api_rate_limits').update({ request_count: 1, window_start: now.toISOString() }).eq('id', rateLimit.id);
      } else if (rateLimit.request_count >= 10) { // Max 10 requests per 24h
        throw new Error("Rate limit exceeded. Please try again tomorrow.");
      } else {
        await supabase.from('api_rate_limits').update({ request_count: rateLimit.request_count + 1 }).eq('id', rateLimit.id);
      }
    } else {
      await supabase.from('api_rate_limits').insert({ user_id: user.id, endpoint: 'generateDashboardInsights', request_count: 1 });
    }

    // 2. Cache Check (24h Cache)
    const cacheKey = JSON.stringify(context).length.toString(); // Naive hash for demo purposes
    const { data: cacheResult } = await supabase
      .from('ai_response_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('cache_key', cacheKey)
      .gt('expires_at', now.toISOString())
      .single();

    if (cacheResult) {
      return cacheResult.response_data as DashboardInsights;
    }

    // 3. AI Generation with Retry Logic
    const prompt = buildGenerateInsightsPrompt(context);
    let retries = 2;
    let responseText = null;

    while (retries >= 0 && !responseText) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });
        responseText = response.text;
      } catch (err) {
        if (retries === 0) throw err;
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Exponential backoff stub
      }
    }

    if (!responseText) throw new Error("Empty response from AI");
    const insights = JSON.parse(responseText) as DashboardInsights;

    // 4. Save to Cache (24h expiration)
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    await supabase.from('ai_response_cache').insert({
      user_id: user.id,
      cache_key: cacheKey,
      response_data: insights,
      expires_at: expiresAt.toISOString()
    });

    return insights;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      weeklySummary: "Keep up the great work! You're making steady progress.",
      strengths: [],
      weakestAreas: [],
      topMissingSkills: [],
      suggestedCertifications: [],
      learningRoadmap: [],
      recommendedJobs: []
    };
  }
}
