"use client";

import { JobCard, type Job } from "@/components/jobs";

const mockJob: Job = {
  id: "job-1",
  title: "Senior React Engineer",
  company: {
    name: "Linear",
    verified: true,
  },
  location: "San Francisco, CA",
  isRemote: true,
  salary: "$160k - $210k",
  employmentType: "Full-time",
  experienceLevel: "Senior",
  skills: ["React", "TypeScript", "Next.js", "Tailwind"],
  postedAt: "2 hours ago",
};

export default function JobCardDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-32">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Card Testing</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-center md:text-left">Default Variant</h2>
          <JobCard job={mockJob} matchPercentage={92} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-center md:text-left">Featured Variant</h2>
          <JobCard 
            job={{
              ...mockJob, 
              title: "Staff Frontend Engineer", 
              company: { name: "Stripe", verified: true }
            }} 
            featured 
            matchPercentage={98} 
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-center md:text-left">Saved Variant</h2>
          <JobCard 
            job={{
              ...mockJob, 
              title: "UX Designer", 
              company: { name: "Notion", verified: false },
              skills: ["Figma", "Prototyping", "UI/UX"]
            }} 
            saved 
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-center md:text-left">Compact Variant</h2>
          <JobCard job={mockJob} variant="compact" />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-center md:text-left">Loading State</h2>
          <JobCard loading />
        </section>
      </div>
    </div>
  );
}
