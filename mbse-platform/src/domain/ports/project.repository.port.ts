import type { Project, ProjectRole } from "../entities/project.entity";

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(input: { name: string; description: string }): Promise<Project>;
  update(id: string, input: { name?: string; description?: string }): Promise<Project>;
  delete(id: string): Promise<void>;

  // ─── Member Management ──────────────────────────────────────────────────────
  addMember(projectId: string, userId: string, role: Exclude<ProjectRole, "OWNER">): Promise<Project>;
  changeMemberRole(projectId: string, userId: string, role: Exclude<ProjectRole, "OWNER">): Promise<Project>;
  removeMember(projectId: string, userId: string): Promise<Project>;
}
