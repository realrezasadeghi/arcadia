"use client";

import Link from "next/link";
import { ArrowRight, Users, Loader2 } from "lucide-react";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { LayerCard } from "./layer-card";
import { useProject } from "@/presentation/hooks/use-projects";
import { Layer } from "@/domain/value-objects/layer.vo";

interface ProjectDetailViewProps {
  projectId: string;
}

const LAYERS = Layer.all();

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm text-destructive">پروژه یافت نشد</p>
        <Button variant="outline" asChild>
          <Link href="/projects">بازگشت به پروژه‌ها</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 mt-0.5" asChild>
          <Link href="/projects">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{project.name.value}</h1>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {project.members.length} عضو
            </span>
            {project.members.map((m) => (
              <Badge key={m.userId} variant="secondary" className="text-[10px] px-1.5 py-0">
                {m.role === "OWNER" ? "مالک" : m.role === "EDITOR" ? "ویرایشگر" : "بیننده"}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Arcadia Layer Chain */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {LAYERS.map((layer, i) => (
          <div key={layer.value} className="flex items-center gap-1.5 shrink-0">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium border"
              style={{
                backgroundColor: `hsl(var(--layer-${layer.value.toLowerCase()}-muted))`,
                color: `hsl(var(--layer-${layer.value.toLowerCase()}-foreground))`,
                borderColor: `hsl(var(--layer-${layer.value.toLowerCase()}))`,
              }}
            >
              {layer.value} — {layer.labelFa}
            </span>
            {i < LAYERS.length - 1 && (
              <span className="text-muted-foreground text-sm">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Layer Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {LAYERS.map((layer) => (
          <LayerCard key={layer.value} layer={layer} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}
