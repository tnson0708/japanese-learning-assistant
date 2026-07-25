"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Volume2, X } from "lucide-react";
import { OptionGroup } from "@/components/option-group";
import { speakJapanese } from "@/lib/speech";
import { type Script } from "@/lib/kana";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS,
  wordList,
  getWordsByDifficulty,
  type WordDifficulty,
  type Word,
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
  const [category, setCategory] = useState<WordCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  // Filter words by difficulty, scope, category, and search query
  const filteredWords = useMemo(() => {
    let list = getWordsByDifficulty(difficulty, scope);

    if (category !== "all") {
      list = list.filter((w) => w.category === category);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          (w.kanji && w.kanji.toLowerCase().includes(q)) ||
          w.romaji.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q)
      );
    }

    return list;
  }, [difficulty, scope, category, query]);

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
          Learn Japanese vocabulary organized by difficulty, script, and category.
        </p>
      </div>

      {/* Filter & Controls Card */}
      <div className="flex flex-col gap-5 rounded-xl border bg-card p-4 sm:p-6 shadow-2xs">
        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {/* Script Filter */}
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

          {/* Difficulty Filter */}
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

        {/* Category & Search Row */}
        <div className="flex flex-col gap-4 pt-2 border-t sm:flex-row sm:items-center sm:justify-between">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Topic:
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as WordCategory | "all");
                setPage(1);
              }}
              className="rounded-lg border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Topics ({wordList.length})</option>
              {CATEGORY_ORDER.map((cat) => (
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
              {paginatedWords.map((word) => (
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

                  {/* Column 5: Notes */}
                  <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6">
                    {word.notes ? word.notes : <span className="text-muted-foreground/40">-</span>}
                  </td>
                </tr>
              ))}

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

