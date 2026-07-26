"use client";

import { useRef, useState } from "react";
import { Volume2, RotateCcw, Undo2, ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HandwritingCanvas,
  type HandwritingCanvasHandle,
} from "@/components/practice/handwriting-canvas";
import { ComparisonOverlay } from "@/components/practice/comparison-overlay";
import { scoreAttempt, type ScoreResult } from "@/lib/scoring";
import { randomKana, type Kana, type KanaSection, type Script } from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";

type Mode = "copy" | "recall";
type Scope = Script | "both";

interface PracticeSessionProps {
  initialKana: Kana;
  scope: Scope;
  section?: KanaSection;
  onEnd?: () => void;
}

export function PracticeSession({ initialKana, scope, section = "all", onEnd }: PracticeSessionProps) {
  const [kana, setKana] = useState(initialKana);
  const [mode, setMode] = useState<Mode>("copy");
  const [hintEnabled, setHintEnabled] = useState(true);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  function check() {
    const strokes = canvasRef.current?.getStrokes() ?? [];
    if (strokes.length === 0) return;
    setResult(scoreAttempt(strokes, kana));
  }

  function next() {
    let candidate = randomKana(scope, section);
    // Avoid immediate repeats when the pool allows it.
    for (let i = 0; i < 5 && candidate.id === kana.id; i++) {
      candidate = randomKana(scope, section);
    }
    setKana(candidate);
    setResult(null);
    setHasInk(false);
    canvasRef.current?.clear();
  }


  function clear() {
    canvasRef.current?.clear();
    setResult(null);
    setHasInk(false);
  }

  function undo() {
    canvasRef.current?.undo();
    setResult(null);
  }

  const revealChar = mode === "copy" || result !== null;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-full border p-0.5 text-sm">
          {(["copy", "recall"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setResult(null);
              }}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-colors text-xs sm:text-sm",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "copy" ? "Copy" : "Recall"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setHintEnabled((h) => !h)}
            disabled={mode === "recall"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              hintEnabled && mode === "copy"
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={
              mode === "recall"
                ? "Hint is unavailable in Recall mode"
                : "Toggle the faint stroke guide on the canvas"
            }
          >
            {hintEnabled ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            Hint
          </button>
          {onEnd && (
            <button
              type="button"
              onClick={onEnd}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 rounded-xl border bg-card py-4">
        <span className="text-xs text-muted-foreground">
          {mode === "copy" ? "Copy this character" : "Write from memory"}
        </span>
        <span className="text-5xl font-medium">
          {revealChar ? kana.char : kana.romaji}
        </span>
        {revealChar && (
          <button
            type="button"
            onClick={() => speakJapanese(kana.char)}
            className="mt-1 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Play pronunciation"
          >
            <Volume2 className="size-4" />
          </button>
        )}
      </div>

      <HandwritingCanvas
        ref={canvasRef}
        kana={kana}
        showGuide={mode === "copy" && hintEnabled}
        className="mx-auto w-full max-w-sm"
        onStrokesChange={(n) => setHasInk(n > 0)}
      />

      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" onClick={undo} disabled={!hasInk}>
          <Undo2 className="size-4" />
          Undo
        </Button>
        <Button variant="outline" onClick={clear} disabled={!hasInk}>
          <RotateCcw className="size-4" />
          Clear
        </Button>
        <Button onClick={check} disabled={!hasInk}>
          Check
        </Button>
      </div>

      {result && (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{result.overall}%</div>
              <p className="text-sm text-muted-foreground">{result.message}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>{result.strokeCountDrawn} strokes drawn</div>
              <div>{result.strokeCountExpected} expected</div>
            </div>
          </div>
          <ComparisonOverlay result={result} />
        </div>
      )}

      <Button onClick={next} size="lg" variant={result ? "default" : "outline"}>
        Next character
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
