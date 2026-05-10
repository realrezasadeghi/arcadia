import type { ArchitectureModel } from "../entities/model.entity";
import type { ModelElement } from "../entities/element.entity";
import type { Relationship } from "../entities/relationship.entity";
import type { RelationshipType } from "../value-objects/relationship-type.vo";
import type { Layer } from "../value-objects/layer.vo";

export interface CreateModelDTO {
  projectId: string;
  layer: Layer;
  name: string;
  description?: string;
}

export interface CreateElementDTO {
  modelId: string;
  type: string;
  name: string;
  description?: string;
  properties?: Record<string, unknown>;
}

export interface CreateRelationshipDTO {
  modelId: string;
  type: RelationshipType;
  sourceElementId: string;
  targetElementId: string;
  name?: string;
  description?: string;
}

export interface IModelRepository {
  // ─── Models ────────────────────────────────────────────────────────────────
  findModelsByProject(projectId: string): Promise<ArchitectureModel[]>;
  findModelById(id: string): Promise<ArchitectureModel | null>;
  findModelByProjectAndLayer(projectId: string, layer: Layer): Promise<ArchitectureModel | null>;
  createModel(dto: CreateModelDTO): Promise<ArchitectureModel>;
  updateModel(id: string, dto: Partial<CreateModelDTO>): Promise<ArchitectureModel>;
  deleteModel(id: string): Promise<void>;

  // ─── Elements ──────────────────────────────────────────────────────────────
  findElementsByModel(modelId: string): Promise<ModelElement[]>;
  findElementById(id: string): Promise<ModelElement | null>;
  createElement(dto: CreateElementDTO): Promise<ModelElement>;
  updateElement(id: string, dto: Partial<CreateElementDTO>): Promise<ModelElement>;
  deleteElement(id: string): Promise<void>;

  // ─── Relationships ─────────────────────────────────────────────────────────
  findRelationshipsByModel(modelId: string): Promise<Relationship[]>;
  createRelationship(dto: CreateRelationshipDTO): Promise<Relationship>;
  updateRelationship(id: string, dto: Partial<CreateRelationshipDTO>): Promise<Relationship>;
  deleteRelationship(id: string): Promise<void>;
}
