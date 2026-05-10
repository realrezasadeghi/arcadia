/**
 * Service Container — Dependency Injection
 * Wires use cases with their repository implementations.
 * Follows Dependency Inversion Principle.
 */
import { projectRepository } from "../repositories/project.repository";
import { modelRepository } from "../repositories/model.repository";
import { authRepository } from "../repositories/auth.repository";

import { GetProjectsUseCase } from "@/application/use-cases/project/get-projects.use-case";
import { CreateProjectUseCase } from "@/application/use-cases/project/create-project.use-case";
import { UpdateProjectUseCase } from "@/application/use-cases/project/update-project.use-case";
import { DeleteProjectUseCase } from "@/application/use-cases/project/delete-project.use-case";
import { ConnectElementsUseCase } from "@/application/use-cases/model/connect-elements.use-case";
import { CreateTraceLinkUseCase } from "@/application/use-cases/traceability/create-trace-link.use-case";

export const container = {
  // Project use cases
  getProjects: new GetProjectsUseCase(projectRepository),
  createProject: new CreateProjectUseCase(projectRepository),
  updateProject: new UpdateProjectUseCase(projectRepository),
  deleteProject: new DeleteProjectUseCase(projectRepository),

  // Model use cases
  connectElements: new ConnectElementsUseCase(modelRepository),
  createTraceLink: new CreateTraceLinkUseCase(),

  // Repositories (direct access for React Query hooks)
  projectRepository,
  modelRepository,
  authRepository,
} as const;
