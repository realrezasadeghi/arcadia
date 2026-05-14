"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { container } from "@/infrastructure/api/service-container";

export const TRACE_KEYS = {
  byProject: (projectId: string) => ["trace-links", "project", projectId] as const,
  byElement: (elementId: string) => ["trace-links", "element", elementId] as const,
};

export function useTraceLinks(projectId: string) {
  return useQuery({
    queryKey: TRACE_KEYS.byProject(projectId),
    queryFn: () => container.repos.traceLink.findByProject(projectId),
    enabled: !!projectId,
  });
}

export function useElementTraces(elementId: string) {
  return useQuery({
    queryKey: TRACE_KEYS.byElement(elementId),
    queryFn: () => container.repos.traceLink.findByElement(elementId),
    enabled: !!elementId,
  });
}

export function useCreateTraceLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      projectId: string;
      type: string;
      sourceElementId: string;
      sourceLayer: string;
      targetElementId: string;
      targetLayer: string;
      description?: string;
    }) => container.createTraceLink.execute(input),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: TRACE_KEYS.byProject(result.projectId) });
      qc.invalidateQueries({ queryKey: TRACE_KEYS.byElement(result.sourceElementId) });
      qc.invalidateQueries({ queryKey: TRACE_KEYS.byElement(result.targetElementId) });
      toast.success("Trace Link ایجاد شد");
    },
    onError: (e: Error) => toast.error("خطا در ایجاد Trace Link", { description: e.message }),
  });
}

export function useDeleteTraceLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string; sourceElementId: string; targetElementId: string }) =>
      container.deleteTraceLink.execute({ id }),
    onSuccess: (_, { projectId, sourceElementId, targetElementId }) => {
      qc.invalidateQueries({ queryKey: TRACE_KEYS.byProject(projectId) });
      qc.invalidateQueries({ queryKey: TRACE_KEYS.byElement(sourceElementId) });
      qc.invalidateQueries({ queryKey: TRACE_KEYS.byElement(targetElementId) });
      toast.success("Trace Link حذف شد");
    },
    onError: (e: Error) => toast.error("خطا در حذف Trace Link", { description: e.message }),
  });
}
