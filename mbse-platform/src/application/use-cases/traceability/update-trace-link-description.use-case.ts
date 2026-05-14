import type { ITraceLinkRepository } from "@/domain/ports/trace-link.repository.port";
import type { TraceLink } from "@/domain/entities/trace-link.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface UpdateTraceLinkDescriptionInput {
  id: string;
  description: string;
}

/**
 * UpdateTraceLinkDescriptionUseCase
 *
 * Business rules:
 * 1. Trace Link باید وجود داشته باشد
 * 2. فقط توضیحات قابل ویرایش است — نوع، source و target تغییر نمی‌کنند
 */
export class UpdateTraceLinkDescriptionUseCase {
  constructor(private readonly repository: ITraceLinkRepository) {}

  async execute(input: UpdateTraceLinkDescriptionInput): Promise<TraceLink> {
    const link = await this.repository.findById(input.id);
    if (!link) throw new EntityNotFoundError("TraceLink", input.id);

    return this.repository.updateDescription(input.id, input.description);
  }
}
