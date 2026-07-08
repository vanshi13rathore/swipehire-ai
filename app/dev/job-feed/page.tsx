"use client";

import { JobFeed, mockJobs } from "@/components/jobs";

export default function JobFeedDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-32">
      <h1 className="text-3xl font-bold mb-12 text-center">Job Feed Testing</h1>

      <div className="space-y-24 max-w-5xl mx-auto">
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Default Feed</h2>
          <JobFeed jobs={mockJobs} />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Loading State</h2>
          <JobFeed loading />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Empty State</h2>
          <JobFeed jobs={[]} />
        </section>
      </div>
    </div>
  );
}
