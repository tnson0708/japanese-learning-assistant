"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Volume2, X, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";
import {
  grammarSummaryLessons,
  type SummaryCard,
  type SummaryCardBlock,
  type SummaryExampleItem,
  type SummaryTable,
} from "@/data/theory/grammar-summary";

/** Splits `{{gloss}}` markup out of a line into plain text + styled gloss nodes. */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]*\}\})/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\{\{([^}]*)\}\}$/);
        if (m) {
          return (
            <em key={i} className="italic text-muted-foreground/90 font-normal">
              {" "}
              ({m[1]})
            </em>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** A Japanese pattern/example line with inline `{{gloss}}` text plus a speak button (gloss stripped before TTS). */
function SpeakableLine({ text, className }: { text: string; className?: string }) {
  const spoken = text.replace(/\{\{[^}]*\}\}/g, "").trim();
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      <span>
        <InlineText text={text} />
      </span>
      {spoken && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            speakJapanese(spoken);
          }}
          className="shrink-0 rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
          aria-label={`Nghe phát âm: ${spoken}`}
          title="Nghe phát âm"
        >
          <Volume2 className="size-3.5" />
        </button>
      )}
    </span>
  );
}

function NotesBlock({ lines }: { lines: string[] }) {
  const filtered = lines.filter((l) => l.trim() && !/^\d+\s*[\.…]+$/.test(l.trim()));
  if (filtered.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 text-sm leading-relaxed text-foreground">
      {filtered.map((line, i) => (
        <p key={i} className="flex items-start gap-1.5">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
          <span className="flex-1">
            <InlineText text={line} />
          </span>
        </p>
      ))}
    </div>
  );
}

function PatternBlock({ lines }: { lines: string[] }) {
  const filtered = lines.filter((l) => l.trim());
  if (filtered.length === 0) return null;

  return (
    <div className="flex flex-col divide-y divide-primary/15 overflow-hidden rounded-lg border border-primary/25 bg-primary/5 shadow-xs">
      {filtered.map((line, i) => (
        <div key={i} className="px-3 py-2 text-sm font-semibold text-foreground">
          <SpeakableLine text={line} />
        </div>
      ))}
    </div>
  );
}

function TableBlock({ table }: { table: SummaryTable }) {
  if (table.kind === "note") {
    return (
      <p className="rounded-lg border border-dashed border-primary/20 bg-muted/40 px-3.5 py-2 text-sm leading-relaxed text-foreground">
        <InlineText text={table.text} />
      </p>
    );
  }

  // Filter out rows that are entirely empty/null
  const nonEmpRows = table.rows.filter((row) => row.some((cell) => cell !== null && cell.trim() !== ""));
  if (nonEmpRows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border bg-card/60 shadow-xs">
      <table className="w-full border-collapse text-xs sm:text-sm">
        <tbody>
          {nonEmpRows.map((row, ri) => (
            <tr key={ri} className="even:bg-muted/30">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "border px-2 py-1.5 text-center text-foreground",
                    cell === null && "bg-muted/10 border-muted/30"
                  )}
                >
                  {cell ? <InlineText text={cell} /> : <span className="text-muted-foreground/30">•</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExampleItemRow({ item }: { item: SummaryExampleItem }) {
  const validLines = item.lines.filter(
    (line) => line.text.trim() && !/^\d+\s*[\.…]+$/.test(line.text.trim())
  );
  if (validLines.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 py-2 first:pt-0 last:pb-0">
      {validLines.map((line, i) => {
        if (line.kind === "note") {
          return (
            <p key={i} className="text-xs italic leading-relaxed text-muted-foreground">
              <InlineText text={line.text} />
            </p>
          );
        }
        return (
          <div
            key={i}
            className={cn(
              "text-sm leading-relaxed",
              line.kind === "response" && "pl-3 text-muted-foreground"
            )}
          >
            <SpeakableLine text={line.text} />
          </div>
        );
      })}
    </div>
  );
}

function ExamplesBlockView({ label, items }: { label?: string; items: SummaryExampleItem[] }) {
  const filteredItems = items.filter((item) =>
    item.lines.some((line) => line.text.trim() && !/^\d+\s*[\.…]+$/.test(line.text.trim()))
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3.5 py-1.5">
      {label && (
        <p className="pt-1.5 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex flex-col divide-y divide-border/50">
        {filteredItems.map((item, i) => (
          <ExampleItemRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

function BlockView({ block }: { block: SummaryCardBlock }) {
  switch (block.type) {
    case "notes":
      return <NotesBlock lines={block.lines} />;
    case "pattern":
      return <PatternBlock lines={block.lines} />;
    case "table":
      return <TableBlock table={block.table} />;
    case "examples":
      return <ExamplesBlockView label={block.label} items={block.items} />;
    default:
      return null;
  }
}

/** Determine a small category badge for card visual clarity */
function getCardHeaderBadge(card: SummaryCard) {
  const hasPattern = card.blocks.some((b) => b.type === "pattern");
  const hasTable = card.blocks.some((b) => b.type === "table");
  const hasExamples = card.blocks.some((b) => b.type === "examples");

  if (hasPattern) return { label: "Mẫu câu", color: "bg-primary/10 text-primary border-primary/20" };
  if (hasTable) return { label: "Bảng tra cứu", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" };
  if (hasExamples) return { label: "Ví dụ", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" };
  return { label: "Ghi chú", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" };
}

function GrammarSummaryCardView({ card }: { card: SummaryCard }) {
  const badge = getCardHeaderBadge(card);

  return (
    <Card className="group transition-all duration-200 hover:border-primary/30 hover:shadow-xs">
      <CardContent className="flex flex-col gap-2.5 p-3.5 sm:p-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
              badge.color
            )}
          >
            <Sparkles className="size-2.5" />
            {badge.label}
          </span>
        </div>
        {card.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </CardContent>
    </Card>
  );
}

export function GrammarSummaryView() {
  const [activeId, setActiveId] = useState<number>(1);
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const navRefs = useRef<Record<number, HTMLAnchorElement | null>>({});

  // Intersection observer for section tracking when viewing all lessons
  useEffect(() => {
    if (selectedFilterId !== null || searchQuery.trim() !== "") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = Number(entry.target.id.replace("lesson-", ""));
            setActiveId(id);
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
    if (activeId && navRefs.current[activeId]) {
      navRefs.current[activeId]?.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [activeId]);

  // Filter lessons & cards based on selected lesson or search query
  const filteredLessons = useMemo(() => {
    let result = grammarSummaryLessons;

    if (selectedFilterId !== null) {
      result = result.filter((l) => l.id === selectedFilterId);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result
      .map((lesson) => {
        const matchingCards = lesson.cards.filter((card) => {
          const cardText = JSON.stringify(card).toLowerCase();
          return cardText.includes(query) || lesson.badge.toLowerCase().includes(query) || lesson.heading.toLowerCase().includes(query);
        });

        if (matchingCards.length === 0) return null;
        return {
          ...lesson,
          cards: matchingCards,
        };
      })
      .filter(Boolean) as typeof grammarSummaryLessons;
  }, [selectedFilterId, searchQuery]);

  const totalCardsCount = useMemo(() => {
    return filteredLessons.reduce((acc, l) => acc + l.cards.length, 0);
  }, [filteredLessons]);

  const handleLessonSelect = (id: number | null) => {
    setSelectedFilterId(id);
    if (id !== null) {
      setActiveId(id);
      const targetEl = sectionRefs.current[id];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky top control header: Search + Lesson selector pills */}
      <div className="sticky top-14 z-20 flex flex-col gap-2.5 rounded-xl border bg-background/95 p-3 shadow-xs backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu câu, ví dụ, từ khóa (VD: ください, たい, Bài 5)..."
              className="w-full rounded-lg border bg-muted/30 py-1.5 pl-9 pr-8 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Xóa tìm kiếm"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground sm:justify-end sm:gap-2">
            <span>
              {searchQuery ? (
                <>Tìm thấy <strong className="font-bold text-foreground">{totalCardsCount}</strong> mục</>
              ) : (
                <>Tổng cộng <strong className="font-bold text-foreground">25</strong> Bài học</>
              )}
            </span>

            {(selectedFilterId !== null || searchQuery !== "") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFilterId(null);
                  setSearchQuery("");
                }}
                className="text-primary hover:underline font-medium"
              >
                Xem tất cả
              </button>
            )}
          </div>
        </div>

        {/* Scrollable horizontal pills for quick jumping */}
        <nav
          aria-label="Danh sách bài học"
          className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5"
        >
          <button
            type="button"
            onClick={() => handleLessonSelect(null)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
              selectedFilterId === null
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Tất cả (Bài 1–25)
          </button>

          {grammarSummaryLessons.map((lesson) => {
            const isSelected = selectedFilterId === lesson.id;
            const isActive = activeId === lesson.id && selectedFilterId === null;

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
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
                  isSelected || isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {lesson.badge}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Empty search results state */}
      {filteredLessons.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
          <BookOpen className="size-10 text-muted-foreground/50" />
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-foreground">Không tìm thấy nội dung phù hợp</h3>
            <p className="text-xs text-muted-foreground">
              Thử tìm với từ khóa khác như &quot;ください&quot;, &quot;たい&quot;, hoặc &quot;より&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedFilterId(null);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Xem toàn bộ ngữ pháp
          </button>
        </div>
      )}

      {/* Main lessons masonry cards view */}
      <div className="flex flex-col gap-8">
        {filteredLessons.map((lesson) => (
          <section
            key={lesson.id}
            id={`lesson-${lesson.id}`}
            ref={(el) => {
              sectionRefs.current[lesson.id] = el;
            }}
            className="scroll-mt-36"
          >
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {lesson.badge}
                </span>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  {lesson.heading}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {lesson.cards.length} thẻ ngữ pháp
              </span>
            </div>

            {/* Masonry Columns Layout replacing equal-height grid */}
            <div className="columns-1 md:columns-2 gap-3 space-y-3">
              {lesson.cards.map((card, i) => (
                <div key={i} className="break-inside-avoid">
                  <GrammarSummaryCardView card={card} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
