"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, Volume2, X } from "lucide-react";
import { OptionGroup } from "@/components/option-group";
import { speakJapanese } from "@/lib/speech";
import { type Script } from "@/lib/kana";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  THEME_OPTIONS,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS,
  getSubCategory,
  getWordsByDifficulty,
  wordList,
  type CategoryTheme,
  type WordDifficulty,
  type WordCategory,
} from "@/lib/words";
import { cn } from "@/lib/utils";

type Scope = Script | "both";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

const DIFFICULTY_OPTIONS: { value: WordDifficulty; label: string }[] = WORD_DIFFICULTIES.map(
  (d) => ({ value: d, label: WORD_DIFFICULTY_LABELS[d] })
);

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function VocabularyPage() {
  const [scope, setScope] = useState<Scope>("hiragana");
  const [difficulty, setDifficulty] = useState<WordDifficulty>("easy");
  const [theme, setTheme] = useState<CategoryTheme>("all");
  const [category, setCategory] = useState<WordCategory | "all">("all");
  const [subCategory, setSubCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  // Available topics based on selected theme
  const availableTopics = useMemo(() => {
    if (theme === "all") return CATEGORY_ORDER;
    const found = THEME_OPTIONS.find((t) => t.id === theme);
    return found ? found.categories : CATEGORY_ORDER;
  }, [theme]);

  // Reset category if not in availableTopics when theme changes
  const handleThemeChange = (newTheme: CategoryTheme) => {
    setTheme(newTheme);
    setCategory("all");
    setSubCategory("all");
    setPage(1);
  };

  // Available sub-categories for current difficulty, scope, and selected category
  const availableSubCategories = useMemo(() => {
    let list = getWordsByDifficulty(difficulty, scope);
    if (category !== "all") {
      list = list.filter((w) => w.category === category);
    } else if (theme !== "all") {
      const allowed = new Set(availableTopics);
      list = list.filter((w) => allowed.has(w.category));
    }
    const subCats = new Set<string>();
    for (const w of list) {
      subCats.add(getSubCategory(w));
    }
    return Array.from(subCats).sort();
  }, [difficulty, scope, category, theme, availableTopics]);

  // Filter words by difficulty, scope, category, subCategory, and search query
  const filteredWords = useMemo(() => {
    let list = getWordsByDifficulty(difficulty, scope);

    if (category !== "all") {
      list = list.filter((w) => w.category === category);
    } else if (theme !== "all") {
      const allowed = new Set(availableTopics);
      list = list.filter((w) => allowed.has(w.category));
    }

    if (subCategory !== "all") {
      list = list.filter((w) => getSubCategory(w) === subCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          (w.kanji && w.kanji.toLowerCase().includes(q)) ||
          w.romaji.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          getSubCategory(w).toLowerCase().includes(q)
      );
    }

    return list;
  }, [difficulty, scope, category, theme, availableTopics, subCategory, query]);

  // Reset to page 1 whenever filters change
  const totalPages = Math.ceil(filteredWords.length / pageSize) || 1;
  const safePage = Math.min(page, totalPages);
  if (safePage !== page && totalPages > 0) {
    setPage(safePage);
  }

  const paginatedWords = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredWords.slice(start, start + pageSize);
  }, [filteredWords, safePage, pageSize]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Vocabulary Table
        </h1>
        <p className="text-sm text-muted-foreground">
          Learn Japanese vocabulary organized by difficulty, theme, topic, and sub-category.
        </p>
      </div>

      {/* Filter & Controls Card */}
      <div className="flex flex-col gap-5 rounded-xl border bg-card p-4 sm:p-6 shadow-2xs">
        {/* Row 1: Script & Difficulty */}
        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Script
            </span>
            <OptionGroup
              options={SCOPE_OPTIONS}
              value={scope}
              onChange={(s) => {
                setScope(s);
                setPage(1);
              }}
              size="sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Difficulty Level
            </span>
            <OptionGroup
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={(d) => {
                setDifficulty(d);
                setPage(1);
              }}
              size="sm"
            />
          </div>
        </div>

        {/* Row 2: Category Theme Selector */}
        <div className="flex flex-col gap-2 pt-2 border-t">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category Theme
          </span>
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <OptionGroup
              options={THEME_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
              value={theme}
              onChange={(th) => handleThemeChange(th)}
              size="sm"
              className="flex-nowrap"
            />
          </div>
        </div>

        {/* Row 3: Topic Selector & Search Box */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Topic:
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as WordCategory | "all");
                setSubCategory("all");
                setPage(1);
              }}
              className="rounded-lg border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">
                All Topics ({theme === "all" ? wordList.length : availableTopics.length})
              </option>
              {availableTopics.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search vocabulary, kanji, romaji..."
              className="w-full rounded-lg border bg-background pl-9 pr-8 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 4: Sub-Category Filter Bar */}
        {availableSubCategories.length > 1 && (
          <div className="flex flex-col gap-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <Filter className="size-3 text-primary" />
                Sub-Category
              </span>
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <OptionGroup
                options={[
                  { value: "all", label: "All Sub-categories" },
                  ...availableSubCategories.map((sub) => ({ value: sub, label: sub })),
                ]}
                value={subCategory}
                onChange={(sc) => {
                  setSubCategory(sc);
                  setPage(1);
                }}
                size="sm"
                className="flex-nowrap"
              />
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Table Container */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-foreground">{filteredWords.length}</strong> words
          </span>

          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <div className="flex items-center gap-1">
              {PAGE_SIZE_OPTIONS.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    setPageSize(sz);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                    pageSize === sz
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground"
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Column English Table */}
        <div className="overflow-x-auto rounded-xl border bg-card shadow-2xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">Vocabulary</th>
                <th scope="col" className="px-4 py-3 sm:px-6">Kanji</th>
                <th scope="col" className="px-4 py-3 sm:px-6">Romaji</th>
                <th scope="col" className="px-4 py-3 sm:px-6">Meaning</th>
                <th scope="col" className="px-4 py-3 sm:px-6">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedWords.map((word) => {
                const subCatLabel = getSubCategory(word);
                return (
                  <tr
                    key={word.id}
                    className="transition-colors hover:bg-accent/40"
                  >
                    {/* Column 1: Vocabulary (Kana + Audio) */}
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-medium tracking-tight">
                          {word.word}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakJapanese(word.word)}
                          className="rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-primary"
                          title={`Listen to ${word.word}`}
                          aria-label={`Listen to ${word.word}`}
                        >
                          <Volume2 className="size-4" />
                        </button>
                      </div>
                    </td>

                    {/* Column 2: Kanji */}
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                      {word.kanji ? (
                        <span className="text-lg font-medium text-foreground">
                          {word.kanji}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">-</span>
                      )}
                    </td>

                    {/* Column 3: Romaji */}
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground font-mono sm:px-6">
                      {word.romaji}
                    </td>

                    {/* Column 4: Meaning */}
                    <td className="px-4 py-3 text-sm text-foreground sm:px-6">
                      {word.meaning}
                    </td>

                    {/* Column 5: Notes & Sub-category badge */}
                    <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {word.notes && <span>{word.notes}</span>}
                        {subCatLabel !== "General Words" && (
                          <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {subCatLabel}
                          </span>
                        )}
                        {!word.notes && subCatLabel === "General Words" && (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredWords.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No vocabulary words match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Page <strong className="text-foreground">{safePage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center gap-1 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent"
              >
                <ChevronLeft className="size-3.5" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent"
              >
                Next
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


