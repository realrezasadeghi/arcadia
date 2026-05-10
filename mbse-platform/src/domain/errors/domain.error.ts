/**
 * DomainError — خطاهای business logic
 * از Error معمولی جدا است تا در لایه‌های بالاتر قابل تشخیص باشد.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class ConnectionNotAllowedError extends DomainError {
  constructor(reason: string) {
    super(`اتصال مجاز نیست: ${reason}`);
    this.name = "ConnectionNotAllowedError";
    Object.setPrototypeOf(this, ConnectionNotAllowedError.prototype);
  }
}

export class TraceLinkNotAllowedError extends DomainError {
  constructor(reason: string) {
    super(`پیوند ردیابی مجاز نیست: ${reason}`);
    this.name = "TraceLinkNotAllowedError";
    Object.setPrototypeOf(this, TraceLinkNotAllowedError.prototype);
  }
}

export class InvalidValueError extends DomainError {
  constructor(field: string, value: unknown) {
    super(`مقدار نامعتبر برای "${field}": ${String(value)}`);
    this.name = "InvalidValueError";
    Object.setPrototypeOf(this, InvalidValueError.prototype);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} با شناسه "${id}" یافت نشد`);
    this.name = "EntityNotFoundError";
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
