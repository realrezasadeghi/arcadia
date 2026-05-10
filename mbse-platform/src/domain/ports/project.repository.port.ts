import type { Project } from "../entities/project.entity";

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(input: { name: string; description: string }): Promise<Project>;
  update(id: string, input: { name?: string; description?: string }): Promise<Project>;
  delete(id: string): Promise<void>;
}
