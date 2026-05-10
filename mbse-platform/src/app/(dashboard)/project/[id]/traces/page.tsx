import { TraceMatrixView } from "@/presentation/components/traceability/trace-matrix-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TracesPage({ params }: PageProps) {
  const { id } = await params;
  return <TraceMatrixView projectId={id} />;
}
