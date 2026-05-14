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

// ─── Auth ──────────────────────────────────────────────────────────────────────
import { LoginUseCase }                          from "@/application/use-cases/auth/login.use-case";
import { RegisterUseCase }                       from "@/application/use-cases/auth/register.use-case";
import { LogoutUseCase }                         from "@/application/use-cases/auth/logout.use-case";
import { GetCurrentUserUseCase }                 from "@/application/use-cases/auth/get-current-user.use-case";
import { RefreshTokenUseCase }                   from "@/application/use-cases/auth/refresh-token.use-case";

// ─── Project ───────────────────────────────────────────────────────────────────
import { GetProjectsUseCase }                    from "@/application/use-cases/project/get-projects.use-case";
import { GetProjectUseCase }                     from "@/application/use-cases/project/get-project.use-case";
import { CreateProjectUseCase }                  from "@/application/use-cases/project/create-project.use-case";
import { UpdateProjectUseCase }                  from "@/application/use-cases/project/update-project.use-case";
import { DeleteProjectUseCase }                  from "@/application/use-cases/project/delete-project.use-case";
import { AddMemberUseCase }                      from "@/application/use-cases/project/add-member.use-case";
import { ChangeMemberRoleUseCase }               from "@/application/use-cases/project/change-member-role.use-case";
import { RemoveMemberUseCase }                   from "@/application/use-cases/project/remove-member.use-case";

// ─── Model ─────────────────────────────────────────────────────────────────────
import { GetModelsByProjectUseCase }             from "@/application/use-cases/model/get-models-by-project.use-case";
import { GetModelUseCase }                       from "@/application/use-cases/model/get-model.use-case";
import { CreateModelUseCase }                    from "@/application/use-cases/model/create-model.use-case";
import { UpdateModelUseCase }                    from "@/application/use-cases/model/update-model.use-case";
import { DeleteModelUseCase }                    from "@/application/use-cases/model/delete-model.use-case";
import { GetElementsByModelUseCase }             from "@/application/use-cases/model/get-elements-by-model.use-case";
import { GetElementUseCase }                     from "@/application/use-cases/model/get-element.use-case";
import { CreateElementUseCase }                  from "@/application/use-cases/model/create-element.use-case";
import { UpdateElementUseCase }                  from "@/application/use-cases/model/update-element.use-case";
import { DeleteElementUseCase }                  from "@/application/use-cases/model/delete-element.use-case";
import { GetRelationshipsByModelUseCase }        from "@/application/use-cases/model/get-relationships-by-model.use-case";
import { ConnectElementsUseCase }                from "@/application/use-cases/model/connect-elements.use-case";
import { UpdateRelationshipUseCase }             from "@/application/use-cases/model/update-relationship.use-case";
import { DeleteRelationshipUseCase }             from "@/application/use-cases/model/delete-relationship.use-case";

// ─── Diagram ───────────────────────────────────────────────────────────────────
import { GetDiagramsByModelUseCase }             from "@/application/use-cases/diagram/get-diagrams-by-model.use-case";
import { GetDiagramUseCase }                     from "@/application/use-cases/diagram/get-diagram.use-case";
import { CreateDiagramUseCase }                  from "@/application/use-cases/diagram/create-diagram.use-case";
import { UpdateDiagramUseCase }                  from "@/application/use-cases/diagram/update-diagram.use-case";
import { UpdateDiagramLayoutUseCase }            from "@/application/use-cases/diagram/update-diagram-layout.use-case";
import { DeleteDiagramUseCase }                  from "@/application/use-cases/diagram/delete-diagram.use-case";

// ─── Traceability ──────────────────────────────────────────────────────────────
import { GetTraceLinksByProjectUseCase }         from "@/application/use-cases/traceability/get-trace-links-by-project.use-case";
import { GetTraceLinksByElementUseCase }         from "@/application/use-cases/traceability/get-trace-links-by-element.use-case";
import { CreateTraceLinkUseCase }                from "@/application/use-cases/traceability/create-trace-link.use-case";
import { UpdateTraceLinkDescriptionUseCase }     from "@/application/use-cases/traceability/update-trace-link-description.use-case";
import { DeleteTraceLinkUseCase }                from "@/application/use-cases/traceability/delete-trace-link.use-case";

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
  // ─── Auth ──────────────────────────────────────────────────────────────────
  login:           new LoginUseCase(repos.auth),
  register:        new RegisterUseCase(repos.auth),
  logout:          new LogoutUseCase(repos.auth),
  getCurrentUser:  new GetCurrentUserUseCase(repos.auth),
  refreshToken:    new RefreshTokenUseCase(repos.auth),

  // ─── Project ───────────────────────────────────────────────────────────────
  getProjects:      new GetProjectsUseCase(repos.project),
  getProject:       new GetProjectUseCase(repos.project),
  createProject:    new CreateProjectUseCase(repos.project),
  updateProject:    new UpdateProjectUseCase(repos.project),
  deleteProject:    new DeleteProjectUseCase(repos.project),
  addMember:        new AddMemberUseCase(repos.project),
  changeMemberRole: new ChangeMemberRoleUseCase(repos.project),
  removeMember:     new RemoveMemberUseCase(repos.project),

  // ─── Model ─────────────────────────────────────────────────────────────────
  getModelsByProject:      new GetModelsByProjectUseCase(repos.model),
  getModel:                new GetModelUseCase(repos.model),
  createModel:             new CreateModelUseCase(repos.model),
  updateModel:             new UpdateModelUseCase(repos.model),
  deleteModel:             new DeleteModelUseCase(repos.model),
  getElementsByModel:      new GetElementsByModelUseCase(repos.model),
  getElement:              new GetElementUseCase(repos.model),
  createElement:           new CreateElementUseCase(repos.model),
  updateElement:           new UpdateElementUseCase(repos.model),
  deleteElement:           new DeleteElementUseCase(repos.model),
  getRelationshipsByModel: new GetRelationshipsByModelUseCase(repos.model),
  connectElements:         new ConnectElementsUseCase(repos.model),
  updateRelationship:      new UpdateRelationshipUseCase(repos.model),
  deleteRelationship:      new DeleteRelationshipUseCase(repos.model),

  // ─── Diagram ───────────────────────────────────────────────────────────────
  getDiagramsByModel:  new GetDiagramsByModelUseCase(repos.diagram, repos.model),
  getDiagram:          new GetDiagramUseCase(repos.diagram),
  createDiagram:       new CreateDiagramUseCase(repos.diagram, repos.model),
  updateDiagram:       new UpdateDiagramUseCase(repos.diagram),
  updateDiagramLayout: new UpdateDiagramLayoutUseCase(repos.diagram),
  deleteDiagram:       new DeleteDiagramUseCase(repos.diagram),

  // ─── Traceability ──────────────────────────────────────────────────────────
  getTraceLinksByProject:      new GetTraceLinksByProjectUseCase(repos.traceLink),
  getTraceLinksByElement:      new GetTraceLinksByElementUseCase(repos.traceLink),
  createTraceLink:             new CreateTraceLinkUseCase(repos.traceLink, repos.model),
  updateTraceLinkDescription:  new UpdateTraceLinkDescriptionUseCase(repos.traceLink),
  deleteTraceLink:             new DeleteTraceLinkUseCase(repos.traceLink),

  // ─── Raw repositories (فقط برای query های ساده بدون business logic) ────────
  repos,
} as const;

/** خواندن مستقیم strategy برای debug */
export { strategy as activeStrategy };
