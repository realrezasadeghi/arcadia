"use client";

import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Background, Controls, MiniMap,
  applyNodeChanges, applyEdgeChanges,
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

  // Store IS the source of truth — no double state
  const {
    nodes, edges,
    setNodes, setEdges,
    addNode, updateNodePosition, addEdge, removeNode, removeEdge,
    selectNode, selectEdge, setPendingConnection, pendingConnection,
  } = useCanvasStore();

  // ─── RF change handlers — apply changes directly to store ─────────────────
  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes(applyNodeChanges(changes, nodes) as CanvasNode[]);
  }, [nodes, setNodes]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges(applyEdgeChanges(changes, edges) as CanvasEdge[]);
  }, [edges, setEdges]);

  // ─── Node drag end → persist layout ───────────────────────────────────────
  const handleNodeDragStop: NodeDragHandler = useCallback((_, node) => {
    updateNodePosition(node.id, node.position);
    notifyChange();
  }, [updateNodePosition, notifyChange]);

  // ─── Connect handler ───────────────────────────────────────────────────────
  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return;

    const sourceType = ElementType.from(sourceNode.data.elementType);
    const targetType = ElementType.from(targetNode.data.elementType);
    const allowedTypes = ConnectionPolicy.getAllowedTypes(sourceType, targetType)
      .map((rt) => rt.value) as RelationshipTypeValue[];

    if (allowedTypes.length === 0) return;
    if (allowedTypes.length === 1) {
      void createRelationship(connection.source, connection.target, allowedTypes[0], "");
    } else {
      setPendingConnection({ sourceNodeId: connection.source, targetNodeId: connection.target, allowedTypes });
    }
  }, [nodes, setPendingConnection]);

  async function createRelationship(
    sourceId: string, targetId: string,
    type: RelationshipTypeValue, name: string,
  ) {
    try {
      const rel = await container.connectElements.execute({ modelId, sourceElementId: sourceId, targetElementId: targetId, relationshipType: type, name });
      addEdge({
        id: rel.id, source: sourceId, target: targetId, type: "architecture-edge",
        data: { relationshipId: rel.id, relationshipType: rel.type.value as RelationshipTypeValue, name: rel.name },
      });
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) });
    } catch (err) { console.error("Connection failed:", err); }
  }

  // ─── Drop from palette ─────────────────────────────────────────────────────
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const typeValue = e.dataTransfer.getData("application/mbse-element-type") as ElementTypeValue;
    if (!typeValue || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = { x: e.clientX - bounds.left - 80, y: e.clientY - bounds.top - 30 };

    try {
      const element = await container.createElement.execute({ modelId, type: typeValue, name: ElementType.from(typeValue).labelFa });
      await container.repos.diagram.updateLayout(diagramId, {
        elementLayouts: [
          ...nodes.map((n) => ({ elementId: n.data.elementId, position: n.position, size: { width: n.width ?? 160, height: n.height ?? 60 } })),
          { elementId: element.id, position, size: { width: 160, height: 60 } },
        ],
      });
      addNode({
        id: element.id, type: "architecture-node", position,
        data: { elementId: element.id, elementType: element.type.value as ElementTypeValue, name: element.name, description: element.description, status: element.status, modelId },
      });
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) });
    } catch (err) { console.error("Element creation failed:", err); }
  }, [modelId, diagramId, nodes, addNode, qc]);

  // ─── Delete key ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && e.target === document.body) {
        const { selectedNodeId, selectedEdgeId } = useCanvasStore.getState();
        if (selectedNodeId) removeNode(selectedNodeId);
        else if (selectedEdgeId) removeEdge(selectedEdgeId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [removeNode, removeEdge]);

  return (
    <div className="flex flex-col h-full">
      <CanvasToolbar projectId={projectId} projectName={projectName} diagramName={diagramName} layer={layer} />

      <div className="flex flex-1 overflow-hidden">
        <PropertiesPanel projectId={projectId} />

        <div ref={reactFlowWrapper} className="flex-1 h-full" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeDragStop={handleNodeDragStop}
            onNodeClick={(_, node) => selectNode(node.id)}
            onEdgeClick={(_, edge) => selectEdge(edge.id)}
            onPaneClick={() => { selectNode(null); selectEdge(null); }}
            fitView fitViewOptions={{ padding: 0.15 }}
            deleteKeyCode={null}
            className="bg-background"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="[&>pattern]:stroke-border" />
            <Controls position="bottom-right" className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground" />
            <MiniMap
              position="bottom-left"
              className="!bg-card !border !border-border rounded-lg overflow-hidden"
              nodeColor={(node) => {
                try { return ElementType.from((node.data as CanvasNode["data"]).elementType).visualSpec.strokeColor; }
                catch { return "#94a3b8"; }
              }}
            />
          </ReactFlow>
        </div>

        <ElementPalette layer={layer} onDragStart={() => {}} />
      </div>

      <ConnectionDialog
        open={!!pendingConnection}
        allowedTypes={pendingConnection?.allowedTypes ?? []}
        onConfirm={(type, name) => {
          if (!pendingConnection) return;
          void createRelationship(pendingConnection.sourceNodeId, pendingConnection.targetNodeId, type, name);
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
