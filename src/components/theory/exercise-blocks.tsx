"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Eye, EyeOff, Sparkles, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JapaneseText } from "@/components/theory/japanese-text";
import type { FillInBlankQuestion, MultipleChoiceQuestion, SentencePracticeItem } from "@/lib/theory";

/**
 * 1. Fill-in-the-blank Exercise Component (e.g., choosing particles は, も, の, か)
 */
export function FillInBlankExerciseBlock({
  title,
  instruction,
  questions,
}: {
  title: string;
  instruction?: string;
  questions: FillInBlankQuestion[];
}) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const handleSelect = (qId: string, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setChecked(false);
  };

  const correctCount = questions.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <Card className="border-primary/20 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
          </div>
          {checked && (
            <Badge variant={correctCount === questions.length ? "default" : "secondary"}>
              {correctCount} / {questions.length} câu đúng
            </Badge>
          )}
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground">{instruction}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {questions.map((q, index) => {
            const selected = userAnswers[q.id];
            const isCorrect = selected === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-1 text-sm sm:text-base font-medium">
                    <span className="text-muted-foreground text-xs font-semibold mr-1">
                      {index + 1}.
                    </span>
                    <JapaneseText text={q.promptPre} />
                    <span className="inline-flex min-w-12 items-center justify-center rounded-md border border-dashed border-primary/50 bg-background px-2.5 py-0.5 text-primary font-bold">
                      {selected ? selected : "_"}
                    </span>
                    {q.promptPost && <JapaneseText text={q.promptPost} />}
                  </div>

                  {checked && selected && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="size-5 shrink-0 text-destructive" />
                      )}
                    </div>
                  )}
                </div>

                {/* Option Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {q.options.map((option) => {
                    const isOptionSelected = selected === option;
                    let btnVariant: "outline" | "default" | "destructive" = "outline";

                    if (isOptionSelected) {
                      if (checked) {
                        btnVariant = isCorrect ? "default" : "destructive";
                      } else {
                        btnVariant = "default";
                      }
                    } else if (checked && option === q.correctAnswer) {
                      btnVariant = "outline";
                    }

                    return (
                      <Button
                        key={option}
                        type="button"
                        size="sm"
                        variant={btnVariant}
                        className={`h-8 px-3 text-xs sm:text-sm font-semibold transition-all ${
                          checked && option === q.correctAnswer && !isOptionSelected
                            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            : ""
                        }`}
                        onClick={() => handleSelect(q.id, option)}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>

                {/* Feedback / Solution */}
                {checked && (
                  <div className="mt-1 flex flex-col gap-1.5 rounded-lg bg-background p-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <span>Đáp án đúng:</span>
                        <Badge variant="outline" className="font-bold text-emerald-600 dark:text-emerald-400">
                          {q.correctAnswer}
                        </Badge>
                      </div>
                      {q.fullSentenceJp && (
                        <JapaneseText
                          text={q.fullSentenceJp}
                          className="text-xs font-semibold"
                          iconClassName="size-4"
                        />
                      )}
                    </div>

                    {q.fullSentenceVi && (
                      <p className="text-muted-foreground italic">
                        Dịch: {q.fullSentenceVi}
                      </p>
                    )}

                    {q.explanation && (
                      <p className="text-muted-foreground leading-relaxed pt-0.5 border-t border-border/40">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action controls */}
        <div className="flex items-center justify-between border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" /> Làm lại
          </Button>

          {!checked ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setChecked(true)}
              disabled={Object.keys(userAnswers).length === 0}
              className="gap-1.5 text-xs font-semibold"
            >
              Kiểm tra đáp án
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              {correctCount === questions.length
                ? "Xuất sắc! Bạn đã trả lời đúng tất cả."
                : "Hãy ôn lại các câu chưa chính xác nhé."}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 2. Multiple Choice Quiz Component
 */
export function MultipleChoiceExerciseBlock({
  title,
  instruction,
  questions,
}: {
  title: string;
  instruction?: string;
  questions: MultipleChoiceQuestion[];
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);

  const handleSelect = (qId: string, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setChecked(false);
  };

  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswerIndex
  ).length;

  return (
    <Card className="border-primary/20 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
          </div>
          {checked && (
            <Badge variant={correctCount === questions.length ? "default" : "secondary"}>
              {correctCount} / {questions.length} đúng
            </Badge>
          )}
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {questions.map((q, qIndex) => {
            const selectedIdx = selectedAnswers[q.id];
            const isCorrect = selectedIdx === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-xl border bg-card p-3.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    <span className="text-primary mr-1 font-bold">{qIndex + 1}.</span>
                    {q.question}
                  </p>
                  {checked && selectedIdx !== undefined && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="size-5 shrink-0 text-destructive" />
                      )}
                    </div>
                  )}
                </div>

                {/* Option list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((optText, optIdx) => {
                    const isOptionSelected = selectedIdx === optIdx;
                    let styleClasses =
                      "border-border/70 hover:border-primary/50 hover:bg-accent/50 text-foreground";

                    if (isOptionSelected) {
                      if (checked) {
                        styleClasses = isCorrect
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                          : "border-destructive bg-destructive/10 text-destructive font-semibold";
                      } else {
                        styleClasses = "border-primary bg-primary/10 text-primary font-semibold";
                      }
                    } else if (checked && optIdx === q.correctAnswerIndex) {
                      styleClasses = "border-emerald-500/60 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold";
                    }

                    return (
                      <div
                        key={optIdx}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelect(q.id, optIdx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(q.id, optIdx);
                          }
                        }}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs sm:text-sm transition-all cursor-pointer select-none ${styleClasses}`}
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <JapaneseText text={optText} className="flex-1" />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {checked && (
                  <div className="mt-1 rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-0.5">
                      Đáp án đúng: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}</span>
                    </p>
                    {q.explanation && <p className="leading-relaxed">{q.explanation}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" /> Làm lại
          </Button>

          {!checked ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setChecked(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="gap-1.5 text-xs font-semibold"
            >
              Kiểm tra kết quả
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              {correctCount === questions.length
                ? "Hoàn hảo! Bạn nắm rất vững kiến thức."
                : "Thử ôn lại các câu chọn nhầm nhé."}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 3. Interactive Sentence Practice Card (Reveal solution, audio, and breakdown)
 */
export function SentencePracticeBlock({
  title,
  instruction,
  items,
}: {
  title: string;
  instruction?: string;
  items: SentencePracticeItem[];
}) {
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = () => {
    const allRevealed: Record<string, boolean> = {};
    items.forEach((item) => {
      allRevealed[item.id] = true;
    });
    setRevealedItems(allRevealed);
  };

  const hideAll = () => {
    setRevealedItems({});
  };

  return (
    <Card className="border-primary/20 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={revealAll}
              className="h-7 px-2 text-xs"
            >
              Hiện tất cả
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={hideAll}
              className="h-7 px-2 text-xs"
            >
              Ẩn tất cả
            </Button>
          </div>
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const isRevealed = !!revealedItems[item.id];

          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border bg-card p-3.5 shadow-2xs transition-all hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-primary">
                    Mẫu câu {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {item.vi}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleReveal(item.id)}
                  className="h-8 gap-1.5 text-xs font-medium shrink-0"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="size-3.5" /> Ẩn
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5" /> Xem đáp án
                    </>
                  )}
                </Button>
              </div>

              {item.hint && !isRevealed && (
                <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded-lg">
                  💡 Gợi ý: {item.hint}
                </p>
              )}

              {isRevealed && (
                <div className="mt-1 flex flex-col gap-2 rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="flex items-baseline gap-2">
                    <JapaneseText
                      text={item.jp}
                      className="text-base font-semibold text-primary"
                    />
                  </div>

                  {item.breakdown && (
                    <p className="text-xs text-muted-foreground border-t border-border/50 pt-2 leading-relaxed">
                      🔍 <span className="font-semibold text-foreground">Phân tích:</span> {item.breakdown}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
