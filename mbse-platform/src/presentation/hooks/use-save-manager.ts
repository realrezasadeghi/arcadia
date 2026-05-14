"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUIStore } from "@/presentation/stores/ui.store";
import { container } from "@/infrastructure/api/service-container";
import { useCanvasStore } from "@/presentation/stores/canvas.store";
import { toast } from "sonner";

const DEBOUNCE_MS = 2000;
const MAX_PENDING = 5;

/**
 * useSaveManager
 *
 * بعد از هر تغییر در canvas:
 * - pendingChanges را افزایش می‌دهد
 * - اگر ≥ MAX_PENDING یا ۲ ثانیه سکوت → layout را به API ارسال می‌کند
 */
export function useSaveManager() {
  const { setSaveStatus, incrementPending, resetPending, pendingChanges } = useUIStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { diagramId, nodes } = useCanvasStore();

  const flush = useCallback(async () => {
    if (!diagramId) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setSaveStatus("saving");
    try {
      const layouts = nodes.map((n) => ({
        elementId: n.data.elementId,
        position: n.position,
        size: { width: n.width ?? 160, height: n.height ?? 60 },
      }));
      await container.updateDiagramLayout.execute({
        diagramId,
        layout: { elementLayouts: layouts },
      });
      resetPending();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
      toast.error("خطا در ذخیره دیاگرام");
    }
  }, [diagramId, nodes, setSaveStatus, resetPending]);

  const notifyChange = useCallback(() => {
    incrementPending();

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, DEBOUNCE_MS);
  }, [incrementPending, flush]);

  // flush اگر تعداد تغییرات به حداکثر رسید
  useEffect(() => {
    if (pendingChanges >= MAX_PENDING) {
      flush();
    }
  }, [pendingChanges, flush]);

  // cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { notifyChange, flush };
}
