import type { Layer } from "./layer.vo";

// ─── OA Element Types ────────────────────────────────────────────────────────
export const OA_ELEMENT_TYPES = [
  "OperationalEntity",
  "OperationalActor",
  "OperationalActivity",
  "OperationalCapability",
  "OperationalProcess",
] as const;

// ─── SA Element Types ────────────────────────────────────────────────────────
export const SA_ELEMENT_TYPES = [
  "System",
  "SystemActor",
  "SystemFunction",
  "SystemCapability",
  "SystemComponent",
] as const;

// ─── LA Element Types ────────────────────────────────────────────────────────
export const LA_ELEMENT_TYPES = [
  "LogicalComponent",
  "LogicalActor",
  "LogicalFunction",
] as const;

// ─── PA Element Types ────────────────────────────────────────────────────────
export const PA_ELEMENT_TYPES = [
  "PhysicalComponent",
  "PhysicalNode",
  "PhysicalFunction",
  "PhysicalActor",
] as const;

export type OAElementType = (typeof OA_ELEMENT_TYPES)[number];
export type SAElementType = (typeof SA_ELEMENT_TYPES)[number];
export type LAElementType = (typeof LA_ELEMENT_TYPES)[number];
export type PAElementType = (typeof PA_ELEMENT_TYPES)[number];

export type ElementType =
  | OAElementType
  | SAElementType
  | LAElementType
  | PAElementType;

export const ELEMENT_TYPES_BY_LAYER: Record<Layer, readonly ElementType[]> = {
  OA: OA_ELEMENT_TYPES,
  SA: SA_ELEMENT_TYPES,
  LA: LA_ELEMENT_TYPES,
  PA: PA_ELEMENT_TYPES,
};

/**
 * Visual specification per element type — matching Capella conventions
 */
export interface ElementVisualSpec {
  shape: "rectangle" | "rounded-rectangle" | "ellipse" | "hexagon";
  fillColor: string;
  strokeColor: string;
  labelFa: string;
  label: string;
  icon?: string;
}

export const ELEMENT_VISUAL_SPEC: Record<ElementType, ElementVisualSpec> = {
  // OA
  OperationalEntity: {
    shape: "rounded-rectangle",
    fillColor: "#AED6F1",
    strokeColor: "#2E86C1",
    label: "Operational Entity",
    labelFa: "موجودیت عملیاتی",
  },
  OperationalActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    strokeColor: "#717D7E",
    label: "Operational Actor",
    labelFa: "بازیگر عملیاتی",
  },
  OperationalActivity: {
    shape: "rectangle",
    fillColor: "#F9E79F",
    strokeColor: "#D4AC0D",
    label: "Operational Activity",
    labelFa: "فعالیت عملیاتی",
  },
  OperationalCapability: {
    shape: "ellipse",
    fillColor: "#A9DFBF",
    strokeColor: "#1E8449",
    label: "Operational Capability",
    labelFa: "قابلیت عملیاتی",
  },
  OperationalProcess: {
    shape: "rounded-rectangle",
    fillColor: "#D7BDE2",
    strokeColor: "#7D3C98",
    label: "Operational Process",
    labelFa: "فرایند عملیاتی",
  },
  // SA
  System: {
    shape: "rounded-rectangle",
    fillColor: "#AED6F1",
    strokeColor: "#1A5276",
    label: "System",
    labelFa: "سیستم",
  },
  SystemActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    strokeColor: "#717D7E",
    label: "System Actor",
    labelFa: "بازیگر سیستم",
  },
  SystemFunction: {
    shape: "rectangle",
    fillColor: "#FAD7A0",
    strokeColor: "#CA6F1E",
    label: "System Function",
    labelFa: "تابع سیستم",
  },
  SystemCapability: {
    shape: "ellipse",
    fillColor: "#A9DFBF",
    strokeColor: "#1D8348",
    label: "System Capability",
    labelFa: "قابلیت سیستم",
  },
  SystemComponent: {
    shape: "rounded-rectangle",
    fillColor: "#85C1E9",
    strokeColor: "#1A5276",
    label: "System Component",
    labelFa: "مؤلفه سیستم",
  },
  // LA
  LogicalComponent: {
    shape: "rounded-rectangle",
    fillColor: "#A9DFBF",
    strokeColor: "#1E8449",
    label: "Logical Component",
    labelFa: "مؤلفه منطقی",
  },
  LogicalActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    strokeColor: "#717D7E",
    label: "Logical Actor",
    labelFa: "بازیگر منطقی",
  },
  LogicalFunction: {
    shape: "rectangle",
    fillColor: "#F9E79F",
    strokeColor: "#D4AC0D",
    label: "Logical Function",
    labelFa: "تابع منطقی",
  },
  // PA
  PhysicalComponent: {
    shape: "rectangle",
    fillColor: "#D2B4DE",
    strokeColor: "#6C3483",
    label: "Physical Component",
    labelFa: "مؤلفه فیزیکی",
  },
  PhysicalNode: {
    shape: "rectangle",
    fillColor: "#AEB6BF",
    strokeColor: "#2C3E50",
    label: "Physical Node",
    labelFa: "گره فیزیکی",
  },
  PhysicalFunction: {
    shape: "rectangle",
    fillColor: "#FAD7A0",
    strokeColor: "#CA6F1E",
    label: "Physical Function",
    labelFa: "تابع فیزیکی",
  },
  PhysicalActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    strokeColor: "#717D7E",
    label: "Physical Actor",
    labelFa: "بازیگر فیزیکی",
  },
};

export function getElementLayer(type: ElementType): Layer {
  if ((OA_ELEMENT_TYPES as readonly string[]).includes(type)) return "OA";
  if ((SA_ELEMENT_TYPES as readonly string[]).includes(type)) return "SA";
  if ((LA_ELEMENT_TYPES as readonly string[]).includes(type)) return "LA";
  return "PA";
}
