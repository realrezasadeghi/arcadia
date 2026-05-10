"use client";

import { useState, useEffect } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import { useCreateProject, useUpdateProject } from "@/presentation/hooks/use-projects";
import type { Project } from "@/domain/entities/project.entity";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
}

export function ProjectFormDialog({ open, onClose, project }: ProjectFormDialogProps) {
  const isEdit = !!project;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (open) {
      setName(project?.name.value ?? "");
      setDescription(project?.description ?? "");
      setNameError("");
    }
  }, [open, project]);

  const create = useCreateProject();
  const update = useUpdateProject();
  const isPending = create.isPending || update.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setNameError("نام پروژه باید حداقل ۳ کاراکتر باشد");
      return;
    }
    setNameError("");

    if (isEdit && project) {
      update.mutate(
        { id: project.id, name, description },
        { onSuccess: onClose }
      );
    } else {
      create.mutate(
        { name, description },
        { onSuccess: onClose }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "ویرایش پروژه" : "پروژه جدید"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "مشخصات پروژه را ویرایش کنید" : "یک پروژه معماری جدید بسازید"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="proj-name">نام پروژه *</Label>
            <Input
              id="proj-name"
              placeholder="مثال: سیستم IFE هواپیما"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="proj-desc">توضیحات</Label>
            <textarea
              id="proj-desc"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
              placeholder="توضیح مختصری از هدف این پروژه..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              انصراف
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "ذخیره تغییرات" : "ایجاد پروژه"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
