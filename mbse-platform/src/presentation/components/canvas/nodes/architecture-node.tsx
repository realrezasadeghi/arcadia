"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { getElementVisual } from "@/presentation/config/visual.config";
import { cn } from "@/presentation/lib/utils";
import type { ElementNodeData } from "@/presentation/stores/canvas.store";

const STATUS_RING: Record<string, string> = {
  DRAFT:      "ring-1 ring-gray-400/50",
  VALIDATED:  "ring-2 ring-green-500/70",
  DEPRECATED: "ring-2 ring-red-400/70 opacity-60",
};

function ArchitectureNodeComponent({ data, selected }: NodeProps<ElementNodeData>) {
  const elementType = ElementType.from(data.elementType);
  const spec = getElementVisual(elementType.value);

  const isEllipse = spec.shape === "ellipse";
  const isRounded = spec.shape === "rounded-rectangle";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center min-w-[140px] min-h-[52px] px-3 py-2",
        "border-2 text-[11px] font-medium leading-tight text-center select-none",
        "transition-shadow duration-150",
        isEllipse ? "rounded-full" : isRounded ? "rounded-xl" : "rounded-sm",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        STATUS_RING[data.status] ?? ""
      )}
      style={{
        backgroundColor: spec.fillColor,
        borderColor: spec.strokeColor,
        color: spec.strokeColor,
      }}
    >
      {data.status === "VALIDATED" && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
      )}
      {data.status === "DEPRECATED" && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-400 border-2 border-background" />
      )}

      <span className="absolute -top-4 right-0 left-0 text-center text-[9px] text-muted-foreground truncate px-1">
        {elementType.label}
      </span>

      <span className="line-clamp-2 break-words">{data.name}</span>

      <Handle type="target" position={Position.Top}    className="!h-2 !w-2 !border !border-current !bg-background" />
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border !border-current !bg-background" />
      <Handle type="target" position={Position.Right}  className="!h-2 !w-2 !border !border-current !bg-background" />
      <Handle type="source" position={Position.Left}   className="!h-2 !w-2 !border !border-current !bg-background" />
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeComponent);
