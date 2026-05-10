import type { ElementType } from "../value-objects/element-type.vo";
import type { Layer } from "../value-objects/layer.vo";
import type { TraceLinkType } from "../value-objects/relationship-type.vo";

/**
 * Cross-layer traceability rules.
 * Defines which element types can be traced to which,
 * and in which direction (always flows OA → SA → LA → PA).
 */

export interface TraceRule {
  type: TraceLinkType;
  sourceTypes: ElementType[];
  sourceLayer: Layer;
  targetTypes: ElementType[];
  targetLayer: Layer;
  description: string;
}

export const TRACE_RULES: TraceRule[] = [
  // ─── SA realizes OA ───────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: "SA",
    sourceTypes: ["SystemFunction"],
    targetLayer: "OA",
    targetTypes: ["OperationalActivity"],
    description: "تابع سیستم، فعالیت عملیاتی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: "SA",
    sourceTypes: ["SystemActor"],
    targetLayer: "OA",
    targetTypes: ["OperationalEntity", "OperationalActor"],
    description: "بازیگر سیستم، موجودیت عملیاتی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: "SA",
    sourceTypes: ["SystemCapability"],
    targetLayer: "OA",
    targetTypes: ["OperationalCapability"],
    description: "قابلیت سیستم، قابلیت عملیاتی را محقق می‌کند",
  },
  // ─── LA realizes SA ───────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: "LA",
    sourceTypes: ["LogicalFunction"],
    targetLayer: "SA",
    targetTypes: ["SystemFunction"],
    description: "تابع منطقی، تابع سیستم را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: "LA",
    sourceTypes: ["LogicalComponent"],
    targetLayer: "SA",
    targetTypes: ["SystemComponent"],
    description: "مؤلفه منطقی، مؤلفه سیستم را محقق می‌کند",
  },
  // ─── PA realizes LA ───────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalComponent"],
    targetLayer: "LA",
    targetTypes: ["LogicalComponent"],
    description: "مؤلفه فیزیکی، مؤلفه منطقی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalFunction"],
    targetLayer: "LA",
    targetTypes: ["LogicalFunction"],
    description: "تابع فیزیکی، تابع منطقی را محقق می‌کند",
  },
  // ─── Allocation ───────────────────────────────────────────────────────────
  {
    type: "Allocation",
    sourceLayer: "LA",
    sourceTypes: ["LogicalFunction"],
    targetLayer: "LA",
    targetTypes: ["LogicalComponent"],
    description: "تابع منطقی به مؤلفه منطقی تخصیص می‌یابد",
  },
  {
    type: "Allocation",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalFunction"],
    targetLayer: "PA",
    targetTypes: ["PhysicalComponent"],
    description: "تابع فیزیکی به مؤلفه فیزیکی تخصیص می‌یابد",
  },
  // ─── Deployment ──────────────────────────────────────────────────────────
  {
    type: "Deployment",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalComponent"],
    targetLayer: "PA",
    targetTypes: ["PhysicalNode"],
    description: "مؤلفه فیزیکی روی گره استقرار می‌یابد",
  },
  // ─── Involvement ─────────────────────────────────────────────────────────
  {
    type: "Involvement",
    sourceLayer: "OA",
    sourceTypes: ["OperationalEntity", "OperationalActor"],
    targetLayer: "OA",
    targetTypes: ["OperationalCapability"],
    description: "موجودیت عملیاتی در قابلیت عملیاتی مشارکت دارد",
  },
];

export function isTraceLinkAllowed(
  sourceType: ElementType,
  sourceLayer: Layer,
  targetType: ElementType,
  targetLayer: Layer,
  traceLinkType: TraceLinkType
): { allowed: boolean; reason?: string } {
  // Prevent same element tracing
  if (sourceLayer === targetLayer && traceLinkType === "Realization") {
    return {
      allowed: false,
      reason: "پیوند Realization نمی‌تواند بین عناصر همان لایه باشد",
    };
  }

  const rule = TRACE_RULES.find(
    (r) =>
      r.type === traceLinkType &&
      r.sourceLayer === sourceLayer &&
      r.targetLayer === targetLayer &&
      r.sourceTypes.includes(sourceType) &&
      r.targetTypes.includes(targetType)
  );

  if (!rule) {
    return {
      allowed: false,
      reason: `پیوند "${traceLinkType}" از "${sourceType}" (${sourceLayer}) به "${targetType}" (${targetLayer}) مجاز نیست`,
    };
  }

  return { allowed: true };
}

export function getTraceLinkOptions(
  sourceType: ElementType,
  sourceLayer: Layer
): Array<{ targetTypes: ElementType[]; targetLayer: Layer; type: TraceLinkType }> {
  return TRACE_RULES.filter(
    (r) =>
      r.sourceLayer === sourceLayer && r.sourceTypes.includes(sourceType)
  ).map((r) => ({
    targetTypes: r.targetTypes as ElementType[],
    targetLayer: r.targetLayer,
    type: r.type,
  }));
}
