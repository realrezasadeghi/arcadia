"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Label } from "@/presentation/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/presentation/components/ui/dialog";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { getElementVisual } from "@/presentation/config/visual.config";
import { Layer } from "@/domain/value-objects/layer.vo";
import { TracePolicy } from "@/domain/policies/trace.policy";
import { useModels, useElements } from "@/presentation/hooks/use-models";
import { useCreateTraceLink } from "@/presentation/hooks/use-trace-links";
import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";

interface CreateTraceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** المنت مبدأ که trace از آن شروع می‌شود */
  sourceElementId: string;
  sourceElementType: ElementTypeValue;
  sourceLayerValue: string;
  projectId: string;
}

/**
 * CreateTraceDialog
 *
 * گام اول: گزینه‌های trace معتبر از TracePolicy گرفته می‌شود.
 * گام دوم: کاربر یک گزینه (target layer + trace type) انتخاب می‌کند.
 * گام سوم: المنت‌های target layer نمایش داده می‌شوند تا یکی انتخاب شود.
 */
export function CreateTraceDialog({
  open, onOpenChange,
  sourceElementId, sourceElementType, sourceLayerValue,
  projectId,
}: CreateTraceDialogProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const createTrace = useCreateTraceLink();

  const sourceType = ElementType.from(sourceElementType);
  const sourceLayer = Layer.from(sourceLayerValue);
  const traceOptions = TracePolicy.getTraceOptions(sourceType, sourceLayer);

  const selectedOption = selectedOptionIndex !== null ? traceOptions[selectedOptionIndex] : null;

  // Models for project — to find the model matching target layer
  const { data: models } = useModels(projectId);
  const targetModel = models?.find((m) => selectedOption?.targetLayer.equals(m.layer));

  const { data: targetElements } = useElements(targetModel?.id ?? "");

  // Filter elements in target model that match allowed types
  const filteredTargetElements = targetElements?.filter((el) =>
    selectedOption?.targetTypes.includes(el.type.value as ElementTypeValue)
  ) ?? [];

  function handleReset() {
    setSelectedOptionIndex(null);
    setSelectedTargetId(null);
  }

  function handleClose() {
    handleReset();
    onOpenChange(false);
  }

  async function handleConfirm() {
    if (!selectedOption || !selectedTargetId) return;

    await createTrace.mutateAsync({
      projectId,
      type: selectedOption.type.value,
      sourceElementId,
      sourceLayer: sourceLayer.value,
      targetElementId: selectedTargetId,
      targetLayer: selectedOption.targetLayer.value,
    });

    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ایجاد Trace Link</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {traceOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              هیچ trace مجازی برای این المنت تعریف نشده است.
            </p>
          ) : (
            <>
              {/* Step 1 — Pick trace option */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs">نوع ارتباط trace</Label>
                <div className="flex flex-col gap-1.5">
                  {traceOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setSelectedOptionIndex(i); setSelectedTargetId(null); }}
                      className={[
                        "w-full rounded-md border px-3 py-2 text-sm text-right transition-colors",
                        selectedOptionIndex === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:bg-muted",
                      ].join(" ")}
                    >
                      <span className="font-medium">{opt.type.labelFa}</span>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        → {opt.targetLayer.labelFa} ({opt.targetTypes.map((t) => ElementType.from(t).labelFa).join(" / ")})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — Pick target element */}
              {selectedOption && (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">
                    انتخاب المنت در لایه {selectedOption.targetLayer.labelFa}
                  </Label>
                  {!targetModel ? (
                    <p className="text-xs text-muted-foreground">
                      مدلی برای لایه {selectedOption.targetLayer.labelFa} ایجاد نشده است.
                    </p>
                  ) : filteredTargetElements.length === 0 ? (
                    <p className="text-xs text-muted-foreground">المنت سازگاری در این لایه وجود ندارد.</p>
                  ) : (
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded-md p-1">
                      {filteredTargetElements.map((el) => {
                        const spec = getElementVisual(el.type.value as ElementTypeValue);
                        return (
                          <button
                            key={el.id}
                            type="button"
                            onClick={() => setSelectedTargetId(el.id)}
                            className={[
                              "flex items-center gap-2 rounded px-2 py-1.5 text-sm text-right transition-colors",
                              selectedTargetId === el.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted",
                            ].join(" ")}
                          >
                            <span
                              className="h-3 w-3 shrink-0 rounded-sm border"
                              style={{ backgroundColor: spec.fillColor, borderColor: spec.strokeColor }}
                            />
                            <span className="truncate">{el.name}</span>
                            <span className="mr-auto text-[10px] text-muted-foreground shrink-0">
                              {ElementType.from(el.type.value as ElementTypeValue).labelFa}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>انصراف</Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedOption || !selectedTargetId || createTrace.isPending}
          >
            {createTrace.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin ml-1.5" />}
            ایجاد Trace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
