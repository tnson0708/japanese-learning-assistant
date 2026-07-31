import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Kana } from "@/lib/kana";
import { useLanguage } from "@/lib/language-context";

interface StrokeOrderSvgProps {
  kana: Kana;
  className?: string;
  autoPlay?: boolean;
  showNumbers?: boolean;
  externalPlayKey?: number;
  onReplay?: () => void;
}

const STROKE_DURATION_MS = 450;
const STROKE_GAP_MS = 150;

export function StrokeOrderSvg({
  kana,
  className,
  autoPlay = true,
  showNumbers = true,
  externalPlayKey = 0,
  onReplay,
}: StrokeOrderSvgProps) {
  const { t } = useLanguage();
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
  }, [kana.id, playKey, externalPlayKey, autoPlay]);

  return (
    <div className="flex flex-col items-center">
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
      </div>

      <button
        type="button"
        onClick={() => {
          setPlayKey((k) => k + 1);
          onReplay?.();
        }}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs transition-all duration-150 hover:border-primary/50 hover:bg-accent hover:text-foreground hover:shadow-xs active:scale-95 cursor-pointer"
        title={t("detail_replay_strokes")}
        aria-label={t("detail_replay_strokes")}
      >
        <RotateCcw className="size-3.5 text-primary" />
        <span>{t("detail_replay_strokes")}</span>
        <kbd className="hidden sm:inline-block rounded bg-muted border px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
          B
        </kbd>
      </button>
    </div>
  );
}

