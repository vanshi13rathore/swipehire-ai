import type { ResumeAnalysis, Job, JobMatch } from "./types";

export function matchResumeToJob(analysis: ResumeAnalysis, job: Job): JobMatch {
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const reasons: string[] = [];

  // Edge cases
  if (!analysis) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: job?.skills || [],
      reasons: ["Empty resume data provided."],
    };
  }

  if (!job || !job.skills || job.skills.length === 0) {
    return {
      score: 100,
      matchedSkills: [],
      missingSkills: [],
      reasons: ["Job has no specific skill requirements."],
    };
  }

  const resumeSkills = (analysis.skills || []).map(s => s.toLowerCase().trim());
  const totalSkills = job.skills.length;
  
  for (const skill of job.skills) {
    const jobSkill = skill.toLowerCase().trim();
    if (resumeSkills.includes(jobSkill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  let score = 0;
  if (totalSkills > 0) {
    score = Math.round((matchedSkills.length / totalSkills) * 100);
  }

  // Ensure score is within [0, 100]
  score = Math.max(0, Math.min(100, score));

  // Generate deterministic reasons
  if (matchedSkills.length > 0) {
    reasons.push(`Strong ${matchedSkills[0]} experience.`);
  }

  if (missingSkills.length > 0) {
    reasons.push(`Missing ${missingSkills[0]} experience.`);
  }

  if (matchedSkills.length === totalSkills) {
    reasons.push("All required skills are present.");
  } else if (score >= 50) {
    reasons.push("Most required skills are present.");
  } else if (score > 0) {
    reasons.push("Some required skills are present.");
  } else {
    reasons.push("No required skills match this job.");
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    reasons,
  };
}
