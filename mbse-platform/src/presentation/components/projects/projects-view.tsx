"use client";

import { useState } from "react";
import { Plus, Search, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { ProjectCard } from "./project-card";
import { ProjectFormDialog } from "./project-form-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { useProjects } from "@/presentation/hooks/use-projects";
import type { Project } from "@/domain/entities/project.entity";

export function ProjectsView() {
  const { data: projects, isLoading, isError } = useProjects();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const filtered = projects?.filter((p) =>
    p.name.value.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  function handleEdit(project: Project) {
    setEditTarget(project);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditTarget(undefined);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">پروژه‌ها</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            مدل‌های معماری MBSE خود را مدیریت کنید
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          پروژه جدید
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در پروژه‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-destructive">خطا در بارگذاری پروژه‌ها</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">
              {search ? "پروژه‌ای یافت نشد" : "هنوز پروژه‌ای ندارید"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search
                ? "عبارت جستجو را تغییر دهید"
                : "اولین پروژه معماری خود را بسازید"}
            </p>
          </div>
          {!search && (
            <Button onClick={() => setFormOpen(true)} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              ایجاد پروژه
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <ProjectFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        project={editTarget}
      />
      <DeleteProjectDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        project={deleteTarget}
      />
    </div>
  );
}
