import type { TraceLink, CreateTraceLinkInput } from "@/domain/entities/trace-link.entity";
import { isTraceLinkAllowed } from "@/domain/rules/trace-rules";
import { httpClient } from "@/infrastructure/http/http-client";

/**
 * CreateTraceLinkUseCase validates cross-layer trace rules before persisting.
 */
export class CreateTraceLinkUseCase {
  async execute(input: CreateTraceLinkInput): Promise<TraceLink> {
    const [sourceEl, targetEl] = await Promise.all([
      httpClient.get<{ type: string }>(`/elements/${input.sourceElementId}`),
      httpClient.get<{ type: string }>(`/elements/${input.targetElementId}`),
    ]);

    const validation = isTraceLinkAllowed(
      sourceEl.type as never,
      input.sourceLayer,
      targetEl.type as never,
      input.targetLayer,
      input.type
    );

    if (!validation.allowed) {
      throw new Error(validation.reason ?? "پیوند ردیابی مجاز نیست");
    }

    return httpClient.post<TraceLink>(
      `/projects/${input.projectId}/trace-links`,
      input
    );
  }
}
