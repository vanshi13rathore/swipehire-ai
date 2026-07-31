export interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
  certifications: string[];
  summary: string;
}

export interface ResumeAnalysisRequest {
  file: File;
  userId: string;
  filename: string;
  updatedTime: number;
}

export interface Job {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    verified?: boolean;
  };
  location: string;
  isRemote: boolean;
  salary: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  postedAt: string;
}

export interface JobMatch {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

export interface MatchedJob extends Job {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

export interface RecommendedJob extends Job {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  recommendationScore: number;
  recommendationReason: string;
}

export interface JobWithScores extends Job {
  chemistryScore: number;
  heuristicScores: {
    overall_score: number;
    skills_score: number;
    experience_score: number;
    education_score: number;
    keyword_score: number;
  } | null;
  recommendationReason: string;
}

import type { ResumeData } from "../supabase/types";

export interface TailorResumeResponse {
  tailoredData: ResumeData;
  atsScore: {
    before: number;
    after: number;
    explanation: string;
  };
  missingSkills: string[];
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    missingKeywords: string[];
  };
}
