import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type {
  Project,
  CreateProjectInput,
} from "@/domain/entities/project.entity";

export class CreateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    if (!input.name.trim()) {
      throw new Error("نام پروژه الزامی است");
    }
    return this.repository.create(input);
  }
}
