import { create } from "zustand";
import type { Node, Edge, XYPosition } from "reactflow";

export type RelationshipTypeValue =
  | "OperationalExchange" | "InvolvementLink"
  | "FunctionalExchange"  | "SystemExchange"
  | "LogicalExchange"     | "ComponentExchange"
  | "ProvidedInterface"   | "RequiredInterface"
  | "PhysicalExchange"    | "PhysicalLink" | "DeploymentLink";

export type ElementTypeValue =
  | "OperationalEntity" | "OperationalActor" | "OperationalActivity"
  | "OperationalCapability" | "OperationalProcess"
  | "System" | "SystemActor" | "SystemFunction" | "SystemCapability" | "SystemComponent"
  | "LogicalComponent" | "LogicalActor" | "LogicalFunction"
  | "PhysicalComponent" | "PhysicalNode" | "PhysicalFunction" | "PhysicalActor";

export interface ElementNodeData {
  elementId: string;
  elementType: ElementTypeValue;
  name: string;
  description: string;
  status: "DRAFT" | "VALIDATED" | "DEPRECATED";
  modelId: string;
}

export interface RelationshipEdgeData {
  relationshipId: string;
  relationshipType: RelationshipTypeValue;
  name: string;
}

export type CanvasNode = Node<ElementNodeData>;
export type CanvasEdge = Edge<RelationshipEdgeData>;

export interface PendingConnection {
  sourceNodeId: string;
  targetNodeId: string;
  allowedTypes: RelationshipTypeValue[];
}

interface CanvasState {
  diagramId: string | null;
  modelId: string | null;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  pendingConnection: PendingConnection | null;

  initCanvas: (diagramId: string, modelId: string, nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
  addNode: (node: CanvasNode) => void;
  updateNodePosition: (id: string, position: XYPosition) => void;
  updateNodeData: (id: string, data: Partial<ElementNodeData>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setPendingConnection: (conn: PendingConnection | null) => void;
  reset: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  diagramId: null,
  modelId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  pendingConnection: null,

  initCanvas: (diagramId, modelId, nodes, edges) =>
    set({ diagramId, modelId, nodes, edges, selectedNodeId: null, selectedEdgeId: null }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  updateNodePosition: (id, position) =>
    set((s) => ({ nodes: s.nodes.map((n) => n.id === id ? { ...n, position } : n) })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
    })),

  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  removeEdge: (id) =>
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setPendingConnection: (conn) => set({ pendingConnection: conn }),
  reset: () => set({
    diagramId: null, modelId: null, nodes: [], edges: [],
    selectedNodeId: null, selectedEdgeId: null, pendingConnection: null,
  }),
}));
