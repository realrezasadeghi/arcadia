/**
 * BackendStrategy — Strategy Pattern
 *
 * هر backend (واقعی یا in-memory) باید این abstract class را پیاده‌سازی کند.
 * Service Container فقط از این interface می‌داند — نه از پیاده‌سازی مشخص.
 *
 * سوییچ کردن backend = تعویض یک Strategy object.
 * بدون لمس کردن Use Cases یا Domain.
 */

import type { IProjectRepository }   from "@/domain/ports/project.repository.port";
import type { IModelRepository }     from "@/domain/ports/model.repository.port";
import type { IDiagramRepository }   from "@/domain/ports/diagram.repository.port";
import type { ITraceLinkRepository } from "@/domain/ports/trace-link.repository.port";
import type { IAuthRepository }      from "@/domain/ports/auth.repository.port";

/** مجموعه همه repositoryهایی که یک backend باید ارائه دهد */
export interface IRepositoryBundle {
  project:   IProjectRepository;
  model:     IModelRepository;
  diagram:   IDiagramRepository;
  traceLink: ITraceLinkRepository;
  auth:      IAuthRepository;
}

export abstract class BackendStrategy {
  /** نام backend — برای debug و logging */
  abstract readonly name: string;

  /** ساخت و بازگرداندن تمام repositoryها */
  abstract build(): IRepositoryBundle;
}
