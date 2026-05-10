import type { Layer } from "../value-objects/layer.vo";

/**
 * An ArchitectureModel represents one layer (OA/SA/LA/PA) within a project.
 * Each project has up to 4 models (one per layer).
 */
export interface ArchitectureModel {
  id: string;
  projectId: string;
  layer: Layer;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModelInput {
  projectId: string;
  layer: Layer;
  name: string;
  description?: string;
}

export interface UpdateModelInput {
  name?: string;
  description?: string;
}
