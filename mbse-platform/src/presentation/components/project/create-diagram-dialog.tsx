"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { DiagramType } from "@/domain/value-objects/diagram-type.vo";
import { Layer } from "@/domain/value-objects/layer.vo";
import { useCreateDiagram } from "@/presentation/hooks/use-diagrams";

interface CreateDiagramDialogProps {
  open: boolean;
  onClose: () => void;
  modelId: string;
  layer: Layer;
}

export function CreateDiagramDialog({ open, onClose, modelId, layer }: CreateDiagramDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [nameError, setNameError] = useState("");

  const diagramTypes = DiagramType.allForLayer(layer);
  const createDiagram = useCreateDiagram();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setNameError("نام دیاگرام الزامی است"); return; }
    if (!selectedType) return;
    setNameError("");

    createDiagram.mutate(
      { modelId, type: selectedType, name },
      {
        onSuccess: (diagram) => {
          onClose();
          setName("");
          setSelectedType("");
          router.push(`/project/${diagram.modelId}/diagram/${diagram.id}`);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>دیاگرام جدید</DialogTitle>
          <DialogDescription>
            یک دیاگرام برای لایه {layer.labelFa} بسازید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>نوع دیاگرام</Label>
            <div className="flex flex-col gap-1">
              {diagramTypes.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => setSelectedType(dt.value)}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm text-right transition-colors ${
                    selectedType === dt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent"
                  }`}
                >
                  <span className="font-mono text-xs text-muted-foreground">{dt.value}</span>
                  <span>{dt.labelFa}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="diag-name">نام دیاگرام</Label>
            <Input
              id="diag-name"
              placeholder="مثال: Context Diagram"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
            <Button type="submit" disabled={!selectedType} loading={createDiagram.isPending}>
              ایجاد و باز کردن
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
