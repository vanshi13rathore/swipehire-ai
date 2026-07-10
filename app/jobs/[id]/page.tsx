import { JobDetails } from "@/components/jobs";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <JobDetails id={params.id} />
    </div>
  );
}
