import { generateCareerChemistry } from "./lib/ai/career-chemistry";
import type { ResumeAnalysis, MatchedJob } from "./lib/ai/types";

function runTest(name: string, analysis: Partial<ResumeAnalysis> | null, job: Partial<MatchedJob>) {
  console.log(`\n--- Test: ${name} ---`);
  const result = generateCareerChemistry(analysis as ResumeAnalysis | null, job as MatchedJob);
  console.log(JSON.stringify(result, null, 2));
}

runTest("High Match", {
  projects: ["Built a CRM"]
}, {
  score: 100,
  skills: ["React", "Node.js"],
  matchedSkills: ["React", "Node.js"],
  missingSkills: []
});

runTest("Medium Match", {
  projects: []
}, {
  score: 60,
  skills: ["React", "AWS", "Docker"],
  matchedSkills: ["React"],
  missingSkills: ["AWS", "Docker"]
});

runTest("Low Match", {
  projects: ["Python Scripts"]
}, {
  score: 0,
  skills: ["React", "TypeScript"],
  matchedSkills: [],
  missingSkills: ["React", "TypeScript"]
});

runTest("No Skills", {
  projects: []
}, {
  score: 0,
  skills: ["React"],
  matchedSkills: [],
  missingSkills: ["React"]
});

runTest("Empty Resume", null, {
  score: 0,
  skills: ["React"],
  matchedSkills: [],
  missingSkills: ["React"]
});

// Expanded tests

runTest("No missing skills", {
  projects: ["Fullstack app"]
}, {
  score: 100,
  skills: ["Vue", "Ruby"],
  matchedSkills: ["Vue", "Ruby"],
  missingSkills: []
});

runTest("No required job skills", {
  projects: ["Random app"]
}, {
  score: 100,
  skills: [],
  matchedSkills: [],
  missingSkills: []
});

runTest("Duplicate resume skills", {
  projects: []
}, {
  score: 75,
  skills: ["Python", "Docker"],
  matchedSkills: ["Python", "Python"], // Simulated duplicate matching logic upstream
  missingSkills: ["Docker"]
});

runTest("Experience without projects", {
  projects: [],
  experience: ["Frontend Developer at Google"]
}, {
  score: 85,
  skills: ["JavaScript", "CSS"],
  matchedSkills: ["JavaScript", "CSS"],
  missingSkills: []
});

runTest("Full match", {
  projects: ["Built API", "Deployed to AWS"],
  experience: ["Backend Engineer"]
}, {
  score: 100,
  skills: ["Node.js", "Express", "AWS"],
  matchedSkills: ["Node.js", "Express", "AWS"],
  missingSkills: []
});
