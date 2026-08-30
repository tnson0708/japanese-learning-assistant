"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordCard } from "@/components/vocabulary/word-card";
import { KatakanaQuizSession } from "@/components/vocabulary/katakana-quiz-session";
import { PrintCutoutSheet } from "@/components/vocabulary/print-cutout-sheet";
import { PrintLabelsButton } from "@/components/vocabulary/print-labels-button";
import { useLanguage } from "@/lib/language-context";
import { getDomainName, getSubtopicName, type Domain, type Subtopic } from "@/lib/vocabulary";

export function SubtopicStudyView({ domain, subtopic }: { domain: Domain; subtopic: Subtopic }) {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const katakanaWords = subtopic.words.filter((w) => w.wordType === "katakana" && w.englishSource);

  const domainName = getDomainName(domain, language);
  const subtopicName = getSubtopicName(subtopic, language);

  if (mode === "quiz") {
    return (
      <div className="flex flex-col gap-4">
        <KatakanaQuizSession words={katakanaWords} onEnd={() => setMode("study")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PrintCutoutSheet title={subtopicName} groups={[{ words: subtopic.words }]} />

      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground print:hidden">
        <Link href="/vocabulary" className="hover:text-foreground hover:underline">
          {t("vocab_breadcrumb_vocabulary")}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/vocabulary?domain=${domain.id}`} className="hover:text-foreground hover:underline">
          {domainName}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{subtopicName}</span>
      </nav>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{subtopicName}</h1>
        <div className="flex shrink-0 flex-wrap gap-2">
          <PrintLabelsButton />
          {katakanaWords.length > 0 && (
            <Button onClick={() => setMode("quiz")} variant="outline" className="gap-2 font-semibold">
              <Target className="size-4" />
              {t("vocab_quiz_entry")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 print:hidden">
        {subtopic.words.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>
    </div>
  );
}
