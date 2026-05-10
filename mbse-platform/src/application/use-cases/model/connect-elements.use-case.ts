import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { Relationship } from "@/domain/entities/relationship.entity";
import type { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import { isConnectionAllowed } from "@/domain/rules/connection-rules";

export interface ConnectElementsInput {
  modelId: string;
  sourceElementId: string;
  targetElementId: string;
  relationshipType: RelationshipType;
  name?: string;
  description?: string;
}

/**
 * ConnectElementsUseCase validates connection rules before creating a relationship.
 * This enforces Arcadia constraints at the application layer.
 */
export class ConnectElementsUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: ConnectElementsInput): Promise<Relationship> {
    const [source, target] = await Promise.all([
      this.repository.findElementById(input.sourceElementId),
      this.repository.findElementById(input.targetElementId),
    ]);

    if (!source) throw new Error("عنصر منبع یافت نشد");
    if (!target) throw new Error("عنصر مقصد یافت نشد");

    const validation = isConnectionAllowed(
      source.type,
      target.type,
      input.relationshipType
    );

    if (!validation.allowed) {
      throw new Error(validation.reason ?? "اتصال مجاز نیست");
    }

    return this.repository.createRelationship({
      modelId: input.modelId,
      type: input.relationshipType,
      sourceElementId: input.sourceElementId,
      targetElementId: input.targetElementId,
      name: input.name ?? "",
      description: input.description ?? "",
    });
  }
}
