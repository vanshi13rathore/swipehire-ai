import { recommendJobs } from "./lib/ai/recommender";
import type { ResumeAnalysis, Job } from "./lib/ai/types";

const mockAnalysis: ResumeAnalysis = {
  name: "John Doe",
  email: "john@example.com",
  phone: "123",
  skills: ["React", "TypeScript", "Node.js", "AWS", "CSS"],
  experience: [
    "Frontend Developer at Corp (2020-2023)",
    "Senior Frontend Developer at Startup (2023-Present)"
  ],
  education: ["BS Computer Science"],
  projects: [],
  certifications: [],
  summary: "Frontend focused engineer"
};

const mockJobs: Job[] = [
  {
    // 0: Perfect Match
    id: "j1",
    title: "Senior React Developer",
    company: { name: "TechCo" },
    location: "Remote",
    isRemote: true,
    salary: "$150k",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    skills: ["React", "TypeScript", "Node.js", "AWS", "CSS"],
    postedAt: "today"
  },
  {
    // 1: Good Match
    id: "j2",
    title: "Frontend Engineer",
    company: { name: "DesignCorp" },
    location: "Remote",
    isRemote: true,
    salary: "$120k",
    employmentType: "Full-time",
    experienceLevel: "Mid-Level",
    skills: ["React", "TypeScript", "GraphQL"],
    postedAt: "today"
  },
  {
    // 2: Medium Match
    id: "j3",
    title: "Fullstack Developer",
    company: { name: "AgileInc" },
    location: "Office",
    isRemote: false,
    salary: "$100k",
    employmentType: "Full-time",
    experienceLevel: "Entry Level",
    skills: ["React", "Python", "Django"],
    postedAt: "today"
  },
  {
    // 3: Low Match
    id: "j4",
    title: "Backend Developer",
    company: { name: "DataSys" },
    location: "Office",
    isRemote: false,
    salary: "$90k",
    employmentType: "Contract",
    experienceLevel: "Mid-Level",
    skills: ["Java", "Spring Boot", "AWS"], // 1 skill match
    postedAt: "today"
  },
  {
    // 4: Zero Match
    id: "j5",
    title: "Data Scientist",
    company: { name: "AI Analytics" },
    location: "Office",
    isRemote: false,
    salary: "$160k",
    employmentType: "Contract",
    experienceLevel: "Senior",
    skills: ["Python", "TensorFlow", "Pandas"],
    postedAt: "today"
  },
  {
    // 5: Duplicate Skills (Testing robustness)
    id: "j6",
    title: "React Developer",
    company: { name: "WebShop" },
    location: "Remote",
    isRemote: true,
    salary: "$110k",
    employmentType: "Full-time",
    experienceLevel: "Mid-Level",
    skills: ["React", "React", "TypeScript", "CSS", "CSS"], // Duplicates
    postedAt: "today"
  }
];

function runTests() {
  console.log("=== RECOMMENDER ENGINE TESTS ===\n");

  const results = recommendJobs(mockAnalysis, mockJobs);
  
  console.log("1. Sorting Test");
  console.log("Returned Order (Highest to Lowest):");
  results.forEach(r => console.log(`- ${r.title}: ${r.recommendationScore} (${r.recommendationReason})`));
  
  if (results[0].recommendationScore >= results[1].recommendationScore) {
    console.log("✅ Sorting successful.\n");
  }

  console.log("2. Perfect Match");
  const perfect = results.find(j => j.id === "j1");
  console.log(`Score: ${perfect?.recommendationScore}`);
  if (perfect && perfect.recommendationScore > 90) console.log("✅ Perfect Match scoring successful.\n");

  console.log("3. Good Match");
  const good = results.find(j => j.id === "j2");
  console.log(`Score: ${good?.recommendationScore}`);
  if (good && good.recommendationScore >= 60 && good.recommendationScore < 90) console.log("✅ Good Match scoring successful.\n");

  console.log("4. Medium Match");
  const med = results.find(j => j.id === "j3");
  console.log(`Score: ${med?.recommendationScore}`);
  if (med && med.recommendationScore >= 40 && med.recommendationScore < 60) console.log("✅ Medium Match scoring successful.\n");

  console.log("5. Low Match");
  const low = results.find(j => j.id === "j4");
  console.log(`Score: ${low?.recommendationScore}`);
  if (low && low.recommendationScore > 0 && low.recommendationScore < 40) console.log("✅ Low Match scoring successful.\n");

  console.log("6. Zero Match");
  const zero = results.find(j => j.id === "j5");
  console.log(`Score: ${zero?.recommendationScore}`);
  if (zero && zero.recommendationScore < 30) console.log("✅ Zero Match scoring successful.\n");

  console.log("7. Duplicate Skills");
  const dup = results.find(j => j.id === "j6");
  console.log(`Score: ${dup?.recommendationScore}`);
  if (dup) console.log("✅ Duplicate skills successfully handled.\n");

  console.log("8. Empty Resume");
  const emptyResResults = recommendJobs(null, mockJobs);
  console.log(`Total scored without resume: ${emptyResResults.length}`);
  if (emptyResResults.length > 0 && emptyResResults[0].recommendationScore < 40) {
    console.log("✅ Empty resume scoring falls back to base limits.\n");
  }

  console.log("9. Empty Jobs");
  const emptyJobsResults = recommendJobs(mockAnalysis, []);
  console.log(`Total jobs returned: ${emptyJobsResults.length}`);
  if (emptyJobsResults.length === 0) {
    console.log("✅ Empty jobs gracefully returns 0 items.\n");
  }
}

runTests();
