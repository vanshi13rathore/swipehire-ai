import type { ResumeAnalysis, Job, RecommendedJob } from "./types";
import { matchResumeToJob } from "./job-matcher";

export function recommendJobs(analysis: ResumeAnalysis | null, jobs: Job[]): RecommendedJob[] {
  if (!jobs || jobs.length === 0) return [];

  const recommended: RecommendedJob[] = jobs.map(job => {
    const match = matchResumeToJob(analysis as ResumeAnalysis, job);
    const skillScore = match.score * 0.50; // out of 50

    let experienceScore = 0; // out of 20
    let progressionScore = 0; // out of 15
    let employmentScore = 0; // out of 10
    let remoteScore = 0; // out of 5

    if (analysis && analysis.experience) {
      const jobExpLower = (job.experienceLevel || "").toLowerCase();
      const expCount = analysis.experience.length;

      if (jobExpLower.includes("senior") || jobExpLower.includes("lead") || jobExpLower.includes("principal")) {
        experienceScore = expCount >= 3 ? 20 : 10;
      } else if (jobExpLower.includes("mid") || jobExpLower.includes("intermediate")) {
        experienceScore = expCount >= 1 ? 20 : 10;
      } else if (jobExpLower.includes("entry") || jobExpLower.includes("junior")) {
        experienceScore = 20; 
      } else {
        experienceScore = 15;
      }

      const hasSeniorExp = analysis.experience.some(e => 
        e.toLowerCase().includes("senior") || 
        e.toLowerCase().includes("lead") || 
        e.toLowerCase().includes("principal")
      );
      
      const isSeniorJob = job.title.toLowerCase().includes("senior") || job.title.toLowerCase().includes("lead");

      if (isSeniorJob && !hasSeniorExp && expCount >= 2) {
        progressionScore = 15; 
      } else if (hasSeniorExp && isSeniorJob) {
        progressionScore = 15; 
      } else if (!isSeniorJob) {
        progressionScore = 10; 
      } else {
        progressionScore = 5;
      }
    } else {
      experienceScore = 0;
      progressionScore = 0;
    }

    const empLower = (job.employmentType || "").toLowerCase();
    if (empLower.includes("full")) employmentScore = 10;
    else if (empLower.includes("contract")) employmentScore = 5;
    else employmentScore = 2;

    if (job.isRemote) remoteScore = 5;
    else remoteScore = 0;

    let totalScore = skillScore + experienceScore + progressionScore + employmentScore + remoteScore;
    totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    let recommendationReason = "";
    if (totalScore >= 80) {
      if (match.matchedSkills.length > 0) {
        recommendationReason = `Excellent ${match.matchedSkills[0]} alignment.`;
      } else {
        recommendationReason = "Excellent overall match.";
      }
    } else if (totalScore >= 60) {
      if (progressionScore === 15) {
        recommendationReason = "Great opportunity for career progression.";
      } else if (match.matchedSkills.length > 0) {
        recommendationReason = `Strong ${match.matchedSkills[0]} ecosystem match.`;
      } else {
        recommendationReason = "Strong alignment with your profile.";
      }
    } else if (totalScore >= 40) {
      if (job.isRemote) {
        recommendationReason = "Good remote opportunity.";
      } else {
        recommendationReason = "Good salary progression.";
      }
    } else if (totalScore > 0) {
      recommendationReason = "Low match, but might be worth exploring.";
    } else {
      recommendationReason = "Does not align with your current profile.";
    }

    return {
      ...job,
      score: match.score,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      reasons: match.reasons,
      recommendationScore: totalScore,
      recommendationReason,
    };
  });

  return recommended.sort((a, b) => b.recommendationScore - a.recommendationScore);
}
