import type { Job } from "@/lib/ai/types";
import type { RemotiveJob } from "./types";

export function getExperienceLevel(title: string): string {
  const t = (title || "").toLowerCase();
  
  if (
    t.includes("senior") || 
    t.includes("lead") || 
    t.includes("principal") || 
    t.includes("staff") || 
    t.includes("architect") || 
    t.includes("director") || 
    t.includes("manager")
  ) {
    return "Senior";
  }
  
  if (
    t.includes("intern") || 
    t.includes("graduate") || 
    t.includes("fresher") || 
    t.includes("junior") || 
    t.includes("entry") || 
    t.includes("associate")
  ) {
    return "Entry Level";
  }
  
  return "Mid-Level";
}

export function normalizeJob(job: RemotiveJob): Job {
  const rawSkills = job.tags || [];
  // Deduplicate, trim, and filter empty strings
  const skills = Array.from(new Set(rawSkills.map(s => s.trim()).filter(Boolean)));

  return {
    id: String(job.id),
    title: job.title || "Software Engineer",
    company: {
      name: job.company_name || "Unknown Company",
      logo: job.company_logo || "",
      verified: true,
    },
    location: job.candidate_required_location || "Remote",
    isRemote: true,
    salary: job.salary || "Competitive",
    employmentType: job.job_type ? job.job_type.replace("_", " ") : "Full-time",
    experienceLevel: getExperienceLevel(job.title),
    skills,
    postedAt: job.publication_date || new Date().toISOString()
  };
}

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch("/api/jobs");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data as Job[];
  } catch (error) {
    console.error("Error fetching jobs from internal API:", error);
    // Wrap network failures with descriptive application errors
    throw new Error("Unable to connect to the job market. Please try again later.");
  }
}
