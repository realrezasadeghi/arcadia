"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/api/service-container";
import { toast } from "sonner";
import type { ProjectRole } from "@/domain/entities/project.entity";

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
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all() });
      toast.success("پروژه ایجاد شد", { description: p.name.value });
    },
    onError: () => toast.error("خطا در ایجاد پروژه"),
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
      toast.success("پروژه به‌روزرسانی شد");
    },
    onError: () => toast.error("خطا در به‌روزرسانی پروژه"),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => container.deleteProject.execute(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all() });
      toast.success("پروژه حذف شد");
    },
    onError: () => toast.error("خطا در حذف پروژه"),
  });
}

// ─── Member Management ────────────────────────────────────────────────────────

export function useAddMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, userId, role }: { projectId: string; userId: string; role: Exclude<ProjectRole, "OWNER"> }) =>
      container.repos.project.addMember(projectId, userId, role),
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      toast.success("عضو اضافه شد");
    },
    onError: (e: Error) => toast.error("خطا در افزودن عضو", { description: e.message }),
  });
}

export function useChangeMemberRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, userId, role }: { projectId: string; userId: string; role: Exclude<ProjectRole, "OWNER"> }) =>
      container.repos.project.changeMemberRole(projectId, userId, role),
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      toast.success("نقش عضو تغییر کرد");
    },
    onError: (e: Error) => toast.error("خطا در تغییر نقش", { description: e.message }),
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      container.repos.project.removeMember(projectId, userId),
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      toast.success("عضو حذف شد");
    },
    onError: (e: Error) => toast.error("خطا در حذف عضو", { description: e.message }),
  });
}
