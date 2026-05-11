"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Form } from "@/presentation/components/ui/form";
import { FieldInput, FieldTextarea } from "@/presentation/components/ui/form-fields";
import { useCreateProject, useUpdateProject } from "@/presentation/hooks/use-projects";
import { projectFormSchema, type ProjectFormValues } from "@/lib/schemas/project.schema";
import type { Project } from "@/domain/entities/project.entity";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
}

export function ProjectFormDialog({ open, onClose, project }: ProjectFormDialogProps) {
  const isEdit = !!project;
  const create = useCreateProject();
  const update = useUpdateProject();
  const isPending = create.isPending || update.isPending;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: project?.name.value ?? "",
        description: project?.description ?? "",
      });
    }
  }, [open, project, form]);

  function onSubmit(values: ProjectFormValues) {
    const payload = { name: values.name, description: values.description ?? "" };
    if (isEdit && project) {
      update.mutate({ id: project.id, ...payload }, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
            <FieldInput
              control={form.control}
              name="name"
              label="نام پروژه *"
              placeholder="مثال: سیستم IFE هواپیما"
              autoFocus
            />
            <FieldTextarea
              control={form.control}
              name="description"
              label="توضیحات"
              placeholder="توضیح مختصری از هدف این پروژه..."
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                انصراف
              </Button>
              <Button type="submit" loading={isPending}>
                {isEdit ? "ذخیره تغییرات" : "ایجاد پروژه"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
