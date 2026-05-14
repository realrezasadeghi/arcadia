"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import { getEdgeVisual } from "@/presentation/config/visual.config";
import type { RelationshipTypeValue } from "@/presentation/stores/canvas.store";

interface ConnectionDialogProps {
  open: boolean;
  allowedTypes: RelationshipTypeValue[];
  onConfirm: (type: RelationshipTypeValue, name: string) => void;
  onCancel: () => void;
}

export function ConnectionDialog({ open, allowedTypes, onConfirm, onCancel }: ConnectionDialogProps) {
  const [selectedType, setSelectedType] = useState<RelationshipTypeValue | null>(
    allowedTypes[0] ?? null
  );
  const [name, setName] = useState("");

  function handleConfirm() {
    if (!selectedType) return;
    onConfirm(selectedType, name);
    setName("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>نوع رابطه را انتخاب کنید</DialogTitle>
          <DialogDescription>بین این دو المنت چه نوع رابطه‌ای برقرار می‌شود؟</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            {allowedTypes.map((typeValue) => {
              const rt = RelationshipType.from(typeValue);
              const spec = getEdgeVisual(typeValue);
              const isSelected = selectedType === typeValue;
              return (
                <button
                  key={typeValue}
                  onClick={() => setSelectedType(typeValue)}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm text-right transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent"
                  }`}
                >
                  <span className="h-1 w-6 rounded-full shrink-0" style={{ backgroundColor: spec.strokeColor }} />
                  <span className="flex-1 text-right">{rt.labelFa}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rel-name">نام رابطه (اختیاری)</Label>
            <Input
              id="rel-name"
              placeholder="مثال: requestData"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>انصراف</Button>
          <Button onClick={handleConfirm} disabled={!selectedType}>ایجاد رابطه</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
