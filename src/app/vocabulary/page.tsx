"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Volume2 } from "lucide-react";
import { OptionGroup } from "@/components/option-group";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/speech";
import { type Script } from "@/lib/kana";
import {
  CATEGORY_LABELS,
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

export default function VocabularyPage() {
  const [scope, setScope] = useState<Scope>("hiragana");
  const [level, setLevel] = useState<JlptLevel>("n5");
  const [expanded, setExpanded] = useState<Set<WordCategory>>(new Set());

  const groups = useMemo(
    () => groupWordsByCategory(level, scope),
    [level, scope]
  );

  // Collapse everything again whenever the filters change, so switching
  // levels/scripts doesn't leave a huge stale list expanded.
  const filterKey = `${level}-${scope}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setExpanded(new Set());
  }

  function toggle(category: WordCategory) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vocabulary</h1>
        <p className="text-sm text-muted-foreground">
          Learn JLPT words grouped by topic — pick a level and a topic to
          focus on, one group at a time.
        </p>
      </div>

      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Script</span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">JLPT Level</span>
          <OptionGroup options={LEVEL_OPTIONS} value={level} onChange={setLevel} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {groups.map(({ category, words }) => (
          <CategorySection
            key={category}
            category={category}
            words={words}
            expanded={expanded.has(category)}
            onToggle={() => toggle(category)}
          />
        ))}
        {groups.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No words found for this script/level combination.
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
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent/50"
      >
        <span className="text-sm font-medium">{CATEGORY_LABELS[category]}</span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {words.length}
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
    <div className="flex flex-col gap-0.5 rounded-lg border bg-background px-3 py-2">
      <div className="flex items-center justify-between gap-1">
        <span className="text-lg font-medium">{word.word}</span>
        <button
          type="button"
          onClick={() => speakJapanese(word.word)}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
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
