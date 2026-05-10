import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project } from "@/domain/entities/project.entity";

export class GetProjectsUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.repository.findAll();
  }
}
