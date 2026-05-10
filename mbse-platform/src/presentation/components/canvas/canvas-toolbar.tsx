"use client";

import Link from "next/link";
import {
  ZoomIn, ZoomOut, Maximize2, ChevronRight,
  Undo2, Redo2, Trash2,
} from "lucide-react";
import { useReactFlow } from "reactflow";
import { Button } from "@/presentation/components/ui/button";
import { Separator } from "@/presentation/components/ui/separator";
import { SaveStatusIndicator } from "@/presentation/components/layout/save-status-indicator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import { useCanvasStore } from "@/presentation/stores/canvas.store";
import type { Layer } from "@/domain/value-objects/layer.vo";

interface CanvasToolbarProps {
  projectId: string;
  projectName: string;
  diagramName: string;
  layer: Layer;
}

export function CanvasToolbar({ projectId, projectName, diagramName, layer }: CanvasToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { selectedNodeId, selectedEdgeId, removeNode, removeEdge } = useCanvasStore();

  const hasSelection = selectedNodeId || selectedEdgeId;

  function handleDelete() {
    if (selectedNodeId) removeNode(selectedNodeId);
    else if (selectedEdgeId) removeEdge(selectedEdgeId);
  }

  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b bg-background px-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground transition-colors">
          پروژه‌ها
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        <Link href={`/project/${projectId}`} className="hover:text-foreground transition-colors truncate max-w-[120px]">
          {projectName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        <span
          className="rounded px-1.5 py-0.5 text-xs font-medium border"
          style={{ borderColor: `hsl(var(--layer-${layer.value.toLowerCase()}))`,
                   color: `hsl(var(--layer-${layer.value.toLowerCase()}-foreground))`,
                   backgroundColor: `hsl(var(--layer-${layer.value.toLowerCase()}-muted))` }}
        >
          {layer.value}
        </span>
        <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        <span className="text-foreground font-medium truncate max-w-[160px]">{diagramName}</span>
      </div>

      <div className="mr-auto flex items-center gap-1">
        <SaveStatusIndicator />

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Undo / Redo (placeholder — undo/redo می‌توان بعداً با immer اضافه کرد) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>واگرد</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>انجام‌مجدد</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Delete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="icon" className="h-7 w-7"
              disabled={!hasSelection}
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>حذف انتخاب‌شده (Del)</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Zoom controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => zoomIn()}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>بزرگ‌نمایی</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => zoomOut()}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>کوچک‌نمایی</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => fitView({ padding: 0.1, duration: 400 })}>
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>جا دادن همه</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
