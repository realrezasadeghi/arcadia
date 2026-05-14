/**
 * Service Container — Composition Root
 *
 * از Strategy Pattern استفاده می‌کند:
 *   NEXT_PUBLIC_MOCK_API=true  → InMemoryBackendStrategy (بدون سرور)
 *   NEXT_PUBLIC_MOCK_API=false → RealBackendStrategy (HTTP calls)
 *
 * برای افزودن backend جدید (مثلاً IndexedDB یا GraphQL):
 *   1. کلاسی بساز که BackendStrategy را extend کند
 *   2. همین فایل را آپدیت کن
 *   بدون تغییر در Use Cases یا Domain.
 */

import type { BackendStrategy } from "../strategies/backend.strategy";
import { InMemoryBackendStrategy } from "../strategies/in-memory-backend.strategy";
import { RealBackendStrategy }     from "../strategies/real-backend.strategy";

import { GetProjectsUseCase }     from "@/application/use-cases/project/get-projects.use-case";
import { CreateProjectUseCase }   from "@/application/use-cases/project/create-project.use-case";
import { UpdateProjectUseCase }   from "@/application/use-cases/project/update-project.use-case";
import { DeleteProjectUseCase }   from "@/application/use-cases/project/delete-project.use-case";
import { CreateModelUseCase }     from "@/application/use-cases/model/create-model.use-case";
import { CreateElementUseCase }   from "@/application/use-cases/model/create-element.use-case";
import { ConnectElementsUseCase } from "@/application/use-cases/model/connect-elements.use-case";
import { CreateDiagramUseCase }   from "@/application/use-cases/diagram/create-diagram.use-case";
import { CreateTraceLinkUseCase } from "@/application/use-cases/traceability/create-trace-link.use-case";

function resolveStrategy(): BackendStrategy {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    return new InMemoryBackendStrategy();
  }
  return new RealBackendStrategy();
}

const strategy = resolveStrategy();
const repos = strategy.build();

if (typeof window !== "undefined") {
  console.info(`[Container] Backend strategy: ${strategy.name}`);
}

export const container = {
  // ─── Project ───────────────────────────────────────────────────────────────
  getProjects:    new GetProjectsUseCase(repos.project),
  createProject:  new CreateProjectUseCase(repos.project),
  updateProject:  new UpdateProjectUseCase(repos.project),
  deleteProject:  new DeleteProjectUseCase(repos.project),

  // ─── Model ─────────────────────────────────────────────────────────────────
  createModel:     new CreateModelUseCase(repos.model),
  createElement:   new CreateElementUseCase(repos.model),
  connectElements: new ConnectElementsUseCase(repos.model),

  // ─── Diagram ───────────────────────────────────────────────────────────────
  createDiagram: new CreateDiagramUseCase(repos.diagram, repos.model),

  // ─── Traceability ──────────────────────────────────────────────────────────
  createTraceLink: new CreateTraceLinkUseCase(repos.traceLink, repos.model),

  // ─── Raw repositories (برای React Query hooks) ────────────────────────────
  repos,
} as const;

/** خواندن مستقیم strategy برای debug */
export { strategy as activeStrategy };
