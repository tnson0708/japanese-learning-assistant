"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { generateQuestions, type QuizDirection, type QuizScope } from "@/lib/quiz";
import { QuizSession, type QuizAnswerRecord } from "@/components/quiz/quiz-session";

type Stage = "setup" | "active" | "results";

const SCOPE_OPTIONS: { value: QuizScope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
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
  const [direction, setDirection] = useState<QuizDirection>("kana-to-romaji");
  const [count, setCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<ReturnType<typeof generateQuestions>>([]);
  const [results, setResults] = useState<QuizAnswerRecord[]>([]);

  function start() {
    setQuestions(generateQuestions(scope, direction, count));
    setResults([]);
    setStage("active");
  }

  function finish(records: QuizAnswerRecord[]) {
    setResults(records);
    setStage("results");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quiz</h1>
        <p className="text-sm text-muted-foreground">
          Multiple-choice drills to lock in kana ↔ romaji recall.
        </p>
      </div>

      {stage === "setup" && (
        <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Script</span>
            <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Direction</span>
            <OptionGroup
              options={DIRECTION_OPTIONS}
              value={direction}
              onChange={setDirection}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Questions</span>
            <OptionGroup
              options={COUNT_OPTIONS.map((c) => ({ value: c, label: String(c) }))}
              value={count}
              onChange={setCount}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Time limit</span>
            <OptionGroup options={TIME_OPTIONS} value={timeLimit} onChange={setTimeLimit} />
          </div>
          <Button onClick={start} size="lg">
            Start Quiz
          </Button>
        </div>
      )}

      {stage === "active" && questions.length > 0 && (
        <QuizSession
          questions={questions}
          timeLimitSeconds={timeLimit || null}
          onFinish={finish}
        />
      )}

      {stage === "results" && (
        <QuizResults
          records={results}
          totalQuestions={questions.length}
          onRetry={start}
          onChangeSettings={() => setStage("setup")}
        />
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
      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card py-10">
        <span className="text-5xl font-bold">{pct}%</span>
        <span className="text-muted-foreground">
          {correct} / {records.length} correct
        </span>
        {unanswered > 0 && (
          <span className="text-xs text-muted-foreground">
            Time ran out — {unanswered} question{unanswered === 1 ? "" : "s"}{" "}
            unanswered
          </span>
        )}
      </div>

      {missed.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Review missed characters</span>
          <div className="flex flex-wrap gap-2">
            {missed.map((r, i) => (
              <Link
                key={i}
                href={`/kana/${r.question.kana.id}`}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
              >
                <span className="text-lg">{r.question.kana.char}</span>
                <span className="text-muted-foreground">
                  {r.question.kana.romaji}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onRetry} className="flex-1">
          Retry same settings
        </Button>
        <Button onClick={onChangeSettings} variant="outline" className="flex-1">
          Change settings
        </Button>
      </div>
    </div>
  );
}
