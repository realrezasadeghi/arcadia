"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LayoutDashboard, Loader2, FileBarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { CreateDiagramDialog } from "./create-diagram-dialog";
import { useModels, useDiagrams, useCreateModel } from "@/presentation/hooks/use-models";
import { Layer } from "@/domain/value-objects/layer.vo";

const LAYER_VARIANT = {
  OA: "oa", SA: "sa", LA: "la", PA: "pa",
} as const;

interface LayerCardProps {
  layer: Layer;
  projectId: string;
}

export function LayerCard({ layer, projectId }: LayerCardProps) {
  const [showCreateDiagram, setShowCreateDiagram] = useState(false);

  const { data: models, isLoading: modelsLoading } = useModels(projectId);
  const model = models?.find((m) => m.layer.value === layer.value);

  const { data: diagrams, isLoading: diagramsLoading } = useDiagrams(model?.id ?? "");
  const createModel = useCreateModel();

  async function ensureModelAndOpenDiagram() {
    if (!model) {
      await createModel.mutateAsync({
        projectId,
        layer,
        name: `${layer.labelFa}`,
      });
    }
    setShowCreateDiagram(true);
  }

  const variant = LAYER_VARIANT[layer.value];
  const isLoading = modelsLoading || createModel.isPending;

  return (
    <>
      <Card className={`border-r-4`} style={{ borderRightColor: `hsl(var(--layer-${layer.value.toLowerCase()}))` }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={variant} className="font-mono text-xs">
                {layer.value}
              </Badge>
              <span className="text-sm font-medium">{layer.labelFa}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 text-xs"
              onClick={ensureModelAndOpenDiagram}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              دیاگرام جدید
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {diagramsLoading && (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال بارگذاری...
            </div>
          )}

          {!diagramsLoading && (!diagrams || diagrams.length === 0) && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <LayoutDashboard className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                هنوز دیاگرامی ندارید
              </p>
            </div>
          )}

          {diagrams && diagrams.length > 0 && (
            <div className="flex flex-col gap-1">
              {diagrams.map((diag) => (
                <Link
                  key={diag.id}
                  href={`/project/${projectId}/diagram/${diag.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <FileBarChart2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">{diag.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{diag.type.value}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {model && (
        <CreateDiagramDialog
          open={showCreateDiagram}
          onClose={() => setShowCreateDiagram(false)}
          modelId={model.id}
          layer={layer}
        />
      )}
    </>
  );
}
