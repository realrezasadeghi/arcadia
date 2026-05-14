import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project, ProjectRole } from "@/domain/entities/project.entity";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface ChangeMemberRoleInput {
  projectId: string;
  userId: string;
  role: Exclude<ProjectRole, "OWNER">;
  requestingUserId: string;
}

/**
 * ChangeMemberRoleUseCase
 *
 * Business rules:
 * 1. پروژه باید وجود داشته باشد
 * 2. فقط مالک پروژه می‌تواند نقش اعضا را تغییر دهد
 * 3. نقش مالک قابل تغییر نیست (توسط Project entity enforce می‌شود)
 */
export class ChangeMemberRoleUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: ChangeMemberRoleInput): Promise<Project> {
    const project = await this.repository.findById(input.projectId);
    if (!project) throw new EntityNotFoundError("Project", input.projectId);

    if (!project.isOwner(input.requestingUserId)) {
      throw new DomainError("فقط مالک پروژه می‌تواند نقش اعضا را تغییر دهد");
    }

    if (project.isOwner(input.userId)) {
      throw new DomainError("نقش مالک پروژه قابل تغییر نیست");
    }

    return this.repository.changeMemberRole(input.projectId, input.userId, input.role);
  }
}
