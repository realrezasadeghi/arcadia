import type { IDiagramRepository, UpdateDiagramLayoutDTO } from "@/domain/ports/diagram.repository.port";
import type { Diagram } from "@/domain/entities/diagram.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface UpdateDiagramLayoutInput {
  diagramId: string;
  layout: UpdateDiagramLayoutDTO;
}

/**
 * UpdateDiagramLayoutUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 * 2. layout شامل موقعیت و اندازه المنت‌ها و viewport می‌شود
 */
export class UpdateDiagramLayoutUseCase {
  constructor(private readonly repository: IDiagramRepository) {}

  async execute(input: UpdateDiagramLayoutInput): Promise<Diagram> {
    const diagram = await this.repository.findById(input.diagramId);
    if (!diagram) throw new EntityNotFoundError("Diagram", input.diagramId);

    return this.repository.updateLayout(input.diagramId, input.layout);
  }
}
