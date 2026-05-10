import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project } from "@/domain/entities/project.entity";
import { DomainError } from "@/domain/errors/domain.error";

export class CreateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: { name: string; description: string }): Promise<Project> {
    if (!input.name.trim() || input.name.trim().length < 3) {
      throw new DomainError("نام پروژه باید حداقل ۳ کاراکتر باشد");
    }
    return this.repository.create(input);
  }
}
