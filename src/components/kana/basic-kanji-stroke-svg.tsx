"use client";

import { useEffect, useRef } from "react";
import type { BasicKanjiWord } from "@/lib/basic-kanji";

interface BasicKanjiStrokeSvgProps {
  kanji: BasicKanjiWord;
  className?: string;
  externalPlayKey?: number;
}

const STROKE_DURATION_MS = 500;
const STROKE_GAP_MS = 150;

export function BasicKanjiStrokeSvg({
  kanji,
  className,
  externalPlayKey = 0,
}: BasicKanjiStrokeSvgProps) {
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
  }, [kanji.id, externalPlayKey]);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-label={`Stroke order for ${kanji.char}`}
      >
        {/* Practice grid lines (田字格) */}
        <g stroke="#cbd5e1" strokeWidth={0.8} strokeDasharray="3 3">
          <line x1={50} y1={0} x2={50} y2={100} />
          <line x1={0} y1={50} x2={100} y2={50} />
          <line x1={0} y1={0} x2={100} y2={100} opacity={0.4} />
          <line x1={100} y1={0} x2={0} y2={100} opacity={0.4} />
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
          {kanji.strokePaths.map((d, i) => (
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
        <g fill="#64748b" fontSize={7} fontWeight="bold">
          {kanji.strokePaths.map((d, i) => {
            const start = d.match(/M\s*(-?[\d.]+)[, ]\s*(-?[\d.]+)/);
            if (!start) return null;
            const x = parseFloat(start[1]);
            const y = parseFloat(start[2]);
            return (
              <text key={i} x={Math.max(4, x - 6)} y={Math.max(10, y - 2)}>
                {i + 1}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
