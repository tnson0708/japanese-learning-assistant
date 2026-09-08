"use client";

import { useState } from "react";
import { Printer, Volume2, CheckSquare, Square, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JapaneseText } from "@/components/theory/japanese-text";
import { ExerciseAudioPlayer, printSingleExercise } from "@/components/theory/exercise-blocks";
import type {
  ListeningDictationItem,
  ListeningPictureGroup,
  ListeningPictureIcon,
  ListeningTrueFalseItem,
} from "@/lib/theory";

/**
 * 1. Listening Dictation Drill (問題 1-style): learner hears a question and
 * writes the answer following the given negative-sentence pattern, then
 * reveals the transcript to self-check. `answerJp`/`answerVi` are only
 * filled in once someone transcribes them from the textbook's answer key —
 * until then the item still works as a write-and-self-check practice line.
 */
export function ListeningDictationBlock({
  title,
  instruction,
  audioUrl,
  exampleJp,
  exampleVi,
  items,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
  exampleJp?: string;
  exampleVi?: string;
  items: ListeningDictationItem[];
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) =>
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));

  const blockId = `exercise-listening-dictation-${items[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
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
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <ExerciseAudioPlayer audioUrl={audioUrl} />

        {exampleJp && (
          <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3.5 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Ví dụ (例)</span>
            <JapaneseText text={exampleJp} className="text-sm font-semibold text-foreground" />
            {exampleVi && <p className="text-xs text-muted-foreground">{exampleVi}</p>}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {items.map((item) => {
            const isRevealed = !!revealed[item.id];
            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-2xs print:border-gray-300 print:bg-white"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                    {item.num}
                  </span>
                  <input
                    type="text"
                    value={drafts[item.id] || ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    placeholder="Nghe và viết câu trả lời theo mẫu..."
                    className="flex-1 border-b border-dashed border-muted-foreground/40 bg-transparent px-1 py-1 text-sm text-foreground outline-hidden focus:border-primary print:hidden"
                  />
                  <Button
                    type="button"
                    variant={isRevealed ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleReveal(item.id)}
                    className="h-7 shrink-0 px-2 text-[11px] font-semibold print:hidden"
                  >
                    {isRevealed ? "Ẩn" : "Xem đáp án"}
                  </Button>
                </div>

                {isRevealed && (
                  <div className="ml-8 border-l-2 border-primary/50 pl-3 py-0.5 animate-in fade-in duration-150">
                    {item.answerJp ? (
                      <>
                        <JapaneseText text={item.answerJp} className="text-sm font-semibold text-primary" />
                        {item.answerVi && (
                          <p className="text-xs text-muted-foreground">{item.answerVi}</p>
                        )}
                      </>
                    ) : (
                      <p className="flex items-center gap-1.5 text-xs italic text-muted-foreground">
                        <HelpCircle className="size-3.5 shrink-0" />
                        Đáp án chưa được cập nhật — hãy tự nghe lại và đối chiếu với sách.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Minimal line-art icon standing in for the textbook's actual illustration
 * (which isn't available as an image asset here). Monochrome-blue doodle
 * style to loosely match the book's look.
 */
function StickPerson({ x, wave }: { x: number; wave?: boolean }) {
  return (
    <g stroke="#1e3a8a" strokeWidth="2" fill="none" strokeLinecap="round">
      <circle cx={x} cy="34" r="4" fill="#1e3a8a" stroke="none" />
      <line x1={x} y1="38" x2={x} y2="50" />
      <line x1={x} y1="50" x2={x - 4} y2="58" />
      <line x1={x} y1="50" x2={x + 4} y2="58" />
      {wave ? (
        <line x1={x} y1="42" x2={x + 8} y2="30" />
      ) : (
        <line x1={x} y1="42" x2={x + 6} y2="46" />
      )}
      <line x1={x} y1="42" x2={x - 6} y2="46" />
    </g>
  );
}

function ClockIcon() {
  return (
    <g>
      <circle cx="14" cy="14" r="7" fill="white" stroke="#334155" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="14" y2="9" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="14" x2="18" y2="14" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function PictureIcon({
  icon,
  imageUrl,
  badgeName,
  badgeNumber,
}: {
  icon?: ListeningPictureIcon;
  imageUrl?: string;
  badgeName?: string;
  badgeNumber?: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={encodeURI(imageUrl)}
        alt={badgeName ? `${badgeName} ${badgeNumber ?? ""}` : "Tranh minh họa"}
        className="aspect-square w-full rounded-md border object-cover"
      />
    );
  }

  if (!icon) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed bg-muted/30 text-[10px] italic text-muted-foreground">
        Chưa có tranh
      </div>
    );
  }

  if (icon === "name-badge") {
    return (
      <svg viewBox="0 0 84 60" className="h-16 w-full rounded-md" role="img" aria-label={`Thẻ tên ${badgeName ?? ""} ${badgeNumber ?? ""}`}>
        <rect x="1" y="1" width="82" height="58" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
        <g stroke="#facc15" strokeWidth="1.5" strokeLinecap="round">
          <line x1="14" y1="6" x2="14" y2="14" />
          <line x1="10" y1="10" x2="18" y2="10" />
        </g>
        <text x="42" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">
          {badgeName}
        </text>
        <text x="42" y="49" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e293b">
          {badgeNumber}
        </text>
      </svg>
    );
  }

  if (icon.startsWith("greeting-")) {
    const variant = icon.replace("greeting-", "") as "night" | "dawn" | "day";
    const sky = variant === "night" ? "#1e293b" : variant === "dawn" ? "#fed7aa" : "#7dd3fc";
    return (
      <svg viewBox="0 0 84 60" className="h-16 w-full rounded-md" role="img" aria-label={`Bối cảnh chào hỏi buổi ${variant}`}>
        <rect x="0" y="0" width="84" height="60" rx="6" fill={sky} />
        {variant === "night" && (
          <>
            <circle cx="66" cy="14" r="7" fill="#f8fafc" />
            <circle cx="14" cy="10" r="1" fill="#f8fafc" />
            <circle cx="24" cy="18" r="1" fill="#f8fafc" />
            <circle cx="36" cy="8" r="1" fill="#f8fafc" />
          </>
        )}
        {variant === "dawn" && (
          <>
            <rect x="0" y="38" width="84" height="22" fill="#bae6fd" />
            <path d="M 54 38 A 12 12 0 0 1 78 38 Z" fill="#fb923c" />
          </>
        )}
        {variant === "day" && (
          <>
            <circle cx="66" cy="14" r="9" fill="#fbbf24" />
            <line x1="66" y1="0" x2="66" y2="4" stroke="#fbbf24" strokeWidth="2" />
            <line x1="78" y1="14" x2="82" y2="14" stroke="#fbbf24" strokeWidth="2" />
          </>
        )}
        <ClockIcon />
        <StickPerson x={32} />
        <StickPerson x={50} />
        {variant === "day" && <rect x="54" y="50" width="6" height="6" fill="#1e293b" />}
      </svg>
    );
  }

  // greet-crowd | greet-handshake | greet-distant
  return (
    <svg viewBox="0 0 84 60" className="h-16 w-full rounded-md" role="img" aria-label="Bối cảnh chào hỏi">
      <rect x="0" y="0" width="84" height="60" rx="6" fill="#f1f5f9" />
      {icon === "greet-crowd" && (
        <>
          <StickPerson x={18} wave />
          {[[46, 40], [56, 46], [66, 40], [72, 48], [50, 50]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#1e3a8a" />
          ))}
        </>
      )}
      {icon === "greet-handshake" && (
        <>
          <StickPerson x={30} />
          <StickPerson x={54} />
          <line x1="36" y1="46" x2="48" y2="46" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {icon === "greet-distant" && (
        <>
          <StickPerson x={18} wave />
          <StickPerson x={66} />
          <line x1="26" y1="34" x2="58" y2="34" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 3" />
        </>
      )}
    </svg>
  );
}

/**
 * 2. Listening Picture-Choice Drill (問題 2-style): learner listens then
 * checks the picture that matches. The book's original illustrations aren't
 * available as image assets here, so each option is drawn as a simple
 * line-art stand-in instead — swap in a real cropped image per option
 * (`imageUrl`) later if wanted.
 */
export function ListeningPictureChoiceBlock({
  title,
  instruction,
  audioUrl,
  groups,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
  groups: ListeningPictureGroup[];
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const blockId = `exercise-listening-picture-${groups[0]?.id || title.replace(/\s+/g, "-")}`;

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
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
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <ExerciseAudioPlayer audioUrl={audioUrl} />

        {groups.map((group) => {
          const chosen = selected[group.id];
          return (
            <div key={group.id} className="flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground">{group.num}</span>
              <div className="grid grid-cols-3 gap-2.5">
                {group.options.map((opt, i) => {
                  const isChosen = chosen === opt.id;
                  const isCorrect = group.correctOptionId === opt.id;
                  const showFeedback = !!chosen && !!group.correctOptionId;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [group.id]: opt.id }))
                      }
                      className={`flex flex-col gap-1.5 rounded-xl border p-2 text-left transition-colors cursor-pointer ${
                        showFeedback && isChosen
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-red-500 bg-red-500/10"
                          : isChosen
                            ? "border-primary bg-primary/10"
                            : "border-border/70 bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {["①", "②", "③", "④"][i] || i + 1}
                        </span>
                        {isChosen ? (
                          <CheckSquare className="size-3.5 text-primary" />
                        ) : (
                          <Square className="size-3.5 text-muted-foreground/50" />
                        )}
                      </div>
                      <PictureIcon icon={opt.icon} imageUrl={opt.imageUrl} badgeName={opt.badgeName} badgeNumber={opt.badgeNumber} />
                      {opt.label && (
                        <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * 3. Listening True/False Drill (問題 3-style, ○/×). Examples are pre-marked
 * reference rows; the numbered items are clickable ○/× toggles. Grading only
 * shows once `correctAnswer` is filled in from the textbook's answer key.
 */
export function ListeningTrueFalseBlock({
  title,
  instruction,
  audioUrl,
  items,
}: {
  title: string;
  instruction?: string;
  audioUrl?: string;
  items: ListeningTrueFalseItem[];
}) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const blockId = `exercise-listening-tf-${items[0]?.id || title.replace(/\s+/g, "-")}`;
  const examples = items.filter((it) => it.isExample);
  const questions = items.filter((it) => !it.isExample);
  const hasAnyKey = questions.some((q) => q.correctAnswer !== undefined);

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
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
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <ExerciseAudioPlayer audioUrl={audioUrl} />

        {examples.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed bg-muted/30 px-3.5 py-2">
            {examples.map((ex) => (
              <span key={ex.id} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                {ex.num}:
                <span
                  className={`flex size-6 items-center justify-center rounded-full border-2 text-sm font-bold ${
                    ex.exampleAnswer
                      ? "border-emerald-500 text-emerald-600"
                      : "border-red-500 text-red-600"
                  }`}
                >
                  {ex.exampleAnswer ? "○" : "×"}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {questions.map((q) => {
            const picked = answers[q.id];
            const graded = picked !== undefined && q.correctAnswer !== undefined;
            const isRight = graded && picked === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-2xs"
              >
                <span className="text-xs font-bold text-foreground">{q.num}</span>
                {(["○", "×"] as const).map((sym) => {
                  const val = sym === "○";
                  const isPicked = picked === val;
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                      className={`flex size-8 items-center justify-center rounded-full border-2 text-base font-bold transition-colors cursor-pointer ${
                        isPicked
                          ? graded
                            ? isRight
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                              : "border-red-500 bg-red-500/10 text-red-600"
                            : "border-primary bg-primary/10 text-primary"
                          : "border-border/70 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {!hasAnyKey && (
          <p className="flex items-center gap-1.5 text-xs italic text-muted-foreground">
            <HelpCircle className="size-3.5 shrink-0" />
            Đáp án đúng/sai sẽ được cập nhật sau khi có sách giải — trước mắt hãy tự đối chiếu khi nghe lại.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 4. Reading Comprehension + True/False Drill: a short passage followed by
 * ○/× statements the learner checks against it. Unlike the listening
 * true/false drill, correctness here is derivable straight from the text,
 * so `correctAnswer` is expected to be filled in for every item.
 */
export function ReadingComprehensionBlock({
  title,
  instruction,
  passageTitle,
  passageJp,
  passageVi,
  passageImageUrl,
  items,
}: {
  title: string;
  instruction?: string;
  passageTitle?: string;
  passageJp: string;
  passageVi?: string;
  passageImageUrl?: string;
  items: ListeningTrueFalseItem[];
}) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showTranslation, setShowTranslation] = useState(false);

  const blockId = `exercise-reading-${items[0]?.id || title.replace(/\s+/g, "-")}`;
  const examples = items.filter((it) => it.isExample);
  const questions = items.filter((it) => !it.isExample);

  return (
    <Card id={blockId} className="border-primary/20 shadow-xs exercise-card-block print:border-gray-400 print:shadow-none print:break-inside-avoid print:bg-white">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex items-center gap-2">
          <Volume2 className="size-4 text-primary print:hidden opacity-0" />
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
        {instruction && (
          <p className="text-xs text-muted-foreground print:text-gray-700">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3.5">
          {passageTitle && (
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{passageTitle}</span>
          )}
          {passageImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={encodeURI(passageImageUrl)}
              alt={passageTitle || "Tranh minh họa"}
              className="max-h-48 w-fit rounded-lg border object-contain"
            />
          )}
          <JapaneseText text={passageJp} className="text-sm leading-loose text-foreground whitespace-pre-line" />
          {passageVi && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTranslation((s) => !s)}
                className="h-6 w-fit px-2 text-[11px] print:hidden"
              >
                {showTranslation ? "Ẩn bản dịch" : "Xem bản dịch"}
              </Button>
              {showTranslation && (
                <p className="whitespace-pre-line text-xs italic text-muted-foreground">{passageVi}</p>
              )}
            </>
          )}
        </div>

        {examples.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed bg-muted/30 px-3.5 py-2">
            {examples.map((ex) => (
              <span key={ex.id} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                {ex.num}:
                <span
                  className={`flex size-6 items-center justify-center rounded-full border-2 text-sm font-bold ${
                    ex.exampleAnswer
                      ? "border-emerald-500 text-emerald-600"
                      : "border-red-500 text-red-600"
                  }`}
                >
                  {ex.exampleAnswer ? "○" : "×"}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {questions.map((q) => {
            const picked = answers[q.id];
            const graded = picked !== undefined && q.correctAnswer !== undefined;
            const isRight = graded && picked === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-2xs"
              >
                <span className="text-xs font-bold text-foreground">{q.num}</span>
                {q.statementJp && (
                  <JapaneseText text={q.statementJp} className="flex-1 text-sm text-foreground" />
                )}
                <div className="flex shrink-0 gap-1.5">
                  {(["○", "×"] as const).map((sym) => {
                    const val = sym === "○";
                    const isPicked = picked === val;
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                        className={`flex size-8 items-center justify-center rounded-full border-2 text-base font-bold transition-colors cursor-pointer ${
                          isPicked
                            ? graded
                              ? isRight
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                                : "border-red-500 bg-red-500/10 text-red-600"
                              : "border-primary bg-primary/10 text-primary"
                            : "border-border/70 text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
