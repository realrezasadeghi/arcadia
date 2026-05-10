import type { IProjectRepository } from "@/domain/ports/project.repository.port";

export class DeleteProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
