import { JobDetailsClient } from "./client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <JobDetailsClient id={id} />;
}
