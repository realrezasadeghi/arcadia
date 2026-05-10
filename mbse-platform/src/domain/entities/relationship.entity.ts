import type { RelationshipType } from "../value-objects/relationship-type.vo";

/**
 * A Relationship connects two ModelElements within the same layer.
 * (Cross-layer connections are handled by TraceLink)
 */
export interface Relationship {
  id: string;
  modelId: string;
  type: RelationshipType;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  description: string;
  properties: RelationshipProperties;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipProperties {
  exchangeKind?: "FLOW" | "EVENT" | "OPERATION";
  conveyedItems?: string[];
  protocol?: string;
  [key: string]: unknown;
}

export interface CreateRelationshipInput {
  modelId: string;
  type: RelationshipType;
  sourceElementId: string;
  targetElementId: string;
  name?: string;
  description?: string;
  properties?: RelationshipProperties;
}

export interface UpdateRelationshipInput {
  name?: string;
  description?: string;
  properties?: Partial<RelationshipProperties>;
}
