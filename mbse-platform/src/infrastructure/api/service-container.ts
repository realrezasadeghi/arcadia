/**
 * Service Container — Dependency Injection
 *
 * Use Cases از repository‌ها استفاده می‌کنند، نه از httpClient مستقیم.
 * تزریق وابستگی از اینجا انجام می‌شود (Composition Root).
 */
import { projectRepository } from "../repositories/project.repository";
import { modelRepository } from "../repositories/model.repository";
import { diagramRepository } from "../repositories/diagram.repository";
import { traceLinkRepository } from "../repositories/trace-link.repository";
import { authRepository } from "../repositories/auth.repository";

import { GetProjectsUseCase } from "@/application/use-cases/project/get-projects.use-case";
import { CreateProjectUseCase } from "@/application/use-cases/project/create-project.use-case";
import { UpdateProjectUseCase } from "@/application/use-cases/project/update-project.use-case";
import { DeleteProjectUseCase } from "@/application/use-cases/project/delete-project.use-case";
import { CreateElementUseCase } from "@/application/use-cases/model/create-element.use-case";
import { ConnectElementsUseCase } from "@/application/use-cases/model/connect-elements.use-case";
import { CreateDiagramUseCase } from "@/application/use-cases/diagram/create-diagram.use-case";
import { CreateTraceLinkUseCase } from "@/application/use-cases/traceability/create-trace-link.use-case";

export const container = {
  // ─── Project ───────────────────────────────────────────────────────────────
  getProjects:   new GetProjectsUseCase(projectRepository),
  createProject: new CreateProjectUseCase(projectRepository),
  updateProject: new UpdateProjectUseCase(projectRepository),
  deleteProject: new DeleteProjectUseCase(projectRepository),

  // ─── Model ─────────────────────────────────────────────────────────────────
  createElement:   new CreateElementUseCase(modelRepository),
  connectElements: new ConnectElementsUseCase(modelRepository),

  // ─── Diagram ───────────────────────────────────────────────────────────────
  createDiagram: new CreateDiagramUseCase(diagramRepository, modelRepository),

  // ─── Traceability ──────────────────────────────────────────────────────────
  createTraceLink: new CreateTraceLinkUseCase(traceLinkRepository, modelRepository),

  // ─── Raw repositories (برای React Query hooks) ────────────────────────────
  repos: {
    project:   projectRepository,
    model:     modelRepository,
    diagram:   diagramRepository,
    traceLink: traceLinkRepository,
    auth:      authRepository,
  },
} as const;
