"use client";

import { useEffect, useRef, useState } from "react";
import type { Kana } from "@/lib/kana";

interface StrokeOrderSvgProps {
  kana: Kana;
  className?: string;
  autoPlay?: boolean;
  showNumbers?: boolean;
}

const STROKE_DURATION_MS = 450;
const STROKE_GAP_MS = 150;

export function StrokeOrderSvg({
  kana,
  className,
  autoPlay = true,
  showNumbers = true,
}: StrokeOrderSvgProps) {
  const [playKey, setPlayKey] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const strokes = [...kana.strokes].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!autoPlay) return;
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.transition = "none";
      // Force reflow so the transition below reliably restarts on replay.
      void el.getBoundingClientRect();
      el.style.transition = `stroke-dashoffset ${STROKE_DURATION_MS}ms ease-in-out`;
      el.style.transitionDelay = `${i * (STROKE_DURATION_MS + STROKE_GAP_MS)}ms`;
      el.style.strokeDashoffset = "0";
    });
  }, [kana.id, playKey, autoPlay]);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${kana.viewBox} ${kana.viewBox}`}
        className="h-full w-full"
        role="img"
        aria-label={`Stroke order for ${kana.char}`}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {strokes.map((s, i) => (
            <path
              key={s.order}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={s.d}
            />
          ))}
        </g>
        {showNumbers && (
          <g fill="#94a3b8" fontSize={8}>
            {strokes.map((s, i) => {
              const start = s.d.match(/M\s*(-?[\d.]+)[, ]\s*(-?[\d.]+)/);
              if (!start) return null;
              const x = parseFloat(start[1]);
              const y = parseFloat(start[2]);
              return (
                <text key={s.order} x={x - 8} y={y - 2}>
                  {i + 1}
                </text>
              );
            })}
          </g>
        )}
      </svg>
      <button
        type="button"
        onClick={() => setPlayKey((k) => k + 1)}
        className="mt-2 text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
      >
        Replay stroke order
      </button>
    </div>
  );
}
