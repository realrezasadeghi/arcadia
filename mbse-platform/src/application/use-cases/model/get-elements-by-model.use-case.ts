import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ModelElement } from "@/domain/entities/element.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetElementsByModelInput {
  modelId: string;
}

/**
 * GetElementsByModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetElementsByModelUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: GetElementsByModelInput): Promise<ModelElement[]> {
    const model = await this.repository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    return this.repository.findElementsByModel(input.modelId);
  }
}
