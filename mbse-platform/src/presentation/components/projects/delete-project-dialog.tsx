"use client";

import { Button } from "@/presentation/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import { useDeleteProject } from "@/presentation/hooks/use-projects";
import type { Project } from "@/domain/entities/project.entity";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

export function DeleteProjectDialog({ open, onClose, project }: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();

  function handleConfirm() {
    if (!project) return;
    deleteProject.mutate(project.id, { onSuccess: onClose });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>حذف پروژه</DialogTitle>
          <DialogDescription>
            آیا از حذف پروژه{" "}
            <span className="font-semibold text-foreground">«{project?.name.value}»</span>{" "}
            مطمئن هستید؟ این عمل برگشت‌پذیر نیست.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteProject.isPending}>
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={deleteProject.isPending}
          >
            حذف پروژه
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
