"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, ArrowLeft, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import type { Project } from "@/domain/entities/project.entity";

const LAYER_BADGES = [
  { label: "OA", variant: "oa" as const },
  { label: "SA", variant: "sa" as const },
  { label: "LA", variant: "la" as const },
  { label: "PA", variant: "pa" as const },
];

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const memberCount = project.members.length;
  const date = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric", month: "short", day: "numeric"
  }).format(project.updatedAt);

  return (
    <Card className="group flex flex-col hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{project.name.value}</h3>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Pencil className="h-4 w-4" /> ویرایش
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(project)}
              >
                <Trash2 className="h-4 w-4" /> حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Layer Badges */}
        <div className="flex gap-1.5 flex-wrap mt-2">
          {LAYER_BADGES.map((b) => (
            <Badge key={b.label} variant={b.variant} className="text-[10px] px-1.5 py-0">
              {b.label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {memberCount} عضو
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>

        <Link href={`/project/${project.id}`}>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            باز کردن
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
