"use client";

import { ChevronLeft } from "lucide-react";
import { SubtopicCard } from "@/components/vocabulary/subtopic-card";
import { PrintCutoutSheet } from "@/components/vocabulary/print-cutout-sheet";
import { PrintLabelsButton } from "@/components/vocabulary/print-labels-button";
import { useLanguage } from "@/lib/language-context";
import { subtopicMatchesFilters, type Domain, type LevelFilter, type TypeFilter } from "@/lib/vocabulary";

export function SubtopicGrid({
  domain,
  level,
  type,
  onBack,
}: {
  domain: Domain;
  level: LevelFilter;
  type: TypeFilter;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  const visibleSubtopics = domain.subtopics.filter((s) => subtopicMatchesFilters(s, level, type));

  return (
    <div className="flex flex-col gap-4">
      <PrintCutoutSheet
        title={domain.name}
        groups={domain.subtopics.map((s) => ({ heading: s.name, words: s.words }))}
      />

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          {t("vocab_back_to_domains")}
        </button>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
          {domain.name}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
        <PrintLabelsButton />
      </div>

      {visibleSubtopics.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground print:hidden">
          {t("vocab_no_matching_subtopics")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:hidden">
          {visibleSubtopics.map((subtopic) => (
            <SubtopicCard key={subtopic.id} domainId={domain.id} subtopic={subtopic} />
          ))}
        </div>
      )}
    </div>
  );
}
