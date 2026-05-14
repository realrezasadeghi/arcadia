import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { Relationship } from "@/domain/entities/relationship.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetRelationshipsByModelInput {
  modelId: string;
}

/**
 * GetRelationshipsByModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetRelationshipsByModelUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: GetRelationshipsByModelInput): Promise<Relationship[]> {
    const model = await this.repository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    return this.repository.findRelationshipsByModel(input.modelId);
  }
}
