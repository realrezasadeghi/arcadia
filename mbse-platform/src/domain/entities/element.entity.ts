import type { ElementType } from "../value-objects/element-type.vo";

/**
 * A ModelElement is a domain-level element belonging to a specific layer model.
 * It exists independently of any diagram — an element can appear in multiple diagrams.
 */
export interface ModelElement {
  id: string;
  modelId: string;
  type: ElementType;
  name: string;
  description: string;
  properties: ElementProperties;
  createdAt: string;
  updatedAt: string;
}

export interface ElementProperties {
  status?: "DRAFT" | "VALIDATED" | "DEPRECATED";
  stereotype?: string;
  // Extended properties per element type
  [key: string]: unknown;
}

/**
 * DiagramElement represents the visual placement of a ModelElement in a specific diagram.
 * Separation of concern: logical identity vs. visual representation.
 */
export interface DiagramElement {
  elementId: string; // ref to ModelElement.id
  diagramId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface CreateElementInput {
  modelId: string;
  type: ElementType;
  name: string;
  description?: string;
  properties?: ElementProperties;
}

export interface UpdateElementInput {
  name?: string;
  description?: string;
  properties?: Partial<ElementProperties>;
}
