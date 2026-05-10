import { ValueObject } from "../shared/value-object.base";
import { InvalidValueError } from "../errors/domain.error";

type RelationshipTypeValue =
  | "OperationalExchange" | "InvolvementLink"
  | "FunctionalExchange"  | "SystemExchange"
  | "LogicalExchange"     | "ComponentExchange"
  | "ProvidedInterface"   | "RequiredInterface"
  | "PhysicalExchange"    | "PhysicalLink" | "DeploymentLink";

type TraceLinkTypeValue =
  | "Realization" | "Allocation" | "Deployment" | "Involvement" | "Refinement";

interface VisualSpec {
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: string;
  arrowEnd: "arrow" | "open-arrow" | "diamond" | "none";
  labelFa: string;
  label: string;
  animated?: boolean;
}

const RELATIONSHIP_VISUAL: Record<RelationshipTypeValue, VisualSpec> = {
  OperationalExchange: { strokeColor: "#2E86C1", strokeWidth: 1.5, arrowEnd: "arrow",      label: "Operational Exchange", labelFa: "تبادل عملیاتی" },
  InvolvementLink:     { strokeColor: "#717D7E", strokeWidth: 1,   arrowEnd: "open-arrow", label: "Involvement Link",     labelFa: "پیوند مشارکت",  strokeDash: "5,3" },
  FunctionalExchange:  { strokeColor: "#CA6F1E", strokeWidth: 1.5, arrowEnd: "arrow",      label: "Functional Exchange",  labelFa: "تبادل تابعی" },
  SystemExchange:      { strokeColor: "#1A5276", strokeWidth: 2,   arrowEnd: "arrow",      label: "System Exchange",      labelFa: "تبادل سیستمی" },
  LogicalExchange:     { strokeColor: "#1E8449", strokeWidth: 1.5, arrowEnd: "arrow",      label: "Logical Exchange",     labelFa: "تبادل منطقی" },
  ComponentExchange:   { strokeColor: "#1D8348", strokeWidth: 2,   arrowEnd: "arrow",      label: "Component Exchange",   labelFa: "تبادل مؤلفه" },
  ProvidedInterface:   { strokeColor: "#1E8449", strokeWidth: 1.5, arrowEnd: "diamond",    label: "Provided Interface",   labelFa: "رابط ارائه‌شده" },
  RequiredInterface:   { strokeColor: "#922B21", strokeWidth: 1.5, arrowEnd: "open-arrow", label: "Required Interface",   labelFa: "رابط مورد نیاز", strokeDash: "4,2" },
  PhysicalExchange:    { strokeColor: "#6C3483", strokeWidth: 1.5, arrowEnd: "arrow",      label: "Physical Exchange",    labelFa: "تبادل فیزیکی" },
  PhysicalLink:        { strokeColor: "#2C3E50", strokeWidth: 2.5, arrowEnd: "none",       label: "Physical Link",        labelFa: "پیوند فیزیکی" },
  DeploymentLink:      { strokeColor: "#7F8C8D", strokeWidth: 1,   arrowEnd: "open-arrow", label: "Deployment Link",      labelFa: "پیوند استقرار",  strokeDash: "6,3" },
};

const TRACE_VISUAL: Record<TraceLinkTypeValue, VisualSpec> = {
  Realization: { strokeColor: "#8E44AD", strokeWidth: 1, arrowEnd: "open-arrow", label: "Realization", labelFa: "تحقق",    strokeDash: "4,2" },
  Allocation:  { strokeColor: "#E67E22", strokeWidth: 1, arrowEnd: "open-arrow", label: "Allocation",  labelFa: "تخصیص",   strokeDash: "4,2" },
  Deployment:  { strokeColor: "#2C3E50", strokeWidth: 1, arrowEnd: "open-arrow", label: "Deployment",  labelFa: "استقرار", strokeDash: "6,2" },
  Involvement: { strokeColor: "#717D7E", strokeWidth: 1, arrowEnd: "open-arrow", label: "Involvement", labelFa: "مشارکت",  strokeDash: "3,3" },
  Refinement:  { strokeColor: "#1A5276", strokeWidth: 1, arrowEnd: "open-arrow", label: "Refinement",  labelFa: "اصلاح",   strokeDash: "5,3" },
};

const ALL_RELATIONSHIP_VALUES = Object.keys(RELATIONSHIP_VISUAL) as RelationshipTypeValue[];
const ALL_TRACE_VALUES = Object.keys(TRACE_VISUAL) as TraceLinkTypeValue[];

interface RelationshipTypeProps { value: RelationshipTypeValue; }

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
  get visualSpec(): VisualSpec { return RELATIONSHIP_VISUAL[this.props.value]; }
  get labelFa(): string { return RELATIONSHIP_VISUAL[this.props.value].labelFa; }
  toString(): string { return this.props.value; }
}

interface TraceLinkTypeProps { value: TraceLinkTypeValue; }

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
  get visualSpec(): VisualSpec { return TRACE_VISUAL[this.props.value]; }
  get labelFa(): string { return TRACE_VISUAL[this.props.value].labelFa; }
  isCrossLayer(): boolean {
    return this.props.value === "Realization" || this.props.value === "Refinement";
  }
  toString(): string { return this.props.value; }
}
