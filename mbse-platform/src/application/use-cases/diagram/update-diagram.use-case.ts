import type { IDiagramRepository } from "@/domain/ports/diagram.repository.port";
import type { Diagram } from "@/domain/entities/diagram.entity";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface UpdateDiagramInput {
  diagramId: string;
  name?: string;
  description?: string;
}

/**
 * UpdateDiagramUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 * 2. نام اگر داده شود نمی‌تواند خالی باشد
 */
export class UpdateDiagramUseCase {
  constructor(private readonly repository: IDiagramRepository) {}

  async execute(input: UpdateDiagramInput): Promise<Diagram> {
    if (input.name !== undefined && !input.name.trim()) {
      throw new DomainError("نام دیاگرام نمی‌تواند خالی باشد");
    }

    const diagram = await this.repository.findById(input.diagramId);
    if (!diagram) throw new EntityNotFoundError("Diagram", input.diagramId);

    return this.repository.update(input.diagramId, {
      name: input.name?.trim(),
      description: input.description,
    });
  }
}
