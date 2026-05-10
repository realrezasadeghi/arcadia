"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Archive, GitMerge, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import { TraceLinkType } from "@/domain/value-objects/relationship-type.vo";
import { useCanvasStore } from "@/presentation/stores/canvas.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";
import { MODEL_KEYS } from "@/presentation/hooks/use-models";
import { useElementTraces, useDeleteTraceLink } from "@/presentation/hooks/use-trace-links";
import { CreateTraceDialog } from "@/presentation/components/traceability/create-trace-dialog";
import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";

/**
 * PropertiesPanel
 *
 * نمایش و ویرایش مشخصات المنت یا رابطه انتخاب‌شده.
 * Single Responsibility: فقط properties management.
 */
export function PropertiesPanel({ projectId }: { projectId: string }) {
  const { selectedNodeId, selectedEdgeId, nodes, edges, updateNodeData, selectNode } = useCanvasStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId) ?? null;

  if (!selectedNode && !selectedEdge) return null;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b px-3 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          مشخصات
        </p>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => selectNode(null)}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selectedNode && (
          <NodeProperties node={selectedNode} onUpdate={updateNodeData} projectId={projectId} />
        )}
        {selectedEdge && selectedEdge.data && (
          <EdgeProperties edgeData={selectedEdge.data} />
        )}
      </div>
    </aside>
  );
}

// ─── Node Properties ──────────────────────────────────────────────────────────

function NodeProperties({
  node,
  onUpdate,
  projectId,
}: {
  node: NonNullable<ReturnType<typeof useCanvasStore.getState>["nodes"][0]>;
  onUpdate: (id: string, data: Parameters<ReturnType<typeof useCanvasStore.getState>["updateNodeData"]>[1]) => void;
  projectId: string;
}) {
  const [name, setName] = useState(node.data.name);
  const [desc, setDesc] = useState(node.data.description);
  const [traceDialogOpen, setTraceDialogOpen] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    setName(node.data.name);
    setDesc(node.data.description);
  }, [node.id, node.data.name, node.data.description]);

  const updateMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      container.repos.model.updateElement(node.data.elementId, { name, description }),
    onSuccess: (updated) => {
      onUpdate(node.id, { name: updated.name, description: updated.description });
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(node.data.modelId) });
    },
  });

  const { data: traces, isLoading: tracesLoading } = useElementTraces(node.data.elementId);
  const deleteTrace = useDeleteTraceLink();

  const elementType = ElementType.from(node.data.elementType);
  const spec = elementType.visualSpec;

  function handleSave() {
    if (!name.trim()) return;
    updateMutation.mutate({ name, description: desc });
  }

  const STATUS_LABELS = {
    DRAFT: "پیش‌نویس",
    VALIDATED: "اعتبارسنجی‌شده",
    DEPRECATED: "منسوخ",
  } as const;

  return (
    <div className="flex flex-col gap-4">
      {/* Type header */}
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-4 shrink-0 border"
          style={{
            backgroundColor: spec.fillColor,
            borderColor: spec.strokeColor,
            borderRadius: spec.shape === "ellipse" ? "50%" : spec.shape === "rounded-rectangle" ? "4px" : "1px",
          }}
        />
        <span className="text-xs text-muted-foreground">{elementType.labelFa}</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">وضعیت:</span>
        <Badge
          variant={
            node.data.status === "VALIDATED" ? "default"
            : node.data.status === "DEPRECATED" ? "destructive"
            : "secondary"
          }
          className="text-[10px] px-1.5 py-0"
        >
          {STATUS_LABELS[node.data.status]}
        </Badge>
      </div>

      <Separator />

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">نام</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">توضیحات</Label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={handleSave}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
          placeholder="توضیح این المنت..."
        />
      </div>

      <Separator />

      {/* Quick actions */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">عملیات سریع</p>
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-7 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            اعتبارسنجی
          </Button>
          <Button
            variant="ghost" size="sm"
            className="justify-start gap-2 h-7 text-xs"
            onClick={() => setTraceDialogOpen(true)}
          >
            <GitMerge className="h-3.5 w-3.5 text-primary" />
            افزودن Trace Link
          </Button>
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-7 text-xs text-destructive hover:text-destructive">
            <Archive className="h-3.5 w-3.5" />
            منسوخ کردن
          </Button>
        </div>
      </div>

      <Separator />

      {/* Traces list */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Trace Links</p>
        {tracesLoading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : !traces || traces.length === 0 ? (
          <p className="text-xs text-muted-foreground">هیچ trace ای تعریف نشده است.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {traces.map((tr) => {
              const isSource = tr.sourceElementId === node.data.elementId;
              const otherLayer = isSource ? tr.targetLayer : tr.sourceLayer;
              const traceSpec = TraceLinkType.from(tr.type.value).visualSpec;
              return (
                <div
                  key={tr.id}
                  className="flex items-start gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5"
                >
                  <span
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: traceSpec.strokeColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{traceSpec.labelFa}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {isSource ? "→" : "←"} {otherLayer.labelFa}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={deleteTrace.isPending}
                    onClick={() =>
                      deleteTrace.mutate({
                        id: tr.id,
                        projectId: tr.projectId,
                        sourceElementId: tr.sourceElementId,
                        targetElementId: tr.targetElementId,
                      })
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create trace dialog */}
      <CreateTraceDialog
        open={traceDialogOpen}
        onOpenChange={setTraceDialogOpen}
        sourceElementId={node.data.elementId}
        sourceElementType={node.data.elementType as ElementTypeValue}
        sourceLayerValue={elementType.layer.value}
        projectId={projectId}
      />
    </div>
  );
}

// ─── Edge Properties ──────────────────────────────────────────────────────────

function EdgeProperties({ edgeData }: { edgeData: NonNullable<ReturnType<typeof useCanvasStore.getState>["edges"][0]["data"]> }) {
  const relType = RelationshipType.from(edgeData.relationshipType);
  const spec = relType.visualSpec;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="h-1 w-6 rounded-full"
          style={{ backgroundColor: spec.strokeColor }}
        />
        <span className="text-xs text-muted-foreground">{spec.labelFa}</span>
      </div>
      {edgeData.name && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">نام</p>
          <p className="text-sm font-medium">{edgeData.name}</p>
        </div>
      )}
    </div>
  );
}
