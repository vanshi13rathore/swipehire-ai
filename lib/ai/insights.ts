import type { ResumeAnalysis } from './types';

export interface ResumeInsights {
  profileStrength: "Low" | "Medium" | "High";
  missingSections: string[];
  topSkills: string[];
  recommendations: string[];
}

export function generateResumeInsights(analysis: ResumeAnalysis): ResumeInsights {
  const missingSections: string[] = [];
  const recommendations: string[] = [];
  const topSkills = analysis.skills?.slice(0, 5) || [];

  const hasSummary = Boolean(analysis.summary && analysis.summary.trim() !== "");
  const hasExperience = Boolean(analysis.experience && analysis.experience.length > 0);
  const hasSkills = Boolean(analysis.skills && analysis.skills.length > 0);
  const hasEducation = Boolean(analysis.education && analysis.education.length > 0);
  const hasProjects = Boolean(analysis.projects && analysis.projects.length > 0);
  const hasCertifications = Boolean(analysis.certifications && analysis.certifications.length > 0);

  // Missing sections
  if (!hasSummary) missingSections.push("Summary");
  if (!hasSkills) missingSections.push("Skills");
  if (!hasExperience) missingSections.push("Experience");
  if (!hasEducation) missingSections.push("Education");
  if (!hasProjects) missingSections.push("Projects");
  if (!hasCertifications) missingSections.push("Certifications");

  // Profile strength
  let profileStrength: "Low" | "Medium" | "High" = "Low";
  const numSkills = analysis.skills ? analysis.skills.length : 0;
  
  if (hasSummary && numSkills >= 5 && hasExperience) {
    profileStrength = "High";
  } else if (hasSummary && numSkills >= 3) {
    profileStrength = "Medium";
  }

  // Recommendations
  if (!hasSummary) {
    recommendations.push("Write a professional summary.");
  }
  if (numSkills < 5) {
    recommendations.push("Add more technical skills.");
  }
  if (!hasExperience) {
    recommendations.push("Include professional experience.");
  }
  if (!hasProjects) {
    recommendations.push("Include project experience.");
  }
  if (!hasEducation) {
    recommendations.push("Add your educational background.");
  }
  if (!hasCertifications) {
    recommendations.push("Add professional certifications.");
  }

  // Ensure there's at least one recommendation for high-scoring resumes
  if (recommendations.length === 0) {
    recommendations.push("Your resume looks well-structured and comprehensive.");
  }

  return {
    profileStrength,
    missingSections,
    topSkills,
    recommendations
  };
}
