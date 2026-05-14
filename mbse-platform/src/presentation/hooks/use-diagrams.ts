"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";
import { MODEL_KEYS } from "./use-models";
import { toast } from "sonner";

export const DIAGRAM_KEYS = {
  detail: (diagramId: string) => ["diagrams", "detail", diagramId] as const,
};

export function useDiagram(diagramId: string) {
  return useQuery({
    queryKey: DIAGRAM_KEYS.detail(diagramId),
    queryFn: () => container.getDiagram.execute({ diagramId }),
    enabled: !!diagramId,
  });
}

export function useCreateDiagram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { modelId: string; type: string; name: string; description?: string }) =>
      container.createDiagram.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.diagrams(modelId) }),
    onError: (e: Error) => toast.error("خطا در ایجاد دیاگرام", { description: e.message }),
  });
}

export function useUpdateDiagram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ diagramId, modelId, ...rest }: { diagramId: string; modelId: string; name?: string; description?: string }) =>
      container.updateDiagram.execute({ diagramId, ...rest }),
    onSuccess: (_, { modelId, diagramId }) => {
      qc.invalidateQueries({ queryKey: MODEL_KEYS.diagrams(modelId) });
      qc.invalidateQueries({ queryKey: DIAGRAM_KEYS.detail(diagramId) });
      toast.success("دیاگرام به‌روزرسانی شد");
    },
    onError: (e: Error) => toast.error("خطا در به‌روزرسانی دیاگرام", { description: e.message }),
  });
}

export function useDeleteDiagram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ diagramId }: { diagramId: string; modelId: string }) =>
      container.deleteDiagram.execute({ diagramId }),
    onSuccess: (_, { modelId }) => {
      qc.invalidateQueries({ queryKey: MODEL_KEYS.diagrams(modelId) });
      toast.success("دیاگرام حذف شد");
    },
    onError: (e: Error) => toast.error("خطا در حذف دیاگرام", { description: e.message }),
  });
}
