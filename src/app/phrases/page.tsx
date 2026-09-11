"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, MessageSquare, Search, Volume2, X, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { OptionGroup } from "@/components/option-group";
import { speakJapanese } from "@/lib/speech";
import {
  FORMALITY_LABELS,
  PHRASE_LIST,
  PHRASE_THEMES,
  PHRASE_TOPICS,
  type Phrase,
  type PhraseFormality,
  type PhraseTheme,
  type PhraseTopic,
} from "@/lib/phrases";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export default function PhrasesPage() {
  const { t, language } = useLanguage();
  const isVi = language === "vi";

  const [theme, setTheme] = useState<PhraseTheme>("all");
  const [topic, setTopic] = useState<PhraseTopic>("all");
  const [formality, setFormality] = useState<PhraseFormality | "all">("all");
  const [query, setQuery] = useState("");
  const [showRomaji, setShowRomaji] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [theme, topic, formality, query, itemsPerPage]);

  // Available topics for selected theme
  const availableTopics = useMemo(() => {
    if (theme === "all") return PHRASE_TOPICS;
    return PHRASE_TOPICS.filter((tp) => tp.theme === theme);
  }, [theme]);

  // Handle theme change & reset topic
  const handleThemeChange = (newTheme: PhraseTheme) => {
    setTheme(newTheme);
    setTopic("all");
  };

  // Filter phrases list
  const filteredPhrases = useMemo(() => {
    let list = PHRASE_LIST;

    if (theme !== "all") {
      list = list.filter((p) => p.theme === theme);
    }

    if (topic !== "all") {
      list = list.filter((p) => p.topic === topic);
    }

    if (formality !== "all") {
      list = list.filter((p) => p.formality === formality);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.japanese.toLowerCase().includes(q) ||
          p.hiragana.toLowerCase().includes(q) ||
          p.romaji.toLowerCase().includes(q) ||
          p.english.toLowerCase().includes(q) ||
          p.vietnamese.toLowerCase().includes(q) ||
          (p.notesEn && p.notesEn.toLowerCase().includes(q)) ||
          (p.notesVi && p.notesVi.toLowerCase().includes(q))
      );
    }

    return list;
  }, [theme, topic, formality, query]);

  // Pagination calculations
  const totalItems = filteredPhrases.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedPhrases = useMemo(() => {
    return filteredPhrases.slice(startIndex, endIndex);
  }, [filteredPhrases, startIndex, endIndex]);

  const pageNumbers = useMemo(() => {
    return getPageNumbers(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const handleCopy = (phrase: Phrase) => {
    navigator.clipboard.writeText(phrase.japanese);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const themeOptions = PHRASE_THEMES.map((th) => ({
    value: th.id,
    label: isVi ? th.labelVi : th.labelEn,
  }));

  const formalityOptions = [
    { value: "all", label: t("phrases_all_formalities") },
    { value: "polite", label: FORMALITY_LABELS.polite[language] },
    { value: "casual", label: FORMALITY_LABELS.casual[language] },
    { value: "formal", label: FORMALITY_LABELS.formal[language] },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {t("phrases_title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("phrases_subtitle")}
        </p>
      </div>

      {/* Controls & Filter Card */}
      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-4 sm:p-6 shadow-2xs">
        {/* Row 1: Category Theme Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("phrases_theme")}
          </span>
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <OptionGroup
              options={themeOptions}
              value={theme}
              onChange={(th) => handleThemeChange(th as PhraseTheme)}
              size="sm"
              className="flex-nowrap"
            />
          </div>
        </div>

        {/* Row 2: Topic Selector, Formality Selector & Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-3 border-t">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Topic Dropdown */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {t("phrases_topic")}:
              </span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as PhraseTopic)}
                className="w-full sm:w-auto rounded-xl border border-border/80 bg-background px-3 py-2 sm:py-1.5 text-xs font-bold text-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">{t("phrases_all_topics")}</option>
                {availableTopics.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {isVi ? tp.labelVi : tp.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Formality Filter Dropdown */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {t("phrases_formality")}:
              </span>
              <select
                value={formality}
                onChange={(e) => setFormality(e.target.value as PhraseFormality | "all")}
                className="w-full sm:w-auto rounded-xl border border-border/80 bg-background px-3 py-2 sm:py-1.5 text-xs font-bold text-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                {formalityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Romaji Button */}
            <button
              type="button"
              onClick={() => setShowRomaji((prev) => !prev)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 px-3 py-2 sm:py-1.5 text-xs font-bold transition-all cursor-pointer select-none",
                showRomaji
                  ? "bg-background text-foreground hover:bg-accent shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
              title={showRomaji ? (isVi ? "Ẩn Romaji" : "Hide Romaji") : (isVi ? "Hiện Romaji" : "Show Romaji")}
            >
              {showRomaji ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              <span>{showRomaji ? (isVi ? "Ẩn Romaji" : "Hide Romaji") : (isVi ? "Hiện Romaji" : "Show Romaji")}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("phrases_search_placeholder")}
              className="w-full rounded-xl border border-border/80 bg-muted/30 pl-9 pr-8 py-2 sm:py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-red-600 focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-red-600 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sentence Cards List */}
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          {paginatedPhrases.map((p) => {
            const translation = isVi ? p.vietnamese : p.english;
            const notes = isVi ? p.notesVi : p.notesEn;
            const formalityLabel = FORMALITY_LABELS[p.formality][language];

            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/50 hover:shadow-xs"
              >
                <div className="flex flex-col gap-2">
                  {/* Top Bar: Formality Tag & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                        p.formality === "polite"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : p.formality === "casual"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      )}
                    >
                      {formalityLabel}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => speakJapanese(p.japanese)}
                        className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                        title={`Listen to ${p.japanese}`}
                        aria-label={`Listen to ${p.japanese}`}
                      >
                        <Volume2 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(p)}
                        className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                        title={t("phrases_copy")}
                        aria-label={t("phrases_copy")}
                      >
                        {copiedId === p.id ? (
                          <Check className="size-4 text-emerald-500" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Japanese Sentence */}
                  <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl pt-1">
                    {p.japanese}
                  </span>

                  {/* Hiragana Reading */}
                  {p.hiragana !== p.japanese && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {p.hiragana}
                    </span>
                  )}

                  {/* Romaji Reading */}
                  {showRomaji && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {p.romaji}
                    </span>
                  )}
                </div>

                {/* Translation & Situation Notes */}
                <div className="flex flex-col gap-1.5 border-t border-border/50 pt-3 mt-1">
                  <p className="text-sm font-semibold text-foreground">
                    {translation}
                  </p>
                  {notes && (
                    <p className="text-xs text-muted-foreground/80 italic">
                      💡 {notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {filteredPhrases.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border/80 p-12 text-center text-sm text-muted-foreground">
              {t("phrases_no_results")}
            </div>
          )}
        </div>

        {/* PAGINATION BAR (Strictly matching mockup media_1789144900553.png) */}
        {totalItems > 0 && (
          <div className="mt-4 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            {/* Left Controls: Select Items Per Page & Display Range */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span>{isVi ? "Số câu mỗi trang:" : "Items per page:"}</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 cursor-pointer"
                >
                  <option value={10}>{isVi ? "10 câu / trang" : "10 per page"}</option>
                  <option value={20}>{isVi ? "20 câu / trang" : "20 per page"}</option>
                  <option value={50}>{isVi ? "50 câu / trang" : "50 per page"}</option>
                  <option value={100}>{isVi ? "100 câu / trang" : "100 per page"}</option>
                </select>
              </div>

              <span className="text-border/80 hidden sm:inline">|</span>

              <div>
                {isVi ? (
                  <>
                    Hiển thị <strong className="font-bold text-foreground">{startIndex + 1} – {endIndex}</strong> trong <strong className="font-bold text-foreground">{totalItems}</strong> câu
                  </>
                ) : (
                  <>
                    Showing <strong className="font-bold text-foreground">{startIndex + 1} – {endIndex}</strong> of <strong className="font-bold text-foreground">{totalItems}</strong> phrases
                  </>
                )}
              </div>
            </div>

            {/* Right Controls: Previous / Page Numbers / Next */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              {/* Previous Page Button */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background px-3.5 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-accent cursor-pointer select-none",
                  currentPage === 1 && "opacity-40 cursor-not-allowed hover:bg-background"
                )}
              >
                <ChevronLeft className="size-3.5" />
                <span>{isVi ? "Trang trước" : "Previous"}</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((pNum, idx) => {
                  if (pNum === "...") {
                    return (
                      <span key={`ellipsis-${idx}`} className="size-8 flex items-center justify-center text-muted-foreground select-none">
                        ...
                      </span>
                    );
                  }

                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer select-none",
                        isCurrent
                          ? "bg-red-600 text-white shadow-2xs"
                          : "border border-border/80 bg-background text-foreground hover:bg-accent"
                      )}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page Button */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  "inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background px-3.5 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-accent cursor-pointer select-none",
                  currentPage === totalPages && "opacity-40 cursor-not-allowed hover:bg-background"
                )}
              >
                <span>{isVi ? "Trang sau" : "Next"}</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
