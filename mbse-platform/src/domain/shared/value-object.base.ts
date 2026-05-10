/**
 * ValueObject Base Class — DDD
 *
 * - بدون هویت (شناسه ندارد)
 * - Immutable (تغییرناپذیر)
 * - برابری بر اساس مقدار
 * - حاوی business behavior
 */
export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected readonly props: Readonly<TProps>;

  protected constructor(props: TProps) {
    this.validate(props);
    this.props = Object.freeze({ ...props });
  }

  /** اعتبارسنجی مقادیر — هر VO باید این را override کند */
  protected abstract validate(props: TProps): void;

  /** برابری بر اساس مقدار، نه رفرنس */
  equals(other: ValueObject<TProps>): boolean {
    if (!(other instanceof this.constructor)) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  toString(): string {
    return JSON.stringify(this.props);
  }
}
