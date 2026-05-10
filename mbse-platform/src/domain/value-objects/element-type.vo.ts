import { ValueObject } from "../shared/value-object.base";
import { InvalidValueError } from "../errors/domain.error";
import { Layer } from "./layer.vo";

// ─── Raw string types (برای type-safety در سراسر کد) ──────────────────────
type OAElementValue =
  | "OperationalEntity"
  | "OperationalActor"
  | "OperationalActivity"
  | "OperationalCapability"
  | "OperationalProcess";

type SAElementValue =
  | "System"
  | "SystemActor"
  | "SystemFunction"
  | "SystemCapability"
  | "SystemComponent";

type LAElementValue =
  | "LogicalComponent"
  | "LogicalActor"
  | "LogicalFunction";

type PAElementValue =
  | "PhysicalComponent"
  | "PhysicalNode"
  | "PhysicalFunction"
  | "PhysicalActor";

export type ElementTypeValue =
  | OAElementValue
  | SAElementValue
  | LAElementValue
  | PAElementValue;

// ─── Visual Spec (data, not behavior — فقط مشخصات بصری Capella) ──────────
interface VisualSpec {
  shape: "rectangle" | "rounded-rectangle" | "ellipse";
  fillColor: string;
  fillColorDark: string;
  strokeColor: string;
  labelFa: string;
  label: string;
}

const VISUAL_SPEC: Record<ElementTypeValue, VisualSpec> = {
  OperationalEntity:    { shape: "rounded-rectangle", fillColor: "#AED6F1", fillColorDark: "#1a3a52", strokeColor: "#2E86C1", label: "Operational Entity",    labelFa: "موجودیت عملیاتی" },
  OperationalActor:     { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E", label: "Operational Actor",     labelFa: "بازیگر عملیاتی" },
  OperationalActivity:  { shape: "rectangle",         fillColor: "#F9E79F", fillColorDark: "#3d3200", strokeColor: "#D4AC0D", label: "Operational Activity",  labelFa: "فعالیت عملیاتی" },
  OperationalCapability:{ shape: "ellipse",           fillColor: "#A9DFBF", fillColorDark: "#1a3d2b", strokeColor: "#1E8449", label: "Operational Capability",labelFa: "قابلیت عملیاتی" },
  OperationalProcess:   { shape: "rounded-rectangle", fillColor: "#D7BDE2", fillColorDark: "#2d1a3d", strokeColor: "#7D3C98", label: "Operational Process",   labelFa: "فرایند عملیاتی" },
  System:               { shape: "rounded-rectangle", fillColor: "#AED6F1", fillColorDark: "#1a3a52", strokeColor: "#1A5276", label: "System",                labelFa: "سیستم" },
  SystemActor:          { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E", label: "System Actor",          labelFa: "بازیگر سیستم" },
  SystemFunction:       { shape: "rectangle",         fillColor: "#FAD7A0", fillColorDark: "#3d2800", strokeColor: "#CA6F1E", label: "System Function",       labelFa: "تابع سیستم" },
  SystemCapability:     { shape: "ellipse",           fillColor: "#A9DFBF", fillColorDark: "#1a3d2b", strokeColor: "#1D8348", label: "System Capability",     labelFa: "قابلیت سیستم" },
  SystemComponent:      { shape: "rounded-rectangle", fillColor: "#85C1E9", fillColorDark: "#0d2d47", strokeColor: "#1A5276", label: "System Component",      labelFa: "مؤلفه سیستم" },
  LogicalComponent:     { shape: "rounded-rectangle", fillColor: "#A9DFBF", fillColorDark: "#1a3d2b", strokeColor: "#1E8449", label: "Logical Component",     labelFa: "مؤلفه منطقی" },
  LogicalActor:         { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E", label: "Logical Actor",         labelFa: "بازیگر منطقی" },
  LogicalFunction:      { shape: "rectangle",         fillColor: "#F9E79F", fillColorDark: "#3d3200", strokeColor: "#D4AC0D", label: "Logical Function",      labelFa: "تابع منطقی" },
  PhysicalComponent:    { shape: "rectangle",         fillColor: "#D2B4DE", fillColorDark: "#2d1a3d", strokeColor: "#6C3483", label: "Physical Component",    labelFa: "مؤلفه فیزیکی" },
  PhysicalNode:         { shape: "rectangle",         fillColor: "#AEB6BF", fillColorDark: "#1a1f24", strokeColor: "#2C3E50", label: "Physical Node",         labelFa: "گره فیزیکی" },
  PhysicalFunction:     { shape: "rectangle",         fillColor: "#FAD7A0", fillColorDark: "#3d2800", strokeColor: "#CA6F1E", label: "Physical Function",     labelFa: "تابع فیزیکی" },
  PhysicalActor:        { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E", label: "Physical Actor",        labelFa: "بازیگر فیزیکی" },
};

const LAYER_MAP: Record<ElementTypeValue, Layer> = {
  OperationalEntity: Layer.OA, OperationalActor: Layer.OA,
  OperationalActivity: Layer.OA, OperationalCapability: Layer.OA, OperationalProcess: Layer.OA,
  System: Layer.SA, SystemActor: Layer.SA, SystemFunction: Layer.SA,
  SystemCapability: Layer.SA, SystemComponent: Layer.SA,
  LogicalComponent: Layer.LA, LogicalActor: Layer.LA, LogicalFunction: Layer.LA,
  PhysicalComponent: Layer.PA, PhysicalNode: Layer.PA,
  PhysicalFunction: Layer.PA, PhysicalActor: Layer.PA,
};

const ALL_VALUES = Object.keys(VISUAL_SPEC) as ElementTypeValue[];

interface ElementTypeProps {
  value: ElementTypeValue;
}

/**
 * ElementType — Value Object
 *
 * نمایانگر نوع یک المنت در مدل Arcadia.
 * دانش layer، visual spec و رفتارهای مقایسه را در خود دارد.
 */
export class ElementType extends ValueObject<ElementTypeProps> {
  protected validate(props: ElementTypeProps): void {
    if (!ALL_VALUES.includes(props.value)) {
      throw new InvalidValueError("ElementType", props.value);
    }
  }

  static from(value: string): ElementType {
    if (!ALL_VALUES.includes(value as ElementTypeValue)) {
      throw new InvalidValueError("ElementType", value);
    }
    return new ElementType({ value: value as ElementTypeValue });
  }

  static allForLayer(layer: Layer): ElementType[] {
    return ALL_VALUES
      .filter((v) => LAYER_MAP[v].equals(layer))
      .map((v) => new ElementType({ value: v }));
  }

  get value(): ElementTypeValue {
    return this.props.value;
  }

  get layer(): Layer {
    return LAYER_MAP[this.props.value];
  }

  get visualSpec(): VisualSpec {
    return VISUAL_SPEC[this.props.value];
  }

  get labelFa(): string {
    return VISUAL_SPEC[this.props.value].labelFa;
  }

  get label(): string {
    return VISUAL_SPEC[this.props.value].label;
  }

  /** آیا این نوع یک Component است؟ */
  isComponent(): boolean {
    return this.props.value.endsWith("Component");
  }

  /** آیا این نوع یک Function است؟ */
  isFunction(): boolean {
    return this.props.value.endsWith("Function") || this.props.value.endsWith("Activity");
  }

  /** آیا این نوع یک Actor/Entity است؟ */
  isActor(): boolean {
    return this.props.value.endsWith("Actor") || this.props.value.endsWith("Entity");
  }

  /** آیا این نوع یک Capability است؟ */
  isCapability(): boolean {
    return this.props.value.endsWith("Capability");
  }

  toString(): string {
    return this.props.value;
  }
}
