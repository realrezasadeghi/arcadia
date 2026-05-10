import type { ElementType } from "../value-objects/element-type.vo";
import type { RelationshipType } from "../value-objects/relationship-type.vo";
import type { Layer } from "../value-objects/layer.vo";

/**
 * Defines which element types can be connected with which relationship types.
 * This enforces Arcadia methodology constraints.
 *
 * Pattern: Open/Closed Principle — extend by adding new rules, not modifying existing ones.
 */

export interface ConnectionRule {
  relationshipType: RelationshipType;
  allowedSources: ElementType[];
  allowedTargets: ElementType[];
  layer: Layer;
  description: string;
}

export const CONNECTION_RULES: ConnectionRule[] = [
  // ─── OA Rules ─────────────────────────────────────────────────────────────
  {
    relationshipType: "OperationalExchange",
    layer: "OA",
    allowedSources: ["OperationalActivity"],
    allowedTargets: ["OperationalActivity"],
    description: "تبادل عملیاتی فقط بین فعالیت‌های عملیاتی مجاز است",
  },
  {
    relationshipType: "InvolvementLink",
    layer: "OA",
    allowedSources: ["OperationalEntity", "OperationalActor"],
    allowedTargets: ["OperationalCapability", "OperationalActivity", "OperationalProcess"],
    description: "پیوند مشارکت بین موجودیت/بازیگر و قابلیت/فعالیت",
  },
  // ─── SA Rules ─────────────────────────────────────────────────────────────
  {
    relationshipType: "FunctionalExchange",
    layer: "SA",
    allowedSources: ["SystemFunction"],
    allowedTargets: ["SystemFunction"],
    description: "تبادل تابعی فقط بین توابع سیستم مجاز است",
  },
  {
    relationshipType: "SystemExchange",
    layer: "SA",
    allowedSources: ["System", "SystemActor"],
    allowedTargets: ["System", "SystemActor"],
    description: "تبادل سیستمی بین سیستم و بازیگران خارجی",
  },
  // ─── LA Rules ─────────────────────────────────────────────────────────────
  {
    relationshipType: "LogicalExchange",
    layer: "LA",
    allowedSources: ["LogicalFunction"],
    allowedTargets: ["LogicalFunction"],
    description: "تبادل منطقی بین توابع منطقی",
  },
  {
    relationshipType: "ComponentExchange",
    layer: "LA",
    allowedSources: ["LogicalComponent", "LogicalActor"],
    allowedTargets: ["LogicalComponent", "LogicalActor"],
    description: "تبادل مؤلفه بین مؤلفه‌های منطقی",
  },
  {
    relationshipType: "ProvidedInterface",
    layer: "LA",
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
    description: "رابط ارائه‌شده توسط مؤلفه منطقی",
  },
  {
    relationshipType: "RequiredInterface",
    layer: "LA",
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
    description: "رابط مورد نیاز مؤلفه منطقی",
  },
  // ─── PA Rules ─────────────────────────────────────────────────────────────
  {
    relationshipType: "PhysicalExchange",
    layer: "PA",
    allowedSources: ["PhysicalFunction"],
    allowedTargets: ["PhysicalFunction"],
    description: "تبادل فیزیکی بین توابع فیزیکی",
  },
  {
    relationshipType: "PhysicalLink",
    layer: "PA",
    allowedSources: ["PhysicalNode"],
    allowedTargets: ["PhysicalNode"],
    description: "پیوند فیزیکی فقط بین گره‌های فیزیکی",
  },
  {
    relationshipType: "DeploymentLink",
    layer: "PA",
    allowedSources: ["PhysicalComponent"],
    allowedTargets: ["PhysicalNode"],
    description: "مؤلفه نرم‌افزاری روی گره فیزیکی deploy می‌شود",
  },
];

export function isConnectionAllowed(
  sourceType: ElementType,
  targetType: ElementType,
  relationshipType: RelationshipType
): { allowed: boolean; reason?: string } {
  const rule = CONNECTION_RULES.find(
    (r) => r.relationshipType === relationshipType
  );

  if (!rule) {
    return { allowed: false, reason: `نوع رابطه "${relationshipType}" تعریف نشده است` };
  }

  const sourceAllowed = rule.allowedSources.includes(sourceType);
  const targetAllowed = rule.allowedTargets.includes(targetType);

  if (!sourceAllowed) {
    return {
      allowed: false,
      reason: `عنصر منبع از نوع "${sourceType}" برای این رابطه مجاز نیست`,
    };
  }

  if (!targetAllowed) {
    return {
      allowed: false,
      reason: `عنصر مقصد از نوع "${targetType}" برای این رابطه مجاز نیست`,
    };
  }

  return { allowed: true };
}

export function getAllowedRelationshipTypes(
  sourceType: ElementType,
  targetType: ElementType
): RelationshipType[] {
  return CONNECTION_RULES.filter(
    (r) =>
      r.allowedSources.includes(sourceType) &&
      r.allowedTargets.includes(targetType)
  ).map((r) => r.relationshipType);
}
