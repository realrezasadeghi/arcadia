import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { Relationship } from "@/domain/entities/relationship.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface UpdateRelationshipInput {
  relationshipId: string;
  modelId: string;
  name?: string;
  description?: string;
}

/**
 * UpdateRelationshipUseCase
 *
 * Business rules:
 * 1. رابطه باید وجود داشته باشد
 * 2. نوع رابطه قابل تغییر نیست (بعد از ایجاد ثابت است)
 */
export class UpdateRelationshipUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: UpdateRelationshipInput): Promise<Relationship> {
    const [relationships] = await Promise.all([
      this.repository.findRelationshipsByModel(input.modelId),
    ]);
    const rel = relationships.find((r) => r.id === input.relationshipId);
    if (!rel) throw new EntityNotFoundError("Relationship", input.relationshipId);

    return this.repository.updateRelationship(input.relationshipId, {
      name: input.name,
      description: input.description,
    });
  }
}
