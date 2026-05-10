import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type { ProjectRole } from "@/domain/entities/project.entity";
import { Project } from "@/domain/entities/project.entity";
import { projects, nextId, DEMO_USER } from "./in-memory-store";
import { EntityNotFoundError } from "@/domain/errors/domain.error";

function delay(ms = 120): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

export class InMemoryProjectRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    await delay();
    return [...projects.values()];
  }

  async findById(id: string): Promise<Project | null> {
    await delay(80);
    return projects.get(id) ?? null;
  }

  async create(input: { name: string; description: string }): Promise<Project> {
    await delay();
    const p = Project.create({ id: nextId("proj"), name: input.name, description: input.description, ownerId: DEMO_USER.id });
    projects.set(p.id, p);
    return p;
  }

  async update(id: string, input: { name?: string; description?: string }): Promise<Project> {
    await delay();
    const p = projects.get(id);
    if (!p) throw new EntityNotFoundError("Project", id);
    if (input.name) p.rename(input.name);
    if (input.description !== undefined) p.updateDescription(input.description);
    return p;
  }

  async delete(id: string): Promise<void> {
    await delay();
    projects.delete(id);
  }

  async addMember(projectId: string, userId: string, role: Exclude<ProjectRole, "OWNER">): Promise<Project> {
    await delay();
    const p = projects.get(projectId);
    if (!p) throw new EntityNotFoundError("Project", projectId);
    p.addMember(userId, role);
    return p;
  }

  async changeMemberRole(projectId: string, userId: string, role: Exclude<ProjectRole, "OWNER">): Promise<Project> {
    await delay();
    const p = projects.get(projectId);
    if (!p) throw new EntityNotFoundError("Project", projectId);
    p.changeMemberRole(userId, role);
    return p;
  }

  async removeMember(projectId: string, userId: string): Promise<Project> {
    await delay();
    const p = projects.get(projectId);
    if (!p) throw new EntityNotFoundError("Project", projectId);
    p.removeMember(userId);
    return p;
  }
}
