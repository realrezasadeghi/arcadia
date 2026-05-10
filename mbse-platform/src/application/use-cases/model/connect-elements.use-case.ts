import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { Relationship } from "@/domain/entities/relationship.entity";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import { ConnectionPolicy } from "@/domain/policies/connection.policy";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface ConnectElementsInput {
  modelId: string;
  sourceElementId: string;
  targetElementId: string;
  relationshipType: string;
  name?: string;
  description?: string;
}

export class ConnectElementsUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: ConnectElementsInput): Promise<Relationship> {
    const [source, target] = await Promise.all([
      this.repository.findElementById(input.sourceElementId),
      this.repository.findElementById(input.targetElementId),
    ]);

    if (!source) throw new EntityNotFoundError("Element", input.sourceElementId);
    if (!target) throw new EntityNotFoundError("Element", input.targetElementId);

    const sourceType = ElementType.from(source.type.value);
    const targetType = ElementType.from(target.type.value);
    const relType = RelationshipType.from(input.relationshipType);

    // Policy validation — throws ConnectionNotAllowedError if invalid
    ConnectionPolicy.assertAllowed(sourceType, targetType, relType);

    return this.repository.createRelationship({
      modelId: input.modelId,
      type: relType,
      sourceElementId: input.sourceElementId,
      targetElementId: input.targetElementId,
      name: input.name ?? "",
      description: input.description ?? "",
    });
  }
}
