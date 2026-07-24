"use client";

import { useEffect, useState } from "react";
import { Pause, Play, SkipForward, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { randomKana, type Kana, type Script } from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";

export type PaperDirection = "write" | "read";
type Phase = "prompt" | "reveal";

const TICK_MS = 100;

interface PaperPracticeSessionProps {
  scope: Script | "both";
  direction: PaperDirection;
  promptSeconds: number;
  revealSeconds: number;
  onEnd: () => void;
}

function pickNext(scope: Script | "both", excludeId: string): Kana {
  let candidate = randomKana(scope);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomKana(scope);
  }
  return candidate;
}

export function PaperPracticeSession({
  scope,
  direction,
  promptSeconds,
  revealSeconds,
  onEnd,
}: PaperPracticeSessionProps) {
  const [kana, setKana] = useState<Kana>(() => randomKana(scope));
  const [phase, setPhase] = useState<Phase>("prompt");
  const [remainingMs, setRemainingMs] = useState(promptSeconds * 1000);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(1);

  const phaseTotalMs =
    (phase === "prompt" ? promptSeconds : revealSeconds) * 1000;

  // The showing/asking side depends on direction: "write" asks from romaji
  // and reveals the kana to check against paper; "read" asks from the kana
  // glyph and reveals the romaji (with audio) to check pronunciation.
  const showingKana =
    (direction === "write" && phase === "reveal") ||
    (direction === "read" && phase === "prompt");

  function goNext() {
    setKana((prev) => pickNext(scope, prev.id));
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
    if (direction === "read" && phase === "reveal") {
      speakJapanese(kana.char);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kana, phase]);

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

      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card py-10">
        <span
          className={cn(
            "font-medium",
            showingKana ? "text-7xl" : "text-6xl"
          )}
        >
          {showingKana ? kana.char : kana.romaji}
        </span>
        {phase === "reveal" && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {direction === "write" ? kana.romaji : kana.char}
            </span>
            <button
              type="button"
              onClick={() => speakJapanese(kana.char)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Play pronunciation"
            >
              <Volume2 className="size-4" />
            </button>
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
