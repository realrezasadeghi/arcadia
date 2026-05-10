import { BackendStrategy, type IRepositoryBundle } from "./backend.strategy";
import { projectRepository }   from "../repositories/project.repository";
import { modelRepository }     from "../repositories/model.repository";
import { diagramRepository }   from "../repositories/diagram.repository";
import { traceLinkRepository } from "../repositories/trace-link.repository";
import { authRepository }      from "../repositories/auth.repository";

/**
 * RealBackendStrategy
 *
 * همه داده‌ها از طریق HTTP به backend واقعی ارسال/دریافت می‌شوند.
 * نیاز به NEXT_PUBLIC_API_URL دارد.
 */
export class RealBackendStrategy extends BackendStrategy {
  readonly name = "real-http";

  build(): IRepositoryBundle {
    return {
      auth:      authRepository,
      project:   projectRepository,
      model:     modelRepository,
      diagram:   diagramRepository,
      traceLink: traceLinkRepository,
    };
  }
}
