/**
 * visual.config.ts — Presentation Layer
 *
 * همه اطلاعات بصری (رنگ، شکل، خط‌چین) اینجاست.
 * هیچ‌کدام از این‌ها نباید در domain باشد.
 */

import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";
import type { RelationshipTypeValue, TraceLinkTypeValue } from "@/domain/value-objects/relationship-type.vo";

// ─── Element Visual ────────────────────────────────────────────────────────────

export interface ElementVisualSpec {
  shape: "rectangle" | "rounded-rectangle" | "ellipse";
  fillColor: string;
  fillColorDark: string;
  strokeColor: string;
}

export const ELEMENT_VISUAL: Record<ElementTypeValue, ElementVisualSpec> = {
  OperationalEntity:     { shape: "rounded-rectangle", fillColor: "#AED6F1", fillColorDark: "#1a3a52", strokeColor: "#2E86C1" },
  OperationalActor:      { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E" },
  OperationalActivity:   { shape: "rectangle",         fillColor: "#F9E79F", fillColorDark: "#3d3200", strokeColor: "#D4AC0D" },
  OperationalCapability: { shape: "ellipse",           fillColor: "#A9DFBF", fillColorDark: "#1a3d2b", strokeColor: "#1E8449" },
  OperationalProcess:    { shape: "rounded-rectangle", fillColor: "#D7BDE2", fillColorDark: "#2d1a3d", strokeColor: "#7D3C98" },
  System:                { shape: "rounded-rectangle", fillColor: "#AED6F1", fillColorDark: "#1a3a52", strokeColor: "#1A5276" },
  SystemActor:           { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E" },
  SystemFunction:        { shape: "rectangle",         fillColor: "#FAD7A0", fillColorDark: "#3d2800", strokeColor: "#CA6F1E" },
  SystemCapability:      { shape: "ellipse",           fillColor: "#A9DFBF", fillColorDark: "#1a3d2b", strokeColor: "#1D8348" },
  SystemComponent:       { shape: "rounded-rectangle", fillColor: "#85C1E9", fillColorDark: "#0d2d47", strokeColor: "#1A5276" },
  LogicalComponent:      { shape: "rounded-rectangle", fillColor: "#A9DFBF", fillColorDark: "#1a3d2b", strokeColor: "#1E8449" },
  LogicalActor:          { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E" },
  LogicalFunction:       { shape: "rectangle",         fillColor: "#F9E79F", fillColorDark: "#3d3200", strokeColor: "#D4AC0D" },
  PhysicalComponent:     { shape: "rectangle",         fillColor: "#D2B4DE", fillColorDark: "#2d1a3d", strokeColor: "#6C3483" },
  PhysicalNode:          { shape: "rectangle",         fillColor: "#AEB6BF", fillColorDark: "#1a1f24", strokeColor: "#2C3E50" },
  PhysicalFunction:      { shape: "rectangle",         fillColor: "#FAD7A0", fillColorDark: "#3d2800", strokeColor: "#CA6F1E" },
  PhysicalActor:         { shape: "rounded-rectangle", fillColor: "#D5D8DC", fillColorDark: "#2d3436", strokeColor: "#717D7E" },
};

export function getElementVisual(type: string): ElementVisualSpec {
  return ELEMENT_VISUAL[type as ElementTypeValue] ?? {
    shape: "rectangle",
    fillColor: "#E5E7EB",
    fillColorDark: "#374151",
    strokeColor: "#9CA3AF",
  };
}

// ─── Edge (Relationship) Visual ────────────────────────────────────────────────

export interface EdgeVisualSpec {
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: string;
  arrowEnd: "arrow" | "open-arrow" | "diamond" | "none";
  animated?: boolean;
}

export const RELATIONSHIP_VISUAL: Record<RelationshipTypeValue, EdgeVisualSpec> = {
  OperationalExchange: { strokeColor: "#2E86C1", strokeWidth: 1.5, arrowEnd: "arrow" },
  InvolvementLink:     { strokeColor: "#717D7E", strokeWidth: 1,   arrowEnd: "open-arrow", strokeDash: "5,3" },
  FunctionalExchange:  { strokeColor: "#CA6F1E", strokeWidth: 1.5, arrowEnd: "arrow" },
  SystemExchange:      { strokeColor: "#1A5276", strokeWidth: 2,   arrowEnd: "arrow" },
  LogicalExchange:     { strokeColor: "#1E8449", strokeWidth: 1.5, arrowEnd: "arrow" },
  ComponentExchange:   { strokeColor: "#1D8348", strokeWidth: 2,   arrowEnd: "arrow" },
  ProvidedInterface:   { strokeColor: "#1E8449", strokeWidth: 1.5, arrowEnd: "diamond" },
  RequiredInterface:   { strokeColor: "#922B21", strokeWidth: 1.5, arrowEnd: "open-arrow", strokeDash: "4,2" },
  PhysicalExchange:    { strokeColor: "#6C3483", strokeWidth: 1.5, arrowEnd: "arrow" },
  PhysicalLink:        { strokeColor: "#2C3E50", strokeWidth: 2.5, arrowEnd: "none" },
  DeploymentLink:      { strokeColor: "#7F8C8D", strokeWidth: 1,   arrowEnd: "open-arrow", strokeDash: "6,3" },
};

export const TRACE_VISUAL: Record<TraceLinkTypeValue, EdgeVisualSpec> = {
  Realization: { strokeColor: "#8E44AD", strokeWidth: 1, arrowEnd: "open-arrow", strokeDash: "4,2" },
  Allocation:  { strokeColor: "#E67E22", strokeWidth: 1, arrowEnd: "open-arrow", strokeDash: "4,2" },
  Deployment:  { strokeColor: "#2C3E50", strokeWidth: 1, arrowEnd: "open-arrow", strokeDash: "6,2" },
  Involvement: { strokeColor: "#717D7E", strokeWidth: 1, arrowEnd: "open-arrow", strokeDash: "3,3" },
  Refinement:  { strokeColor: "#1A5276", strokeWidth: 1, arrowEnd: "open-arrow", strokeDash: "5,3" },
};

export function getEdgeVisual(type: string): EdgeVisualSpec {
  return RELATIONSHIP_VISUAL[type as RelationshipTypeValue] ?? {
    strokeColor: "#94a3b8",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
  };
}

export function getTraceVisual(type: string): EdgeVisualSpec {
  return TRACE_VISUAL[type as TraceLinkTypeValue] ?? {
    strokeColor: "#94a3b8",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "4,2",
  };
}

// ─── Layer Color ───────────────────────────────────────────────────────────────

/** CSS variable name برای هر لایه — فقط در presentation استفاده می‌شود */
export const LAYER_COLOR_VAR: Record<string, string> = {
  OA: "--layer-oa",
  SA: "--layer-sa",
  LA: "--layer-la",
  PA: "--layer-pa",
};

export function getLayerColorVar(layerValue: string): string {
  return LAYER_COLOR_VAR[layerValue] ?? "--layer-oa";
}
