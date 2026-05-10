import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type {
  Project,
  UpdateProjectInput,
} from "@/domain/entities/project.entity";

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, input: UpdateProjectInput): Promise<Project> {
    return this.repository.update(id, input);
  }
}
