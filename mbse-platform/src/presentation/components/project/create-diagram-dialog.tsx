"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/presentation/components/ui/form";
import { cn } from "@/presentation/lib/utils";
import { DiagramType } from "@/domain/value-objects/diagram-type.vo";
import { Layer } from "@/domain/value-objects/layer.vo";
import { useCreateDiagram } from "@/presentation/hooks/use-diagrams";
import { diagramFormSchema, type DiagramFormValues } from "@/lib/schemas/project.schema";

interface CreateDiagramDialogProps {
  open: boolean;
  onClose: () => void;
  modelId: string;
  layer: Layer;
}

export function CreateDiagramDialog({ open, onClose, modelId, layer }: CreateDiagramDialogProps) {
  const router = useRouter();
  const diagramTypes = DiagramType.allForLayer(layer);
  const createDiagram = useCreateDiagram();

  const form = useForm<DiagramFormValues>({
    resolver: zodResolver(diagramFormSchema),
    defaultValues: { type: "", name: "" },
  });

  const selectedType = form.watch("type");

  function onSubmit(values: DiagramFormValues) {
    createDiagram.mutate(
      { modelId, type: values.type, name: values.name },
      {
        onSuccess: (diagram) => {
          onClose();
          form.reset();
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع دیاگرام</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-1">
                      {diagramTypes.map((dt) => (
                        <button
                          key={dt.value}
                          type="button"
                          onClick={() => field.onChange(dt.value)}
                          className={cn(
                            "flex items-center justify-between rounded-md border px-3 py-2 text-sm text-right transition-colors",
                            field.value === dt.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40 hover:bg-accent"
                          )}
                        >
                          <span className="font-mono text-xs text-muted-foreground">{dt.value}</span>
                          <span>{dt.labelFa}</span>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام دیاگرام</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: Context Diagram" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
              <Button type="submit" disabled={!selectedType} loading={createDiagram.isPending}>
                ایجاد و باز کردن
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
