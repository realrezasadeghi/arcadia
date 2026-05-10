import { ValueObject } from "../shared/value-object.base";
import { DomainError } from "../errors/domain.error";

interface ProjectNameProps {
  value: string;
}

/**
 * ProjectName — Value Object
 *
 * نام پروژه قوانین کسب‌وکار خود را در خود دارد:
 * - نمی‌تواند خالی باشد
 * - حداکثر ۱۰۰ کاراکتر
 * - حداقل ۳ کاراکتر
 */
export class ProjectName extends ValueObject<ProjectNameProps> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;

  protected validate(props: ProjectNameProps): void {
    const trimmed = props.value.trim();

    if (!trimmed) {
      throw new DomainError("نام پروژه نمی‌تواند خالی باشد");
    }
    if (trimmed.length < ProjectName.MIN_LENGTH) {
      throw new DomainError(
        `نام پروژه باید حداقل ${ProjectName.MIN_LENGTH} کاراکتر باشد`
      );
    }
    if (trimmed.length > ProjectName.MAX_LENGTH) {
      throw new DomainError(
        `نام پروژه نمی‌تواند بیشتر از ${ProjectName.MAX_LENGTH} کاراکتر باشد`
      );
    }
  }

  static create(value: string): ProjectName {
    return new ProjectName({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
