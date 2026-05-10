"use client";

import { Loader2 } from "lucide-react";
import { DiagramCanvas } from "./diagram-canvas";
import { useCanvasLoader } from "@/presentation/hooks/use-canvas-loader";

interface CanvasPageLoaderProps {
  diagramId: string;
  projectId: string;
  projectName: string;
}

export function CanvasPageLoader({ diagramId, projectId, projectName }: CanvasPageLoaderProps) {
  const { diagram, isLoading, isError } = useCanvasLoader(diagramId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !diagram) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">دیاگرام یافت نشد</p>
      </div>
    );
  }

  return (
    <DiagramCanvas
      diagramId={diagramId}
      modelId={diagram.modelId}
      layerValue={diagram.type.layer.value}
      projectId={projectId}
      projectName={projectName}
      diagramName={diagram.name}
    />
  );
}
