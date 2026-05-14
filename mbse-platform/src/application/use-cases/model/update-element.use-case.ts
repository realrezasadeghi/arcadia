import type { IModelRepository } from "@/domain/ports/model.repository.port";
import type { ModelElement, ElementStatus } from "@/domain/entities/element.entity";
import { EntityNotFoundError, DomainError } from "@/domain/errors/domain.error";

export interface UpdateElementInput {
  elementId: string;
  name?: string;
  description?: string;
  properties?: { status?: ElementStatus; [key: string]: unknown };
}

/**
 * UpdateElementUseCase
 *
 * Business rules:
 * 1. المنت باید وجود داشته باشد
 * 2. نام نمی‌تواند خالی باشد
 * 3. المنت منسوخ‌شده (DEPRECATED) نمی‌تواند به VALIDATED تغییر وضعیت دهد
 */
export class UpdateElementUseCase {
  constructor(private readonly repository: IModelRepository) {}

  async execute(input: UpdateElementInput): Promise<ModelElement> {
    const element = await this.repository.findElementById(input.elementId);
    if (!element) throw new EntityNotFoundError("ModelElement", input.elementId);

    if (input.name !== undefined && !input.name.trim()) {
      throw new DomainError("نام المنت نمی‌تواند خالی باشد");
    }

    if (
      input.properties?.status === "VALIDATED" &&
      element.status === "DEPRECATED"
    ) {
      throw new DomainError("المنت منسوخ‌شده قابل اعتبارسنجی نیست");
    }

    return this.repository.updateElement(input.elementId, {
      name: input.name?.trim(),
      description: input.description,
      properties: input.properties as Record<string, unknown> | undefined,
    });
  }
}
