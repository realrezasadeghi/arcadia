import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project } from "@/domain/entities/project.entity";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface RemoveMemberInput {
  projectId: string;
  userId: string;
  requestingUserId: string;
}

/**
 * RemoveMemberUseCase
 *
 * Business rules:
 * 1. پروژه باید وجود داشته باشد
 * 2. فقط مالک پروژه می‌تواند عضو را حذف کند
 * 3. مالک پروژه نمی‌تواند خودش را حذف کند (توسط Project entity enforce می‌شود)
 */
export class RemoveMemberUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: RemoveMemberInput): Promise<Project> {
    const project = await this.repository.findById(input.projectId);
    if (!project) throw new EntityNotFoundError("Project", input.projectId);

    if (!project.isOwner(input.requestingUserId)) {
      throw new DomainError("فقط مالک پروژه می‌تواند عضو را حذف کند");
    }

    return this.repository.removeMember(input.projectId, input.userId);
  }
}
