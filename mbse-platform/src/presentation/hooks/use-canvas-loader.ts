"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCanvasStore, type CanvasEdge, type CanvasNode } from "@/presentation/stores/canvas.store";
import { container } from "@/infrastructure/api/service-container";
import { DIAGRAM_KEYS } from "./use-diagrams";
import { MODEL_KEYS } from "./use-models";
import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";
import type { RelationshipTypeValue } from "@/presentation/stores/canvas.store";

/**
 * useCanvasLoader
 *
 * داده‌های diagram را از API بارگذاری کرده و canvas store را initialize می‌کند.
 * Elements + Relationships + Layout را ترکیب می‌کند.
 */
export function useCanvasLoader(diagramId: string) {
  const { initCanvas, reset } = useCanvasStore();

  const diagramQuery = useQuery({
    queryKey: DIAGRAM_KEYS.detail(diagramId),
    queryFn: () => container.getDiagram.execute({ diagramId }),
    enabled: !!diagramId,
  });

  const diagram = diagramQuery.data;

  const elementsQuery = useQuery({
    queryKey: MODEL_KEYS.elements(diagram?.modelId ?? ""),
    queryFn: () => container.getElementsByModel.execute({ modelId: diagram!.modelId }),
    enabled: !!diagram?.modelId,
  });

  const relationshipsQuery = useQuery({
    queryKey: MODEL_KEYS.relationships(diagram?.modelId ?? ""),
    queryFn: () => container.getRelationshipsByModel.execute({ modelId: diagram!.modelId }),
    enabled: !!diagram?.modelId,
  });

  // Build canvas nodes/edges when all data is ready
  useEffect(() => {
    if (!diagram || !elementsQuery.data || !relationshipsQuery.data) return;

    const layoutMap = new Map(
      diagram.elementLayouts.map((l) => [l.elementId, l])
    );

    const nodes: CanvasNode[] = elementsQuery.data
      .filter((el) => layoutMap.has(el.id))
      .map((el) => {
        const layout = layoutMap.get(el.id)!;
        return {
          id: el.id,
          type: "architecture-node",
          position: layout.position,
          width: layout.size.width,
          height: layout.size.height,
          data: {
            elementId: el.id,
            elementType: el.type.value as ElementTypeValue,
            name: el.name,
            description: el.description,
            status: el.status,
            modelId: diagram.modelId,
          },
        };
      });

    const nodeIds = new Set(nodes.map((n) => n.id));

    const edges: CanvasEdge[] = relationshipsQuery.data
      .filter((r) => nodeIds.has(r.sourceElementId) && nodeIds.has(r.targetElementId))
      .map((r) => ({
        id: r.id,
        source: r.sourceElementId,
        target: r.targetElementId,
        type: "architecture-edge",
        data: {
          relationshipId: r.id,
          relationshipType: r.type.value as RelationshipTypeValue,
          name: r.name,
        },
      }));

    initCanvas(diagramId, diagram.modelId, nodes, edges);

    return () => reset();
  }, [diagram, elementsQuery.data, relationshipsQuery.data, diagramId, initCanvas, reset]);

  return {
    diagram,
    isLoading: diagramQuery.isLoading || elementsQuery.isLoading || relationshipsQuery.isLoading,
    isError: diagramQuery.isError,
  };
}
