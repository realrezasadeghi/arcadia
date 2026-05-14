import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ArchitectureModel } from "@/domain/entities/model.entity";
import { Layer } from "@/domain/value-objects/layer.vo";
import { DomainError } from "@/domain/errors/domain.error";

export interface CreateModelInput {
  projectId: string;
  layer: string | Layer;
  name: string;
  description?: string;
}

/**
 * CreateModelUseCase
 *
 * Business rules:
 * 1. لایه باید یکی از لایه‌های معتبر Arcadia باشد (OA/SA/LA/PA)
 * 2. هر پروژه حداکثر یک مدل از هر لایه می‌تواند داشته باشد
 */
export class CreateModelUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: CreateModelInput): Promise<ArchitectureModel> {
    const layer = input.layer instanceof Layer
      ? input.layer
      : Layer.from(input.layer);

    const existing = await this.repository.findModelByProjectAndLayer(
      input.projectId,
      layer
    );

    if (existing) {
      throw new DomainError(
        `این پروژه قبلاً یک مدل برای لایه ${layer.labelFa} دارد`
      );
    }

    return this.repository.createModel({
      projectId: input.projectId,
      layer,
      name: input.name,
      description: input.description,
    });
  }
}
