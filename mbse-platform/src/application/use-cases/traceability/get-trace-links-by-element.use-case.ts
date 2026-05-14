import type { ITraceLinkRepository } from "@/domain/ports/trace-link.repository.port";
import type { TraceLink } from "@/domain/entities/trace-link.entity";

export interface GetTraceLinksByElementInput {
  elementId: string;
}

/**
 * GetTraceLinksByElementUseCase
 *
 * تمام Trace Link هایی که یک المنت در آن‌ها source یا target است را بازمی‌گرداند.
 * برای نمایش پانل ردیابی در Properties Panel استفاده می‌شود.
 */
export class GetTraceLinksByElementUseCase {
  constructor(private readonly repository: ITraceLinkRepository) {}

  async execute(input: GetTraceLinksByElementInput): Promise<TraceLink[]> {
    return this.repository.findByElement(input.elementId);
  }
}
