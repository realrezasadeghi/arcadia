import { BackendStrategy, type IRepositoryBundle } from "./backend.strategy";
import { InMemoryAuthRepository }      from "../in-memory/in-memory-auth.repository";
import { InMemoryProjectRepository }   from "../in-memory/in-memory-project.repository";
import { InMemoryModelRepository }     from "../in-memory/in-memory-model.repository";
import { InMemoryDiagramRepository }   from "../in-memory/in-memory-diagram.repository";
import { InMemoryTraceLinkRepository } from "../in-memory/in-memory-trace-link.repository";

/**
 * InMemoryBackendStrategy
 *
 * همه داده‌ها در حافظه (Map) نگهداری می‌شوند.
 * بدون نیاز به سرور — مناسب برای توسعه، تست و demo.
 */
export class InMemoryBackendStrategy extends BackendStrategy {
  readonly name = "in-memory";

  build(): IRepositoryBundle {
    return {
      auth:      new InMemoryAuthRepository(),
      project:   new InMemoryProjectRepository(),
      model:     new InMemoryModelRepository(),
      diagram:   new InMemoryDiagramRepository(),
      traceLink: new InMemoryTraceLinkRepository(),
    };
  }
}
