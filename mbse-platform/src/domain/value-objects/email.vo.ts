import { ValueObject } from "../shared/value-object.base";
import { DomainError } from "../errors/domain.error";

interface EmailProps {
  value: string;
}

/**
 * Email — Value Object
 * فرمت ایمیل را validate می‌کند و case-insensitive مقایسه می‌کند.
 */
export class Email extends ValueObject<EmailProps> {
  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  protected validate(props: EmailProps): void {
    if (!Email.REGEX.test(props.value)) {
      throw new DomainError(`ایمیل "${props.value}" معتبر نیست`);
    }
  }

  static create(value: string): Email {
    return new Email({ value: value.toLowerCase().trim() });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
