"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Volume2 } from "lucide-react";
import type { PracticeCardItem } from "@/app/practice/page";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface PracticePipCardProps {
  item: PracticeCardItem;
  phase: "prompt" | "reveal";
  progressPercent: number;
  remainingSeconds: number;
  paused: boolean;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onToggleReveal: () => void;
}

/** Compact flashcard rendered inside the Document Picture-in-Picture window. */
export function PracticePipCard({
  item,
  phase,
  progressPercent,
  remainingSeconds,
  paused,
  position,
  total,
  onPrev,
  onNext,
  onTogglePause,
  onToggleReveal,
}: PracticePipCardProps) {
  const revealed = phase === "reveal";

  return (
    <div className="flex h-screen flex-col gap-3 p-3 select-none">
      {/* Status bar */}
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-600 dark:text-red-400 uppercase">
          {item.typeLabel}
        </span>
        <span className="font-mono text-muted-foreground">
          {position} / {total} • {remainingSeconds.toFixed(1)}s
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-100 ease-linear",
            revealed ? "bg-emerald-500" : "bg-red-600"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Character — click to flip */}
      <button
        type="button"
        onClick={onToggleReveal}
        className="flex flex-1 min-h-0 items-center justify-center rounded-2xl border-2 border-dashed border-red-500/30 bg-muted/20 cursor-pointer"
        title="Lật thẻ"
      >
        <span
          className={cn(
            "font-kanji-mincho text-foreground leading-none whitespace-nowrap",
            item.char.length === 1 && "text-[min(40vw,30vh)]",
            item.char.length === 2 && "text-[min(28vw,24vh)]",
            item.char.length >= 3 && "text-[min(20vw,18vh)]"
          )}
        >
          {item.char}
        </span>
      </button>

      {/* Result */}
      <div
        className={cn(
          "flex flex-col gap-1 rounded-xl border p-2.5 transition-all",
          revealed ? "border-emerald-500/50 bg-emerald-500/5" : "border-border"
        )}
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={cn(
              "text-xl font-black transition-all",
              revealed ? "text-red-600 dark:text-red-400" : "text-foreground/15 blur-xs"
            )}
          >
            {item.mainReading}
          </span>
          {item.subReading && (
            <span className={cn("text-xs font-bold text-foreground", !revealed && "opacity-15 blur-xs")}>
              {item.subReading}
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-xs text-muted-foreground leading-snug line-clamp-2",
            !revealed && "opacity-15 blur-xs"
          )}
        >
          {item.meaningVi}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex size-9 items-center justify-center rounded-lg border bg-background hover:bg-accent cursor-pointer"
          title="Chữ trước (←)"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => speakJapanese(item.char)}
          className="flex size-9 items-center justify-center rounded-lg border border-red-600/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
          title="Nghe phát âm"
        >
          <Volume2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={onTogglePause}
          className="flex flex-1 h-9 items-center justify-center gap-1.5 rounded-lg border bg-background text-xs font-bold hover:bg-accent cursor-pointer"
          title="Tạm dừng / Tiếp tục (Space)"
        >
          {paused ? (
            <Play className="size-3.5 text-amber-500 fill-amber-500" />
          ) : (
            <Pause className="size-3.5 text-muted-foreground" />
          )}
          <span>{paused ? "Tiếp tục" : "Tạm dừng"}</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex size-9 items-center justify-center rounded-lg border bg-background hover:bg-accent cursor-pointer"
          title="Thẻ tiếp theo (→)"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
