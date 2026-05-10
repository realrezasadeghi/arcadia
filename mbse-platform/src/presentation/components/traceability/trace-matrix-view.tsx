"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, GitMerge } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { Layer } from "@/domain/value-objects/layer.vo";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { TraceLinkType } from "@/domain/value-objects/relationship-type.vo";
import { useTraceLinks } from "@/presentation/hooks/use-trace-links";
import { useModels, useElements } from "@/presentation/hooks/use-models";
import { useProject } from "@/presentation/hooks/use-projects";
import type { ElementTypeValue } from "@/domain/value-objects/element-type.vo";

interface TraceMatrixViewProps {
  projectId: string;
}

/** زوج‌های لایه‌ای که Trace Matrix برایشان نمایش داده می‌شود */
const LAYER_PAIRS: Array<{ upper: Layer; lower: Layer; label: string }> = [
  { upper: Layer.OA, lower: Layer.SA, label: "OA → SA" },
  { upper: Layer.SA, lower: Layer.LA, label: "SA → LA" },
  { upper: Layer.LA, lower: Layer.PA, label: "LA → PA" },
];

export function TraceMatrixView({ projectId }: TraceMatrixViewProps) {
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: traceLinks, isLoading: tracesLoading } = useTraceLinks(projectId);
  const { data: models } = useModels(projectId);

  const isLoading = projectLoading || tracesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 mt-0.5" asChild>
          <Link href={`/project/${projectId}`}>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">ماتریس Traceability</h1>
          {project && (
            <p className="mt-1 text-sm text-muted-foreground">{project.name.value}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <GitMerge className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{traceLinks?.length ?? 0} پیوند</span>
        </div>
      </div>

      {/* Matrix per layer pair */}
      <div className="flex flex-col gap-8">
        {LAYER_PAIRS.map(({ upper, lower, label }) => (
          <LayerPairMatrix
            key={label}
            upper={upper}
            lower={lower}
            label={label}
            projectId={projectId}
            models={models ?? []}
            traceLinks={traceLinks ?? []}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Per-pair matrix ──────────────────────────────────────────────────────────

interface LayerPairMatrixProps {
  upper: Layer;
  lower: Layer;
  label: string;
  projectId: string;
  models: Array<{ id: string; layer: Layer; name: string }>;
  traceLinks: Array<{
    id: string;
    sourceElementId: string;
    sourceLayer: { value: string };
    targetElementId: string;
    targetLayer: { value: string };
    type: { value: string };
  }>;
}

function LayerPairMatrix({ upper, lower, label, models, traceLinks }: LayerPairMatrixProps) {
  const upperModel = models.find((m) => upper.equals(m.layer));
  const lowerModel = models.find((m) => lower.equals(m.layer));

  const { data: upperElements } = useElements(upperModel?.id ?? "");
  const { data: lowerElements } = useElements(lowerModel?.id ?? "");

  // Build set of traced pairs: "sourceId|targetId"
  const tracedPairs = useMemo(() => {
    const pairs = new Set<string>();
    for (const tr of traceLinks) {
      const srcLayer = tr.sourceLayer.value;
      const tgtLayer = tr.targetLayer.value;
      if (srcLayer === upper.value && tgtLayer === lower.value) {
        pairs.add(`${tr.sourceElementId}|${tr.targetElementId}`);
      } else if (srcLayer === lower.value && tgtLayer === upper.value) {
        pairs.add(`${tr.targetElementId}|${tr.sourceElementId}`);
      }
    }
    return pairs;
  }, [traceLinks, upper, lower]);

  const upperRows = upperElements ?? [];
  const lowerCols = lowerElements ?? [];

  if (upperRows.length === 0 && lowerCols.length === 0) {
    return (
      <section>
        <SectionHeader upper={upper} lower={lower} label={label} count={0} />
        <p className="text-sm text-muted-foreground">هیچ المنتی در این دو لایه وجود ندارد.</p>
      </section>
    );
  }

  const pairCount = [...tracedPairs].length;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader upper={upper} lower={lower} label={label} count={pairCount} />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="sticky right-0 z-10 bg-muted/60 border-b border-l border-border px-3 py-2 text-right font-medium min-w-[140px]">
                {upper.labelFa} \ {lower.labelFa}
              </th>
              {lowerCols.map((el) => (
                <th
                  key={el.id}
                  className="border-b border-l border-border px-2 py-2 font-normal text-muted-foreground min-w-[100px] max-w-[140px]"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <ElementDot elementType={el.type.value as ElementTypeValue} />
                    <span className="truncate max-w-[90px] text-center">{el.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upperRows.map((rowEl, ri) => (
              <tr key={rowEl.id} className={ri % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="sticky right-0 z-10 border-b border-l border-border px-3 py-2 font-medium"
                  style={{ backgroundColor: ri % 2 === 0 ? "hsl(var(--background))" : "hsl(var(--muted) / 0.2)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <ElementDot elementType={rowEl.type.value as ElementTypeValue} />
                    <span className="truncate max-w-[110px]">{rowEl.name}</span>
                  </div>
                </td>
                {lowerCols.map((colEl) => {
                  const hasTrace = tracedPairs.has(`${rowEl.id}|${colEl.id}`);
                  // Find the trace link to show type
                  const traceLinkForCell = traceLinks.find(
                    (tr) =>
                      (tr.sourceElementId === rowEl.id && tr.targetElementId === colEl.id) ||
                      (tr.sourceElementId === colEl.id && tr.targetElementId === rowEl.id)
                  );
                  const traceSpec = traceLinkForCell
                    ? TraceLinkType.from(traceLinkForCell.type.value).visualSpec
                    : null;

                  return (
                    <td
                      key={colEl.id}
                      className="border-b border-l border-border px-2 py-2 text-center"
                    >
                      {hasTrace && traceSpec ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: traceSpec.strokeColor }}
                            title={traceSpec.labelFa}
                          />
                          <span className="text-[9px] text-muted-foreground">{traceSpec.labelFa}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SectionHeader({
  upper, lower, label, count,
}: { upper: Layer; lower: Layer; label: string; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <LayerPill layer={upper} />
        <span className="text-muted-foreground">→</span>
        <LayerPill layer={lower} />
      </div>
      <Badge variant="secondary" className="text-[10px]">{count} پیوند</Badge>
    </div>
  );
}

function LayerPill({ layer }: { layer: Layer }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium border"
      style={{
        backgroundColor: `hsl(var(--layer-${layer.value.toLowerCase()}-muted))`,
        color: `hsl(var(--layer-${layer.value.toLowerCase()}-foreground))`,
        borderColor: `hsl(var(--layer-${layer.value.toLowerCase()}))`,
      }}
    >
      {layer.value}
    </span>
  );
}

function ElementDot({ elementType }: { elementType: ElementTypeValue }) {
  try {
    const spec = ElementType.from(elementType).visualSpec;
    return (
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm border shrink-0"
        style={{ backgroundColor: spec.fillColor, borderColor: spec.strokeColor }}
      />
    );
  } catch {
    return <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted" />;
  }
}
