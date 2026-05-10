import { CanvasPageLoader } from "@/presentation/components/canvas/canvas-page-loader";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";

interface PageProps {
  params: Promise<{ id: string; diagramId: string }>;
}

export default async function DiagramPage({ params }: PageProps) {
  const { id, diagramId } = await params;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen flex flex-col overflow-hidden">
        <CanvasPageLoader
          diagramId={diagramId}
          projectId={id}
          projectName="پروژه"
        />
      </div>
    </TooltipProvider>
  );
}
