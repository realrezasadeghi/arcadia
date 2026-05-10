import type { TraceLink } from "../entities/trace-link.entity";
import type { Layer } from "../value-objects/layer.vo";
import type { TraceLinkType } from "../value-objects/relationship-type.vo";

export interface CreateTraceLinkDTO {
  projectId: string;
  type: TraceLinkType;
  sourceElementId: string;
  sourceLayer: Layer;
  targetElementId: string;
  targetLayer: Layer;
  description?: string;
}

export interface ITraceLinkRepository {
  findByProject(projectId: string): Promise<TraceLink[]>;
  findByElement(elementId: string): Promise<TraceLink[]>;
  findById(id: string): Promise<TraceLink | null>;
  create(dto: CreateTraceLinkDTO): Promise<TraceLink>;
  updateDescription(id: string, description: string): Promise<TraceLink>;
  delete(id: string): Promise<void>;
}
