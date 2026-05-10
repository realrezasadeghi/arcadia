"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  addEdge as rfAddEdge,
  type Connection, type NodeDragHandler,
  type OnNodesChange, type OnEdgesChange,
  BackgroundVariant, ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import { ArchitectureNode } from "./nodes/architecture-node";
import { ArchitectureEdge } from "./edges/architecture-edge";
import { ElementPalette } from "./element-palette";
import { PropertiesPanel } from "./properties-panel";
import { CanvasToolbar } from "./canvas-toolbar";
import { ConnectionDialog } from "./connection-dialog";

import { useCanvasStore, type CanvasEdge, type CanvasNode } from "@/presentation/stores/canvas.store";
import { useSaveManager } from "@/presentation/hooks/use-save-manager";

import { ElementType } from "@/domain/value-objects/element-type.vo";
import { ConnectionPolicy } from "@/domain/policies/connection.policy";
import { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import { Layer } from "@/domain/value-objects/layer.vo";

import { container } from "@/infrastructure/api/service-container";
import { useQueryClient } from "@tanstack/react-query";
import { MODEL_KEYS } from "@/presentation/hooks/use-models";
import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";
import type { RelationshipTypeValue } from "@/presentation/stores/canvas.store";

const NODE_TYPES = { "architecture-node": ArchitectureNode } as const;
const EDGE_TYPES = { "architecture-edge": ArchitectureEdge } as const;

interface DiagramCanvasInnerProps {
  diagramId: string;
  modelId: string;
  layerValue: string;
  projectId: string;
  projectName: string;
  diagramName: string;
}

function DiagramCanvasInner({
  diagramId, modelId, layerValue,
  projectId, projectName, diagramName,
}: DiagramCanvasInnerProps) {
  const layer = Layer.from(layerValue);
  const qc = useQueryClient();
  const { notifyChange } = useSaveManager();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    nodes: storeNodes, edges: storeEdges,
    initCanvas, setNodes, setEdges,
    addNode, updateNodePosition, addEdge, removeNode, removeEdge,
    selectNode, selectEdge, setPendingConnection, pendingConnection,
  } = useCanvasStore();

  const [nodes, , onNodesChange] = useNodesState<CanvasNode["data"]>(storeNodes);
  const [edges, , onEdgesChange] = useEdgesState<CanvasEdge["data"]>(storeEdges);

  // Sync store → RF state
  useEffect(() => { setNodes(nodes as CanvasNode[]); }, [nodes, setNodes]);
  useEffect(() => { setEdges(edges as CanvasEdge[]); }, [edges, setEdges]);

  // ─── Node drag end → persist position ──────────────────────────────────────
  const handleNodeDragStop: NodeDragHandler = useCallback((_, node) => {
    updateNodePosition(node.id, node.position);
    notifyChange();
  }, [updateNodePosition, notifyChange]);

  // ─── Connect handler ────────────────────────────────────────────────────────
  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const sourceNode = storeNodes.find((n) => n.id === connection.source);
    const targetNode = storeNodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return;

    const sourceType = ElementType.from(sourceNode.data.elementType);
    const targetType = ElementType.from(targetNode.data.elementType);
    const allowedTypes = ConnectionPolicy.getAllowedTypes(sourceType, targetType)
      .map((rt) => rt.value) as RelationshipTypeValue[];

    if (allowedTypes.length === 0) return; // اتصال مجاز نیست

    if (allowedTypes.length === 1) {
      // تنها یک گزینه → مستقیم بساز
      createRelationship(connection.source, connection.target, allowedTypes[0], "");
    } else {
      // چند گزینه → dialog نمایش بده
      setPendingConnection({
        sourceNodeId: connection.source,
        targetNodeId: connection.target,
        allowedTypes,
      });
    }
  }, [storeNodes, setPendingConnection]);

  async function createRelationship(
    sourceId: string, targetId: string,
    type: RelationshipTypeValue, name: string
  ) {
    try {
      const rel = await container.connectElements.execute({
        modelId,
        sourceElementId: sourceId,
        targetElementId: targetId,
        relationshipType: type,
        name,
      });

      const newEdge: CanvasEdge = {
        id: rel.id,
        source: sourceId,
        target: targetId,
        type: "architecture-edge",
        data: {
          relationshipId: rel.id,
          relationshipType: rel.type.value as RelationshipTypeValue,
          name: rel.name,
        },
      };
      addEdge(newEdge);
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) });
    } catch (err) {
      console.error("Connection failed:", err);
    }
  }

  // ─── Drop from palette ──────────────────────────────────────────────────────
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const typeValue = e.dataTransfer.getData("application/mbse-element-type") as ElementTypeValue;
    if (!typeValue || !reactFlowWrapper.current) return;

    // Convert screen coords → flow coords
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: e.clientX - bounds.left - 80,
      y: e.clientY - bounds.top - 30,
    };

    try {
      const element = await container.createElement.execute({
        modelId,
        type: typeValue,
        name: ElementType.from(typeValue).labelFa,
      });

      // Update diagram layout
      await container.repos.diagram.updateLayout(diagramId, {
        elementLayouts: [
          ...storeNodes.map((n) => ({
            elementId: n.data.elementId,
            position: n.position,
            size: { width: n.width ?? 160, height: n.height ?? 60 },
          })),
          { elementId: element.id, position, size: { width: 160, height: 60 } },
        ],
      });

      const newNode: CanvasNode = {
        id: element.id,
        type: "architecture-node",
        position,
        data: {
          elementId: element.id,
          elementType: element.type.value as ElementTypeValue,
          name: element.name,
          description: element.description,
          status: element.status,
          modelId,
        },
      };
      addNode(newNode);
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) });
    } catch (err) {
      console.error("Element creation failed:", err);
    }
  }, [modelId, diagramId, storeNodes, addNode, qc]);

  // ─── Delete key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === "Delete" || e.key === "Backspace") && e.target === document.body) {
        const { selectedNodeId, selectedEdgeId } = useCanvasStore.getState();
        if (selectedNodeId) removeNode(selectedNodeId);
        else if (selectedEdgeId) removeEdge(selectedEdgeId);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [removeNode, removeEdge]);

  return (
    <div className="flex flex-col h-full">
      <CanvasToolbar
        projectId={projectId}
        projectName={projectName}
        diagramName={diagramName}
        layer={layer}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Properties (راست) */}
        <PropertiesPanel />

        {/* Canvas (وسط) */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 h-full"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <ReactFlow
            nodes={storeNodes}
            edges={storeEdges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            onNodesChange={onNodesChange as OnNodesChange}
            onEdgesChange={onEdgesChange as OnEdgesChange}
            onConnect={handleConnect}
            onNodeDragStop={handleNodeDragStop}
            onNodeClick={(_, node) => selectNode(node.id)}
            onEdgeClick={(_, edge) => selectEdge(edge.id)}
            onPaneClick={() => { selectNode(null); selectEdge(null); }}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            deleteKeyCode={null}
            className="bg-background"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              className="[&>pattern]:stroke-border"
            />
            <Controls
              position="bottom-right"
              className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground"
            />
            <MiniMap
              position="bottom-left"
              className="!bg-card !border !border-border rounded-lg overflow-hidden"
              nodeColor={(node) => {
                const data = node.data as CanvasNode["data"];
                try {
                  return ElementType.from(data.elementType).visualSpec.strokeColor;
                } catch { return "#94a3b8"; }
              }}
            />
          </ReactFlow>
        </div>

        {/* Palette (چپ) */}
        <ElementPalette layer={layer} onDragStart={() => {}} />
      </div>

      {/* Connection type picker */}
      <ConnectionDialog
        open={!!pendingConnection}
        allowedTypes={pendingConnection?.allowedTypes ?? []}
        onConfirm={(type, name) => {
          if (!pendingConnection) return;
          createRelationship(
            pendingConnection.sourceNodeId,
            pendingConnection.targetNodeId,
            type, name
          );
          setPendingConnection(null);
        }}
        onCancel={() => setPendingConnection(null)}
      />
    </div>
  );
}

export function DiagramCanvas(props: DiagramCanvasInnerProps) {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
