import type { IDiagramRepository } from "@/domain/ports/diagram.repository.port";
import type { Diagram } from "@/domain/entities/diagram.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetDiagramInput {
  diagramId: string;
}

/**
 * GetDiagramUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 */
export class GetDiagramUseCase {
  constructor(private readonly repository: IDiagramRepository) {}

  async execute(input: GetDiagramInput): Promise<Diagram> {
    const diagram = await this.repository.findById(input.diagramId);
    if (!diagram) throw new EntityNotFoundError("Diagram", input.diagramId);
    return diagram;
  }
}
