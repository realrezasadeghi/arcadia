import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { Project, ProjectRole } from "@/domain/entities/project.entity";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface AddMemberInput {
  projectId: string;
  userId: string;
  role: Exclude<ProjectRole, "OWNER">;
  /** شناسه کاربری که این عملیات را درخواست می‌دهد — باید مالک پروژه باشد */
  requestingUserId: string;
}

/**
 * AddMemberUseCase
 *
 * Business rules:
 * 1. پروژه باید وجود داشته باشد
 * 2. فقط مالک پروژه می‌تواند عضو اضافه کند
 * 3. شناسه کاربری نمی‌تواند خالی باشد
 * 4. چک تکراری بودن عضو در domain entity انجام می‌شود (Project.addMember)
 */
export class AddMemberUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: AddMemberInput): Promise<Project> {
    if (!input.userId.trim()) {
      throw new DomainError("شناسه کاربری الزامی است");
    }

    const project = await this.repository.findById(input.projectId);
    if (!project) throw new EntityNotFoundError("Project", input.projectId);

    if (!project.isOwner(input.requestingUserId)) {
      throw new DomainError("فقط مالک پروژه می‌تواند عضو اضافه کند");
    }

    return this.repository.addMember(input.projectId, input.userId.trim(), input.role);
  }
}
