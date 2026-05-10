import type { IDiagramRepository } from "@/domain/ports/diagram.repository.port";
import type { IModelRepository } from "@/domain/ports/model.repository.port";
import { Diagram } from "@/domain/entities/diagram.entity";
import { DiagramType } from "@/domain/value-objects/diagram-type.vo";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface CreateDiagramInput {
  modelId: string;
  type: string;
  name: string;
  description?: string;
}

export class CreateDiagramUseCase {
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly modelRepository: IModelRepository
  ) {}

  async execute(input: CreateDiagramInput): Promise<Diagram> {
    const diagramType = DiagramType.from(input.type);

    const model = await this.modelRepository.findModelById(input.modelId);
    if (!model) throw new EntityNotFoundError("ArchitectureModel", input.modelId);

    // DiagramType باید با Layer مدل مطابقت داشته باشد
    if (!diagramType.layer.equals(model.layer)) {
      throw new DomainError(
        `نوع دیاگرام "${diagramType.labelFa}" متعلق به لایه "${diagramType.layer.labelFa}" است، نه "${model.layer.labelFa}"`
      );
    }

    return this.diagramRepository.create({
      modelId: input.modelId,
      type: diagramType,
      name: input.name,
      description: input.description,
    });
  }
}
