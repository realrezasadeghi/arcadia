import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface DeleteModelInput {
  modelId: string;
}

/**
 * DeleteModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 * 2. حذف مدل، تمام المنت‌ها و روابط داخل آن را نیز حذف می‌کند (cascade — در repository)
 */
export class DeleteModelUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: DeleteModelInput): Promise<void> {
    const model = await this.repository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    return this.repository.deleteModel(input.modelId);
  }
}
