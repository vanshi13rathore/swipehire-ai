import { generateResumeInsights } from "./lib/ai/insights";
import type { ResumeAnalysis } from "./lib/ai/types";

const emptyResume: ResumeAnalysis = {
  name: "",
  email: "",
  phone: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  summary: ""
};

console.log("--- LOW ---");
console.log(generateResumeInsights(emptyResume));

console.log("\n--- MEDIUM ---");
console.log(generateResumeInsights({
  ...emptyResume,
  summary: "A software engineer",
  skills: ["A", "B", "C", "D"],
  experience: []
}));

console.log("\n--- HIGH ---");
console.log(generateResumeInsights({
  ...emptyResume,
  summary: "A great software engineer",
  skills: ["A", "B", "C", "D", "E", "F"],
  experience: ["Tech Corp"]
}));
