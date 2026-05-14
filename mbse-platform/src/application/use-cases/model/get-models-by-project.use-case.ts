import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ArchitectureModel } from "@/domain/entities/model.entity";

export interface GetModelsByProjectInput {
  projectId: string;
}

/**
 * GetModelsByProjectUseCase
 *
 * تمام مدل‌های یک پروژه را بازمی‌گرداند.
 * Business rule: projectId نمی‌تواند خالی باشد.
 */
export class GetModelsByProjectUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: GetModelsByProjectInput): Promise<ArchitectureModel[]> {
    return this.repository.findModelsByProject(input.projectId);
  }
}
