"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Filter, MessageSquare, Search, Volume2, X } from "lucide-react";
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

export default function PhrasesPage() {
  const { t, language } = useLanguage();

  const [theme, setTheme] = useState<PhraseTheme>("all");
  const [topic, setTopic] = useState<PhraseTopic>("all");
  const [formality, setFormality] = useState<PhraseFormality | "all">("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available topics for selected theme
  const availableTopics = useMemo(() => {
    if (theme === "all") return PHRASE_TOPICS;
    return PHRASE_TOPICS.filter((tp) => tp.theme === theme);
  }, [theme]);

  // Handle theme change & reset topic if out of bounds
  const handleThemeChange = (newTheme: PhraseTheme) => {
    setTheme(newTheme);
    setTopic("all");
  };

  // Filter phrases
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

  const handleCopy = (phrase: Phrase) => {
    navigator.clipboard.writeText(phrase.japanese);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const themeOptions = PHRASE_THEMES.map((th) => ({
    value: th.id,
    label: language === "vi" ? th.labelVi : th.labelEn,
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
      <div className="flex flex-col gap-5 rounded-xl border bg-card p-4 sm:p-6 shadow-2xs">
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-2 border-t">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Topic Dropdown */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {t("phrases_topic")}:
              </span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as PhraseTopic)}
                className="w-full sm:w-auto rounded-lg border bg-background px-3 py-2 sm:py-1.5 text-sm font-medium text-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">{t("phrases_all_topics")}</option>
                {availableTopics.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {language === "vi" ? tp.labelVi : tp.labelEn}
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
                className="w-full sm:w-auto rounded-lg border bg-background px-3 py-2 sm:py-1.5 text-sm font-medium text-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {formalityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("phrases_search_placeholder")}
              className="w-full rounded-lg border bg-background pl-9 pr-8 py-2 sm:py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Sentence Cards List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            {t("phrases_showing")}{" "}
            <strong className="text-foreground">{filteredPhrases.length}</strong>{" "}
            {t("phrases_items")}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredPhrases.map((p) => {
            const translation = language === "vi" ? p.vietnamese : p.english;
            const notes = language === "vi" ? p.notesVi : p.notesEn;
            const formalityLabel = FORMALITY_LABELS[p.formality][language];

            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between gap-4 rounded-xl border bg-card p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xs"
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
                        className="rounded-full border p-1.5 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        title={`Listen to ${p.japanese}`}
                        aria-label={`Listen to ${p.japanese}`}
                      >
                        <Volume2 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(p)}
                        className="rounded-full border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
                  <span className="text-xs font-mono font-semibold text-primary/90">
                    {p.romaji}
                  </span>
                </div>

                {/* Translation & Situation Notes */}
                <div className="flex flex-col gap-1.5 border-t pt-3 mt-1">
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
            <div className="col-span-full rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              {t("phrases_no_results")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
