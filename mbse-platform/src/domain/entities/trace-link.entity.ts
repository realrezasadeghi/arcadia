import type { Layer } from "../value-objects/layer.vo";
import type { TraceLinkType } from "../value-objects/relationship-type.vo";

/**
 * A TraceLink connects elements across different layers.
 * This is the core of Arcadia Traceability:
 * e.g., SA:SystemFunction --Realization--> OA:OperationalActivity
 */
export interface TraceLink {
  id: string;
  projectId: string;
  type: TraceLinkType;
  sourceElementId: string;
  sourceLayer: Layer;
  targetElementId: string;
  targetLayer: Layer;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTraceLinkInput {
  projectId: string;
  type: TraceLinkType;
  sourceElementId: string;
  sourceLayer: Layer;
  targetElementId: string;
  targetLayer: Layer;
  description?: string;
}
