import { ValueObject } from "../shared/value-object.base";
import { InvalidValueError } from "../errors/domain.error";

type LayerValue = "OA" | "SA" | "LA" | "PA";

interface LayerProps {
  value: LayerValue;
}

interface LayerMeta {
  labelFa: string;
  label: string;
  order: number;
  colorVar: string;
}

const LAYER_META: Record<LayerValue, LayerMeta> = {
  OA: { labelFa: "تحلیل عملیاتی",  label: "Operational Analysis",  order: 1, colorVar: "--layer-oa" },
  SA: { labelFa: "تحلیل سیستم",    label: "System Analysis",       order: 2, colorVar: "--layer-sa" },
  LA: { labelFa: "معماری منطقی",   label: "Logical Architecture",  order: 3, colorVar: "--layer-la" },
  PA: { labelFa: "معماری فیزیکی",  label: "Physical Architecture", order: 4, colorVar: "--layer-pa" },
};

/**
 * Layer — Value Object
 *
 * نمایانگر یکی از لایه‌های چهارگانه Arcadia.
 * حاوی business behavior برای مقایسه و بررسی ترتیب لایه‌ها.
 */
export class Layer extends ValueObject<LayerProps> {
  /** Singleton instances */
  static readonly OA = new Layer({ value: "OA" });
  static readonly SA = new Layer({ value: "SA" });
  static readonly LA = new Layer({ value: "LA" });
  static readonly PA = new Layer({ value: "PA" });

  private static readonly ALL: Layer[] = [Layer.OA, Layer.SA, Layer.LA, Layer.PA];

  protected validate(props: LayerProps): void {
    if (!["OA", "SA", "LA", "PA"].includes(props.value)) {
      throw new InvalidValueError("Layer", props.value);
    }
  }

  static from(value: string): Layer {
    const found = Layer.ALL.find((l) => l.value === value);
    if (!found) throw new InvalidValueError("Layer", value);
    return found;
  }

  static all(): Layer[] {
    return [...Layer.ALL];
  }

  get value(): LayerValue {
    return this.props.value;
  }

  get order(): number {
    return LAYER_META[this.props.value].order;
  }

  get labelFa(): string {
    return LAYER_META[this.props.value].labelFa;
  }

  get label(): string {
    return LAYER_META[this.props.value].label;
  }

  get colorVar(): string {
    return LAYER_META[this.props.value].colorVar;
  }

  /** آیا این لایه انتزاع بالاتری نسبت به other دارد؟ (OA > SA > LA > PA) */
  isHigherAbstractionThan(other: Layer): boolean {
    return this.order < other.order;
  }

  /** لایه بعدی در زنجیره تحقق */
  nextLayer(): Layer | null {
    return Layer.ALL.find((l) => l.order === this.order + 1) ?? null;
  }

  /** لایه قبلی در زنجیره */
  previousLayer(): Layer | null {
    return Layer.ALL.find((l) => l.order === this.order - 1) ?? null;
  }

  /**
   * آیا candidate می‌تواند این لایه را Realize کند؟
   * قانون Arcadia: فقط لایه مجاور پایین‌تر می‌تواند realize کند.
   */
  canBeRealizedBy(candidate: Layer): boolean {
    return candidate.order === this.order + 1;
  }

  toString(): string {
    return this.props.value;
  }
}
