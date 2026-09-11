"use client";

import { Suspense } from "react";
import { VocabularyExplorer } from "@/components/vocabulary/vocabulary-explorer";

function VocabularyPageContent() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 print:p-0 print:gap-4">
      <VocabularyExplorer />
    </div>
  );
}

export default function VocabularyPage() {
  return (
    <Suspense fallback={null}>
      <VocabularyPageContent />
    </Suspense>
  );
}
