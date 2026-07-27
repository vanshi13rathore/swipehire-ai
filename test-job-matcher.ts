import { matchResumeToJob } from "./lib/ai/job-matcher";
import type { ResumeAnalysis, Job } from "./lib/ai/types";

function runTest(name: string, analysis: Partial<ResumeAnalysis>, job: Partial<Job>) {
  console.log(`\n--- Test: ${name} ---`);
  const result = matchResumeToJob(analysis as ResumeAnalysis, job as Job);
  console.log(JSON.stringify(result, null, 2));
}

// 1. High match
runTest(
  "High match",
  { skills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind"] },
  { skills: ["React", "TypeScript", "Node.js"] }
);

// 2. Medium match
runTest(
  "Medium match",
  { skills: ["React", "Next.js", "Node.js", "TypeScript"] },
  { skills: ["React", "Node.js", "AWS", "Docker"] }
);

// 3. Low match
runTest(
  "Low match",
  { skills: ["Python", "Django", "PostgreSQL"] },
  { skills: ["React", "TypeScript", "Node.js"] }
);

// 4. No skills
runTest(
  "No skills",
  { skills: [] },
  { skills: ["React", "TypeScript"] }
);

// 5. Empty resume
runTest(
  "Empty resume",
  null as unknown as ResumeAnalysis,
  { skills: ["React", "Node.js"] }
);

// 6. Empty job
runTest(
  "Empty job",
  { skills: ["React", "Node.js"] },
  { skills: [] }
);
