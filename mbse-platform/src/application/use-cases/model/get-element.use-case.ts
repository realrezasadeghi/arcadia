import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ModelElement } from "@/domain/entities/element.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetElementInput {
  elementId: string;
}

/**
 * GetElementUseCase
 *
 * Business rules:
 * 1. المنت باید وجود داشته باشد
 */
export class GetElementUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: GetElementInput): Promise<ModelElement> {
    const element = await this.repository.findElementById(input.elementId);
    if (!element) throw new EntityNotFoundError("ModelElement", input.elementId);
    return element;
  }
}
