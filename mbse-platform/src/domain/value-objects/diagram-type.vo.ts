import type { Layer } from "./layer.vo";

export const DIAGRAM_TYPES = [
  // OA Diagrams
  "OEB", // Operational Entity Breakdown
  "OAB", // Operational Activity Breakdown
  "OPD", // Operational Process Description
  "OCD", // Operational Capability Diagram
  "OIS", // Operational Interaction Scenario
  // SA Diagrams
  "SAB", // System Architecture Blank
  "SDFB", // System Data Flow Blank
  "SCD",  // System Capability Diagram
  "SS",   // System Scenario
  // LA Diagrams
  "LAB",  // Logical Architecture Blank
  "LDFB", // Logical Data Flow Blank
  "LCB",  // Logical Component Breakdown
  "LS",   // Logical Scenario
  // PA Diagrams
  "PAB",  // Physical Architecture Blank
  "PDFB", // Physical Data Flow Blank
  "PCB",  // Physical Component Breakdown
  "PS",   // Physical Scenario
] as const;

export type DiagramType = (typeof DIAGRAM_TYPES)[number];

export interface DiagramTypeMeta {
  label: string;
  labelFa: string;
  layer: Layer;
  description: string;
}

export const DIAGRAM_TYPE_META: Record<DiagramType, DiagramTypeMeta> = {
  OEB:  { label: "Operational Entity Breakdown",  labelFa: "تجزیه موجودیت عملیاتی", layer: "OA", description: "سلسله‌مراتب موجودیت‌های عملیاتی" },
  OAB:  { label: "Operational Activity Breakdown", labelFa: "تجزیه فعالیت عملیاتی",  layer: "OA", description: "ساختار تجزیه فعالیت‌های عملیاتی" },
  OPD:  { label: "Operational Process Description", labelFa: "توصیف فرایند عملیاتی", layer: "OA", description: "توالی فعالیت‌های عملیاتی" },
  OCD:  { label: "Operational Capability Diagram", labelFa: "دیاگرام قابلیت عملیاتی", layer: "OA", description: "قابلیت‌های عملیاتی" },
  OIS:  { label: "Operational Interaction Scenario", labelFa: "سناریو تعامل عملیاتی", layer: "OA", description: "سناریوی توالی عملیاتی" },
  SAB:  { label: "System Architecture Blank",      labelFa: "معماری سیستم",            layer: "SA", description: "دیاگرام اصلی معماری سیستم" },
  SDFB: { label: "System Data Flow Blank",         labelFa: "جریان داده سیستم",        layer: "SA", description: "جریان داده در سطح سیستم" },
  SCD:  { label: "System Capability Diagram",      labelFa: "دیاگرام قابلیت سیستم",   layer: "SA", description: "قابلیت‌های سیستم" },
  SS:   { label: "System Scenario",                labelFa: "سناریو سیستم",            layer: "SA", description: "سناریوی رفتاری سیستم" },
  LAB:  { label: "Logical Architecture Blank",     labelFa: "معماری منطقی",            layer: "LA", description: "دیاگرام اصلی معماری منطقی" },
  LDFB: { label: "Logical Data Flow Blank",        labelFa: "جریان داده منطقی",        layer: "LA", description: "جریان داده در سطح منطقی" },
  LCB:  { label: "Logical Component Breakdown",    labelFa: "تجزیه مؤلفه منطقی",      layer: "LA", description: "سلسله‌مراتب مؤلفه‌های منطقی" },
  LS:   { label: "Logical Scenario",               labelFa: "سناریو منطقی",            layer: "LA", description: "سناریوی رفتاری منطقی" },
  PAB:  { label: "Physical Architecture Blank",    labelFa: "معماری فیزیکی",           layer: "PA", description: "دیاگرام اصلی معماری فیزیکی" },
  PDFB: { label: "Physical Data Flow Blank",       labelFa: "جریان داده فیزیکی",      layer: "PA", description: "جریان داده در سطح فیزیکی" },
  PCB:  { label: "Physical Component Breakdown",   labelFa: "تجزیه مؤلفه فیزیکی",    layer: "PA", description: "سلسله‌مراتب مؤلفه‌های فیزیکی" },
  PS:   { label: "Physical Scenario",              labelFa: "سناریو فیزیکی",           layer: "PA", description: "سناریوی رفتاری فیزیکی" },
};

export const DIAGRAM_TYPES_BY_LAYER: Record<Layer, DiagramType[]> = {
  OA: ["OEB", "OAB", "OPD", "OCD", "OIS"],
  SA: ["SAB", "SDFB", "SCD", "SS"],
  LA: ["LAB", "LDFB", "LCB", "LS"],
  PA: ["PAB", "PDFB", "PCB", "PS"],
};
