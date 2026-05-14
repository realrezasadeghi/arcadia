import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ArchitectureModel } from "@/domain/entities/model.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetModelInput {
  modelId: string;
}

/**
 * GetModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetModelUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: GetModelInput): Promise<ArchitectureModel> {
    const model = await this.repository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);
    return model;
  }
}
