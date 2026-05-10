import type { ITraceLinkRepository } from "@/domain/ports/trace-link.repository.port";
import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { TraceLink } from "@/domain/entities/trace-link.entity";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { Layer } from "@/domain/value-objects/layer.vo";
import { TraceLinkType } from "@/domain/value-objects/relationship-type.vo";
import { TracePolicy } from "@/domain/policies/trace.policy";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface CreateTraceLinkInput {
  projectId: string;
  type: string;
  sourceElementId: string;
  sourceLayer: string;
  targetElementId: string;
  targetLayer: string;
  description?: string;
}

/**
 * CreateTraceLinkUseCase
 *
 * هر دو repository از بیرون inject می‌شوند (Dependency Inversion).
 * TracePolicy برای اعتبارسنجی استفاده می‌شود — httpClient مستقیم نیست.
 */
export class CreateTraceLinkUseCase {
  constructor(
    private readonly traceLinkRepository: ITraceLinkRepository,
    private readonly modelRepository: IModelRepository
  ) {}

  async execute(input: CreateTraceLinkInput): Promise<TraceLink> {
    const [sourceEl, targetEl] = await Promise.all([
      this.modelRepository.findElementById(input.sourceElementId),
      this.modelRepository.findElementById(input.targetElementId),
    ]);

    if (!sourceEl) throw new EntityNotFoundError("Element", input.sourceElementId);
    if (!targetEl) throw new EntityNotFoundError("Element", input.targetElementId);

    const sourceType = ElementType.from(sourceEl.type.value);
    const targetType = ElementType.from(targetEl.type.value);
    const sourceLayer = Layer.from(input.sourceLayer);
    const targetLayer = Layer.from(input.targetLayer);
    const traceType = TraceLinkType.from(input.type);

    // Policy validation — throws TraceLinkNotAllowedError if invalid
    TracePolicy.assertAllowed(sourceType, sourceLayer, targetType, targetLayer, traceType);

    return this.traceLinkRepository.create({
      projectId: input.projectId,
      type: traceType,
      sourceElementId: input.sourceElementId,
      sourceLayer,
      targetElementId: input.targetElementId,
      targetLayer,
      description: input.description,
    });
  }
}
