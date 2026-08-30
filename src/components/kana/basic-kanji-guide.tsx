"use client";

import { useState, useMemo } from "react";
import { Search, Volume2, RotateCw, PenTool, BookOpen, Layers, Sparkles } from "lucide-react";
import { BASIC_KANJI_WORDS, type BasicKanjiWord } from "@/lib/basic-kanji";
import { BasicKanjiStrokeSvg } from "@/components/kana/basic-kanji-stroke-svg";
import { BasicKanjiHandwritingCanvas } from "@/components/kana/basic-kanji-handwriting-canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";

export function BasicKanjiGuide() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [search, setSearch] = useState("");
  const [selectedStrokes, setSelectedStrokes] = useState<number | null>(null);
  const [selectedKanji, setSelectedKanji] = useState<BasicKanjiWord | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [practiceMode, setPracticeMode] = useState<"animation" | "canvas">("animation");

  // Filter kanji
  const filteredKanji = useMemo(() => {
    return BASIC_KANJI_WORDS.filter((item) => {
      if (selectedStrokes !== null && item.strokes !== selectedStrokes) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase().trim();
      return (
        item.char.includes(q) ||
        item.hanViet.toLowerCase().includes(q) ||
        item.hiragana.toLowerCase().includes(q) ||
        item.meaningVi.toLowerCase().includes(q) ||
        item.meaningEn.toLowerCase().includes(q)
      );
    });
  }, [search, selectedStrokes]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const strokeCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background p-6 md:p-8 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 font-bold">
                {isVi ? "Chữ cơ bản (N5/N4)" : "Basic Kanji (N5/N4)"}
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">100 Kanji</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isVi ? "Bảng Chữ Kanji Cơ Bản (漢字)" : "Basic Kanji Characters (漢字)"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {isVi
                ? "Tổng hợp 100 chữ Kanji cơ bản thường gặp nhất trong giao tiếp & kỳ thi JLPT N5/N4. Bấm vào chữ để xem cách viết, phiên âm Hán-Việt, Hiragana và từ ghép ví dụ!"
                : "Explore 100 essential Kanji characters for Japanese learners. Click any card for stroke order animations, readings, and example vocabulary!"}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card/80 p-3 px-4 shadow-2xs backdrop-blur-xs">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">100</span>
              <span className="text-[11px] font-semibold text-muted-foreground">{isVi ? "Chữ Hán" : "Kanji Words"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-2xs md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isVi ? "Tìm theo chữ, Hán-Việt, Hiragana..." : "Search by char, reading, meaning..."}
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Stroke Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none md:pb-0">
          <span className="text-xs font-semibold text-muted-foreground mr-1 shrink-0">
            {isVi ? "Số nét:" : "Strokes:"}
          </span>
          <Button
            variant={selectedStrokes === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStrokes(null)}
            className="h-7 text-xs px-2.5 rounded-full cursor-pointer"
          >
            {isVi ? "Tất cả" : "All"}
          </Button>
          {strokeCounts.map((cnt) => (
            <Button
              key={cnt}
              variant={selectedStrokes === cnt ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStrokes(cnt)}
              className="h-7 text-xs px-2.5 rounded-full cursor-pointer"
            >
              {cnt} {isVi ? "nét" : ""}
            </Button>
          ))}
        </div>
      </div>

      {/* Kanji Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filteredKanji.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedKanji(item);
              setAnimKey((prev) => prev + 1);
              setPracticeMode("animation");
            }}
            className="group relative flex flex-col items-center justify-between rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-md cursor-pointer"
          >
            {/* Top Row: Stroke Badge & Sound Button */}
            <div className="flex w-full items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {item.strokes} {isVi ? "nét" : "str"}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(item.char);
                }}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-600"
                title="Phát âm"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>

            {/* Kanji Character Display */}
            <div className="my-3 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-tight text-foreground transition-transform duration-200 group-hover:scale-110 font-serif">
                {item.char}
              </span>
            </div>

            {/* Bottom Info: Hán-Việt & Readings */}
            <div className="flex w-full flex-col items-center gap-1 text-center border-t pt-2.5">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-bold px-2 py-0.5">
                {item.hanViet}
              </Badge>

              <span className="text-xs font-semibold text-primary/80 line-clamp-1">
                {item.hiragana}
              </span>

              <span className="text-[11px] text-muted-foreground line-clamp-1">
                {item.meaningVi}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredKanji.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="size-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">{isVi ? "Không tìm thấy chữ Kanji phù hợp" : "No Kanji found"}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isVi ? "Thử thay đổi từ khóa hoặc bộ lọc số nét xem sao." : "Try adjusting your search query or stroke filter."}
          </p>
        </div>
      )}

      {/* Kanji Detail & Practice Modal */}
      {selectedKanji && (
        <Dialog open={!!selectedKanji} onOpenChange={(open) => !open && setSelectedKanji(null)}>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl overflow-hidden p-0 rounded-2xl border bg-card shadow-2xl">
            <DialogHeader className="border-b p-5 sm:p-6 pb-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="text-5xl font-black text-foreground font-serif">
                    {selectedKanji.char}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-2xl font-bold">
                        {selectedKanji.hanViet}
                      </DialogTitle>
                      <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 font-bold text-xs">
                        {selectedKanji.strokes} {isVi ? "nét" : "strokes"}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold text-primary mt-0.5">
                      {selectedKanji.hiragana}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => speak(selectedKanji.char)}
                  className="rounded-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                  title="Nghe phát âm"
                >
                  <Volume2 className="size-5" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border p-5 sm:p-6 gap-6 max-h-[85vh] overflow-y-auto">
              {/* Left Column: Interactive Stroke Order / Canvas */}
              <div className="flex flex-col items-center gap-4 md:w-1/2 shrink-0 min-w-0">
                {/* Practice Mode Switcher */}
                <div className="flex items-center rounded-lg border bg-muted p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPracticeMode("animation")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition-colors ${
                      practiceMode === "animation"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="size-3.5" />
                    <span>{isVi ? "Hoạt ảnh nét viết" : "Stroke Order"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPracticeMode("canvas")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition-colors ${
                      practiceMode === "canvas"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <PenTool className="size-3.5" />
                    <span>{isVi ? "Tập viết" : "Handwriting"}</span>
                  </button>
                </div>

                {/* Main Display Area */}
                {practiceMode === "animation" ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="relative w-full max-w-[220px] aspect-square rounded-2xl border bg-muted/20 p-3 shadow-inner flex items-center justify-center mx-auto">
                      <BasicKanjiStrokeSvg
                        kanji={selectedKanji}
                        externalPlayKey={animKey}
                        className="w-full h-full"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAnimKey((prev) => prev + 1)}
                      className="gap-2 text-xs font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 cursor-pointer shrink-0"
                    >
                      <RotateCw className="size-3.5" />
                      <span>{isVi ? "Phát lại nét viết" : "Replay Stroke Animation"}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <BasicKanjiHandwritingCanvas
                      kanji={selectedKanji}
                      className="w-full max-w-[220px] aspect-square rounded-2xl border bg-muted/20 p-2 shadow-inner mx-auto flex items-center justify-center"
                    />
                    <p className="text-[11px] text-muted-foreground text-center mt-1">
                      {isVi
                        ? "Dùng chuột hoặc ngón tay vẽ theo đường mờ chữ Kanji."
                        : "Trace the background character using mouse or touch."}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Meanings & Example Compound Words */}
              <div className="flex flex-col gap-4 md:w-1/2 min-w-0 md:pl-6 pt-5 md:pt-0">
                {/* Meaning Section */}
                <div className="flex flex-col gap-1 rounded-xl border bg-amber-500/5 border-amber-500/20 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isVi ? "Ý nghĩa tiếng Việt" : "Meaning"}
                  </span>
                  <p className="text-base font-bold text-foreground">
                    {selectedKanji.meaningVi}
                  </p>
                </div>

                {/* Example Compound Words */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Layers className="size-4 text-amber-500" />
                    <span>{isVi ? "Từ ghép thường gặp" : "Example Vocabulary"}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {selectedKanji.exampleWords.map((ex, idx) => (
                      <div
                        key={idx}
                        onClick={() => speak(ex.reading || ex.word)}
                        className="flex items-center justify-between rounded-xl border bg-card p-3 px-4 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl font-bold font-serif text-foreground shrink-0 tracking-tight">
                            {ex.word}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-primary truncate">
                              ({ex.reading})
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {ex.meaning}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 shrink-0"
                        >
                          <Volume2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
