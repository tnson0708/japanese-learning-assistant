"use client";

import type { ScoreResult } from "@/lib/scoring";

const BOX = 200;

function colorForSimilarity(similarity: number, missing: boolean): string {
  if (missing) return "#dc2626";
  if (similarity >= 0.75) return "#16a34a";
  if (similarity >= 0.5) return "#d97706";
  return "#dc2626";
}

function pointsAttr(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x * BOX},${p.y * BOX}`).join(" ");
}

export function ComparisonOverlay({ result }: { result: ScoreResult }) {
  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${BOX} ${BOX}`}
        className="w-full rounded-xl border bg-white dark:bg-neutral-900"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {result.referenceNorm.map((points, i) => {
            const feedback = result.strokeFeedback[i];
            const missing = !feedback || feedback.userIndex === null;
            return (
              <polyline
                key={`ref-${i}`}
                points={pointsAttr(points)}
                stroke={colorForSimilarity(feedback?.similarity ?? 0, missing)}
                strokeWidth={5}
                strokeDasharray={missing ? "6 5" : undefined}
                opacity={0.55}
              />
            );
          })}
          {result.userNorm.map((points, i) => (
            <polyline
              key={`user-${i}`}
              points={pointsAttr(points)}
              stroke="#1d4ed8"
              strokeWidth={3}
            />
          ))}
        </g>
      </svg>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Legend swatch="#1d4ed8" label="Your stroke" />
        <Legend swatch="#16a34a" label="Good match" />
        <Legend swatch="#d97706" label="Needs work" />
        <Legend swatch="#dc2626" label="Wrong / missing" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block size-2.5 rounded-full"
        style={{ backgroundColor: swatch }}
      />
      {label}
    </span>
  );
}
