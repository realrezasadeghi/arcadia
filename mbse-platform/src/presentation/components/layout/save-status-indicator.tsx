"use client";

import { Check, Cloud, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/presentation/lib/utils";
import { useUIStore } from "@/presentation/stores/ui.store";

const STATUS_CONFIG = {
  saved:   { icon: Check,       text: "ذخیره شد",          className: "text-muted-foreground" },
  saving:  { icon: Loader2,     text: "در حال ذخیره...",    className: "text-primary animate-pulse" },
  dirty:   { icon: Cloud,       text: "تغییرات ذخیره‌نشده", className: "text-muted-foreground" },
  error:   { icon: AlertCircle, text: "خطا در ذخیره",       className: "text-destructive" },
} as const;

export function SaveStatusIndicator() {
  const { saveStatus, pendingChanges } = useUIStore();
  const config = STATUS_CONFIG[saveStatus];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs px-2", config.className)}>
      <Icon className={cn("h-3.5 w-3.5", saveStatus === "saving" && "animate-spin")} />
      <span className="hidden sm:inline">
        {saveStatus === "dirty" && pendingChanges > 0
          ? `${pendingChanges} تغییر`
          : config.text}
      </span>
    </div>
  );
}
