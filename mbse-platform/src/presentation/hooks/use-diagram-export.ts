"use client";

import { useCallback } from "react";
import { useCanvasStore } from "@/presentation/stores/canvas.store";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import type { Layer } from "@/domain/value-objects/layer.vo";
import type { ElementTypeValue, RelationshipTypeValue } from "@/presentation/stores/canvas.store";

interface UseDiagramExportOptions {
  diagramName: string;
  projectName: string;
  layer: Layer;
}

/**
 * useDiagramExport
 *
 * دو نوع خروجی ارائه می‌دهد:
 * - exportJson: دانلود فایل JSON با داده‌های کامل دیاگرام
 * - exportHtml: باز کردن صفحه قابل‌چاپ (Print / PDF)
 */
export function useDiagramExport({ diagramName, projectName, layer }: UseDiagramExportOptions) {
  const exportJson = useCallback(() => {
    const { nodes, edges, diagramId } = useCanvasStore.getState();

    const payload = {
      meta: {
        diagramId,
        diagramName,
        projectName,
        layer: layer.value,
        layerFa: layer.labelFa,
        exportedAt: new Date().toISOString(),
      },
      elements: nodes.map((n) => ({
        id: n.data.elementId,
        name: n.data.name,
        type: n.data.elementType,
        typeFa: ElementType.from(n.data.elementType).labelFa,
        status: n.data.status,
        description: n.data.description,
        position: n.position,
      })),
      relationships: edges.map((e) => ({
        id: e.data?.relationshipId,
        name: e.data?.name,
        type: e.data?.relationshipType,
        typeFa: e.data ? RelationshipType.from(e.data.relationshipType).labelFa : "",
        sourceElementId: e.source,
        targetElementId: e.target,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${diagramName.replace(/\s+/g, "_")}_${layer.value}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [diagramName, projectName, layer]);

  const exportHtml = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();
    const date = new Date().toLocaleDateString("fa-IR");

    const elementsRows = nodes.map((n) => {
      const spec = ElementType.from(n.data.elementType as ElementTypeValue).visualSpec;
      const statusLabel = { DRAFT: "پیش‌نویس", VALIDATED: "اعتبارسنجی‌شده", DEPRECATED: "منسوخ" }[n.data.status];
      return `
        <tr>
          <td>
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${spec.fillColor};border:1px solid ${spec.strokeColor};margin-left:6px"></span>
            ${escapeHtml(n.data.name)}
          </td>
          <td>${escapeHtml(ElementType.from(n.data.elementType as ElementTypeValue).labelFa)}</td>
          <td>${statusLabel}</td>
          <td>${escapeHtml(n.data.description || "—")}</td>
        </tr>`;
    }).join("");

    const edgesRows = edges.map((e) => {
      if (!e.data) return "";
      const spec = RelationshipType.from(e.data.relationshipType as RelationshipTypeValue).visualSpec;
      const srcName = nodes.find((n) => n.id === e.source)?.data.name ?? e.source;
      const tgtName = nodes.find((n) => n.id === e.target)?.data.name ?? e.target;
      return `
        <tr>
          <td>
            <span style="display:inline-block;width:20px;height:3px;background:${spec.strokeColor};margin-left:6px;vertical-align:middle"></span>
            ${escapeHtml(e.data.name || spec.labelFa)}
          </td>
          <td>${escapeHtml(spec.labelFa)}</td>
          <td>${escapeHtml(srcName)}</td>
          <td>${escapeHtml(tgtName)}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(diagramName)} — ${layer.value}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Vazirmatn", Tahoma, sans-serif; font-size: 13px; color: #1a1a1a; padding: 32px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 28px; }
    .layer-badge {
      display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600;
      margin-right: 8px;
      background: #e8f0fe; color: #1a56db; border: 1px solid #1a56db;
    }
    h2 { font-size: 16px; font-weight: 600; margin: 24px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e5e7eb; padding: 7px 10px; text-align: right; vertical-align: middle; }
    th { background: #f9fafb; font-weight: 600; }
    tr:nth-child(even) td { background: #fafafa; }
    .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
    @media print {
      body { padding: 16px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(diagramName)}</h1>
  <div class="meta">
    <span class="layer-badge">${layer.value} — ${escapeHtml(layer.labelFa)}</span>
    پروژه: <strong>${escapeHtml(projectName)}</strong> &nbsp;|&nbsp; تاریخ خروجی: ${date}
  </div>

  <button onclick="window.print()" style="margin-bottom:20px;padding:6px 16px;background:#1a56db;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit">
    چاپ / ذخیره PDF
  </button>

  <h2>المنت‌ها (${nodes.length})</h2>
  ${nodes.length === 0 ? "<p style='color:#999;font-size:12px'>هیچ المنتی در دیاگرام وجود ندارد.</p>" : `
  <table>
    <thead><tr><th>نام</th><th>نوع</th><th>وضعیت</th><th>توضیحات</th></tr></thead>
    <tbody>${elementsRows}</tbody>
  </table>`}

  <h2>روابط (${edges.length})</h2>
  ${edges.length === 0 ? "<p style='color:#999;font-size:12px'>هیچ رابطه‌ای تعریف نشده است.</p>" : `
  <table>
    <thead><tr><th>نام</th><th>نوع</th><th>مبدأ</th><th>مقصد</th></tr></thead>
    <tbody>${edgesRows}</tbody>
  </table>`}

  <div class="footer">خروجی گرفته‌شده توسط نقطه — سکوی MBSE فارسی</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    // پس از بارگذاری صفحه، URL را آزاد کن
    if (w) w.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
  }, [diagramName, projectName, layer]);

  return { exportJson, exportHtml };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
