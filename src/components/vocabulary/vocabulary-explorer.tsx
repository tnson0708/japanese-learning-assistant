"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VocabFilterBar } from "@/components/vocabulary/vocab-filter-bar";
import { DomainGrid } from "@/components/vocabulary/domain-grid";
import { SubtopicGrid } from "@/components/vocabulary/subtopic-grid";
import { ContinueLearningButton } from "@/components/vocabulary/continue-learning-button";
import { DOMAINS, getDomainById } from "@/data/vocabulary";
import type { LevelFilter, TypeFilter } from "@/lib/vocabulary";

export function VocabularyExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");

  const [level, setLevel] = useState<LevelFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");

  // Derived straight from the URL (not local state) so returning here — via
  // the breadcrumb link, browser back/forward, or a bookmark — always shows
  // whichever domain the query param names, instead of resetting to the grid.
  const selectedDomain = domainParam ? getDomainById(domainParam) ?? null : null;

  const selectDomain = (domainId: string) => {
    router.push(`/vocabulary?domain=${domainId}`, { scroll: false });
  };

  const backToDomains = () => {
    router.push("/vocabulary", { scroll: false });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <VocabFilterBar level={level} onLevelChange={setLevel} type={type} onTypeChange={setType} />
        <ContinueLearningButton />
      </div>

      {selectedDomain ? (
        <SubtopicGrid domain={selectedDomain} level={level} type={type} onBack={backToDomains} />
      ) : (
        <DomainGrid domains={DOMAINS} level={level} type={type} onSelectDomain={selectDomain} />
      )}
    </div>
  );
}
