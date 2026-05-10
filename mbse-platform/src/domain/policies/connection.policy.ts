import { ElementType, type ElementTypeValue } from "../value-objects/element-type.vo";
import { RelationshipType } from "../value-objects/relationship-type.vo";
import { Layer } from "../value-objects/layer.vo";
import { ConnectionNotAllowedError } from "../errors/domain.error";

interface ConnectionRule {
  relationshipType: string;
  allowedSources: ElementTypeValue[];
  allowedTargets: ElementTypeValue[];
  layer: Layer;
  descriptionFa: string;
}

const RULES: ConnectionRule[] = [
  // ─── OA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "OperationalExchange",
    layer: Layer.OA,
    allowedSources: ["OperationalActivity"],
    allowedTargets: ["OperationalActivity"],
    descriptionFa: "تبادل عملیاتی فقط بین فعالیت‌های عملیاتی مجاز است",
  },
  {
    relationshipType: "InvolvementLink",
    layer: Layer.OA,
    allowedSources: ["OperationalEntity", "OperationalActor"],
    allowedTargets: ["OperationalCapability", "OperationalActivity", "OperationalProcess"],
    descriptionFa: "پیوند مشارکت بین موجودیت/بازیگر و قابلیت/فعالیت",
  },
  // ─── SA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "FunctionalExchange",
    layer: Layer.SA,
    allowedSources: ["SystemFunction"],
    allowedTargets: ["SystemFunction"],
    descriptionFa: "تبادل تابعی فقط بین توابع سیستم",
  },
  {
    relationshipType: "SystemExchange",
    layer: Layer.SA,
    allowedSources: ["System", "SystemActor"],
    allowedTargets: ["System", "SystemActor"],
    descriptionFa: "تبادل سیستمی بین سیستم و بازیگران خارجی",
  },
  // ─── LA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "LogicalExchange",
    layer: Layer.LA,
    allowedSources: ["LogicalFunction"],
    allowedTargets: ["LogicalFunction"],
    descriptionFa: "تبادل منطقی بین توابع منطقی",
  },
  {
    relationshipType: "ComponentExchange",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent", "LogicalActor"],
    allowedTargets: ["LogicalComponent", "LogicalActor"],
    descriptionFa: "تبادل مؤلفه بین مؤلفه‌های منطقی",
  },
  {
    relationshipType: "ProvidedInterface",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
    descriptionFa: "رابط ارائه‌شده توسط مؤلفه منطقی",
  },
  {
    relationshipType: "RequiredInterface",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
    descriptionFa: "رابط مورد نیاز مؤلفه منطقی",
  },
  // ─── PA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "PhysicalExchange",
    layer: Layer.PA,
    allowedSources: ["PhysicalFunction"],
    allowedTargets: ["PhysicalFunction"],
    descriptionFa: "تبادل فیزیکی بین توابع فیزیکی",
  },
  {
    relationshipType: "PhysicalLink",
    layer: Layer.PA,
    allowedSources: ["PhysicalNode"],
    allowedTargets: ["PhysicalNode"],
    descriptionFa: "پیوند فیزیکی فقط بین گره‌های فیزیکی",
  },
  {
    relationshipType: "DeploymentLink",
    layer: Layer.PA,
    allowedSources: ["PhysicalComponent"],
    allowedTargets: ["PhysicalNode"],
    descriptionFa: "مؤلفه فیزیکی روی گره فیزیکی مستقر می‌شود",
  },
];

/**
 * ConnectionPolicy
 *
 * Policy برای اعتبارسنجی اتصال دو المنت.
 * Open/Closed: قوانین در RULES array قابل extension هستند.
 * Single Responsibility: فقط validation اتصال.
 */
export class ConnectionPolicy {
  /** بررسی می‌کند آیا اتصال مجاز است — در صورت عدم مجاز بودن خطا پرتاب می‌کند */
  static assertAllowed(
    sourceType: ElementType,
    targetType: ElementType,
    relationshipType: RelationshipType
  ): void {
    const rule = RULES.find((r) => r.relationshipType === relationshipType.value);

    if (!rule) {
      throw new ConnectionNotAllowedError(
        `نوع رابطه "${relationshipType.value}" تعریف نشده است`
      );
    }

    if (!rule.allowedSources.includes(sourceType.value)) {
      throw new ConnectionNotAllowedError(
        `عنصر منبع "${sourceType.labelFa}" برای رابطه "${relationshipType.labelFa}" مجاز نیست`
      );
    }

    if (!rule.allowedTargets.includes(targetType.value)) {
      throw new ConnectionNotAllowedError(
        `عنصر مقصد "${targetType.labelFa}" برای رابطه "${relationshipType.labelFa}" مجاز نیست`
      );
    }
  }

  /** بازگرداندن انواع رابطه‌های مجاز بین دو نوع المنت */
  static getAllowedTypes(
    sourceType: ElementType,
    targetType: ElementType
  ): RelationshipType[] {
    return RULES.filter(
      (r) =>
        r.allowedSources.includes(sourceType.value) &&
        r.allowedTargets.includes(targetType.value)
    ).map((r) => RelationshipType.from(r.relationshipType));
  }

  /** بررسی بدون پرتاب خطا */
  static isAllowed(
    sourceType: ElementType,
    targetType: ElementType,
    relationshipType: RelationshipType
  ): boolean {
    try {
      this.assertAllowed(sourceType, targetType, relationshipType);
      return true;
    } catch {
      return false;
    }
  }
}
