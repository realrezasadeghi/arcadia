import type { IModelRepository, CreateModelDTO, CreateElementDTO, CreateRelationshipDTO } from "@/domain/ports/model.repository.port";
import { ArchitectureModel } from "@/domain/entities/model.entity";
import { ModelElement, type ElementProperties } from "@/domain/entities/element.entity";
import { Relationship, type RelationshipProperties } from "@/domain/entities/relationship.entity";
import type { Layer } from "@/domain/value-objects/layer.vo";
import { httpClient } from "../http/http-client";

// ─── Raw shapes from API ──────────────────────────────────────────────────────

interface ModelRaw {
  id: string; projectId: string; layer: string; name: string;
  description: string; createdAt: string; updatedAt: string;
}

interface ElementRaw {
  id: string; modelId: string; type: string; name: string;
  description: string; properties: ElementProperties; createdAt: string; updatedAt: string;
}

interface RelationshipRaw {
  id: string; modelId: string; type: string;
  sourceElementId: string; targetElementId: string;
  name: string; description: string;
  properties: RelationshipProperties; createdAt: string; updatedAt: string;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const toModel = (r: ModelRaw): ArchitectureModel => ArchitectureModel.reconstitute(r);
const toElement = (r: ElementRaw): ModelElement => ModelElement.reconstitute(r);
const toRelationship = (r: RelationshipRaw): Relationship => Relationship.reconstitute(r);

export class ModelRepository implements IModelRepository {
  // ─── Models ────────────────────────────────────────────────────────────────
  async findModelsByProject(projectId: string): Promise<ArchitectureModel[]> {
    const raws = await httpClient.get<ModelRaw[]>(`/projects/${projectId}/models`, {
      tags: [`project-${projectId}-models`],
    });
    return raws.map(toModel);
  }

  async findModelById(id: string): Promise<ArchitectureModel | null> {
    try {
      const raw = await httpClient.get<ModelRaw>(`/models/${id}`, { tags: [`model-${id}`] });
      return toModel(raw);
    } catch { return null; }
  }

  async findModelByProjectAndLayer(projectId: string, layer: Layer): Promise<ArchitectureModel | null> {
    try {
      const raw = await httpClient.get<ModelRaw>(
        `/projects/${projectId}/models?layer=${layer.value}`,
        { tags: [`project-${projectId}-model-${layer.value}`] }
      );
      return toModel(raw);
    } catch { return null; }
  }

  async createModel(dto: CreateModelDTO): Promise<ArchitectureModel> {
    const raw = await httpClient.post<ModelRaw>(
      `/projects/${dto.projectId}/models`,
      { ...dto, layer: dto.layer.value }
    );
    return toModel(raw);
  }

  async updateModel(id: string, dto: Partial<CreateModelDTO>): Promise<ArchitectureModel> {
    const raw = await httpClient.patch<ModelRaw>(`/models/${id}`, dto);
    return toModel(raw);
  }

  async deleteModel(id: string): Promise<void> {
    await httpClient.delete(`/models/${id}`);
  }

  // ─── Elements ──────────────────────────────────────────────────────────────
  async findElementsByModel(modelId: string): Promise<ModelElement[]> {
    const raws = await httpClient.get<ElementRaw[]>(`/models/${modelId}/elements`, {
      tags: [`model-${modelId}-elements`],
    });
    return raws.map(toElement);
  }

  async findElementById(id: string): Promise<ModelElement | null> {
    try {
      const raw = await httpClient.get<ElementRaw>(`/elements/${id}`, { tags: [`element-${id}`] });
      return toElement(raw);
    } catch { return null; }
  }

  async createElement(dto: CreateElementDTO): Promise<ModelElement> {
    const raw = await httpClient.post<ElementRaw>(`/models/${dto.modelId}/elements`, dto);
    return toElement(raw);
  }

  async updateElement(id: string, dto: Partial<CreateElementDTO>): Promise<ModelElement> {
    const raw = await httpClient.patch<ElementRaw>(`/elements/${id}`, dto);
    return toElement(raw);
  }

  async deleteElement(id: string): Promise<void> {
    await httpClient.delete(`/elements/${id}`);
  }

  // ─── Relationships ─────────────────────────────────────────────────────────
  async findRelationshipsByModel(modelId: string): Promise<Relationship[]> {
    const raws = await httpClient.get<RelationshipRaw[]>(`/models/${modelId}/relationships`, {
      tags: [`model-${modelId}-relationships`],
    });
    return raws.map(toRelationship);
  }

  async createRelationship(dto: CreateRelationshipDTO): Promise<Relationship> {
    const raw = await httpClient.post<RelationshipRaw>(
      `/models/${dto.modelId}/relationships`,
      { ...dto, type: dto.type.value }
    );
    return toRelationship(raw);
  }

  async updateRelationship(id: string, dto: Partial<CreateRelationshipDTO>): Promise<Relationship> {
    const raw = await httpClient.patch<RelationshipRaw>(`/relationships/${id}`, dto);
    return toRelationship(raw);
  }

  async deleteRelationship(id: string): Promise<void> {
    await httpClient.delete(`/relationships/${id}`);
  }
}

export const modelRepository = new ModelRepository();
