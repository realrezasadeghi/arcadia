import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type {
  ArchitectureModel,
  CreateModelInput,
  UpdateModelInput,
} from "@/domain/entities/model.entity";
import type {
  ModelElement,
  CreateElementInput,
  UpdateElementInput,
} from "@/domain/entities/element.entity";
import type {
  Relationship,
  CreateRelationshipInput,
  UpdateRelationshipInput,
} from "@/domain/entities/relationship.entity";
import type { Layer } from "@/domain/value-objects/layer.vo";
import { httpClient } from "../http/http-client";

export class ModelRepository implements IModelRepository {
  // ─── Architecture Models ───────────────────────────────────────────────────
  async findModelsByProject(projectId: string): Promise<ArchitectureModel[]> {
    return httpClient.get<ArchitectureModel[]>(`/projects/${projectId}/models`);
  }

  async findModelById(id: string): Promise<ArchitectureModel | null> {
    return httpClient.get<ArchitectureModel>(`/models/${id}`);
  }

  async findModelByProjectAndLayer(
    projectId: string,
    layer: Layer
  ): Promise<ArchitectureModel | null> {
    return httpClient.get<ArchitectureModel>(
      `/projects/${projectId}/models?layer=${layer}`
    );
  }

  async createModel(input: CreateModelInput): Promise<ArchitectureModel> {
    return httpClient.post<ArchitectureModel>(
      `/projects/${input.projectId}/models`,
      input
    );
  }

  async updateModel(
    id: string,
    input: UpdateModelInput
  ): Promise<ArchitectureModel> {
    return httpClient.patch<ArchitectureModel>(`/models/${id}`, input);
  }

  async deleteModel(id: string): Promise<void> {
    return httpClient.delete(`/models/${id}`);
  }

  // ─── Elements ──────────────────────────────────────────────────────────────
  async findElementsByModel(modelId: string): Promise<ModelElement[]> {
    return httpClient.get<ModelElement[]>(`/models/${modelId}/elements`);
  }

  async findElementById(id: string): Promise<ModelElement | null> {
    return httpClient.get<ModelElement>(`/elements/${id}`);
  }

  async createElement(input: CreateElementInput): Promise<ModelElement> {
    return httpClient.post<ModelElement>(
      `/models/${input.modelId}/elements`,
      input
    );
  }

  async updateElement(
    id: string,
    input: UpdateElementInput
  ): Promise<ModelElement> {
    return httpClient.patch<ModelElement>(`/elements/${id}`, input);
  }

  async deleteElement(id: string): Promise<void> {
    return httpClient.delete(`/elements/${id}`);
  }

  // ─── Relationships ─────────────────────────────────────────────────────────
  async findRelationshipsByModel(modelId: string): Promise<Relationship[]> {
    return httpClient.get<Relationship[]>(`/models/${modelId}/relationships`);
  }

  async findRelationshipById(id: string): Promise<Relationship | null> {
    return httpClient.get<Relationship>(`/relationships/${id}`);
  }

  async createRelationship(
    input: CreateRelationshipInput
  ): Promise<Relationship> {
    return httpClient.post<Relationship>(
      `/models/${input.modelId}/relationships`,
      input
    );
  }

  async updateRelationship(
    id: string,
    input: UpdateRelationshipInput
  ): Promise<Relationship> {
    return httpClient.patch<Relationship>(`/relationships/${id}`, input);
  }

  async deleteRelationship(id: string): Promise<void> {
    return httpClient.delete(`/relationships/${id}`);
  }
}

export const modelRepository = new ModelRepository();
