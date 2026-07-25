"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Volume2, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { filterKana, type KanaSection } from "@/lib/kana";
import { generateQuestions, type QuizDirection, type QuizScope } from "@/lib/quiz";
import { QuizSession, type QuizAnswerRecord } from "@/components/quiz/quiz-session";
import { speakJapanese } from "@/lib/speech";

type Stage = "setup" | "active" | "results";

const SCOPE_OPTIONS: { value: QuizScope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

const SECTION_OPTIONS: { value: KanaSection; label: string }[] = [
  { value: "all", label: "All" },
  { value: "main", label: "Main (五十音)" },
  { value: "dakuten", label: "Dakuten (濁音)" },
  { value: "youon", label: "Youon (拗音)" },
];

const DIRECTION_OPTIONS: { value: QuizDirection; label: string }[] = [
  { value: "kana-to-romaji", label: "Kana → Romaji" },
  { value: "romaji-to-kana", label: "Romaji → Kana" },
  { value: "mixed", label: "Mixed" },
];

const COUNT_OPTIONS = [10, 20, 30];

// 0 stands in for "no limit" so the value stays a plain number for OptionGroup.
const TIME_OPTIONS = [
  { value: 0, label: "No limit" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
  { value: 120, label: "2 min" },
];

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [scope, setScope] = useState<QuizScope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [direction, setDirection] = useState<QuizDirection>("kana-to-romaji");
  const [count, setCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<ReturnType<typeof generateQuestions>>([]);
  const [results, setResults] = useState<QuizAnswerRecord[]>([]);

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  function start() {
    setQuestions(generateQuestions(scope, direction, count, section));
    setResults([]);
    setStage("active");
  }

  function finish(records: QuizAnswerRecord[]) {
    setResults(records);
    setStage("results");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Quiz
        </h1>
        <p className="text-sm text-muted-foreground">
          Multiple-choice drills to lock in Kana & Romaji recognition.
        </p>
      </div>

      {stage === "setup" && (
        <div className="flex flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
          {/* Script Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Script
            </span>
            <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} size="sm" />
          </div>

          {/* Direction */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Direction
            </span>
            <OptionGroup
              options={DIRECTION_OPTIONS}
              value={direction}
              onChange={setDirection}
              size="sm"
            />
          </div>

          {/* Section Selection */}
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Section
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                {poolCount} characters in pool
              </span>
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <OptionGroup
                options={SECTION_OPTIONS}
                value={section}
                onChange={setSection}
                size="sm"
                className="flex-nowrap"
              />
            </div>
          </div>

          {/* Question Count */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Question Count
            </span>
            <OptionGroup
              options={COUNT_OPTIONS.map((c) => ({ value: c, label: `${c} items` }))}
              value={count}
              onChange={setCount}
              size="sm"
            />
          </div>

          {/* Time Limit */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Time Limit
            </span>
            <OptionGroup
              options={TIME_OPTIONS}
              value={timeLimit}
              onChange={setTimeLimit}
              size="sm"
            />
          </div>

          <Button
            size="lg"
            onClick={start}
            className="mt-2 w-full text-base font-semibold lg:col-span-2"
          >
            Start Quiz
          </Button>
        </div>
      )}

      {stage === "active" && questions.length > 0 && (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 lg:max-w-lg">
          <button
            type="button"
            onClick={() => setStage("setup")}
            className="self-start text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Exit Quiz
          </button>

          <QuizSession
            questions={questions}
            timeLimitSeconds={timeLimit || null}
            onFinish={finish}
          />
        </div>
      )}

      {stage === "results" && (
        <div className="mx-auto w-full max-w-lg">
          <QuizResults
            records={results}
            totalQuestions={questions.length}
            onRetry={start}
            onChangeSettings={() => setStage("setup")}
          />
        </div>
      )}
    </div>
  );
}

function QuizResults({
  records,
  totalQuestions,
  onRetry,
  onChangeSettings,
}: {
  records: QuizAnswerRecord[];
  totalQuestions: number;
  onRetry: () => void;
  onChangeSettings: () => void;
}) {
  const correct = records.filter((r) => r.correct).length;
  const pct =
    records.length === 0 ? 0 : Math.round((correct / records.length) * 100);
  const missed = records.filter((r) => !r.correct);
  const unanswered = totalQuestions - records.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Score Summary Box */}
      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card py-8 px-6 shadow-2xs text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Quiz Completed
        </span>
        <span className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          {pct}%
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {correct} of {records.length} questions correct
        </span>
        {unanswered > 0 && (
          <span className="mt-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Time ran out — {unanswered} question{unanswered === 1 ? "" : "s"} unanswered
          </span>
        )}
      </div>

      {/* Review Missed Characters */}
      {missed.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Review Missed Characters ({missed.length})
          </span>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {missed.map((r, i) => (
              <div
                key={i}
                className="group relative flex items-center justify-between rounded-lg border bg-background px-3 py-2 transition-colors hover:border-primary/50"
              >
                <Link
                  href={`/kana/${r.question.kana.id}`}
                  className="flex flex-1 items-center gap-2"
                >
                  <span className="text-xl font-medium">{r.question.kana.char}</span>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {r.question.kana.romaji}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => speakJapanese(r.question.kana.char)}
                  className="rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-primary"
                  title={`Listen to ${r.question.kana.char}`}
                  aria-label={`Listen to ${r.question.kana.char}`}
                >
                  <Volume2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRetry} size="lg" className="flex-1 gap-2 font-semibold">
          <RotateCcw className="size-4" />
          Retry Same Settings
        </Button>
        <Button onClick={onChangeSettings} variant="outline" size="lg" className="flex-1 gap-2 font-semibold">
          <Settings className="size-4" />
          Change Settings
        </Button>
      </div>
    </div>
  );
}

