import type { Diagram, ElementLayout, Viewport } from "../entities/diagram.entity";
import type { DiagramType } from "../value-objects/diagram-type.vo";

export interface CreateDiagramDTO {
  modelId: string;
  type: DiagramType;
  name: string;
  description?: string;
}

export interface UpdateDiagramLayoutDTO {
  viewport?: Viewport;
  elementLayouts?: ElementLayout[];
}

export interface IDiagramRepository {
  findByModel(modelId: string): Promise<Diagram[]>;
  findById(id: string): Promise<Diagram | null>;
  create(dto: CreateDiagramDTO): Promise<Diagram>;
  update(id: string, dto: Partial<CreateDiagramDTO>): Promise<Diagram>;
  updateLayout(id: string, dto: UpdateDiagramLayoutDTO): Promise<Diagram>;
  delete(id: string): Promise<void>;
}
