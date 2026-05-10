"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";

export const PROJECT_KEYS = {
  all:    () => ["projects"] as const,
  detail: (id: string) => ["projects", id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: PROJECT_KEYS.all(),
    queryFn: () => container.getProjects.execute(),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => container.repos.project.findById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description: string }) =>
      container.createProject.execute(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECT_KEYS.all() }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name?: string; description?: string }) =>
      container.updateProject.execute(id, input),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all() });
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => container.deleteProject.execute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECT_KEYS.all() }),
  });
}
