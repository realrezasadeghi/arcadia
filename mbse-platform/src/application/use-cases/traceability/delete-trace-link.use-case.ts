import type { ITraceLinkRepository } from "@/domain/ports/trace-link.repository.port";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface DeleteTraceLinkInput {
  id: string;
}

/**
 * DeleteTraceLinkUseCase
 *
 * Business rules:
 * 1. Trace Link باید وجود داشته باشد
 */
export class DeleteTraceLinkUseCase {
  constructor(private readonly repository: ITraceLinkRepository) {}

  async execute(input: DeleteTraceLinkInput): Promise<void> {
    const link = await this.repository.findById(input.id);
    if (!link) throw new EntityNotFoundError("TraceLink", input.id);

    return this.repository.delete(input.id);
  }
}
