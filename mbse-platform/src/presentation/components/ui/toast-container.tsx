"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore } from "@/presentation/stores/toast.store";
import type { ToastVariant } from "@/presentation/stores/toast.store";

const VARIANT_STYLES: Record<ToastVariant, { wrapper: string; icon: React.ReactNode }> = {
  success: {
    wrapper: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />,
  },
  error: {
    wrapper: "border-destructive/30 bg-destructive/10 text-destructive",
    icon: <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />,
  },
  warning: {
    wrapper: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />,
  },
  default: {
    wrapper: "border-border bg-card text-foreground",
    icon: <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />,
  },
};

/**
 * ToastContainer
 *
 * Portal-rendered — باید یک بار در root layout قرار گیرد.
 * بدون وابستگی خارجی — فقط Zustand + Tailwind.
 */
export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  // فقط در سمت client render می‌شود
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => {
        const style = VARIANT_STYLES[t.variant];
        return (
          <div
            key={t.id}
            className={[
              "flex items-start gap-3 rounded-lg border px-3 py-2.5 shadow-lg",
              "animate-in slide-in-from-bottom-2 fade-in-0 duration-200",
              style.wrapper,
            ].join(" ")}
          >
            {style.icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs opacity-80">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="بستن"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
