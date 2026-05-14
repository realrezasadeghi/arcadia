import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ArchitectureModel } from "@/domain/entities/model.entity";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface UpdateModelInput {
  modelId: string;
  name?: string;
  description?: string;
}

/**
 * UpdateModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 * 2. نام اگر داده شود نمی‌تواند خالی باشد
 */
export class UpdateModelUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: UpdateModelInput): Promise<ArchitectureModel> {
    if (input.name !== undefined && !input.name.trim()) {
      throw new DomainError("نام مدل نمی‌تواند خالی باشد");
    }

    const model = await this.repository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    return this.repository.updateModel(input.modelId, {
      name: input.name?.trim(),
      description: input.description,
    });
  }
}
