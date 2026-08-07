import { ResumeBuilderClient } from "./client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeBuilderEditorPage({ params }: PageProps) {
  const { id } = await params;
  return <ResumeBuilderClient id={id} />;
}
