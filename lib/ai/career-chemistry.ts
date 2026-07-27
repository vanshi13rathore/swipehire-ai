import type { ResumeAnalysis, MatchedJob } from "./types";

export interface CareerChemistryResult {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  careerAdvice: string[];
}

const EXCELLENT_MATCH = 80;
const GOOD_MATCH = 50;

export function generateCareerChemistry(
  analysis: ResumeAnalysis | null,
  job: MatchedJob
): CareerChemistryResult {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const careerAdvice: string[] = [];

  if (!analysis) {
    return {
      overall: "No resume data available.",
      strengths: [],
      weaknesses: [],
      careerAdvice: ["Please upload your resume to see chemistry insights."],
    };
  }

  if (!job.skills || job.skills.length === 0) {
    return {
      overall: "This job has broad requirements.",
      strengths: ["You satisfy all current requirements."],
      weaknesses: [],
      careerAdvice: ["Focus on highlighting your soft skills and previous project impact in the interview."],
    };
  }

  // Generate Strengths
  if (job.matchedSkills && job.matchedSkills.length > 0) {
    strengths.push(`You have strong ${job.matchedSkills[0]} experience.`);
  }
  
  if (job.score >= EXCELLENT_MATCH) {
    strengths.push("You satisfy most requirements.");
  } else if (job.score >= GOOD_MATCH && job.score < EXCELLENT_MATCH) {
    strengths.push("You satisfy several key requirements.");
  }

  if (analysis.projects && analysis.projects.length > 0) {
    strengths.push("You have relevant project experience.");
  } else if (analysis.experience && analysis.experience.length > 0) {
    strengths.push("You have relevant industry experience.");
  }

  // Generate Weaknesses
  if (job.missingSkills && job.missingSkills.length > 0) {
    for (let i = 0; i < Math.min(2, job.missingSkills.length); i++) {
      if (i === 0) weaknesses.push(`${job.missingSkills[i]} experience is missing.`);
      if (i === 1) weaknesses.push(`${job.missingSkills[i]} knowledge is recommended.`);
    }
  }

  // Generate Career Advice
  if (job.missingSkills && job.missingSkills.length > 0) {
    const firstSkill = job.missingSkills[0];
    careerAdvice.push(`Learn ${firstSkill}.`);
    
    const isCloudSkill = ["AWS", "Azure", "GCP"].includes(firstSkill);
    if (isCloudSkill) {
      careerAdvice.push(`Add ${firstSkill} certification.`);
    } else {
      careerAdvice.push(`Build a ${firstSkill} project.`);
    }

    if (job.missingSkills.length > 1) {
      const secondSkill = job.missingSkills[1];
      careerAdvice.push(`Practice ${secondSkill}.`);
    }
    
    if (!isCloudSkill && job.missingSkills.length <= 1) {
      careerAdvice.push("Strengthen your portfolio.");
    }
  } else {
    careerAdvice.push("Keep your skills up to date.");
    careerAdvice.push("Prepare for behavioral interviews.");
    careerAdvice.push("Review recent industry trends.");
  }

  // Generate Overall Summary
  let overall = "";
  if (job.score >= EXCELLENT_MATCH) {
    overall = "Excellent match! Your profile aligns strongly with this position.";
  } else if (job.score >= GOOD_MATCH) {
    overall = "Good match. You have a solid foundation but some areas need improvement.";
  } else if (job.score > 0) {
    overall = "Partial match. You have some relevant skills, but upskilling is recommended.";
  } else {
    overall = "Low match. This role requires significant upskilling in key areas.";
  }

  return {
    overall,
    strengths,
    weaknesses,
    careerAdvice,
  };
}
