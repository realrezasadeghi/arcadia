import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { ModelElement } from "@/domain/entities/element.entity";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface CreateElementInput {
  modelId: string;
  type: string;
  name: string;
  description?: string;
}

export class CreateElementUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: CreateElementInput): Promise<ModelElement> {
    // Validate element type is correct (throws InvalidValueError if not)
    ElementType.from(input.type);

    const model = await this.repository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    return this.repository.createElement({
      modelId: input.modelId,
      type: input.type,
      name: input.name,
      description: input.description,
    });
  }
}
