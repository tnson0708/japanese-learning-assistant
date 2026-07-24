"use client";

import { useEffect, useState } from "react";
import { Pause, Play, SkipForward, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/speech";

export type PaperDirection = "write" | "read";
type Phase = "prompt" | "reveal";

const TICK_MS = 100;

/** The minimal shape a paper-practice item needs — satisfied by both `Kana` and word entries. */
export interface PaperItem {
  id: string;
  char: string;
  romaji: string;
  /** Vietnamese meaning, shown during the check phase (words only). */
  meaning?: string;
}

interface PaperPracticeSessionProps {
  direction: PaperDirection;
  promptSeconds: number;
  revealSeconds: number;
  autoPlayAudio: boolean;
  /** Returns the next item, given the current item's id (to avoid immediate repeats). */
  pickNext: (excludeId: string) => PaperItem;
  onEnd: () => void;
}

function sizeClass(text: string): string {
  if (text.length <= 2) return "text-7xl";
  if (text.length <= 5) return "text-5xl";
  return "text-3xl";
}

export function PaperPracticeSession({
  direction,
  promptSeconds,
  revealSeconds,
  autoPlayAudio,
  pickNext,
  onEnd,
}: PaperPracticeSessionProps) {
  const [item, setItem] = useState<PaperItem>(() => pickNext(""));
  const [phase, setPhase] = useState<Phase>("prompt");
  const [remainingMs, setRemainingMs] = useState(promptSeconds * 1000);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(1);

  const phaseTotalMs =
    (phase === "prompt" ? promptSeconds : revealSeconds) * 1000;

  // The showing/asking side depends on direction: "write" asks from romaji
  // and reveals the kana/word to check against paper; "read" asks from the
  // kana glyph and reveals the romaji (with audio) to check pronunciation.
  const showingChar =
    (direction === "write" && phase === "reveal") ||
    (direction === "read" && phase === "prompt");

  function goNext() {
    setItem((prev) => pickNext(prev.id));
    setPhase("prompt");
    setRemainingMs(promptSeconds * 1000);
    setRound((r) => r + 1);
  }

  function revealNow() {
    setPhase("reveal");
    setRemainingMs(revealSeconds * 1000);
  }

  // Countdown: reschedule a tick each render until the phase's time is up,
  // then advance to the next phase (or the next card). The transition is
  // deferred inside the timeout callback (not called synchronously from the
  // effect body) so it doesn't cascade renders during commit.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      if (remainingMs <= TICK_MS) {
        if (phase === "prompt") {
          revealNow();
        } else {
          goNext();
        }
      } else {
        setRemainingMs(remainingMs - TICK_MS);
      }
    }, TICK_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, paused, phase]);

  useEffect(() => {
    if (autoPlayAudio && phase === "reveal") {
      speakJapanese(item.char);
    }
  }, [item, phase, autoPlayAudio]);

  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Card {round}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {phase === "prompt"
              ? direction === "write"
                ? "Write it"
                : "Read it"
              : "Check"}
          </span>
          <button
            type="button"
            onClick={onEnd}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="End paper practice"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card px-4 py-10">
        <span
          className={cn(
            "text-center font-medium",
            showingChar ? sizeClass(item.char) : sizeClass(item.romaji)
          )}
        >
          {showingChar ? item.char : item.romaji}
        </span>
        {phase === "reveal" && (
          <div className="mt-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {direction === "write" ? item.romaji : item.char}
              </span>
              <button
                type="button"
                onClick={() => speakJapanese(item.char)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Play pronunciation"
              >
                <Volume2 className="size-4" />
              </button>
            </div>
            {item.meaning && (
              <span className="text-sm text-muted-foreground">{item.meaning}</span>
            )}
          </div>
        )}
      </div>

      <Progress value={((phaseTotalMs - remainingMs) / phaseTotalMs) * 100}>
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span>{phase === "prompt" ? "Time to write" : "Check & compare"}</span>
          <span className="tabular-nums">{seconds}s</span>
        </div>
      </Progress>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setPaused((p) => !p)}>
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          {paused ? "Resume" : "Pause"}
        </Button>
        {phase === "prompt" ? (
          <Button onClick={revealNow}>Reveal</Button>
        ) : (
          <Button onClick={goNext}>
            <SkipForward className="size-4" />
            Next card
          </Button>
        )}
      </div>
      {phase === "prompt" && (
        <button
          type="button"
          onClick={goNext}
          className="self-center text-xs text-muted-foreground hover:text-foreground"
        >
          Skip this card
        </button>
      )}
    </div>
  );
}
