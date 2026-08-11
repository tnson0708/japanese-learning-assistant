"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, Volume2, X, Printer, Scissors, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { speakJapanese } from "@/lib/speech";
import { type Script } from "@/lib/kana";
import {
  CATEGORY_LABELS,
  CATEGORY_LABELS_VI,
  CATEGORY_ORDER,
  SUB_CATEGORY_LABELS,
  THEME_OPTIONS,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS_BILINGUAL,
  getSubCategory,
  getWordMeaning,
  getWordNotes,
  getWordsByDifficulty,
  wordList,
  type CategoryTheme,
  type WordDifficulty,
  type WordCategory,
  type Word,
} from "@/lib/words";

import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type Scope = Script | "both";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "both", label: "Both" },
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
];

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function VocabularyPage() {
  const { t, language } = useLanguage();

  const [scope, setScope] = useState<Scope>("both");

  const [difficulty, setDifficulty] = useState<WordDifficulty>("easy");
  const [theme, setTheme] = useState<CategoryTheme>("all");
  const [category, setCategory] = useState<WordCategory | "all">("all");
  const [subCategory, setSubCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const difficultyOptions: { value: WordDifficulty; label: string }[] =
    WORD_DIFFICULTIES.map((d) => ({
      value: d,
      label: WORD_DIFFICULTY_LABELS_BILINGUAL[language][d],
    }));

  const themeOptions = [
    { value: "all", label: t("theme_all") },
    { value: "daily_life", label: t("theme_daily_life") },
    { value: "time_numbers", label: t("theme_time_numbers") },
    { value: "nature_places", label: t("theme_nature_places") },
    { value: "school_work", label: t("theme_school_work") },
    { value: "concepts_actions", label: t("theme_concepts_actions") },
  ];

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

    const q = query.trim().toLowerCase();

    // If no search query, respect category, theme, and subCategory filters strictly
    if (!q) {
      if (category !== "all") {
        list = list.filter((w) => w.category === category);
      } else if (theme !== "all") {
        const allowed = new Set(availableTopics);
        list = list.filter((w) => allowed.has(w.category));
      }

      if (subCategory !== "all") {
        list = list.filter((w) => getSubCategory(w) === subCategory);
      }
      return list;
    }

    // When search query is typed:
    // First attempt filtering within active category selection
    let categoryFiltered = list;
    if (category !== "all") {
      categoryFiltered = categoryFiltered.filter((w) => w.category === category);
    } else if (theme !== "all") {
      const allowed = new Set(availableTopics);
      categoryFiltered = categoryFiltered.filter((w) => allowed.has(w.category));
    }
    if (subCategory !== "all") {
      categoryFiltered = categoryFiltered.filter((w) => getSubCategory(w) === subCategory);
    }

    const matchesQuery = (w: Word) => {
      const subCat = getSubCategory(w);
      const subCatLabelEn = SUB_CATEGORY_LABELS[subCat]?.en || subCat;
      const subCatLabelVi = SUB_CATEGORY_LABELS[subCat]?.vi || subCat;
      const catLabelEn = CATEGORY_LABELS[w.category] || "";
      const catLabelVi = CATEGORY_LABELS_VI[w.category] || "";
      const meaning = getWordMeaning(w, language);

      return (
        w.word.toLowerCase().includes(q) ||
        (w.kanji && w.kanji.toLowerCase().includes(q)) ||
        w.romaji.toLowerCase().includes(q) ||
        meaning.toLowerCase().includes(q) ||
        subCatLabelEn.toLowerCase().includes(q) ||
        subCatLabelVi.toLowerCase().includes(q) ||
        catLabelEn.toLowerCase().includes(q) ||
        catLabelVi.toLowerCase().includes(q)
      );
    };

    let result = categoryFiltered.filter(matchesQuery);

    // If active category selection produced 0 results for the query, fallback to searching all words
    if (result.length === 0 && (category !== "all" || subCategory !== "all" || theme !== "all")) {
      result = list.filter(matchesQuery);
    }

    return result;
  }, [difficulty, scope, category, theme, availableTopics, subCategory, query, language]);


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

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printRange, setPrintRange] = useState<"page" | "all">("page");

  const wordsToPrint = useMemo(() => {
    return printRange === "page" ? paginatedWords : filteredWords;
  }, [printRange, paginatedWords, filteredWords]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 print:p-0 print:gap-4">
      {/* Printable Cutout Labels Section (Only visible during print) */}
      <div className="hidden print:block font-sans text-black">
        {/* Printable Header Banner */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-400">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-black">
              Bảng nhãn dán từ vựng (Vocabulary Cutout Tags Sheet)
            </h1>
            <p className="text-xs text-gray-600">
              Dùng kéo cắt theo đường nét đứt ✂️ và dán lên các đồ vật thực tế xung quanh để học từ vựng nhanh thuộc!
            </p>
          </div>
          <span className="text-xs font-bold text-gray-700">仮名道場 • Kana Dojo</span>
        </div>

        {/* Cutout Tags Grid (3 columns per row on A4 paper) */}
        <div className="grid grid-cols-3 gap-3">
          {wordsToPrint.map((word) => {
            const meaningText = getWordMeaning(word, language);

            return (
              <div
                key={`print-tag-${word.id}`}
                className="flex flex-col justify-between rounded-lg border-2 border-dashed border-gray-400 bg-white p-3 shadow-none print:break-inside-avoid min-h-[110px]"
              >

                {/* Main Japanese Word & Kanji */}
                <div className="flex flex-col gap-0.5 pt-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-bold tracking-tight text-black">
                      {word.kanji || word.word}
                    </span>
                    {word.kanji && (
                      <span className="text-xs font-semibold text-gray-600">
                        ({word.word})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-700 font-mono">
                    {word.romaji}
                  </span>
                </div>

                {/* Meaning */}
                <div className="flex flex-col gap-0.5 border-t border-dashed border-gray-300 pt-1.5 mt-2">
                  <span className="text-xs font-bold text-black leading-tight">
                    {meaningText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header (Hidden during print) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {t("vocab_title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("vocab_subtitle")}
          </p>
        </div>

        {/* Print Cutout Labels Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPrintModal(true)}
          className="gap-2 shrink-0 font-semibold cursor-pointer border-primary/30 hover:border-primary hover:bg-primary/10 text-foreground"
          title="In nhãn từ vựng dán đồ vật (Print Cutout Labels)"
        >
          <Printer className="size-4 text-primary" />
          <Scissors className="size-3.5 text-primary -ml-1" />
          <span>{t("vocab_print_btn")}</span>
        </Button>
      </div>

      {/* Print Cutout Labels Options & Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs print:hidden">
          <div className="flex w-full max-w-xl flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-7 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Printer className="size-5 text-primary" />
                  <Scissors className="size-4 text-primary -ml-1" />
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    {t("vocab_print_modal_title")}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("vocab_print_modal_desc")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Print Scope Selector Options */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phạm vi nhãn từ vựng muốn in (Print Scope):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintRange("page")}
                  className={cn(
                    "flex flex-col gap-1 rounded-xl border p-3 text-left transition-all cursor-pointer",
                    printRange === "page"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                      : "border-border bg-background text-muted-foreground hover:bg-accent"
                  )}
                >
                  <span className="text-xs font-bold">📄 Trang hiện tại</span>
                  <span className="text-[11px] font-normal opacity-80">
                    In {paginatedWords.length} nhãn từ vựng đang hiển thị
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintRange("all")}
                  className={cn(
                    "flex flex-col gap-1 rounded-xl border p-3 text-left transition-all cursor-pointer",
                    printRange === "all"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                      : "border-border bg-background text-muted-foreground hover:bg-accent"
                  )}
                >
                  <span className="text-xs font-bold">📚 Tất cả từ đã lọc</span>
                  <span className="text-[11px] font-normal opacity-80">
                    In toàn bộ {filteredWords.length} nhãn từ vựng trong bộ lọc
                  </span>
                </button>
              </div>
            </div>

            {/* Cutout Label Sample Card Preview */}
            <div className="flex flex-col gap-2 pt-2 border-t">
              <span className="text-xs font-semibold text-muted-foreground">
                Xem trước mẫu nhãn cắt dán (Label Tag Sample):
              </span>
              <div className="flex items-center justify-center p-4 bg-muted/40 rounded-xl">
                {wordsToPrint[0] ? (
                  <div className="w-64 flex flex-col justify-between rounded-lg border-2 border-dashed border-primary/60 bg-card p-3 shadow-2xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                          {wordsToPrint[0].kanji || wordsToPrint[0].word}
                        </span>
                        {wordsToPrint[0].kanji && (
                          <span className="text-xs font-semibold text-muted-foreground">
                            ({wordsToPrint[0].word})
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">
                        {wordsToPrint[0].romaji}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-t border-dashed border-border pt-1.5 mt-2 text-xs font-semibold text-foreground">
                      {getWordMeaning(wordsToPrint[0], language)}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Không có từ nào để in</span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowPrintModal(false)}>
                Hủy (Cancel)
              </Button>
              <Button
                disabled={wordsToPrint.length === 0}
                onClick={() => {
                  setShowPrintModal(false);
                  setTimeout(() => window.print(), 150);
                }}
                className="gap-2 font-semibold cursor-pointer"
              >
                <Printer className="size-4" />
                <span>{t("vocab_print_btn_confirm")} ({wordsToPrint.length} nhãn)</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Controls Card (Hidden during print) */}
      <div className="flex flex-col gap-5 rounded-xl border bg-card p-4 sm:p-6 shadow-2xs print:hidden">
        {/* Row 1: Script & Difficulty */}
        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("vocab_script")}
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
              {t("vocab_difficulty")}
            </span>
            <OptionGroup
              options={difficultyOptions}
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
            {t("vocab_theme")}
          </span>
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <OptionGroup
              options={themeOptions}
              value={theme}
              onChange={(th) => handleThemeChange(th as CategoryTheme)}
              size="sm"
              className="flex-nowrap"
            />
          </div>
        </div>

        {/* Row 3: Topic Selector & Search Box */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 border-t">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              {t("vocab_topic")}
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as WordCategory | "all");
                setSubCategory("all");
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-lg border bg-background px-3 py-2 sm:py-1.5 text-sm font-medium text-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">
                {t("vocab_all_topics")} ({theme === "all" ? wordList.length : availableTopics.length})
              </option>
              {availableTopics.map((cat) => (
                <option key={cat} value={cat}>
                  {language === "vi" ? CATEGORY_LABELS_VI[cat] : CATEGORY_LABELS[cat]}
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
              placeholder={t("vocab_search_placeholder")}
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
                {t("vocab_sub_category")}
              </span>
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <OptionGroup
                options={[
                  { value: "all", label: t("vocab_all_subcats") },
                  ...availableSubCategories.map((sub) => ({
                    value: sub,
                    label: SUB_CATEGORY_LABELS[sub]?.[language] || sub,
                  })),
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

      {/* Vocabulary Table Container (Hidden during print) */}
      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            {t("vocab_showing")} <strong className="text-foreground">{filteredWords.length}</strong> {t("vocab_words")}
          </span>

          <div className="flex items-center gap-2">
            <span>{t("vocab_per_page")}</span>
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

        {/* Mobile Card List View (Visible on < md screens - zero horizontal scrolling!) */}
        <div className="flex flex-col gap-3 md:hidden">
          {paginatedWords.map((word) => {
            const subCatRaw = getSubCategory(word);
            const subCatLabel = SUB_CATEGORY_LABELS[subCatRaw]?.[language] || subCatRaw;
            const meaningText = getWordMeaning(word, language);
            const notesText = getWordNotes(word, language);

            return (
              <div
                key={word.id}
                className="flex flex-col gap-2 rounded-xl border bg-card p-3.5 shadow-2xs transition-colors hover:border-primary/50"
              >
                {/* Header: Word + Kanji + Audio + Romaji */}
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {word.word}
                    </span>
                    {word.kanji && (
                      <span className="text-base font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {word.kanji}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded-md">
                      {word.romaji}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakJapanese(word.word)}
                      className="rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary active:scale-95"
                      title={`Listen to ${word.word}`}
                      aria-label={`Listen to ${word.word}`}
                    >
                      <Volume2 className="size-4 text-primary" />
                    </button>
                  </div>
                </div>

                {/* Meaning */}
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">
                    {t("vocab_col_meaning")}:
                  </span>
                  <span className="font-semibold text-foreground">
                    {meaningText}
                  </span>
                </div>

                {/* Notes & Sub-category Badge */}
                {(notesText || (subCatRaw && subCatRaw !== "General Words")) && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 text-xs text-muted-foreground border-t border-dashed border-border/60">
                    {notesText && <span>{notesText}</span>}
                    {subCatRaw && subCatRaw !== "General Words" && (
                      <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ml-auto">
                        {subCatLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredWords.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t("vocab_no_words")}
            </div>
          )}
        </div>

        {/* Desktop 5-Column Table (Visible on md+ screens) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border bg-card shadow-2xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">{t("vocab_col_vocab")}</th>
                <th scope="col" className="px-4 py-3 sm:px-6">{t("vocab_col_kanji")}</th>
                <th scope="col" className="px-4 py-3 sm:px-6">{t("vocab_col_romaji")}</th>
                <th scope="col" className="px-4 py-3 sm:px-6">{t("vocab_col_meaning")}</th>
                <th scope="col" className="px-4 py-3 sm:px-6">{t("vocab_col_notes")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedWords.map((word) => {
                const subCatRaw = getSubCategory(word);
                const subCatLabel = SUB_CATEGORY_LABELS[subCatRaw]?.[language] || subCatRaw;
                const meaningText = getWordMeaning(word, language);
                const notesText = getWordNotes(word, language);

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
                      {meaningText}
                    </td>

                    {/* Column 5: Notes & Sub-category badge */}
                    <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {notesText && <span>{notesText}</span>}
                        {subCatRaw !== "General Words" && (
                          <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {subCatLabel}
                          </span>
                        )}
                        {!notesText && subCatRaw === "General Words" && (
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
                    {t("vocab_no_words")}
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
              {t("vocab_page")} <strong className="text-foreground">{safePage}</strong> {t("vocab_of")}{" "}
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
                {t("vocab_prev")}
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent"
              >
                {t("vocab_next")}
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



