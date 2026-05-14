import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface DeleteRelationshipInput {
  relationshipId: string;
  modelId: string;
}

/**
 * DeleteRelationshipUseCase
 *
 * Business rules:
 * 1. رابطه باید در مدل وجود داشته باشد
 */
export class DeleteRelationshipUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: DeleteRelationshipInput): Promise<void> {
    const relationships = await this.repository.findRelationshipsByModel(input.modelId);
    const rel = relationships.find((r) => r.id === input.relationshipId);
    if (!rel) throw new EntityNotFoundError("Relationship", input.relationshipId);

    return this.repository.deleteRelationship(input.relationshipId);
  }
}
