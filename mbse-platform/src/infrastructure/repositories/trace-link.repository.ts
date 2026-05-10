import type { ITraceLinkRepository, CreateTraceLinkDTO } from "@/domain/ports/trace-link.repository.port";
import { TraceLink } from "@/domain/entities/trace-link.entity";
import { httpClient } from "../http/http-client";

interface TraceLinkRaw {
  id: string; projectId: string; type: string;
  sourceElementId: string; sourceLayer: string;
  targetElementId: string; targetLayer: string;
  description: string; createdAt: string; updatedAt: string;
}

const toEntity = (r: TraceLinkRaw): TraceLink => TraceLink.reconstitute(r);

export class TraceLinkRepository implements ITraceLinkRepository {
  async findByProject(projectId: string): Promise<TraceLink[]> {
    const raws = await httpClient.get<TraceLinkRaw[]>(
      `/projects/${projectId}/trace-links`,
      { tags: [`project-${projectId}-traces`] }
    );
    return raws.map(toEntity);
  }

  async findByElement(elementId: string): Promise<TraceLink[]> {
    const raws = await httpClient.get<TraceLinkRaw[]>(
      `/elements/${elementId}/trace-links`,
      { tags: [`element-${elementId}-traces`] }
    );
    return raws.map(toEntity);
  }

  async findById(id: string): Promise<TraceLink | null> {
    try {
      const raw = await httpClient.get<TraceLinkRaw>(`/trace-links/${id}`);
      return toEntity(raw);
    } catch { return null; }
  }

  async create(dto: CreateTraceLinkDTO): Promise<TraceLink> {
    const raw = await httpClient.post<TraceLinkRaw>(
      `/projects/${dto.projectId}/trace-links`,
      {
        ...dto,
        type: dto.type.value,
        sourceLayer: dto.sourceLayer.value,
        targetLayer: dto.targetLayer.value,
      }
    );
    return toEntity(raw);
  }

  async updateDescription(id: string, description: string): Promise<TraceLink> {
    const raw = await httpClient.patch<TraceLinkRaw>(`/trace-links/${id}`, { description });
    return toEntity(raw);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/trace-links/${id}`);
  }
}

export const traceLinkRepository = new TraceLinkRepository();
