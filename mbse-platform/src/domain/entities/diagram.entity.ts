import type { DiagramType } from "../value-objects/diagram-type.vo";

export interface DiagramViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface DiagramElementLayout {
  elementId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

/**
 * A Diagram is a visual view inside a layer model.
 * Each diagram references elements that belong to the parent model.
 * Layout (position/size) is stored per diagram.
 */
export interface Diagram {
  id: string;
  modelId: string;
  type: DiagramType;
  name: string;
  description: string;
  viewport: DiagramViewport;
  elementLayouts: DiagramElementLayout[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagramInput {
  modelId: string;
  type: DiagramType;
  name: string;
  description?: string;
}

export interface UpdateDiagramInput {
  name?: string;
  description?: string;
  viewport?: DiagramViewport;
  elementLayouts?: DiagramElementLayout[];
}
