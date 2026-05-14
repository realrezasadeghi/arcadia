"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";
import type { Layer } from "@/domain/value-objects/layer.vo";

export const MODEL_KEYS = {
  byProject: (projectId: string) => ["models", projectId] as const,
  elements:  (modelId: string)   => ["elements", modelId] as const,
  diagrams:  (modelId: string)   => ["diagrams", modelId] as const,
};

export function useModels(projectId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.byProject(projectId),
    queryFn: () => container.repos.model.findModelsByProject(projectId),
    enabled: !!projectId,
  });
}

export function useElements(modelId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.elements(modelId),
    queryFn: () => container.repos.model.findElementsByModel(modelId),
    enabled: !!modelId,
  });
}

export function useDiagrams(modelId: string) {
  return useQuery({
    queryKey: MODEL_KEYS.diagrams(modelId),
    queryFn: () => container.repos.diagram.findByModel(modelId),
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
  });
}

export function useCreateElement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { modelId: string; type: string; name: string; description?: string }) =>
      container.createElement.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) }),
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
      qc.invalidateQueries({ queryKey: MODEL_KEYS.elements(modelId) }),
  });
}
