import type { IModelRepository, CreateElementDTO, CreateRelationshipDTO } from "@/domain/ports/model.repository.port";
import { ArchitectureModel } from "@/domain/entities/model.entity";
import { ModelElement } from "@/domain/entities/element.entity";
import { Relationship } from "@/domain/entities/relationship.entity";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { Layer } from "@/domain/value-objects/layer.vo";
import { models, elements, relationships, nextId } from "./in-memory-store";
import { EntityNotFoundError } from "@/domain/errors/domain.error";
import type { ElementStatus } from "@/domain/entities/element.entity";

function delay(ms = 100): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

export class InMemoryModelRepository implements IModelRepository {
  // ─── Models ──────────────────────────────────────────────────────────────
  async findModelsByProject(projectId: string): Promise<ArchitectureModel[]> {
    await delay();
    return [...models.values()].filter((m) => m.projectId === projectId);
  }
  async findModelById(id: string): Promise<ArchitectureModel | null> {
    await delay(60);
    return models.get(id) ?? null;
  }
  async findModelByProjectAndLayer(projectId: string, layer: Layer): Promise<ArchitectureModel | null> {
    await delay(60);
    return [...models.values()].find((m) => m.projectId === projectId && layer.equals(m.layer)) ?? null;
  }
  async createModel(dto: { projectId: string; layer: Layer; name: string; description?: string }): Promise<ArchitectureModel> {
    await delay();
    const m = ArchitectureModel.create({ id: nextId("model"), ...dto });
    models.set(m.id, m);
    return m;
  }
  async updateModel(id: string, dto: Partial<{ name: string; description: string }>): Promise<ArchitectureModel> {
    await delay();
    const m = models.get(id);
    if (!m) throw new EntityNotFoundError("Model", id);
    if (dto.name) m.rename(dto.name);
    if (dto.description !== undefined) m.updateDescription(dto.description);
    return m;
  }
  async deleteModel(id: string): Promise<void> {
    await delay();
    models.delete(id);
  }

  // ─── Elements ────────────────────────────────────────────────────────────
  async findElementsByModel(modelId: string): Promise<ModelElement[]> {
    await delay();
    return [...elements.values()].filter((e) => e.modelId === modelId);
  }
  async findElementById(id: string): Promise<ModelElement | null> {
    await delay(60);
    return elements.get(id) ?? null;
  }
  async createElement(dto: CreateElementDTO): Promise<ModelElement> {
    await delay();
    const el = ModelElement.create({
      id: nextId("el"),
      modelId: dto.modelId,
      type: ElementType.from(dto.type),
      name: dto.name,
      description: dto.description ?? "",
    });
    elements.set(el.id, el);
    return el;
  }
  async updateElement(id: string, dto: Partial<CreateElementDTO & { properties?: { status?: ElementStatus } }>): Promise<ModelElement> {
    await delay();
    const el = elements.get(id);
    if (!el) throw new EntityNotFoundError("Element", id);
    if (dto.name !== undefined || dto.description !== undefined) {
      el.updateProperties({ name: dto.name ?? el.name, description: dto.description ?? el.description });
    }
    if (dto.properties?.status === "VALIDATED") el.validate();
    if (dto.properties?.status === "DEPRECATED") el.deprecate();
    // DRAFT — اگر بکند از این پشتیبانی می‌کند
    return el;
  }
  async deleteElement(id: string): Promise<void> {
    await delay();
    elements.delete(id);
  }

  // ─── Relationships ────────────────────────────────────────────────────────
  async findRelationshipsByModel(modelId: string): Promise<Relationship[]> {
    await delay();
    return [...relationships.values()].filter((r) => r.modelId === modelId);
  }
  async createRelationship(dto: CreateRelationshipDTO): Promise<Relationship> {
    await delay();
    const rel = Relationship.create({
      id: nextId("rel"),
      modelId: dto.modelId,
      type: dto.type,
      sourceElementId: dto.sourceElementId,
      targetElementId: dto.targetElementId,
      name: dto.name ?? "",
      description: dto.description ?? "",
    });
    relationships.set(rel.id, rel);
    return rel;
  }
  async updateRelationship(id: string, dto: Partial<CreateRelationshipDTO>): Promise<Relationship> {
    await delay();
    const rel = relationships.get(id);
    if (!rel) throw new EntityNotFoundError("Relationship", id);
    if (dto.name !== undefined) rel.rename(dto.name);
    return rel;
  }
  async deleteRelationship(id: string): Promise<void> {
    await delay();
    relationships.delete(id);
  }
}
