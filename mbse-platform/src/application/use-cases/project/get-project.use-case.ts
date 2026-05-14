import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project } from "@/domain/entities/project.entity";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

export interface GetProjectInput {
  projectId: string;
}

/**
 * GetProjectUseCase
 *
 * Business rules:
 * 1. پروژه باید وجود داشته باشد
 */
export class GetProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: GetProjectInput): Promise<Project> {
    const project = await this.repository.findById(input.projectId);
    if (!project) throw new EntityNotFoundError("Project", input.projectId);
    return project;
  }
}
