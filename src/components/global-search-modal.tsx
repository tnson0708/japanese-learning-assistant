"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Volume2, ArrowRight, CornerDownLeft, Sparkles, BookOpen, LayoutGrid, MessageSquare, GraduationCap } from "lucide-react";
import { searchGlobal, type SearchResultItem, type SearchResultCategory } from "@/lib/use-global-search";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Execute global search
  const results = useMemo(() => {
    return searchGlobal(query);
  }, [query]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const map: Record<SearchResultCategory, SearchResultItem[]> = {
      kanji: [],
      vocabulary: [],
      phrases: [],
      theory: [],
      kana: [],
    };
    results.forEach((item) => {
      map[item.category].push(item);
    });
    return map;
  }, [results]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside spotlight search
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectResult = (item: SearchResultItem) => {
    onClose();
    router.push(item.href);
  };

  const handleAudio = (e: React.MouseEvent, text?: string) => {
    e.stopPropagation();
    if (text) {
      speakJapanese(text);
    }
  };

  if (!isOpen) return null;

  const popularSearches = [
    { label: "日 (Nhật)", q: "日" },
    { label: "ありがとう", q: "ありがとう" },
    { label: "Trượng (丈)", q: "丈" },
    { label: "Chào hỏi", q: "chào" },
    { label: "Ngữ pháp Minna", q: "bài" },
  ];

  const getCategoryBadgeColor = (cat: SearchResultCategory) => {
    switch (cat) {
      case "kanji":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400";
      case "vocabulary":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400";
      case "phrases":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400";
      case "theory":
        return "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400";
      case "kana":
        return "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400";
    }
  };

  let globalIndexCounter = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-12 sm:pt-20 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl animate-in zoom-in-95 duration-150 ring-1 ring-border/50 max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spotlight Search Header Input */}
        <div className="flex items-center gap-3 border-b px-4 py-3.5 bg-muted/20">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isVi
                ? "Tìm kiếm từ vựng, chữ Kanji, bộ thủ, mẫu câu, ngữ pháp..."
                : "Search vocabulary, Kanji, radicals, phrases, grammar..."
            }
            className="flex-1 bg-transparent text-sm font-medium tracking-tight placeholder:text-muted-foreground focus:outline-none text-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-3 space-y-4">
          {!query.trim() ? (
            <div className="flex flex-col gap-4 p-4 text-center">
              <div className="flex items-center justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-6" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-foreground">
                  {isVi ? "Tìm kiếm thông minh Spotlight" : "Spotlight Global Search"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isVi
                    ? "Nhập từ tiếng Nhật (Kanji, Hiragana, Katakana, Romaji), tên Hán-Việt hoặc ý nghĩa tiếng Việt..."
                    : "Type Japanese words, Romaji, Hán-Việt, or Vietnamese meanings to search instantly."}
                </p>
              </div>

              {/* Popular quick query pills */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t">
                <span className="text-[11px] font-medium text-muted-foreground mr-1">
                  {isVi ? "Gợi ý từ khóa:" : "Suggestions:"}
                </span>
                {popularSearches.map((item) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => setQuery(item.q)}
                    className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <BookOpen className="size-10 mb-2 opacity-40" />
              <p className="text-sm font-semibold">{isVi ? `Không tìm thấy kết quả cho "${query}"` : `No results for "${query}"`}</p>
              <p className="text-xs mt-1">
                {isVi ? "Thử gõ phiên âm Romaji, Hiragana hoặc từ tiếng Việt khác." : "Try searching with Romaji, Hiragana, or Vietnamese keywords."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Category 1: Kanji & Radicals */}
              {groupedResults.kanji.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="size-3.5 text-amber-500" />
                    <span>{isVi ? "Kanji & Bộ thủ" : "Kanji & Radicals"} ({groupedResults.kanji.length})</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {groupedResults.kanji.map((item) => {
                      const itemIdx = globalIndexCounter++;
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <ResultCard
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onSelect={() => handleSelectResult(item)}
                          onAudio={(e) => handleAudio(e, item.audioText)}
                          badgeColor={getCategoryBadgeColor(item.category)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 2: Vocabulary */}
              {groupedResults.vocabulary.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <LayoutGrid className="size-3.5 text-emerald-500" />
                    <span>{isVi ? "Từ vựng" : "Vocabulary"} ({groupedResults.vocabulary.length})</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {groupedResults.vocabulary.slice(0, 15).map((item) => {
                      const itemIdx = globalIndexCounter++;
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <ResultCard
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onSelect={() => handleSelectResult(item)}
                          onAudio={(e) => handleAudio(e, item.audioText)}
                          badgeColor={getCategoryBadgeColor(item.category)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 3: Situational Phrases */}
              {groupedResults.phrases.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <MessageSquare className="size-3.5 text-blue-500" />
                    <span>{isVi ? "Mẫu câu giao tiếp" : "Phrases"} ({groupedResults.phrases.length})</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {groupedResults.phrases.map((item) => {
                      const itemIdx = globalIndexCounter++;
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <ResultCard
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onSelect={() => handleSelectResult(item)}
                          onAudio={(e) => handleAudio(e, item.audioText)}
                          badgeColor={getCategoryBadgeColor(item.category)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 4: Theory Lessons */}
              {groupedResults.theory.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <GraduationCap className="size-3.5 text-purple-500" />
                    <span>{isVi ? "Ngữ pháp & Lý thuyết" : "Grammar Theory"} ({groupedResults.theory.length})</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {groupedResults.theory.map((item) => {
                      const itemIdx = globalIndexCounter++;
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <ResultCard
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onSelect={() => handleSelectResult(item)}
                          onAudio={(e) => handleAudio(e, item.audioText)}
                          badgeColor={getCategoryBadgeColor(item.category)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 5: Kana */}
              {groupedResults.kana.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="size-3.5 text-rose-500" />
                    <span>{isVi ? "Bảng chữ cái Kana" : "Kana Alphabet"} ({groupedResults.kana.length})</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {groupedResults.kana.map((item) => {
                      const itemIdx = globalIndexCounter++;
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <ResultCard
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onSelect={() => handleSelectResult(item)}
                          onAudio={(e) => handleAudio(e, item.audioText)}
                          badgeColor={getCategoryBadgeColor(item.category)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Bar Hints */}
        <div className="flex items-center justify-between border-t px-4 py-2 bg-muted/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono">↑</kbd>
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono">↓</kbd>
              <span>{isVi ? "chọn" : "navigate"}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
              <span>{isVi ? "mở" : "select"}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{results.length}</span>
            <span>{isVi ? "kết quả tìm thấy" : "results found"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  item,
  isSelected,
  onSelect,
  onAudio,
  badgeColor,
}: {
  item: SearchResultItem;
  isSelected: boolean;
  onSelect: () => void;
  onAudio: (e: React.MouseEvent) => void;
  badgeColor: string;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl border p-3 transition-all cursor-pointer select-none",
        isSelected
          ? "bg-primary/10 border-primary shadow-2xs translate-x-0.5"
          : "bg-card hover:bg-accent/60 border-border/60"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl font-bold font-serif text-foreground shrink-0 min-w-[28px] text-center">
          {item.title}
        </span>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            {item.subtitle && (
              <span className="text-xs font-bold text-primary truncate">
                {item.subtitle}
              </span>
            )}
            {item.badge && (
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 font-bold", badgeColor)}>
                {item.badge}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {item.description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {item.audioText && (
          <button
            type="button"
            onClick={onAudio}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary cursor-pointer"
            title="Nghe phát âm"
          >
            <Volume2 className="size-4" />
          </button>
        )}
        <ArrowRight
          className={cn(
            "size-4 transition-transform",
            isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground opacity-40 group-hover:opacity-100"
          )}
        />
      </div>
    </div>
  );
}
