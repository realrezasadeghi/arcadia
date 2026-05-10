import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import { Project } from "@/domain/entities/project.entity";
import { httpClient } from "../http/http-client";

/** Raw shape که از API می‌آید */
interface ProjectRaw {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: Array<{ userId: string; role: "OWNER" | "EDITOR" | "VIEWER"; joinedAt: string }>;
  createdAt: string;
  updatedAt: string;
}

function toEntity(raw: ProjectRaw): Project {
  return Project.reconstitute(raw);
}

export class ProjectRepository implements IProjectRepository {
  private readonly base = "/projects";

  async findAll(): Promise<Project[]> {
    const raws = await httpClient.get<ProjectRaw[]>(this.base, {
      tags: ["projects"],
    });
    return raws.map(toEntity);
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const raw = await httpClient.get<ProjectRaw>(`${this.base}/${id}`, {
        tags: [`project-${id}`],
      });
      return toEntity(raw);
    } catch {
      return null;
    }
  }

  async create(input: { name: string; description: string }): Promise<Project> {
    const raw = await httpClient.post<ProjectRaw>(this.base, input);
    return toEntity(raw);
  }

  async update(id: string, input: { name?: string; description?: string }): Promise<Project> {
    const raw = await httpClient.patch<ProjectRaw>(`${this.base}/${id}`, input);
    return toEntity(raw);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.base}/${id}`);
  }
}

export const projectRepository = new ProjectRepository();
