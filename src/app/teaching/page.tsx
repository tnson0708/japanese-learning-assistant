"use client";

import { TeachingDeck } from "@/components/teaching/teaching-deck";
import { useLanguage } from "@/lib/language-context";

export default function TeachingPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {t("teaching_title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("teaching_subtitle")}
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <TeachingDeck />
      </div>
    </div>
  );
}
