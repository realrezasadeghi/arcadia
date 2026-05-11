"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from "@/presentation/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/presentation/components/ui/form";
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
    if (isEdit && project) {
      update.mutate(
        { id: project.id, name: values.name, description: values.description ?? "" },
        { onSuccess: onClose }
      );
    } else {
      create.mutate(
        { name: values.name, description: values.description ?? "" },
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام پروژه *</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: سیستم IFE هواپیما" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <textarea
                      className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                      placeholder="توضیح مختصری از هدف این پروژه..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
