"use client";

import { ChevronLeft } from "lucide-react";
import { SubtopicCard } from "@/components/vocabulary/subtopic-card";
import { PrintCutoutSheet } from "@/components/vocabulary/print-cutout-sheet";
import { PrintLabelsButton } from "@/components/vocabulary/print-labels-button";
import { useLanguage } from "@/lib/language-context";
import { getDomainName, getSubtopicName, subtopicMatchesFilters, type Domain, type LevelFilter, type TypeFilter } from "@/lib/vocabulary";

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
  const { language } = useLanguage();
  const visibleSubtopics = domain.subtopics.filter((s) => subtopicMatchesFilters(s, level, type));
  const domainName = getDomainName(domain, language);

  return (
    <div className="flex flex-col gap-5">
      <PrintCutoutSheet
        title={domainName}
        groups={domain.subtopics.map((s) => ({ heading: getSubtopicName(s, language), words: s.words }))}
      />

      {/* Subtopic Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-border/40 pb-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="size-3.5" />
            <span>Tất cả lĩnh vực</span>
          </button>

          <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
            {domainName}
          </h2>
        </div>

        <PrintLabelsButton />
      </div>

      {visibleSubtopics.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground print:hidden">
          Không có chủ đề con nào phù hợp với bộ lọc hiện tại.
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
