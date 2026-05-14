import { ValueObject } from "../shared/value-object.base";
import { InvalidValueError } from "../errors/domain.error";

export type RelationshipTypeValue =
  | "OperationalExchange" | "InvolvementLink"
  | "FunctionalExchange"  | "SystemExchange"
  | "LogicalExchange"     | "ComponentExchange"
  | "ProvidedInterface"   | "RequiredInterface"
  | "PhysicalExchange"    | "PhysicalLink" | "DeploymentLink";

export type TraceLinkTypeValue =
  | "Realization" | "Allocation" | "Deployment" | "Involvement" | "Refinement";

interface RelMeta { label: string; labelFa: string; }

const RELATIONSHIP_META: Record<RelationshipTypeValue, RelMeta> = {
  OperationalExchange: { label: "Operational Exchange", labelFa: "تبادل عملیاتی" },
  InvolvementLink:     { label: "Involvement Link",     labelFa: "پیوند مشارکت" },
  FunctionalExchange:  { label: "Functional Exchange",  labelFa: "تبادل تابعی" },
  SystemExchange:      { label: "System Exchange",      labelFa: "تبادل سیستمی" },
  LogicalExchange:     { label: "Logical Exchange",     labelFa: "تبادل منطقی" },
  ComponentExchange:   { label: "Component Exchange",   labelFa: "تبادل مؤلفه" },
  ProvidedInterface:   { label: "Provided Interface",   labelFa: "رابط ارائه‌شده" },
  RequiredInterface:   { label: "Required Interface",   labelFa: "رابط مورد نیاز" },
  PhysicalExchange:    { label: "Physical Exchange",    labelFa: "تبادل فیزیکی" },
  PhysicalLink:        { label: "Physical Link",        labelFa: "پیوند فیزیکی" },
  DeploymentLink:      { label: "Deployment Link",      labelFa: "پیوند استقرار" },
};

const TRACE_META: Record<TraceLinkTypeValue, RelMeta> = {
  Realization: { label: "Realization", labelFa: "تحقق" },
  Allocation:  { label: "Allocation",  labelFa: "تخصیص" },
  Deployment:  { label: "Deployment",  labelFa: "استقرار" },
  Involvement: { label: "Involvement", labelFa: "مشارکت" },
  Refinement:  { label: "Refinement",  labelFa: "اصلاح" },
};

const ALL_RELATIONSHIP_VALUES = Object.keys(RELATIONSHIP_META) as RelationshipTypeValue[];
const ALL_TRACE_VALUES = Object.keys(TRACE_META) as TraceLinkTypeValue[];

interface RelationshipTypeProps { value: RelationshipTypeValue; }

/**
 * RelationshipType — Value Object
 *
 * نوع یک ارتباط بین المنت‌ها در لایه‌های Arcadia.
 * اطلاعات بصری (رنگ خط، نوع فلش) در presentation/config/visual.config.ts هستند.
 */
export class RelationshipType extends ValueObject<RelationshipTypeProps> {
  protected validate(props: RelationshipTypeProps): void {
    if (!ALL_RELATIONSHIP_VALUES.includes(props.value))
      throw new InvalidValueError("RelationshipType", props.value);
  }

  static from(value: string): RelationshipType {
    if (!ALL_RELATIONSHIP_VALUES.includes(value as RelationshipTypeValue))
      throw new InvalidValueError("RelationshipType", value);
    return new RelationshipType({ value: value as RelationshipTypeValue });
  }

  static all(): RelationshipType[] {
    return ALL_RELATIONSHIP_VALUES.map((v) => new RelationshipType({ value: v }));
  }

  get value(): RelationshipTypeValue { return this.props.value; }
  get label(): string   { return RELATIONSHIP_META[this.props.value].label; }
  get labelFa(): string { return RELATIONSHIP_META[this.props.value].labelFa; }

  toString(): string { return this.props.value; }
}

interface TraceLinkTypeProps { value: TraceLinkTypeValue; }

/**
 * TraceLinkType — Value Object
 *
 * نوع یک ارتباط Trace بین لایه‌های مختلف Arcadia.
 * اطلاعات بصری در presentation/config/visual.config.ts هستند.
 */
export class TraceLinkType extends ValueObject<TraceLinkTypeProps> {
  static readonly Realization = new TraceLinkType({ value: "Realization" });
  static readonly Allocation  = new TraceLinkType({ value: "Allocation" });
  static readonly Deployment  = new TraceLinkType({ value: "Deployment" });
  static readonly Involvement = new TraceLinkType({ value: "Involvement" });
  static readonly Refinement  = new TraceLinkType({ value: "Refinement" });

  protected validate(props: TraceLinkTypeProps): void {
    if (!ALL_TRACE_VALUES.includes(props.value))
      throw new InvalidValueError("TraceLinkType", props.value);
  }

  static from(value: string): TraceLinkType {
    if (!ALL_TRACE_VALUES.includes(value as TraceLinkTypeValue))
      throw new InvalidValueError("TraceLinkType", value);
    return new TraceLinkType({ value: value as TraceLinkTypeValue });
  }

  get value(): TraceLinkTypeValue { return this.props.value; }
  get label(): string   { return TRACE_META[this.props.value].label; }
  get labelFa(): string { return TRACE_META[this.props.value].labelFa; }

  isCrossLayer(): boolean {
    return this.props.value === "Realization" || this.props.value === "Refinement";
  }

  toString(): string { return this.props.value; }
}
