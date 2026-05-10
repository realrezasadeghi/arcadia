import { Entity } from "./entity.base";
import type { DomainEvent } from "./domain-event.base";

/**
 * AggregateRoot Base Class — DDD
 *
 * - ریشه Aggregate — تنها نقطه ورود برای تغییر state
 * - مسئول حفظ invariants کل Aggregate
 * - رویدادهای Domain را جمع‌آوری می‌کند
 */
export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private readonly _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /** رویدادها را برگردان و صف را پاک کن */
  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return this._domainEvents;
  }
}
