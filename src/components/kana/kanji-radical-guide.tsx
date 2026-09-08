"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw, PencilLine, Volume2, X, Sparkles, BookOpen, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KANJI_RADICALS, type KanjiRadical } from "@/lib/kanji-radicals";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { RadicalStrokeSvg } from "@/components/kana/radical-stroke-svg";
import { RadicalHandwritingCanvas } from "@/components/kana/radical-handwriting-canvas";

export function KanjiRadicalGuide() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [search, setSearch] = useState("");
  const [selectedStrokeFilter, setSelectedStrokeFilter] = useState<number | "all">("all");
  const [activeRadical, setActiveRadical] = useState<KanjiRadical | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const filteredRadicals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return KANJI_RADICALS.filter((rad) => {
      // Stroke filter
      if (selectedStrokeFilter !== "all") {
        if (selectedStrokeFilter === 6 && rad.strokes < 6) return false;
        if (selectedStrokeFilter !== 6 && rad.strokes !== selectedStrokeFilter) return false;
      }
      // Search filter
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

  const strokeOptions = [
    { label: isVi ? "Tất cả nét" : "All Strokes", value: "all" as const },
    { label: "1 nét", value: 1 },
    { label: "2 nét", value: 2 },
    { label: "3 nét", value: 3 },
    { label: "4 nét", value: 4 },
    { label: "5 nét", value: 5 },
    { label: "6+ nét", value: 6 },
  ];

  return (
    <div className="flex flex-col gap-6 print:gap-3">
      {/* Printable Sheet Header (Only visible on paper print) */}
      <div className="hidden print:flex flex-col gap-1 pb-3 mb-2 border-b border-black">
        <h1 className="text-xl font-extrabold text-black uppercase tracking-tight">
          {isVi ? `BẢNG ${KANJI_RADICALS.length} BỘ THỦ KANJI TIẾNG NHẬT` : `JAPANESE KANJI RADICALS SHEET (${KANJI_RADICALS.length} RADICALS)`}
        </h1>
        <p className="text-xs text-gray-700">
          {isVi
            ? "Tên Hán-Việt chính thức, số nét, ý nghĩa tượng hình & ví dụ chữ Kanji tiêu biểu."
            : "Official Sino-Vietnamese names, stroke counts, meanings, and example Kanji."}
        </p>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col gap-2 rounded-xl border bg-card/60 p-4 sm:p-5 shadow-2xs print:hidden">
        <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
          <BookOpen className="size-5 shrink-0" />
          <span>
            {isVi
              ? `Bảng ${KANJI_RADICALS.length} Bộ Thủ Cơ Bản (Kanji Radicals)`
              : `${KANJI_RADICALS.length} Essential Kanji Radicals`}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? "Bộ thủ (Radicals) là các nét ghép nền tảng giúp cấu thành nên tất cả các chữ Kanji trong tiếng Nhật. Tra cứu tên Hán-Việt, ý nghĩa tượng hình, số nét và cách viết chi tiết từng bộ thủ dưới đây."
            : "Radicals are the fundamental building blocks of all Japanese Kanji characters. Learn their Sino-Vietnamese (Hán-Việt) names, meanings, stroke counts, and stroke orders below."}
        </p>

        {/* Filter Controls Bar */}
        <div className="mt-2 flex flex-col gap-3 pt-3 border-t sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isVi
                  ? "Tìm chữ, Hán-Việt (vd: Chấm chủ, 3 chấm thủy)..."
                  : "Search character or Hán-Việt (e.g. Chấm chủ)..."
              }
              className="w-full rounded-lg border bg-background pl-9 pr-8 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Stroke Count Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {strokeOptions.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setSelectedStrokeFilter(opt.value)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  selectedStrokeFilter === opt.value
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Radical Grid View */}
      {filteredRadicals.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
          {isVi
            ? "Không tìm thấy bộ thủ nào phù hợp với từ khóa hoặc bộ lọc."
            : "No Kanji radicals match your search query or stroke filter."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 print:grid-cols-3 print:gap-3 print:p-0">
          {filteredRadicals.map((rad) => (
            <div
              key={rad.id}
              onClick={() => {
                setActiveRadical(rad);
                setIsPracticing(false);
                setReplayKey((k) => k + 1);
              }}
              className="group relative flex flex-col justify-between rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md cursor-pointer print:break-inside-avoid print:border-gray-400 print:shadow-none print:bg-white print:p-3 print:rounded-lg"
            >
              {/* Card Top: Big Radical Char + Han-Viet Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-extrabold text-foreground transition-colors group-hover:text-primary font-serif print:text-black print:text-3xl">
                    {rad.char}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary tracking-tight print:text-black print:font-extrabold">
                      {rad.hanViet}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground print:text-gray-700">
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
                  className="rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary cursor-pointer print:hidden"
                  title={`Listen to ${rad.char}`}
                >
                  <Volume2 className="size-4" />
                </button>
              </div>

              {/* Card Middle: Meaning & Guide */}
              <div className="my-3 flex flex-col gap-1 text-xs text-muted-foreground">
                <p className="line-clamp-2 leading-relaxed text-foreground/90 font-normal print:line-clamp-none print:text-gray-900 print:text-[11px]">
                  {rad.meaningVi}
                </p>
              </div>

              {/* Card Bottom: Example Kanji tags + Stroke Button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1 overflow-hidden">
                  <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                    {isVi ? "Ví dụ:" : "Ex:"}
                  </span>
                  {rad.exampleKanji.slice(0, 2).map((ex) => (
                    <span
                      key={ex.char}
                      className="rounded-md bg-secondary/80 px-1.5 py-0.5 text-xs font-bold text-foreground font-serif"
                      title={`${ex.char} (${ex.hanViet}): ${ex.meaning}`}
                    >
                      {ex.char}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary group-hover:underline">
                  <span>{isVi ? "Cách viết" : "Strokes"}</span>
                  <PencilLine className="size-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Radical Detail & Stroke Writer Modal */}
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
                <span className="text-5xl font-extrabold text-foreground font-serif">
                  {activeRadical.char}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-primary">
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

            {/* Modal Body: Switch between Animated Stroke View and Interactive Writing Canvas */}
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
                      ? "bg-primary text-primary-foreground shadow-2xs"
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
                      <RotateCcw className="size-3.5 text-primary" />
                      <span>{isVi ? "Phát lại nét viết" : "Replay Strokes"}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakJapanese(activeRadical.char)}
                      className="gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <Volume2 className="size-3.5 text-primary" />
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

            {/* Radical Details & Rules */}
            <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 text-xs">
              <div>
                <span className="font-bold text-foreground">
                  {isVi ? "Ý nghĩa & Vai trò:" : "Meaning & Role:"}
                </span>{" "}
                <span className="text-muted-foreground leading-relaxed">
                  {activeRadical.meaningVi}
                </span>
              </div>

              <div>
                <span className="font-bold text-foreground">
                  {isVi ? "Quy tắc nét:" : "Stroke Rule:"}
                </span>{" "}
                <span className="text-muted-foreground leading-relaxed">
                  {activeRadical.strokeGuide}
                </span>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-1.5">
                  {isVi ? "Chữ Kanji ghép tiêu biểu:" : "Example Kanji Characters:"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {activeRadical.exampleKanji.map((ex) => (
                    <div
                      key={ex.char}
                      className="flex items-center gap-2 rounded-lg border bg-background p-2"
                    >
                      <span className="text-2xl font-extrabold text-primary font-serif">
                        {ex.char}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{ex.hanViet}</span>
                        <span className="text-[10px] text-muted-foreground">{ex.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
