import type { ITraceLinkRepository, CreateTraceLinkDTO } from "@/domain/ports/trace-link.repository.port";
import { TraceLink } from "@/domain/entities/trace-link.entity";
import { traceLinks, nextId } from "./mock-store";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

function delay(ms = 100): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

export class MockTraceLinkRepository implements ITraceLinkRepository {
  async findByProject(projectId: string): Promise<TraceLink[]> {
    await delay();
    return [...traceLinks.values()].filter((t) => t.projectId === projectId);
  }

  async findByElement(elementId: string): Promise<TraceLink[]> {
    await delay();
    return [...traceLinks.values()].filter(
      (t) => t.sourceElementId === elementId || t.targetElementId === elementId,
    );
  }

  async findById(id: string): Promise<TraceLink | null> {
    await delay(60);
    return traceLinks.get(id) ?? null;
  }

  async create(dto: CreateTraceLinkDTO): Promise<TraceLink> {
    await delay();
    const tl = TraceLink.create({
      id: nextId("tl"),
      projectId: dto.projectId,
      type: dto.type,
      sourceElementId: dto.sourceElementId,
      sourceLayer: dto.sourceLayer,
      targetElementId: dto.targetElementId,
      targetLayer: dto.targetLayer,
      description: dto.description ?? "",
    });
    traceLinks.set(tl.id, tl);
    return tl;
  }

  async updateDescription(id: string, description: string): Promise<TraceLink> {
    await delay();
    const tl = traceLinks.get(id);
    if (!tl) throw new EntityNotFoundError("TraceLink", id);
    tl.updateDescription(description);
    return tl;
  }

  async delete(id: string): Promise<void> {
    await delay();
    traceLinks.delete(id);
  }
}
