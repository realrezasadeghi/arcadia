import type { IProjectRepository } from "@/domain/ports/project.repository.port";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/domain/entities/project.entity";
import { httpClient } from "../http/http-client";

export class ProjectRepository implements IProjectRepository {
  private readonly basePath = "/projects";

  async findAll(): Promise<Project[]> {
    return httpClient.get<Project[]>(this.basePath);
  }

  async findById(id: string): Promise<Project | null> {
    return httpClient.get<Project>(`${this.basePath}/${id}`);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    return httpClient.post<Project>(this.basePath, input);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    return httpClient.patch<Project>(`${this.basePath}/${id}`, input);
  }

  async delete(id: string): Promise<void> {
    return httpClient.delete(`${this.basePath}/${id}`);
  }
}

export const projectRepository = new ProjectRepository();
