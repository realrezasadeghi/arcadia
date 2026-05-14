import type { ITraceLinkRepository } from "@/domain/ports/trace-link.repository.port";
import type { TraceLink } from "@/domain/entities/trace-link.entity";

export interface GetTraceLinksByProjectInput {
  projectId: string;
}

/**
 * GetTraceLinksByProjectUseCase
 *
 * تمام Trace Link های یک پروژه را بازمی‌گرداند.
 * برای نمایش Trace Matrix کامل استفاده می‌شود.
 */
export class GetTraceLinksByProjectUseCase {
  constructor(private readonly repository: ITraceLinkRepository) {}

  async execute(input: GetTraceLinksByProjectInput): Promise<TraceLink[]> {
    return this.repository.findByProject(input.projectId);
  }
}
