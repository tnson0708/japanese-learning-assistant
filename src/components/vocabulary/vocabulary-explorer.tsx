"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VocabHeader } from "@/components/vocabulary/vocab-header";
import { VocabFilterBar } from "@/components/vocabulary/vocab-filter-bar";
import { DomainGrid } from "@/components/vocabulary/domain-grid";
import { SubtopicGrid } from "@/components/vocabulary/subtopic-grid";
import { DOMAINS, getDomainById } from "@/data/vocabulary";
import { domainWordCount, type LevelFilter, type TypeFilter } from "@/lib/vocabulary";

export function VocabularyExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");

  const [level, setLevel] = useState<LevelFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");

  const selectedDomain = domainParam ? getDomainById(domainParam) ?? null : null;

  const selectDomain = (domainId: string) => {
    router.push(`/vocabulary?domain=${domainId}`, { scroll: false });
  };

  const backToDomains = () => {
    router.push("/vocabulary", { scroll: false });
  };

  const totalDomains = DOMAINS.length;
  const totalSubtopics = DOMAINS.reduce((sum, d) => sum + d.subtopics.length, 0);
  const totalWords = DOMAINS.reduce((sum, d) => sum + domainWordCount(d), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Hero Header */}
      {!selectedDomain && (
        <VocabHeader
          domainCount={totalDomains}
          wordCount={totalWords}
          subtopicCount={totalSubtopics}
        />
      )}

      {/* Filter Bar */}
      <div className="print:hidden">
        <VocabFilterBar
          level={level}
          onLevelChange={setLevel}
          type={type}
          onTypeChange={setType}
          totalVisible={totalDomains}
        />
      </div>

      {/* Main Grid or Selected Subtopics View */}
      {selectedDomain ? (
        <SubtopicGrid domain={selectedDomain} level={level} type={type} onBack={backToDomains} />
      ) : (
        <DomainGrid
          domains={DOMAINS}
          level={level}
          type={type}
          onSelectDomain={selectDomain}
        />
      )}
    </div>
  );
}
