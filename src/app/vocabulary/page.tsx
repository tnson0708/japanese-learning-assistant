"use client";

import { Suspense } from "react";
import { VocabularyExplorer } from "@/components/vocabulary/vocabulary-explorer";
import { useLanguage } from "@/lib/language-context";

function VocabularyPageContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 print:p-0 print:gap-4">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {t("vocab_title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("vocab_subtitle")}</p>
      </div>

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
