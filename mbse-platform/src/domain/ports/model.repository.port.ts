import type {
  ArchitectureModel,
  CreateModelInput,
  UpdateModelInput,
} from "../entities/model.entity";
import type {
  ModelElement,
  CreateElementInput,
  UpdateElementInput,
} from "../entities/element.entity";
import type {
  Relationship,
  CreateRelationshipInput,
  UpdateRelationshipInput,
} from "../entities/relationship.entity";
import type { Layer } from "../value-objects/layer.vo";

export interface IModelRepository {
  // ─── Architecture Models ──────────────────────────────────────────────────
  findModelsByProject(projectId: string): Promise<ArchitectureModel[]>;
  findModelById(id: string): Promise<ArchitectureModel | null>;
  findModelByProjectAndLayer(projectId: string, layer: Layer): Promise<ArchitectureModel | null>;
  createModel(input: CreateModelInput): Promise<ArchitectureModel>;
  updateModel(id: string, input: UpdateModelInput): Promise<ArchitectureModel>;
  deleteModel(id: string): Promise<void>;

  // ─── Elements ─────────────────────────────────────────────────────────────
  findElementsByModel(modelId: string): Promise<ModelElement[]>;
  findElementById(id: string): Promise<ModelElement | null>;
  createElement(input: CreateElementInput): Promise<ModelElement>;
  updateElement(id: string, input: UpdateElementInput): Promise<ModelElement>;
  deleteElement(id: string): Promise<void>;

  // ─── Relationships ────────────────────────────────────────────────────────
  findRelationshipsByModel(modelId: string): Promise<Relationship[]>;
  findRelationshipById(id: string): Promise<Relationship | null>;
  createRelationship(input: CreateRelationshipInput): Promise<Relationship>;
  updateRelationship(id: string, input: UpdateRelationshipInput): Promise<Relationship>;
  deleteRelationship(id: string): Promise<void>;
}
