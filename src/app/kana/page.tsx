"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Volume2, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionGroup } from "@/components/option-group";
import {
  GROUP_LABELS,
  GROUP_ORDER,
  getKanaByScript,
  sortByGroup,
  type Kana,
  type Script,
} from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";

type SectionFilter = "all" | "main" | "dakuten" | "youon";

const SECTION_OPTIONS: { value: SectionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "main", label: "Main (五十音)" },
  { value: "dakuten", label: "Dakuten (濁音)" },
  { value: "youon", label: "Youon (拗音)" },
];

const MAIN_GROUPS = new Set(["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"]);
const DAKUTEN_GROUPS = new Set([
  "k-dakuten",
  "s-dakuten",
  "t-dakuten",
  "h-dakuten",
  "h-handakuten",
]);

function getGroupSection(group: string): "main" | "dakuten" | "youon" {
  if (MAIN_GROUPS.has(group)) return "main";
  if (DAKUTEN_GROUPS.has(group)) return "dakuten";
  return "youon";
}

function KanaCard({ kana }: { kana: Kana }) {
  const handleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    speakJapanese(kana.char);
  };

  return (
    <Link
      href={`/kana/${kana.id}`}
      className="group relative flex flex-col items-center justify-center rounded-xl border bg-card py-3.5 px-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-accent/50 hover:shadow-sm active:translate-y-0"
    >
      <button
        type="button"
        onClick={handleAudio}
        className="absolute top-1 right-1 rounded-full p-1 text-muted-foreground/50 opacity-0 transition-opacity hover:bg-accent hover:text-primary group-hover:opacity-100 focus:opacity-100"
        title={`Listen to ${kana.char}`}
        aria-label={`Listen to ${kana.char}`}
      >
        <Volume2 className="size-3.5" />
      </button>

      <span className="text-2xl font-medium leading-none tracking-tight sm:text-3xl">
        {kana.char}
      </span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
        {kana.romaji}
      </span>
    </Link>
  );
}

function KanaGroupCard({ groupKey, kanaItems }: { groupKey: string; kanaItems: Kana[] }) {
  const is5Cols = kanaItems.length === 5;

  return (
    <div className="flex flex-col rounded-xl border bg-card/40 p-4 shadow-2xs transition-colors hover:border-border/80">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {GROUP_LABELS[groupKey] || groupKey}
        </h3>
        <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {kanaItems.length}
        </span>
      </div>

      <div
        className={cn(
          "grid gap-2",
          is5Cols ? "grid-cols-5" : "grid-cols-3"
        )}
      >
        {kanaItems.map((k) => (
          <KanaCard key={k.id} kana={k} />
        ))}
      </div>
    </div>
  );
}

function KanaGrid({ script, section, query }: { script: Script; section: SectionFilter; query: string }) {
  const allKana = useMemo(() => sortByGroup(getKanaByScript(script)), [script]);

  const grouped = useMemo(() => {
    const map = new Map<string, Kana[]>();
    for (const k of allKana) {
      const arr = map.get(k.group) ?? [];
      arr.push(k);
      map.set(k.group, arr);
    }
    return map;
  }, [allKana]);

  const searchQuery = query.trim().toLowerCase();

  // Search view
  if (searchQuery) {
    const searchResults = allKana.filter(
      (k) =>
        k.romaji.toLowerCase().includes(searchQuery) ||
        k.char.includes(searchQuery)
    );

    if (searchResults.length === 0) {
      return (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No characters match &quot;{query}&quot;.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
        {searchResults.map((k) => (
          <KanaCard key={k.id} kana={k} />
        ))}
      </div>
    );
  }

  // Filtered by section
  const availableGroups = GROUP_ORDER.filter((g) => {
    if (!grouped.has(g)) return false;
    if (section === "all") return true;
    return getGroupSection(g) === section;
  });

  const sectionsToRender: { title: string; groups: string[] }[] = [];

  if (section === "all") {
    const main = availableGroups.filter((g) => getGroupSection(g) === "main");
    const dakuten = availableGroups.filter((g) => getGroupSection(g) === "dakuten");
    const youon = availableGroups.filter((g) => getGroupSection(g) === "youon");

    if (main.length > 0) sectionsToRender.push({ title: "Main Kana (五十音)", groups: main });
    if (dakuten.length > 0) sectionsToRender.push({ title: "Dakuten & Handakuten (濁音・半濁音)", groups: dakuten });
    if (youon.length > 0) sectionsToRender.push({ title: "Youon (拗音)", groups: youon });
  } else {
    sectionsToRender.push({
      title:
        section === "main"
          ? "Main Kana (五十音)"
          : section === "dakuten"
          ? "Dakuten & Handakuten (濁音・半濁音)"
          : "Youon (拗音)",
      groups: availableGroups,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {sectionsToRender.map((sec) => (
        <div key={sec.title} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
              {sec.title}
            </h2>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {sec.groups.map((groupKey) => (
              <KanaGroupCard
                key={groupKey}
                groupKey={groupKey}
                kanaItems={grouped.get(groupKey)!}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KanaChartPage() {
  const [tab, setTab] = useState<Script>("hiragana");
  const [section, setSection] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Learn Kana
        </h1>
        <p className="text-sm text-muted-foreground">
          Master Hiragana and Katakana with structured Gojūon grids, audio pronunciation, and stroke order animations.
        </p>
      </div>

      {/* Controls Bar: Tabs, Section Filter, Search */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Script)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-2 sm:w-48">
              <TabsTrigger value="hiragana" className="text-sm">Hiragana</TabsTrigger>
              <TabsTrigger value="katakana" className="text-sm">Katakana</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search romaji or kana..."
              className="w-full rounded-lg border bg-background pl-9 pr-8 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            Section:
          </span>
          <div className="w-full overflow-x-auto pb-1 sm:w-auto sm:pb-0 scrollbar-none">
            <OptionGroup
              options={SECTION_OPTIONS}
              value={section}
              onChange={setSection}
              size="sm"
              className="flex-nowrap"
            />
          </div>
        </div>
      </div>


      {/* Kana Content Grid */}
      <KanaGrid script={tab} section={section} query={query} />
    </div>
  );
}

