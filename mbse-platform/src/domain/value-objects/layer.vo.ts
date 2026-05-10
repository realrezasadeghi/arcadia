/**
 * Arcadia Methodology Layers
 * Each layer represents a specific abstraction level in MBSE
 */
export const LAYERS = ["OA", "SA", "LA", "PA"] as const;

export type Layer = (typeof LAYERS)[number];

export const LAYER_META: Record<
  Layer,
  { label: string; labelFa: string; order: number; color: string }
> = {
  OA: {
    label: "Operational Analysis",
    labelFa: "تحلیل عملیاتی",
    order: 1,
    color: "hsl(var(--layer-oa))",
  },
  SA: {
    label: "System Analysis",
    labelFa: "تحلیل سیستم",
    order: 2,
    color: "hsl(var(--layer-sa))",
  },
  LA: {
    label: "Logical Architecture",
    labelFa: "معماری منطقی",
    order: 3,
    color: "hsl(var(--layer-la))",
  },
  PA: {
    label: "Physical Architecture",
    labelFa: "معماری فیزیکی",
    order: 4,
    color: "hsl(var(--layer-pa))",
  },
};

export function isValidLayer(value: string): value is Layer {
  return LAYERS.includes(value as Layer);
}
