"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";
import { MODEL_KEYS } from "./use-models";

export function useCreateDiagram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { modelId: string; type: string; name: string; description?: string }) =>
      container.createDiagram.execute(input),
    onSuccess: (_, { modelId }) =>
      qc.invalidateQueries({ queryKey: MODEL_KEYS.diagrams(modelId) }),
  });
}
