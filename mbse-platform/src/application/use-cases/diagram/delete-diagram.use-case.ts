import type { IDiagramRepository } from "@/domain/ports/diagram.repository.port";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface DeleteDiagramInput {
  diagramId: string;
}

/**
 * DeleteDiagramUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 * نکته: حذف دیاگرام فقط layout را حذف می‌کند —
 *       المنت‌های مدل پابرجا می‌مانند.
 */
export class DeleteDiagramUseCase {
  constructor(private readonly repository: IDiagramRepository) {}

  async execute(input: DeleteDiagramInput): Promise<void> {
    const diagram = await this.repository.findById(input.diagramId);
    if (!diagram) throw new EntityNotFoundError("Diagram", input.diagramId);

    return this.repository.delete(input.diagramId);
  }
}
