import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project } from "@/domain/entities/project.entity";

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, input: { name?: string; description?: string }): Promise<Project> {
    return this.repository.update(id, input);
  }
}
