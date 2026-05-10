import type { IDiagramRepository, CreateDiagramDTO, UpdateDiagramLayoutDTO } from "@/domain/ports/diagram.repository.port";
import { Diagram } from "@/domain/entities/diagram.entity";
import { diagrams, nextId } from "./mock-store";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

function delay(ms = 100): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

export class MockDiagramRepository implements IDiagramRepository {
  async findByModel(modelId: string): Promise<Diagram[]> {
    await delay();
    return [...diagrams.values()].filter((d) => d.modelId === modelId);
  }

  async findById(id: string): Promise<Diagram | null> {
    await delay(60);
    return diagrams.get(id) ?? null;
  }

  async create(dto: CreateDiagramDTO): Promise<Diagram> {
    await delay();
    const d = Diagram.create({
      id: nextId("diag"),
      modelId: dto.modelId,
      type: dto.type.value,
      name: dto.name,
      description: dto.description,
    });
    diagrams.set(d.id, d);
    return d;
  }

  async update(id: string, dto: Partial<CreateDiagramDTO>): Promise<Diagram> {
    await delay();
    const d = diagrams.get(id);
    if (!d) throw new EntityNotFoundError("Diagram", id);
    if (dto.name) d.rename(dto.name);
    if (dto.description !== undefined) d.updateDescription(dto.description);
    return d;
  }

  async updateLayout(id: string, dto: UpdateDiagramLayoutDTO): Promise<Diagram> {
    // Layout update را بدون delay ذخیره می‌کنیم
    const d = diagrams.get(id);
    if (!d) throw new EntityNotFoundError("Diagram", id);
    if (dto.viewport) d.updateViewport(dto.viewport);
    if (dto.elementLayouts) {
      for (const layout of dto.elementLayouts) {
        d.placeElement(layout.elementId, layout.position, layout.size);
      }
    }
    return d;
  }

  async delete(id: string): Promise<void> {
    await delay();
    diagrams.delete(id);
  }
}
