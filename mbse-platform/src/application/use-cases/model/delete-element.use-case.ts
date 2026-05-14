import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface DeleteElementInput {
  elementId: string;
}

/**
 * DeleteElementUseCase
 *
 * Business rules:
 * 1. المنت باید وجود داشته باشد
 * 2. حذف المنت تمام روابطی که به آن متصل هستند را نیز حذف می‌کند (cascade — در repository)
 */
export class DeleteElementUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: DeleteElementInput): Promise<void> {
    const element = await this.repository.findElementById(input.elementId);
    if (!element) throw new EntityNotFoundError("ModelElement", input.elementId);

    return this.repository.deleteElement(input.elementId);
  }
}
