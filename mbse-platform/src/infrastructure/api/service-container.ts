/**
 * Service Container — Composition Root
 *
 * بر اساس NEXT_PUBLIC_MOCK_API:
 *   "true"  → Mock repositories (in-memory, بدون backend)
 *   غیر از آن → Real repositories (HTTP calls به backend)
 *
 * برای swap کردن backend کافی است این env را تغییر دهید.
 */

const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_API === "true";

// ─── Real Repositories ────────────────────────────────────────────────────────
import { projectRepository }   from "../repositories/project.repository";
import { modelRepository }     from "../repositories/model.repository";
import { diagramRepository }   from "../repositories/diagram.repository";
import { traceLinkRepository } from "../repositories/trace-link.repository";
import { authRepository }      from "../repositories/auth.repository";

// ─── Mock Repositories ───────────────────────────────────────────────────────
import { MockAuthRepository }      from "../mock/mock-auth.repository";
import { MockProjectRepository }   from "../mock/mock-project.repository";
import { MockModelRepository }     from "../mock/mock-model.repository";
import { MockDiagramRepository }   from "../mock/mock-diagram.repository";
import { MockTraceLinkRepository } from "../mock/mock-trace-link.repository";

// ─── Use Cases ───────────────────────────────────────────────────────────────
import { GetProjectsUseCase }       from "@/application/use-cases/project/get-projects.use-case";
import { CreateProjectUseCase }     from "@/application/use-cases/project/create-project.use-case";
import { UpdateProjectUseCase }     from "@/application/use-cases/project/update-project.use-case";
import { DeleteProjectUseCase }     from "@/application/use-cases/project/delete-project.use-case";
import { CreateElementUseCase }     from "@/application/use-cases/model/create-element.use-case";
import { ConnectElementsUseCase }   from "@/application/use-cases/model/connect-elements.use-case";
import { CreateDiagramUseCase }     from "@/application/use-cases/diagram/create-diagram.use-case";
import { CreateTraceLinkUseCase }   from "@/application/use-cases/traceability/create-trace-link.use-case";

const repos = USE_MOCK
  ? {
      project:   new MockProjectRepository(),
      model:     new MockModelRepository(),
      diagram:   new MockDiagramRepository(),
      traceLink: new MockTraceLinkRepository(),
      auth:      new MockAuthRepository(),
    }
  : {
      project:   projectRepository,
      model:     modelRepository,
      diagram:   diagramRepository,
      traceLink: traceLinkRepository,
      auth:      authRepository,
    };

export const container = {
  getProjects:    new GetProjectsUseCase(repos.project),
  createProject:  new CreateProjectUseCase(repos.project),
  updateProject:  new UpdateProjectUseCase(repos.project),
  deleteProject:  new DeleteProjectUseCase(repos.project),
  createElement:  new CreateElementUseCase(repos.model),
  connectElements: new ConnectElementsUseCase(repos.model),
  createDiagram:  new CreateDiagramUseCase(repos.diagram, repos.model),
  createTraceLink: new CreateTraceLinkUseCase(repos.traceLink, repos.model),
  repos,
} as const;
