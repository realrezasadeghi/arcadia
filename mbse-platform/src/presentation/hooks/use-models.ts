"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";
import { toast } from "sonner";
import type { Layer } from "@/domain/value-objects/layer.vo";

export const MODEL_KEYS = {
  byProject:     (projectId: string) => ["models", projectId] as const,
  detail:        (modelId: string)   => ["models", "detail", modelId] as const,
  elements:      (modelId: string)   => ["elements", modelId] as const,
  relationships: (modelId: string)   => ["relationships", modelId] as const,
  diagrams:      (modelId: string)   => ["diagrams", modelId] as const,
};

export function useModels(projectId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.byProject(projectId),
    queryFn: () => container.getModelsByProject.execute({ projectId }),
    enabled: !!projectId,
  });
}

export function useModel(modelId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.detail(modelId),
    queryFn: () => container.getModel.execute({ modelId }),
    enabled: !!modelId,
  });
}

export function useElements(modelId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.elements(modelId),
    queryFn: () => container.getElementsByModel.execute({ modelId }),
    enabled: !!modelId,
  });
}

export function useRelationships(modelId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.relationships(modelId),
    queryFn: () => container.getRelationshipsByModel.execute({ modelId }),
    enabled: !!modelId,
  });
}

export function useDiagrams(modelId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.diagrams(modelId),
    queryFn: () => container.getDiagramsByModel.execute({ modelId }),
    enabled: !!modelId,
  });
}

export function useCreateModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { projectId: string; layer: Layer; name: string; description?: string }) =>
      container.createModel.execute(input),
    onSuccess: (_, { projectId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.byProject(projectId) }),
    onError: (e: Error) => toast.error("خطا در ایجاد مدل", { description: e.message }),
  });
}

export function useUpdateModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, ...rest }: { modelId: string; name?: string; description?: string }) =>
      container.updateModel.execute({ modelId, ...rest }),
    onSuccess: (model) => {
      qc.invalidateQueries({ queryKey: MODEL_KEYS.detail(model.id) });
      qc.invalidateQueries({ queryKey: MODEL_KEYS.byProject(model.projectId) });
      toast.success("مدل به‌روزرسانی شد");
    },
    onError: (e: Error) => toast.error("خطا در به‌روزرسانی مدل", { description: e.message }),
  });
}

export function useDeleteModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, projectId }: { modelId: string; projectId: string }) =>
      container.deleteModel.execute({ modelId }),
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: MODEL_KEYS.byProject(projectId) });
      toast.success("مدل حذف شد");
    },
    onError: (e: Error) => toast.error("خطا در حذف مدل", { description: e.message }),
  });
}

export function useCreateElement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { modelId: string; type: string; name: string; description?: string }) =>
      container.createElement.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) }),
    onError: (e: Error) => toast.error("خطا در ایجاد المنت", { description: e.message }),
  });
}

export function useUpdateElement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { elementId: string; modelId: string; name?: string; description?: string; properties?: Record<string, unknown> }) =>
      container.updateElement.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) }),
    onError: (e: Error) => toast.error("خطا در به‌روزرسانی المنت", { description: e.message }),
  });
}

export function useDeleteElement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ elementId }: { elementId: string; modelId: string }) =>
      container.deleteElement.execute({ elementId }),
    onSuccess: (_, { modelId }) => {
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) });
      qc.invalidateQueries({ queryKey: MODEL_KEYS.relationships(modelId) });
      toast.success("المنت حذف شد");
    },
    onError: (e: Error) => toast.error("خطا در حذف المنت", { description: e.message }),
  });
}

export function useConnectElements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      modelId: string;
      sourceElementId: string;
      targetElementId: string;
      relationshipType: string;
      name?: string;
    }) => container.connectElements.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.relationships(modelId) }),
    onError: (e: Error) => toast.error("خطا در اتصال المنت‌ها", { description: e.message }),
  });
}

export function useUpdateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { relationshipId: string; modelId: string; name?: string; description?: string }) =>
      container.updateRelationship.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.relationships(modelId) }),
    onError: (e: Error) => toast.error("خطا در به‌روزرسانی رابطه", { description: e.message }),
  });
}

export function useDeleteRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ relationshipId, modelId }: { relationshipId: string; modelId: string }) =>
      container.deleteRelationship.execute({ relationshipId, modelId }),
    onSuccess: (_, { modelId }) => {
      qc.invalidateQueries({ queryKey: MODEL_KEYS.relationships(modelId) });
      toast.success("رابطه حذف شد");
    },
    onError: (e: Error) => toast.error("خطا در حذف رابطه", { description: e.message }),
  });
}
