"use client";

import { useCallback } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import { Separator } from "@/presentation/components/ui/separator";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { Layer } from "@/domain/value-objects/layer.vo";
import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";

interface ElementPaletteProps {
  layer: Layer;
  onDragStart: (type: ElementTypeValue) => void;
}

/**
 * ElementPalette
 *
 * نمایش المنت‌های قابل استفاده در لایه جاری.
 * کاربر روی هر المنت drag می‌کند تا روی canvas رها کند.
 */
export function ElementPalette({ layer, onDragStart }: ElementPaletteProps) {
  const elementTypes = ElementType.allForLayer(layer);

  const handleDragStart = useCallback(
    (e: React.DragEvent, type: ElementTypeValue) => {
      e.dataTransfer.setData("application/mbse-element-type", type);
      e.dataTransfer.effectAllowed = "copy";
      onDragStart(type);
    },
    [onDragStart]
  );

  return (
    <aside className="flex w-48 shrink-0 flex-col border-l bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card border-b px-3 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          المنت‌ها
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{layer.labelFa}</p>
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {elementTypes.map((et) => {
          const spec = et.visualSpec;
          return (
            <Tooltip key={et.value}>
              <TooltipTrigger asChild>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, et.value)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors select-none"
                >
                  {/* Color swatch */}
                  <span
                    className="h-5 w-5 shrink-0 border"
                    style={{
                      backgroundColor: spec.fillColor,
                      borderColor: spec.strokeColor,
                      borderRadius: spec.shape === "ellipse" ? "50%" : spec.shape === "rounded-rectangle" ? "6px" : "2px",
                    }}
                  />
                  <span className="text-xs leading-tight">{spec.labelFa}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                <p className="font-medium">{spec.label}</p>
                <p className="text-muted-foreground">{spec.labelFa}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <Separator className="my-1" />

      <div className="px-3 py-2">
        <p className="text-[10px] text-muted-foreground">
          المنت را به canvas بکشید
        </p>
      </div>
    </aside>
  );
}
