"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CheckSquare, Printer, Search, Square, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";
import {
  grammarSummaryLessons,
  type GrammarPoint,
  type GrammarTable,
  type SummaryLesson,
} from "@/data/theory/grammar-summary";

const ALL_LESSON_IDS = grammarSummaryLessons.map((l) => l.id);

function SpeakButton({ text }: { text: string }) {
  // Speak only the first sentence of a Q/A pair ("…" separates question and answer)
  const spoken = text.split("…")[0].replace(/[［］]/g, "").trim();
  return (
    <button
      type="button"
      onClick={() => speakJapanese(spoken)}
      className="print:hidden mt-0.5 shrink-0 rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
      aria-label={`Nghe phát âm: ${spoken}`}
      title="Nghe phát âm"
    >
      <Volume2 className="size-3.5" />
    </button>
  );
}

function TableView({ table }: { table: GrammarTable }) {
  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="w-full border-collapse text-xs sm:text-sm print:text-[9pt]">
        <thead>
          <tr>
            {table.columns.map((col, i) => (
              <th
                key={i}
                className="border border-border bg-muted/60 px-2 py-1.5 text-left font-semibold text-foreground print:border-neutral-400 print:bg-neutral-100 print:px-1.5 print:py-1"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "border border-border px-2 py-1.5 align-top text-foreground print:border-neutral-400 print:px-1.5 print:py-1",
                    ci === 0 && table.columns[0] === "" && "bg-muted/30 font-semibold print:bg-neutral-50"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * One grammar point as a full-width row: pattern + meaning + notes on the left,
 * examples on the right. Every row shares the same column split, so the page and
 * the A4 printout line up as one grid instead of uneven floating cards.
 */
function PointRow({ point, index }: { point: GrammarPoint; index: number }) {
  const hasExamples = point.examples.length > 0;

  return (
    <div className="flex flex-col gap-3 py-4 break-inside-avoid print:gap-1.5 print:py-2">
      <div
        className={cn(
          "grid gap-3 print:gap-4",
          hasExamples && "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] print:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        )}
      >
        {/* Left: pattern, meaning, notes */}
        <div className="flex gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary print:size-5 print:bg-neutral-200 print:text-[8pt] print:text-black">
            {index + 1}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[15px] font-bold leading-snug text-foreground print:text-[10.5pt]">{point.pattern}</p>
            <p className="text-sm font-medium text-primary print:text-[9.5pt] print:text-black print:italic">
              {point.meaning}
            </p>
            {point.notes && point.notes.length > 0 && (
              <ul className="mt-1 flex flex-col gap-1 text-[13px] leading-relaxed text-muted-foreground print:mt-0.5 print:gap-0.5 print:text-[9pt] print:leading-snug print:text-neutral-700">
                {point.notes.map((note, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="mt-[0.55em] size-1 shrink-0 rounded-full bg-muted-foreground/60 print:bg-neutral-500" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: examples */}
        {hasExamples && (
          <ol className="flex flex-col gap-2 rounded-lg bg-muted/40 px-3 py-2.5 print:gap-1 print:rounded-none print:border-l-2 print:border-neutral-300 print:bg-transparent print:px-0 print:py-0 print:pl-3">
            {point.examples.map((example, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm leading-relaxed text-foreground print:text-[10pt] print:leading-snug">
                    {example.jp}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground print:text-[8.5pt] print:leading-snug print:text-neutral-600">
                    {example.vi}
                  </span>
                </div>
                <SpeakButton text={example.jp} />
              </li>
            ))}
          </ol>
        )}
      </div>

      {point.table && (
        <div className="md:pl-8 print:pl-7">
          <TableView table={point.table} />
        </div>
      )}
    </div>
  );
}

function LessonSection({
  lesson,
  points,
  className,
  sectionRef,
}: {
  lesson: SummaryLesson;
  points: GrammarPoint[];
  className?: string;
  sectionRef?: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      id={sectionRef ? `lesson-${lesson.id}` : undefined}
      ref={sectionRef}
      className={cn(
        "scroll-mt-36 rounded-2xl border bg-card px-4 shadow-2xs sm:px-5",
        "print:rounded-none print:border-0 print:bg-transparent print:px-0 print:shadow-none",
        className
      )}
    >
      {/* div, not <header>: globals.css hides every <header> when printing */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b py-3 break-after-avoid print:border-b-2 print:border-black print:py-1.5">
        <span className="rounded-md bg-primary px-2.5 py-0.5 text-sm font-bold text-primary-foreground print:bg-black print:px-2 print:text-[10pt] print:text-white">
          Bài {lesson.id}
        </span>
        <span className="text-sm font-semibold text-muted-foreground print:text-[10pt] print:text-black">
          第{lesson.id}課
        </span>
        <h2 className="text-base font-bold text-foreground print:text-[11pt]">{lesson.topic}</h2>
      </div>
      <div className="divide-y divide-border/70 print:divide-neutral-300">
        {points.map((point) => (
          <PointRow key={point.pattern} point={point} index={lesson.points.indexOf(point)} />
        ))}
      </div>
    </section>
  );
}

function pointMatches(point: GrammarPoint, query: string) {
  return JSON.stringify(point).toLowerCase().includes(query);
}

export function GrammarSummaryView() {
  const [activeId, setActiveId] = useState<number>(1);
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Print options
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintLessons, setSelectedPrintLessons] = useState<Set<number>>(new Set(ALL_LESSON_IDS));
  const [pageBreakPerLesson, setPageBreakPerLesson] = useState(false);

  const togglePrintLesson = (id: number) => {
    setSelectedPrintLessons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTriggerPrint = () => {
    setIsPrintModalOpen(false);
    setTimeout(() => window.print(), 100);
  };

  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const navRefs = useRef<Record<number, HTMLAnchorElement | null>>({});

  // Track the lesson in view while browsing all lessons
  useEffect(() => {
    if (selectedFilterId !== null || searchQuery.trim() !== "") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(Number(entry.target.id.replace("lesson-", "")));
          }
        }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
    );

    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [selectedFilterId, searchQuery]);

  useEffect(() => {
    navRefs.current[activeId]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  const filteredLessons = useMemo(() => {
    const lessons =
      selectedFilterId !== null
        ? grammarSummaryLessons.filter((l) => l.id === selectedFilterId)
        : grammarSummaryLessons;

    const query = searchQuery.trim().toLowerCase();
    return lessons
      .map((lesson) => {
        if (!query) return { lesson, points: lesson.points };
        const lessonMatches =
          `bài ${lesson.id}`.includes(query) || lesson.topic.toLowerCase().includes(query);
        return { lesson, points: lessonMatches ? lesson.points : lesson.points.filter((p) => pointMatches(p, query)) };
      })
      .filter((entry) => entry.points.length > 0);
  }, [selectedFilterId, searchQuery]);

  const totalPoints = filteredLessons.reduce((acc, entry) => acc + entry.points.length, 0);

  const handleLessonSelect = (id: number | null) => {
    setSelectedFilterId(id);
    if (id !== null) {
      setActiveId(id);
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const printLessons = grammarSummaryLessons.filter((l) => selectedPrintLessons.has(l.id));
  const printScope =
    printLessons.length === grammarSummaryLessons.length
      ? "Bài 1 – 25"
      : printLessons.map((l) => l.id).join(", ");

  return (
    <>
      {/* ===== Print-only document ===== */}
      <div className="hidden print:block text-black">
        <div className="mb-3 flex items-end justify-between border-b-2 border-black pb-1.5">
          <h1 className="text-[14pt] font-extrabold">Tổng hợp ngữ pháp Minna no Nihongo</h1>
          <span className="text-[9pt]">{printScope}</span>
        </div>
        <div className="flex flex-col gap-5">
          {printLessons.map((lesson, i) => (
            <LessonSection
              key={lesson.id}
              lesson={lesson}
              points={lesson.points}
              className={cn(pageBreakPerLesson && i > 0 && "break-before-page")}
            />
          ))}
        </div>
      </div>

      {/* ===== Screen view ===== */}
      <div className="print:hidden flex flex-col gap-4">
        {/* Sticky controls: search + print */}
        <div className="sticky top-14 z-20 flex flex-col gap-2.5 rounded-xl border bg-background/95 p-3 shadow-xs backdrop-blur-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mẫu câu, ví dụ, nghĩa (VD: ください, たい, so sánh)…"
                className="w-full rounded-lg border bg-muted/30 py-1.5 pl-9 pr-8 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2.5 text-xs text-muted-foreground sm:justify-end">
              <span>
                <strong className="font-bold text-foreground">{totalPoints}</strong> mẫu ngữ pháp
              </span>
              {(selectedFilterId !== null || searchQuery !== "") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilterId(null);
                    setSearchQuery("");
                  }}
                  className="font-medium text-primary hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPrintModalOpen(true)}
                className="shrink-0 gap-1.5 border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>In ngữ pháp</span>
              </Button>
            </div>
          </div>

          {/* Lesson jump pills */}
          <nav aria-label="Danh sách bài học" className="flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleLessonSelect(null)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                selectedFilterId === null
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Tất cả
            </button>
            {grammarSummaryLessons.map((lesson) => {
              const highlighted =
                selectedFilterId === lesson.id || (selectedFilterId === null && activeId === lesson.id);
              return (
                <a
                  key={lesson.id}
                  ref={(el) => {
                    navRefs.current[lesson.id] = el;
                  }}
                  href={`#lesson-${lesson.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLessonSelect(lesson.id);
                  }}
                  title={lesson.topic}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                    highlighted
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  Bài {lesson.id}
                </a>
              );
            })}
          </nav>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
            <BookOpen className="size-10 text-muted-foreground/50" />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-foreground">Không tìm thấy nội dung phù hợp</h3>
              <p className="text-xs text-muted-foreground">
                Thử từ khóa khác như &quot;ください&quot;, &quot;たい&quot; hoặc &quot;so sánh&quot;.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilterId(null);
              }}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Xem toàn bộ ngữ pháp
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredLessons.map(({ lesson, points }) => (
              <LessonSection
                key={lesson.id}
                lesson={lesson}
                points={points}
                sectionRef={(el) => {
                  sectionRefs.current[lesson.id] = el;
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== Print options dialog ===== */}
      {isPrintModalOpen && (
        <div
          className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsPrintModalOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Printer className="size-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-foreground">In ngữ pháp (khổ A4)</h3>
                  <p className="text-xs text-muted-foreground">Chọn các bài muốn in</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                aria-label="Đóng"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">
                Đã chọn: <strong className="font-bold text-primary">{selectedPrintLessons.size}</strong> / 25 bài
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPrintLessons(new Set(ALL_LESSON_IDS))}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  Chọn tất cả
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedPrintLessons(new Set())}
                  className="font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            <div className="grid max-h-[45vh] grid-cols-2 gap-2 overflow-y-auto rounded-xl border bg-muted/20 p-2 sm:grid-cols-3">
              {grammarSummaryLessons.map((lesson) => {
                const isChecked = selectedPrintLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => togglePrintLesson(lesson.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all cursor-pointer select-none",
                      isChecked
                        ? "border-primary bg-primary/10 text-primary shadow-2xs"
                        : "border-border/70 bg-card text-muted-foreground hover:border-foreground/30 hover:bg-accent/50"
                    )}
                  >
                    {isChecked ? (
                      <CheckSquare className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Square className="size-4 shrink-0 text-muted-foreground/60" />
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="font-bold">Bài {lesson.id}</span>
                      <span className="truncate text-[10px] font-normal opacity-80">{lesson.topic}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pageBreakPerLesson}
                onChange={(e) => setPageBreakPerLesson(e.target.checked)}
                className="size-4 accent-primary"
              />
              Mỗi bài bắt đầu ở trang mới
            </label>

            <div className="flex items-center justify-end gap-2 border-t pt-3">
              <Button variant="outline" size="sm" onClick={() => setIsPrintModalOpen(false)} className="text-xs cursor-pointer">
                Hủy
              </Button>
              <Button
                size="sm"
                disabled={selectedPrintLessons.size === 0}
                onClick={handleTriggerPrint}
                className="gap-2 text-xs font-bold cursor-pointer"
              >
                <Printer className="size-4" />
                <span>In {selectedPrintLessons.size} bài</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
