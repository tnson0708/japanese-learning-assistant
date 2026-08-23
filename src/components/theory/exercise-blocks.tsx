"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Eye, EyeOff, Sparkles, Volume2, Printer, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JapaneseText } from "@/components/theory/japanese-text";
import type {
  FillInBlankQuestion,
  MultipleChoiceQuestion,
  SentencePracticeItem,
  ReorderQuestionItem,
  DrillCardPerson,
  PictureDrillGroup,
} from "@/lib/theory";

function printSingleExercise(blockId: string) {
  const targetElem = document.getElementById(blockId);
  if (targetElem) {
    targetElem.classList.add("print-target-active");
  }
  document.body.setAttribute("data-print-target", blockId);

  const cleanup = () => {
    document.body.removeAttribute("data-print-target");
    if (targetElem) {
      targetElem.classList.remove("print-target-active");
    }
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
  setTimeout(cleanup, 1000);
}

export function ExerciseAudioPlayer({ audioUrl }: { audioUrl?: string }) {
  if (!audioUrl) return null;
  return (
    <div className="mb-2 flex flex-col gap-1.5 rounded-lg border bg-muted/40 p-3 print:hidden">
      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
        <Volume2 className="size-4 shrink-0" />
        <span>Bài nghe (Listening Audio Track)</span>
      </div>
      <audio controls src={audioUrl} className="h-9 w-full rounded-md" />
    </div>
  );
}

/**
 * 1. Fill-in-the-blank Exercise Component (e.g., choosing particles は, も, の, か)
 */
export function FillInBlankExerciseBlock({
  title,
  instruction,
  audioUrl,
  questions,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
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

  const blockId = `exercise-fill-${questions[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary print:hidden" />
            <CardTitle className="text-base font-semibold text-foreground print:text-black print:font-bold">
              {title}
            </CardTitle>
            <button
              type="button"
              onClick={() => printSingleExercise(blockId)}
              className="rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary cursor-pointer print:hidden"
              title="In riêng bài tập này (Print only this exercise)"
            >
              <Printer className="size-3.5" />
            </button>
          </div>
          {checked && (
            <Badge variant={correctCount === questions.length ? "default" : "secondary"} className="print:hidden">
              {correctCount} / {questions.length} câu đúng
            </Badge>
          )}
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 print:gap-3">
        <ExerciseAudioPlayer audioUrl={audioUrl} />
        <div className="flex flex-col gap-3">
          {questions.map((q, index) => {
            const selected = userAnswers[q.id];
            const isCorrect = selected === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3.5 transition-colors print:border-gray-300 print:bg-white print:p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-1 text-sm sm:text-base font-medium print:text-black">
                    <span className="text-muted-foreground text-xs font-semibold mr-1 print:text-black print:font-bold">
                      {index + 1}.
                    </span>
                    <JapaneseText text={q.promptPre} />
                    <span className="inline-flex min-w-12 items-center justify-center rounded-md border border-dashed border-primary/50 bg-background px-2.5 py-0.5 text-primary font-bold print:border-gray-400 print:bg-white print:text-black print:font-normal">
                      <span className="print:hidden">{selected ? selected : "_"}</span>
                      <span className="hidden print:inline font-mono">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</span>
                    </span>
                    {q.promptPost && <JapaneseText text={q.promptPost} />}
                  </div>

                  {checked && selected && (
                    <div className="print:hidden">
                      {isCorrect ? (
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="size-5 shrink-0 text-destructive" />
                      )}
                    </div>
                  )}
                </div>

                {/* Option Buttons (Web interactive & Print choices) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="hidden print:inline text-xs font-medium text-gray-700 mr-1">Các từ chọn:</span>
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
                        className={`h-8 px-3 text-xs sm:text-sm font-semibold transition-all print:h-auto print:px-2 print:py-0.5 print:border-gray-400 print:bg-white print:text-black ${
                          checked && option === q.correctAnswer && !isOptionSelected
                            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            : ""
                        }`}
                        onClick={() => handleSelect(q.id, option)}
                      >
                        <span className="hidden print:inline mr-1 font-mono">[ &nbsp; ]</span>
                        {option}
                      </Button>
                    );
                  })}
                </div>

                {/* Feedback / Solution (Hidden during print) */}
                {checked && (
                  <div className="mt-1 flex flex-col gap-1.5 rounded-lg bg-background p-2.5 text-xs print:hidden">
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

        {/* Action controls (Hidden during print) */}
        <div className="flex items-center justify-between border-t pt-3 print:hidden">
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
  audioUrl,
  questions,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
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

  const blockId = `exercise-mc-${questions[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-primary print:hidden" />
            <CardTitle className="text-base font-semibold text-foreground print:text-black print:font-bold">
              {title}
            </CardTitle>
            <button
              type="button"
              onClick={() => printSingleExercise(blockId)}
              className="rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary cursor-pointer print:hidden"
              title="In riêng bài tập này (Print only this exercise)"
            >
              <Printer className="size-3.5" />
            </button>
          </div>
          {checked && (
            <Badge variant={correctCount === questions.length ? "default" : "secondary"} className="print:hidden">
              {correctCount} / {questions.length} đúng
            </Badge>
          )}
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4 print:gap-3">
        <ExerciseAudioPlayer audioUrl={audioUrl} />
        <div className="flex flex-col gap-4 print:gap-3">
          {questions.map((q, qIndex) => {
            const selectedIdx = selectedAnswers[q.id];
            const isCorrect = selectedIdx === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-xl border bg-card p-3.5 shadow-2xs print:border-gray-300 print:bg-white print:p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground print:text-black">
                    <span className="text-primary mr-1 font-bold print:text-black">{qIndex + 1}.</span>
                    {q.question}
                  </p>
                  {checked && selectedIdx !== undefined && (
                    <div className="print:hidden">
                      {isCorrect ? (
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="size-5 shrink-0 text-destructive" />
                      )}
                    </div>
                  )}
                </div>

                {/* Option list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 print:gap-1.5">
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
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs sm:text-sm transition-all cursor-pointer select-none print:border-gray-400 print:bg-white print:text-black print:p-1.5 ${styleClasses}`}
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold print:border-gray-500 print:text-black">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <JapaneseText text={optText} className="flex-1" />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation (Hidden during print) */}
                {checked && (
                  <div className="mt-1 rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground print:hidden">
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

        {/* Footer controls (Hidden during print) */}
        <div className="flex items-center justify-between border-t pt-3 print:hidden">
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
  audioUrl,
  items,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
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

  const blockId = `exercise-sentence-${items[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-primary print:hidden" />
            <CardTitle className="text-base font-semibold text-foreground print:text-black print:font-bold">
              {title}
            </CardTitle>
            <button
              type="button"
              onClick={() => printSingleExercise(blockId)}
              className="rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary cursor-pointer print:hidden"
              title="In riêng bài tập này (Print only this exercise)"
            >
              <Printer className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 print:hidden">
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
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ExerciseAudioPlayer audioUrl={audioUrl} />
        {items.map((item, idx) => {
          const isRevealed = !!revealedItems[item.id];

          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border bg-card p-3.5 shadow-2xs transition-all hover:border-primary/30 print:border-gray-300 print:bg-white print:p-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-primary print:text-black print:font-bold">
                    Mẫu câu {idx + 1}:
                  </span>
                  <p className="text-sm font-medium text-foreground leading-relaxed print:text-black">
                    {item.vi}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleReveal(item.id)}
                  className="h-8 gap-1.5 text-xs font-medium shrink-0 print:hidden"
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

              {/* Printable Writing Line */}
              <div className="hidden print:block pt-1 text-xs text-gray-700 font-mono">
                Trả lời: ____________________________________________________________________
              </div>

              {item.hint && !isRevealed && (
                <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded-lg print:hidden">
                  💡 Gợi ý: {item.hint}
                </p>
              )}

              {isRevealed && (
                <div className="mt-1 flex flex-col gap-2 rounded-lg bg-muted/40 p-3 text-sm print:hidden">
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

/**
 * 4. Reorder Sentence Exercise Component (Sắp xếp từ thành câu hoàn chỉnh)
 */
export function ReorderSentenceExerciseBlock({
  title,
  instruction,
  audioUrl,
  questions,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
  questions: ReorderQuestionItem[];
}) {
  const [selectedTokens, setSelectedTokens] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleSelectToken = (qId: string, tokenIndex: number) => {
    setSelectedTokens((prev) => {
      const current = prev[qId] || [];
      if (current.includes(tokenIndex)) return prev;
      return { ...prev, [qId]: [...current, tokenIndex] };
    });
  };

  const handleRemoveToken = (qId: string, indexInSelected: number) => {
    setSelectedTokens((prev) => {
      const current = prev[qId] || [];
      const updated = current.filter((_, idx) => idx !== indexInSelected);
      return { ...prev, [qId]: updated };
    });
  };

  const handleResetItem = (qId: string) => {
    setSelectedTokens((prev) => ({ ...prev, [qId]: [] }));
  };

  const handleResetAll = () => {
    setSelectedTokens({});
    setChecked(false);
    setRevealed({});
  };

  const toggleReveal = (qId: string) => {
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const isQuestionCorrect = (q: ReorderQuestionItem) => {
    const userOrderIndexes = selectedTokens[q.id] || [];
    if (userOrderIndexes.length !== q.words.length) return false;
    const userWords = userOrderIndexes.map((idx) => q.words[idx]);
    return userWords.every((word, idx) => word === q.correctOrder[idx]);
  };

  const correctCount = questions.filter(isQuestionCorrect).length;

  const blockId = `exercise-reorder-${questions[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary print:hidden" />
            <CardTitle className="text-base font-semibold text-foreground print:text-black print:font-bold">
              {title}
            </CardTitle>
            <button
              type="button"
              onClick={() => printSingleExercise(blockId)}
              className="rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary cursor-pointer print:hidden"
              title="In riêng bài tập này (Print only this exercise)"
            >
              <Printer className="size-3.5" />
            </button>
          </div>
          {checked && (
            <Badge variant={correctCount === questions.length ? "default" : "secondary"} className="print:hidden">
              {correctCount} / {questions.length} câu đúng
            </Badge>
          )}
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 print:gap-3">
        <ExerciseAudioPlayer audioUrl={audioUrl} />
        <div className="flex flex-col gap-4 print:gap-3">
          {questions.map((q, index) => {
            const userOrderIndexes = selectedTokens[q.id] || [];
            const isComplete = userOrderIndexes.length === q.words.length;
            const isCorrect = isQuestionCorrect(q);
            const isShowAnswer = revealed[q.id];

            return (
              <div
                key={q.id}
                className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3.5 sm:p-4 transition-colors print:border-gray-300 print:bg-white print:p-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground print:text-black print:font-bold">
                    Câu {index + 1}:
                  </span>
                  <p className="text-sm font-medium text-foreground print:text-black">
                    {q.fullSentenceVi}
                  </p>
                  {checked && isComplete && (
                    <div className="ml-auto print:hidden">
                      {isCorrect ? (
                        <Badge className="bg-emerald-500 text-white flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Chính xác!
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <XCircle className="size-3.5" /> Thử lại
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected constructed sentence zone (Web only) */}
                <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-lg border border-dashed border-primary/40 bg-background p-2.5 print:hidden">
                  {userOrderIndexes.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">
                      Bấm vào các từ bên dưới để ghép thành câu...
                    </span>
                  ) : (
                    userOrderIndexes.map((tokenIdx, idx) => (
                      <button
                        key={`${q.id}-selected-${idx}`}
                        type="button"
                        onClick={() => handleRemoveToken(q.id, idx)}
                        className="group inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary transition-all hover:bg-destructive/15 hover:text-destructive cursor-pointer"
                        title="Bấm để bỏ từ này"
                      >
                        <span className="font-japanese font-medium">{q.words[tokenIdx]}</span>
                        <span className="text-xs opacity-60 group-hover:opacity-100">×</span>
                      </button>
                    ))
                  )}
                </div>

                {/* Printable Writing Line */}
                <div className="hidden print:block pt-1 text-xs text-gray-700 font-mono">
                  Viết lại câu hoàn chỉnh: ____________________________________________________________________
                </div>

                {/* Available word tokens pool */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground font-medium mr-1 print:text-black print:font-bold">Từ gợi ý:</span>
                  {q.words.map((word, wordIdx) => {
                    const isSelected = userOrderIndexes.includes(wordIdx);
                    return (
                      <button
                        key={`${q.id}-pool-${wordIdx}`}
                        type="button"
                        disabled={isSelected}
                        onClick={() => handleSelectToken(q.id, wordIdx)}
                        className={`rounded-md border px-2.5 py-1 text-sm font-medium transition-all print:border-gray-400 print:bg-white print:text-black print:opacity-100 ${
                          isSelected
                            ? "border-muted/50 bg-muted/40 text-muted-foreground opacity-40 cursor-not-allowed"
                            : "border-primary/30 bg-background text-foreground hover:bg-primary/10 hover:border-primary cursor-pointer active:scale-95"
                        }`}
                      >
                        <span className="font-japanese font-medium">[{word}]</span>
                      </button>
                    );
                  })}
                </div>

                {/* Item Actions (Hidden during print) */}
                <div className="flex items-center justify-between pt-1 print:hidden">
                  <button
                    type="button"
                    onClick={() => handleResetItem(q.id)}
                    className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Xóa ghép lại
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleReveal(q.id)}
                  >
                    {isShowAnswer ? (
                      <>
                        <EyeOff className="size-3.5" /> Ẩn đáp án
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5" /> Xem đáp án
                      </>
                    )}
                  </Button>
                </div>

                {/* Answer reveal section (Hidden during print) */}
                {(isShowAnswer || (checked && isCorrect)) && (
                  <div className="flex flex-col gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm print:hidden">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Đáp án chuẩn:</span>
                      <JapaneseText
                        text={q.fullSentenceJp}
                        className="text-base font-bold text-foreground"
                      />
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-muted-foreground border-t border-emerald-500/20 pt-1.5">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Action Buttons (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 print:hidden">
          <Button
            onClick={() => setChecked(true)}
            disabled={Object.keys(selectedTokens).length === 0}
            className="gap-2 font-medium"
          >
            <CheckCircle2 className="size-4" /> Kiểm tra kết quả
          </Button>

          {checked && (
            <Button variant="outline" onClick={handleResetAll} className="gap-2">
              <RotateCcw className="size-4" /> Làm lại từ đầu
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PersonCard({ person }: { person: DrillCardPerson }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-3 text-center shadow-2xs print:border-gray-300 print:bg-white">
      <span className="text-3xl leading-none">{person.flag}</span>
      <JapaneseText text={person.name} className="text-sm font-semibold" />
      <span className="text-[11px] text-muted-foreground">
        {person.countryJp} · {person.jobVi}
        {person.age !== undefined ? ` · ${person.age} tuổi` : ""}
      </span>
    </div>
  );
}

/**
 * 5. Picture-card Drill Block (練習B style) — replaces the textbook's
 * photo/map illustrations with flag-emoji person cards, so the "who is
 * what nationality/job/age" pattern drills stay fully data-driven.
 */
export function PictureCardsExerciseBlock({
  title,
  instruction,
  people,
  groups,
}: {
  title: string;
  instruction?: string;
  people: DrillCardPerson[];
  groups: PictureDrillGroup[];
}) {
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = () => {
    const allRevealed: Record<string, boolean> = {};
    groups.forEach((g) => g.items.forEach((item) => { allRevealed[item.id] = true; }));
    setRevealedItems(allRevealed);
  };

  const hideAll = () => setRevealedItems({});

  const blockId = `exercise-picture-${groups[0]?.items[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary print:hidden" />
            <CardTitle className="text-base font-semibold text-foreground print:text-black print:font-bold">
              {title}
            </CardTitle>
            <button
              type="button"
              onClick={() => printSingleExercise(blockId)}
              className="rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary cursor-pointer print:hidden"
              title="In riêng bài tập này (Print only this exercise)"
            >
              <Printer className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 print:hidden">
            <Button type="button" variant="ghost" size="sm" onClick={revealAll} className="h-7 px-2 text-xs">
              Hiện tất cả
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={hideAll} className="h-7 px-2 text-xs">
              Ẩn tất cả
            </Button>
          </div>
        </div>
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>

        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-black">
              {group.heading}
            </h4>
            <div className="flex flex-col gap-2">
              {group.items.map((item, idx) => {
                const isRevealed = !!revealedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3 transition-colors print:border-gray-300 print:bg-white print:p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground print:text-black">
                        <span className="text-muted-foreground text-xs font-semibold mr-1 print:text-black">
                          {idx + 1}.
                        </span>
                        {item.vi}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReveal(item.id)}
                        className="h-7 shrink-0 gap-1.5 text-xs font-medium print:hidden"
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

                    <div className="hidden print:block pt-0.5 text-xs text-gray-700 font-mono">
                      Trả lời: ________________________________________________
                    </div>

                    {isRevealed && (
                      <div className="rounded-lg bg-background p-2.5 print:hidden">
                        <JapaneseText text={item.jp} className="text-sm font-semibold text-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
