"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/speech";
import type { QuizQuestion } from "@/lib/quiz";


export interface QuizAnswerRecord {
  question: QuizQuestion;
  selected: string;
  correct: boolean;
}

interface QuizSessionProps {
  questions: QuizQuestion[];
  /** Total time budget for the whole quiz, in seconds. `null` means no limit. */
  timeLimitSeconds: number | null;
  onFinish: (records: QuizAnswerRecord[]) => void;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function QuizSession({
  questions,
  timeLimitSeconds,
  onFinish,
}: QuizSessionProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [records, setRecords] = useState<QuizAnswerRecord[]>([]);
  const [remaining, setRemaining] = useState<number | null>(timeLimitSeconds);
  const recordsRef = useRef<QuizAnswerRecord[]>([]);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const promptChar = question.direction === "kana-to-romaji" ? question.kana.char : null;
  const promptRomaji = question.direction === "romaji-to-kana" ? question.kana.romaji : null;

  const score = useMemo(
    () => records.filter((r) => r.correct).length,
    [records]
  );

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  // Ticks the countdown once per second; the effect below reacts when it hits 0.
  useEffect(() => {
    if (timeLimitSeconds === null) return;
    const interval = window.setInterval(() => {
      setRemaining((r) => (r === null ? r : Math.max(0, r - 1)));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timeLimitSeconds]);

  useEffect(() => {
    if (remaining === 0) onFinish(recordsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  function choose(choice: string) {
    if (selected) return;
    setSelected(choice);
    const correct = choice === question.correctAnswer;
    const nextRecords = [...records, { question, selected: choice, correct }];
    setRecords(nextRecords);

    window.setTimeout(() => {
      if (isLast) {
        onFinish(nextRecords);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 650);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        {remaining !== null && (
          <span
            className={cn(
              "font-mono tabular-nums",
              remaining <= 10 && "font-semibold text-red-600 dark:text-red-400"
            )}
          >
            {formatTime(remaining)}
          </span>
        )}
        <span>
          Score {score} / {records.length}
        </span>
      </div>
      <Progress value={(index / questions.length) * 100} />

      <div className="relative flex flex-col items-center gap-3 rounded-xl border bg-card py-8 sm:py-10 shadow-2xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {question.direction === "kana-to-romaji"
            ? `What is the romaji for this ${question.kana.script} character?`
            : `Which ${question.kana.script} character reads "${question.kana.romaji}"?`}
        </span>
        <span className="text-6xl font-medium tracking-tight">
          {promptChar ?? promptRomaji}
        </span>
        <button
          type="button"
          onClick={() => speakJapanese(question.kana.char)}
          className="rounded-full border bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={`Listen to ${question.kana.char}`}
          aria-label={`Listen to ${question.kana.char}`}
        >
          <Volume2 className="size-4" />
        </button>
      </div>


      <div className="grid grid-cols-2 gap-3">
        {question.choices.map((choice) => {
          const isCorrectChoice = choice === question.correctAnswer;
          const isSelected = choice === selected;
          const showState = selected !== null;
          return (
            <button
              key={choice}
              type="button"
              disabled={selected !== null}
              onClick={() => choose(choice)}
              className={cn(
                "rounded-lg border py-6 text-2xl font-medium transition-colors",
                !showState && "hover:border-primary/60 hover:bg-accent/50",
                showState && isCorrectChoice && "border-green-600 bg-green-600/10 text-green-700 dark:text-green-400",
                showState && isSelected && !isCorrectChoice && "border-red-600 bg-red-600/10 text-red-700 dark:text-red-400",
                showState && !isSelected && !isCorrectChoice && "opacity-50"
              )}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
