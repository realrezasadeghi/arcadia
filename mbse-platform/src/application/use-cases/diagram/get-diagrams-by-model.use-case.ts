import type { IDiagramRepository } from "@/domain/ports/diagram.repository.port";
import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { Diagram } from "@/domain/entities/diagram.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetDiagramsByModelInput {
  modelId: string;
}

/**
 * GetDiagramsByModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetDiagramsByModelUseCase {
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly modelRepository: IModelRepository,
  ) {}

  async execute(input: GetDiagramsByModelInput): Promise<Diagram[]> {
    const model = await this.modelRepository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    return this.diagramRepository.findByModel(input.modelId);
  }
}
