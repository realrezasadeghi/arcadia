/**
 * All relationship/edge types in Arcadia MBSE
 * Divided into: same-layer relations and cross-layer traces
 */

// ─── Same-Layer Relationship Types ───────────────────────────────────────────
export const RELATIONSHIP_TYPES = [
  // OA
  "OperationalExchange",
  "InvolvementLink",
  // SA
  "FunctionalExchange",
  "SystemExchange",
  // LA
  "LogicalExchange",
  "ComponentExchange",
  "ProvidedInterface",
  "RequiredInterface",
  // PA
  "PhysicalExchange",
  "PhysicalLink",
  "DeploymentLink",
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

// ─── Cross-Layer Trace Link Types ─────────────────────────────────────────────
export const TRACE_LINK_TYPES = [
  "Realization",   // e.g. SA Function realizes OA Activity
  "Allocation",    // e.g. LA Function allocated to LA Component
  "Deployment",    // e.g. PA Component deployed on PA Node
  "Involvement",   // e.g. OA Entity involved in OA Capability
  "Refinement",    // e.g. SA Capability refined in LA
] as const;

export type TraceLinkType = (typeof TRACE_LINK_TYPES)[number];

/**
 * Visual specification per relationship type
 */
export interface RelationshipVisualSpec {
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: string;
  arrowEnd: "arrow" | "open-arrow" | "diamond" | "none";
  labelFa: string;
  label: string;
  animated?: boolean;
}

export const RELATIONSHIP_VISUAL_SPEC: Record<
  RelationshipType,
  RelationshipVisualSpec
> = {
  OperationalExchange: {
    strokeColor: "#2E86C1",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
    label: "Operational Exchange",
    labelFa: "تبادل عملیاتی",
  },
  InvolvementLink: {
    strokeColor: "#717D7E",
    strokeWidth: 1,
    strokeDash: "5,3",
    arrowEnd: "open-arrow",
    label: "Involvement Link",
    labelFa: "پیوند مشارکت",
  },
  FunctionalExchange: {
    strokeColor: "#CA6F1E",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
    label: "Functional Exchange",
    labelFa: "تبادل تابعی",
  },
  SystemExchange: {
    strokeColor: "#1A5276",
    strokeWidth: 2,
    arrowEnd: "arrow",
    label: "System Exchange",
    labelFa: "تبادل سیستمی",
  },
  LogicalExchange: {
    strokeColor: "#1E8449",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
    label: "Logical Exchange",
    labelFa: "تبادل منطقی",
  },
  ComponentExchange: {
    strokeColor: "#1D8348",
    strokeWidth: 2,
    arrowEnd: "arrow",
    label: "Component Exchange",
    labelFa: "تبادل مؤلفه",
  },
  ProvidedInterface: {
    strokeColor: "#1E8449",
    strokeWidth: 1.5,
    arrowEnd: "diamond",
    label: "Provided Interface",
    labelFa: "رابط ارائه‌شده",
  },
  RequiredInterface: {
    strokeColor: "#922B21",
    strokeWidth: 1.5,
    strokeDash: "4,2",
    arrowEnd: "open-arrow",
    label: "Required Interface",
    labelFa: "رابط مورد نیاز",
  },
  PhysicalExchange: {
    strokeColor: "#6C3483",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
    label: "Physical Exchange",
    labelFa: "تبادل فیزیکی",
  },
  PhysicalLink: {
    strokeColor: "#2C3E50",
    strokeWidth: 2.5,
    arrowEnd: "none",
    label: "Physical Link",
    labelFa: "پیوند فیزیکی",
  },
  DeploymentLink: {
    strokeColor: "#7F8C8D",
    strokeWidth: 1,
    strokeDash: "6,3",
    arrowEnd: "open-arrow",
    label: "Deployment Link",
    labelFa: "پیوند استقرار",
  },
};

export const TRACE_VISUAL_SPEC: Record<
  TraceLinkType,
  RelationshipVisualSpec
> = {
  Realization: {
    strokeColor: "#8E44AD",
    strokeWidth: 1,
    strokeDash: "4,2",
    arrowEnd: "open-arrow",
    label: "Realization",
    labelFa: "تحقق",
    animated: false,
  },
  Allocation: {
    strokeColor: "#E67E22",
    strokeWidth: 1,
    strokeDash: "4,2",
    arrowEnd: "open-arrow",
    label: "Allocation",
    labelFa: "تخصیص",
  },
  Deployment: {
    strokeColor: "#2C3E50",
    strokeWidth: 1,
    strokeDash: "6,2",
    arrowEnd: "open-arrow",
    label: "Deployment",
    labelFa: "استقرار",
  },
  Involvement: {
    strokeColor: "#717D7E",
    strokeWidth: 1,
    strokeDash: "3,3",
    arrowEnd: "open-arrow",
    label: "Involvement",
    labelFa: "مشارکت",
  },
  Refinement: {
    strokeColor: "#1A5276",
    strokeWidth: 1,
    strokeDash: "5,3",
    arrowEnd: "open-arrow",
    label: "Refinement",
    labelFa: "اصلاح",
  },
};
