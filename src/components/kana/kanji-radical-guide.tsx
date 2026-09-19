"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, PencilLine, Volume2, X, Sparkles, BookOpen, Printer, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KANJI_RADICALS, type KanjiRadical } from "@/lib/kanji-radicals";
import { BASIC_KANJI_WORDS, type BasicKanjiWord } from "@/lib/basic-kanji";
import { EXTRA_KANJI_WORDS } from "@/lib/extra-kanji";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { RadicalStrokeSvg } from "@/components/kana/radical-stroke-svg";
import { RadicalHandwritingCanvas } from "@/components/kana/radical-handwriting-canvas";
import { cn } from "@/lib/utils";

export function KanjiRadicalGuide() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [mainTab, setMainTab] = useState<"kanji-100" | "kanji-extra" | "radicals">("kanji-100");
  const isKanjiListTab = mainTab === "kanji-100" || mainTab === "kanji-extra";
  const currentKanjiSource: BasicKanjiWord[] = mainTab === "kanji-extra" ? EXTRA_KANJI_WORDS : BASIC_KANJI_WORDS;
  const [search, setSearch] = useState("");
  const [selectedStrokeFilter, setSelectedStrokeFilter] = useState<number | "all">("all");
  const [activeRadical, setActiveRadical] = useState<KanjiRadical | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Filtered Radicals List (88 Radicals)
  const filteredRadicals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return KANJI_RADICALS.filter((rad) => {
      if (selectedStrokeFilter !== "all") {
        if (selectedStrokeFilter === 6 && rad.strokes < 6) return false;
        if (selectedStrokeFilter !== 6 && rad.strokes !== selectedStrokeFilter) return false;
      }
      if (!q) return true;
      return (
        rad.char.toLowerCase().includes(q) ||
        rad.hanViet.toLowerCase().includes(q) ||
        rad.meaningVi.toLowerCase().includes(q) ||
        rad.meaningEn.toLowerCase().includes(q) ||
        rad.exampleKanji.some((e) => e.char.includes(q) || e.hanViet.toLowerCase().includes(q))
      );
    });
  }, [search, selectedStrokeFilter]);

  // Filtered Kanji List (100 Basic Kanji, or Extra Kanji when that tab is active)
  const filteredKanjiWords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return currentKanjiSource.filter((k) => {
      if (selectedStrokeFilter !== "all") {
        if (k.strokes !== selectedStrokeFilter) return false;
      }
      if (!q) return true;
      return (
        k.char.toLowerCase().includes(q) ||
        k.hanViet.toLowerCase().includes(q) ||
        k.hiragana.toLowerCase().includes(q) ||
        k.meaningVi.toLowerCase().includes(q) ||
        k.exampleWords.some((e) => e.word.includes(q) || e.reading.includes(q) || e.meaning.toLowerCase().includes(q))
      );
    });
  }, [search, selectedStrokeFilter, currentKanjiSource]);

  // Active items list for Modal navigation
  const activeList = useMemo<KanjiRadical[]>(() => {
    if (isKanjiListTab) {
      return filteredKanjiWords.map((k) => ({
        id: k.id,
        char: k.char,
        hanViet: k.hanViet,
        strokes: k.strokes,
        meaningVi: `${k.meaningVi} (Âm đọc: ${k.hiragana})`,
        meaningEn: k.meaningEn,
        strokeGuide: `Chữ Kanji cơ bản gồm ${k.strokes} nét.`,
        strokePaths: k.strokePaths,
        exampleKanji: k.exampleWords.map((w) => ({
          char: w.word,
          pinyin: w.reading,
          hanViet: w.reading,
          meaning: w.meaning,
        })),
      }));
    }
    return filteredRadicals;
  }, [isKanjiListTab, filteredKanjiWords, filteredRadicals]);

  // Current Modal Navigation Index & Items
  const currentIndex = useMemo(() => {
    if (!activeRadical) return -1;
    return activeList.findIndex((item) => item.id === activeRadical.id || item.char === activeRadical.char);
  }, [activeRadical, activeList]);

  const prevItem = currentIndex > 0 ? activeList[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < activeList.length - 1 ? activeList[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevItem) {
      setActiveRadical(prevItem);
      setIsPracticing(false);
      setReplayKey((k) => k + 1);
    }
  };

  const handleNext = () => {
    if (nextItem) {
      setActiveRadical(nextItem);
      setIsPracticing(false);
      setReplayKey((k) => k + 1);
    }
  };

  // Keyboard navigation for Modal (Left/Right Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeRadical) return;
      if (e.key === "ArrowLeft" && prevItem) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight" && nextItem) {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        setActiveRadical(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRadical, prevItem, nextItem]);

  const strokeOptions = useMemo(() => {
    if (isKanjiListTab) {
      return [
        { label: "Tất cả", value: "all" as const },
        { label: "1 nét", value: 1 },
        { label: "2 nét", value: 2 },
        { label: "3 nét", value: 3 },
        { label: "4 nét", value: 4 },
        { label: "5 nét", value: 5 },
        { label: "6 nét", value: 6 },
        { label: "7 nét", value: 7 },
        { label: "8 nét", value: 8 },
        { label: "9 nét", value: 9 },
        { label: "10 nét", value: 10 },
        { label: "12 nét", value: 12 },
      ];
    }
    return [
      { label: "Tất cả nét", value: "all" as const },
      { label: "1 nét", value: 1 },
      { label: "2 nét", value: 2 },
      { label: "3 nét", value: 3 },
      { label: "4 nét", value: 4 },
      { label: "5 nét", value: 5 },
      { label: "6+ nét", value: 6 },
    ];
  }, [isKanjiListTab]);

  return (
    <div className="flex flex-col gap-6 print:gap-3">
      {/* Printable Sheet Header */}
      <div className="hidden print:flex flex-col gap-1 pb-3 mb-2 border-b border-black">
        <h1 className="text-xl font-extrabold text-black uppercase tracking-tight">
          {mainTab === "kanji-100"
            ? `BẢNG ${BASIC_KANJI_WORDS.length} CHỮ KANJI CƠ BẢN TIẾNG NHẬT`
            : mainTab === "kanji-extra"
            ? `BẢNG ${EXTRA_KANJI_WORDS.length} CHỮ KANJI MỞ RỘNG`
            : `BẢNG ${KANJI_RADICALS.length} BỘ THỦ KANJI TIẾNG NHẬT`}
        </h1>
        <p className="text-xs text-gray-700">
          Tên Hán-Việt chính thức, số nét, ý nghĩa tượng hình & từ ghép Kanji tiêu biểu.
        </p>
      </div>

      {/* 1. Top Sub-Tabs Navigation Bar & Print Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-muted/60 p-1.5 border border-border/40 w-fit overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setMainTab("kanji-100");
              setSearch("");
              setSelectedStrokeFilter("all");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
              mainTab === "kanji-100"
                ? "bg-red-600 text-white shadow-2xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <Sparkles className="size-4 text-amber-300" />
            <span>Chữ Kanji cơ bản ({BASIC_KANJI_WORDS.length} chữ)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMainTab("kanji-extra");
              setSearch("");
              setSelectedStrokeFilter("all");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
              mainTab === "kanji-extra"
                ? "bg-red-600 text-white shadow-2xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <Sparkles className="size-4 text-amber-300" />
            <span>Kanji mở rộng ({EXTRA_KANJI_WORDS.length} chữ)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMainTab("radicals");
              setSearch("");
              setSelectedStrokeFilter("all");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
              mainTab === "radicals"
                ? "bg-red-600 text-white shadow-2xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <BookOpen className="size-4" />
            <span>Bộ thủ Kanji ({KANJI_RADICALS.length} bộ)</span>
          </button>
        </div>

        {/* Print Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="gap-2 font-bold text-xs rounded-xl border-border/80 hover:bg-accent cursor-pointer self-start sm:self-auto"
        >
          <Printer className="size-4 text-red-600" />
          <span>In bảng Kanji A4</span>
        </Button>
      </div>

      {/* 2. Title Header Banner Box */}
      {isKanjiListTab ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs print:hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/10 dark:bg-amber-950/50 border border-amber-500/20 px-2.5 py-0.5 text-xs font-extrabold text-amber-600">
                  {mainTab === "kanji-100" ? "Chữ cơ bản (N5/N4)" : "Kanji mở rộng"}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">{currentKanjiSource.length} Kanji</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {mainTab === "kanji-100" ? "Bảng Chữ Kanji Cơ Bản (漢字)" : "Bảng Kanji Mở Rộng (漢字 bổ sung)"}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {mainTab === "kanji-100"
                  ? "Tổng hợp 100 chữ Kanji cơ bản thường gặp nhất trong giao tiếp & kỳ thi JLPT N5/N4. Bấm vào chữ để xem cách viết, phiên âm Hán-Việt, Hiragana và từ ghép ví dụ!"
                  : "Các chữ Kanji xuất hiện trong bài học nhưng nằm ngoài 100 chữ cơ bản. Bấm vào chữ để xem cách viết, phiên âm Hán-Việt, Hiragana và từ ghép ví dụ!"}
              </p>
            </div>

            {/* Total Count Card Badge */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 px-5 py-3 text-center shrink-0 self-start sm:self-auto">
              <span className="text-3xl font-black text-amber-600">{currentKanjiSource.length}</span>
              <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">CHỮ HÁN</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col gap-3 pt-3 border-t border-border/50 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo chữ, Hán-Việt, Hiragana..."
                className="w-full rounded-xl border border-border/80 bg-muted/30 py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-red-600 focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-red-600 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-muted-foreground shrink-0 mr-1">Số nét:</span>
              {strokeOptions.map((opt) => {
                const isActive = selectedStrokeFilter === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setSelectedStrokeFilter(opt.value)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer select-none",
                      isActive
                        ? "bg-foreground text-background shadow-2xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Radicals Header */
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs print:hidden">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 text-foreground font-extrabold text-lg sm:text-xl tracking-tight">
              <BookOpen className="size-5 text-red-600 shrink-0" />
              <span>Bảng {KANJI_RADICALS.length} Bộ Thủ Cơ Bản (Kanji Radicals)</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Bộ thủ (Radicals) là các nét ghép nền tảng giúp cấu thành nên tất cả các chữ Kanji trong tiếng Nhật. Tra cứu tên Hán-Việt, ý nghĩa tượng hình, số nét và cách viết chi tiết từng bộ thủ dưới đây.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t border-border/50 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm chữ, Hán-Việt (vd: Chấm chủ, 3 chấm thủy)..."
                className="w-full rounded-xl border border-border/80 bg-muted/30 py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-red-600 focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-red-600 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {strokeOptions.map((opt) => {
                const isActive = selectedStrokeFilter === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setSelectedStrokeFilter(opt.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer select-none",
                      isActive
                        ? "bg-foreground text-background shadow-2xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Grid View Section */}
      {isKanjiListTab ? (
        filteredKanjiWords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-muted-foreground text-xs font-medium">
            Không tìm thấy chữ Kanji nào phù hợp với từ khóa hoặc bộ lọc.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5 print:grid-cols-4 print:gap-2">
            {filteredKanjiWords.map((kanji) => (
              <div
                key={kanji.id}
                onClick={() => {
                  setActiveRadical({
                    id: kanji.id,
                    char: kanji.char,
                    hanViet: kanji.hanViet,
                    strokes: kanji.strokes,
                    meaningVi: `${kanji.meaningVi} (Âm đọc: ${kanji.hiragana})`,
                    meaningEn: kanji.meaningEn,
                    strokeGuide: `Chữ Kanji cơ bản gồm ${kanji.strokes} nét.`,
                    strokePaths: kanji.strokePaths,
                    exampleKanji: kanji.exampleWords.map((w) => ({
                      char: w.word,
                      pinyin: w.reading,
                      hanViet: w.reading,
                      meaning: w.meaning,
                    })),
                  });
                  setIsPracticing(false);
                  setReplayKey((k) => k + 1);
                }}
                className="group relative flex flex-col justify-between items-center rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-md cursor-pointer select-none print:break-inside-avoid print:p-2.5"
              >
                {/* Card Top */}
                <div className="w-full flex items-center justify-between text-[11px] font-medium text-muted-foreground/80 mb-1">
                  <span>{kanji.strokes} nét</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(kanji.char);
                    }}
                    className="rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 cursor-pointer print:hidden"
                    title={`Listen to ${kanji.char}`}
                  >
                    <Volume2 className="size-3.5" />
                  </button>
                </div>

                {/* Center Character & Hán-Việt badge */}
                <div className="my-2 flex flex-col items-center gap-1.5">
                  <span className="text-4xl font-extrabold text-foreground transition-colors group-hover:text-amber-600 font-kanji-mincho">
                    {kanji.char}
                  </span>
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                    {kanji.hanViet}
                  </span>
                </div>

                {/* Bottom Reading & Meaning */}
                <div className="w-full flex flex-col items-center gap-0.5 mt-1 pt-2 border-t border-border/40">
                  <span className="text-xs font-bold text-foreground truncate w-full text-center">
                    {kanji.hiragana}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate w-full text-center font-normal">
                    {kanji.meaningVi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* 88 RADICALS GRID */
        filteredRadicals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-muted-foreground text-xs font-medium">
            Không tìm thấy bộ thủ nào phù hợp với từ khóa hoặc bộ lọc số nét.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-3 print:p-0">
            {filteredRadicals.map((rad) => (
              <div
                key={rad.id}
                onClick={() => {
                  setActiveRadical(rad);
                  setIsPracticing(false);
                  setReplayKey((k) => k + 1);
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/50 hover:shadow-md cursor-pointer select-none print:break-inside-avoid print:border-gray-400 print:shadow-none print:bg-white print:p-3"
              >
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl font-extrabold text-foreground transition-colors group-hover:text-red-600 font-kanji-mincho shrink-0">
                      {rad.char}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-extrabold text-foreground tracking-tight truncate">
                        {rad.hanViet}
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        {rad.strokes} {isVi ? "nét" : "strokes"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(rad.char);
                    }}
                    className="rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 cursor-pointer shrink-0 print:hidden"
                    title={`Listen to ${rad.char}`}
                  >
                    <Volume2 className="size-4" />
                  </button>
                </div>

                {/* Card Middle */}
                <div className="my-3 flex flex-col gap-1 text-xs text-muted-foreground">
                  <p className="line-clamp-2 leading-relaxed text-muted-foreground font-normal text-xs">
                    {rad.meaningVi}
                  </p>
                </div>

                {/* Card Bottom */}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-border/50 text-xs">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                      Ví dụ:
                    </span>
                    {rad.exampleKanji.slice(0, 2).map((ex, i) => (
                      <span
                        key={`${ex.char}-${i}`}
                        className="rounded-md bg-muted/80 px-1.5 py-0.5 text-xs font-bold text-foreground font-kanji-mincho"
                        title={`${ex.char} (${ex.hanViet}): ${ex.meaning}`}
                      >
                        {ex.char}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRadical(rad);
                      setIsPracticing(false);
                      setReplayKey((k) => k + 1);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:text-red-600 transition-colors shrink-0"
                  >
                    <span>Cách viết</span>
                    <PencilLine className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 4. Radical / Kanji Detail & Stroke Writer Modal with Next/Previous Controls */}
      {activeRadical && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 print:hidden"
          onClick={() => setActiveRadical(null)}
        >
          <div
            className="relative flex w-full max-w-lg flex-col gap-5 rounded-2xl border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-extrabold text-foreground font-kanji-mincho">
                  {activeRadical.char}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-red-600">
                      {activeRadical.hanViet}
                    </h3>
                    <Badge variant="secondary" className="font-semibold text-xs">
                      {activeRadical.strokes} {isVi ? "nét" : "strokes"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {activeRadical.meaningEn}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRadical(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setIsPracticing(false)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    !isPracticing
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isVi ? "Hoạt ảnh nét viết" : "Stroke Order Animation"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPracticing(true)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    isPracticing
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isVi ? "Tự luyện viết nét ✍️" : "Practice Writing ✍️"}
                </button>
              </div>

              {!isPracticing ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="relative w-full max-w-[200px] aspect-square rounded-xl border bg-background/80 p-3 shadow-inner flex items-center justify-center">
                    <RadicalStrokeSvg
                      radical={activeRadical}
                      externalPlayKey={replayKey}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplayKey((k) => k + 1)}
                      className="gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <RotateCcw className="size-3.5 text-red-600" />
                      <span>{isVi ? "Phát lại nét viết" : "Replay Strokes"}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakJapanese(activeRadical.char)}
                      className="gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <Volume2 className="size-3.5 text-red-600" />
                      <span>{isVi ? "Nghe đọc" : "Audio"}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full">
                  <RadicalHandwritingCanvas
                    radical={activeRadical}
                    className="w-full max-w-[220px] aspect-square rounded-2xl border bg-muted/20 p-2 shadow-inner mx-auto flex items-center justify-center"
                  />
                  <p className="text-[11px] text-muted-foreground text-center mt-1">
                    {isVi
                      ? "Dùng chuột hoặc ngón tay vẽ đè lên hình nét gợi ý để luyện tập."
                      : "Trace over the guide lines using mouse or touch to practice."}
                  </p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 text-xs">
              <div>
                <span className="font-bold text-foreground">Ý nghĩa:</span>{" "}
                <span className="text-muted-foreground leading-relaxed">
                  {activeRadical.meaningVi}
                </span>
              </div>

              <div>
                <span className="font-bold text-foreground">Chữ / Từ ghép tiêu biểu:</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {activeRadical.exampleKanji.map((ex, i) => (
                    <div
                      key={`${ex.char}-${i}`}
                      className="flex items-center gap-2 rounded-lg border bg-background p-2"
                    >
                      <span className="text-2xl font-extrabold text-red-600 font-kanji-mincho">
                        {ex.char}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-foreground truncate">{ex.hanViet}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{ex.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Next / Previous Navigation Buttons (Strictly matching mockup media_1789143685938.png) */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
              <button
                type="button"
                disabled={!prevItem}
                onClick={handlePrev}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background hover:bg-accent px-3.5 py-2 text-xs font-bold text-foreground transition-all cursor-pointer select-none",
                  !prevItem && "opacity-40 cursor-not-allowed hover:bg-background"
                )}
              >
                <ArrowLeft className="size-3.5" />
                <span>{prevItem ? `Chữ trước (${prevItem.char})` : "Chữ trước"}</span>
              </button>

              <button
                type="button"
                disabled={!nextItem}
                onClick={handleNext}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer select-none shadow-2xs",
                  !nextItem && "opacity-40 cursor-not-allowed hover:bg-red-600"
                )}
              >
                <span>{nextItem ? `Chữ kế tiếp (${nextItem.char})` : "Chữ kế tiếp"}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
