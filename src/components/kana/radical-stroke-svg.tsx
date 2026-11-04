"use client";

import { useEffect, useRef } from "react";
import type { KanjiRadical } from "@/lib/kanji-radicals";

interface RadicalStrokeSvgProps {
  radical: KanjiRadical;
  className?: string;
  externalPlayKey?: number;
}

const STROKE_DURATION_MS = 500;
const STROKE_GAP_MS = 150;

export function RadicalStrokeSvg({
  radical,
  className,
  externalPlayKey = 0,
}: RadicalStrokeSvgProps) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.transition = "none";
      // Force reflow
      void el.getBoundingClientRect();
      el.style.transition = `stroke-dashoffset ${STROKE_DURATION_MS}ms ease-in-out`;
      el.style.transitionDelay = `${i * (STROKE_DURATION_MS + STROKE_GAP_MS)}ms`;
      el.style.strokeDashoffset = "0";
    });
  }, [radical.id, externalPlayKey]);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-label={`Stroke order for ${radical.char}`}
      >
        {/* 3x3 practice grid (9 squares) */}
        <g className="stroke-muted-foreground/40" strokeWidth={0.8} strokeDasharray="3 3">
          {[100 / 3, 200 / 3].map((p) => (
            <g key={p}>
              <line x1={p} y1={0} x2={p} y2={100} />
              <line x1={0} y1={p} x2={100} y2={p} />
            </g>
          ))}
        </g>

        {/* Animated stroke paths */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          {radical.strokePaths.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={d}
            />
          ))}
        </g>

        {/* Stroke Order Numbers */}
        <g className="fill-muted-foreground stroke-background" fontSize={7} fontWeight="bold" strokeWidth={2.2} strokeLinejoin="round" paintOrder="stroke">
          {(() => {
            const placed: [number, number][] = [];
            return radical.strokePaths.map((d, i) => {
            const start = d.match(/M\s*(-?[\d.]+)[, ]\s*(-?[\d.]+)/);
            if (!start) return null;
            let lx = Math.max(4, parseFloat(start[1]) - 6);
            const ly = Math.max(10, parseFloat(start[2]) - 2);
            // Strokes sharing a start point (e.g. 口-style frames): shift label right
            while (placed.some(([px, py]) => Math.abs(px - lx) < 5 && Math.abs(py - ly) < 6)) lx += 6;
            placed.push([lx, ly]);
            return (
              <text key={i} x={lx} y={ly}>
                {i + 1}
              </text>
            );
            });
          })()}
        </g>
      </svg>
    </div>
  );
}
