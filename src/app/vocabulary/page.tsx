"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Volume2, X } from "lucide-react";
import { OptionGroup } from "@/components/option-group";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/speech";
import { type Script } from "@/lib/kana";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  JLPT_LEVELS,
  JLPT_LEVEL_LABELS,
  groupWordsByCategory,
  type JlptLevel,
  type Word,
  type WordCategory,
} from "@/lib/words";

type Scope = Script | "both";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

const LEVEL_OPTIONS: { value: JlptLevel; label: string }[] = JLPT_LEVELS.map(
  (level) => ({ value: level, label: JLPT_LEVEL_LABELS[level] })
);

// Category emoji icons for visual distinction
const CATEGORY_ICONS: Partial<Record<WordCategory, string>> = {
  numbers_counting: "🔢",
  time_calendar: "📅",
  family_people: "👨‍👩‍👧",
  body_health: "💪",
  food_drink: "🍜",
  home_daily_life: "🏠",
  clothing_appearance: "👗",
  nature_weather: "🌸",
  animals_plants: "🐾",
  places_directions: "📍",
  transportation_travel: "🚄",
  school_work: "📚",
  technology_communication: "📱",
  money_shopping: "💴",
  emotions_personality: "😊",
  society_culture_business: "🎌",
  thinking_abstract: "💭",
  actions_general: "⚡",
  grammar_words: "📝",
  other: "✨",
};

export default function VocabularyPage() {
  const [scope, setScope] = useState<Scope>("hiragana");
  const [level, setLevel] = useState<JlptLevel>("n5");
  const [activeCategory, setActiveCategory] = useState<WordCategory | "all">("all");
  const [expanded, setExpanded] = useState<Set<WordCategory>>(new Set());

  const allGroups = useMemo(
    () => groupWordsByCategory(level, scope),
    [level, scope]
  );

  // Categories available for the current level/scope selection
  const availableCategories = useMemo(
    () => allGroups.map((g) => g.category),
    [allGroups]
  );

  // Groups filtered by the active category chip
  const visibleGroups = useMemo(() => {
    if (activeCategory === "all") return allGroups;
    return allGroups.filter((g) => g.category === activeCategory);
  }, [allGroups, activeCategory]);

  // Collapse everything again whenever the filters change
  const filterKey = `${level}-${scope}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setExpanded(new Set());
    setActiveCategory("all");
  }

  function toggle(category: WordCategory) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  // Total words shown
  const totalWords = visibleGroups.reduce((sum, g) => sum + g.words.length, 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Vocabulary</h1>
        <p className="text-sm text-muted-foreground">
          Learn JLPT words grouped by topic — pick a level, script, and
          category to focus on.
        </p>
      </div>

      {/* Filters card */}
      <div className="grid gap-5 rounded-xl border bg-card p-5 lg:grid-cols-2 lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Script
          </span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            JLPT Level
          </span>
          <OptionGroup options={LEVEL_OPTIONS} value={level} onChange={setLevel} />
        </div>
      </div>

      {/* Category filter chips */}
      {allGroups.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </span>
            {activeCategory !== "all" && (
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* "All" chip */}
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                activeCategory === "all"
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent hover:border-accent-foreground/20"
              )}
            >
              All topics
            </button>
            {/* Category chips */}
            {CATEGORY_ORDER.filter((cat) =>
              availableCategories.includes(cat)
            ).map((cat) => {
              const group = allGroups.find((g) => g.category === cat);
              const count = group?.words.length ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? "all" : cat)
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    activeCategory === cat
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent hover:border-accent-foreground/20"
                  )}
                >
                  <span>{CATEGORY_ICONS[cat] ?? "•"}</span>
                  <span>{CATEGORY_LABELS[cat]}</span>
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      activeCategory === cat
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats line */}
      {allGroups.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground -mt-2">
          <span>
            {activeCategory === "all"
              ? `${allGroups.length} categories`
              : CATEGORY_LABELS[activeCategory]}
          </span>
          <span>{totalWords} words</span>
        </div>
      )}

      {/* Word groups */}
      <div className="lg:columns-2 lg:gap-4 xl:columns-3">
        {visibleGroups.map(({ category, words }) => (
          <div key={category} className="mb-3 break-inside-avoid">
            <CategorySection
              category={category}
              words={words}
              expanded={expanded.has(category)}
              onToggle={() => toggle(category)}
            />
          </div>
        ))}
        {allGroups.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No words found for this script/level combination.
          </p>
        )}
        {allGroups.length > 0 && visibleGroups.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No words in this category for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  words,
  expanded,
  onToggle,
}: {
  category: WordCategory;
  words: Word[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const icon = CATEGORY_ICONS[category];
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent/50"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          {icon && <span className="text-base">{icon}</span>}
          {CATEGORY_LABELS[category]}
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {words.length} words
          <ChevronDown
            className={cn("size-4 transition-transform", expanded && "rotate-180")}
          />
        </span>
      </button>
      {expanded && (
        <div className="grid grid-cols-2 gap-2 border-t p-3 sm:grid-cols-3">
          {words.map((w) => (
            <WordCard key={w.id} word={w} />
          ))}
        </div>
      )}
    </div>
  );
}

function WordCard({ word }: { word: Word }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border bg-background px-3 py-2 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-1">
        <span className="text-lg font-medium">{word.word}</span>
        <button
          type="button"
          onClick={() => speakJapanese(word.word)}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Play pronunciation"
        >
          <Volume2 className="size-3.5" />
        </button>
      </div>
      <span className="text-xs text-muted-foreground">{word.romaji}</span>
      <span className="text-xs text-muted-foreground">{word.meaning}</span>
    </div>
  );
}
