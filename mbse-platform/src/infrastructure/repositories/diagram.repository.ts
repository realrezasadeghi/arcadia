import type { IDiagramRepository, CreateDiagramDTO, UpdateDiagramLayoutDTO } from "@/domain/ports/diagram.repository.port";
import { Diagram, type ElementLayout, type Viewport } from "@/domain/entities/diagram.entity";
import { httpClient } from "../http/http-client";

interface DiagramRaw {
  id: string; modelId: string; type: string; name: string;
  description: string; viewport: Viewport;
  elementLayouts: ElementLayout[]; createdAt: string; updatedAt: string;
}

const toEntity = (r: DiagramRaw): Diagram => Diagram.reconstitute(r);

export class DiagramRepository implements IDiagramRepository {
  async findByModel(modelId: string): Promise<Diagram[]> {
    const raws = await httpClient.get<DiagramRaw[]>(`/models/${modelId}/diagrams`, {
      tags: [`model-${modelId}-diagrams`],
    });
    return raws.map(toEntity);
  }

  async findById(id: string): Promise<Diagram | null> {
    try {
      const raw = await httpClient.get<DiagramRaw>(`/diagrams/${id}`, {
        tags: [`diagram-${id}`],
      });
      return toEntity(raw);
    } catch { return null; }
  }

  async create(dto: CreateDiagramDTO): Promise<Diagram> {
    const raw = await httpClient.post<DiagramRaw>(
      `/models/${dto.modelId}/diagrams`,
      { ...dto, type: dto.type.value }
    );
    return toEntity(raw);
  }

  async update(id: string, dto: Partial<CreateDiagramDTO>): Promise<Diagram> {
    const raw = await httpClient.patch<DiagramRaw>(`/diagrams/${id}`, dto);
    return toEntity(raw);
  }

  async updateLayout(id: string, dto: UpdateDiagramLayoutDTO): Promise<Diagram> {
    const raw = await httpClient.patch<DiagramRaw>(`/diagrams/${id}/layout`, dto);
    return toEntity(raw);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/diagrams/${id}`);
  }
}

export const diagramRepository = new DiagramRepository();
