import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "../entities/project.entity";

/**
 * IProjectRepository — Dependency Inversion port.
 * Domain defines the contract; infrastructure implements it.
 */
export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: string, input: UpdateProjectInput): Promise<Project>;
  delete(id: string): Promise<void>;
}
