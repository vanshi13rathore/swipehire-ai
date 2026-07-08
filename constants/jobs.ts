import { Job } from "@/types";

export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: "$180k - $240k",
    match: 94,
    skills: ["React", "Node.js", "PostgreSQL"],
    missing: ["Ruby on Rails"],
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Airbnb",
    location: "Remote",
    salary: "$130k - $170k",
    match: 88,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    missing: ["GraphQL"],
  }
];
