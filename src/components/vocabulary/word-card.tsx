"use client";

import { Volume2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { useVocabProgress } from "@/lib/vocab-progress-context";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";
import type { VocabWord } from "@/lib/vocabulary";

export function WordCard({ word }: { word: VocabWord }) {
  const { t } = useLanguage();
  const { isWordLearned, toggleWordLearned } = useVocabProgress();
  const learned = isWordLearned(word.id);

  return (
    <Card className={cn("shadow-2xs transition-colors", learned && "border-emerald-500/40 bg-emerald-500/5")}>
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">{word.word}</span>
            {word.wordType === "kanji" && (
              <span className="text-sm text-muted-foreground">{word.reading}</span>
            )}
            <Badge variant="outline" className="text-[10px]">
              {word.jlptLevel}
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => speakJapanese(word.word)}
            className="shrink-0 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary"
            title={`Listen to ${word.word}`}
            aria-label={`Listen to ${word.word}`}
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm text-foreground">{word.meaning}</p>
          {word.wordType === "kanji" && word.hanVietHint && (
            <span className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs font-medium text-secondary-foreground/80">
              Hán Việt: {word.hanVietHint}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 border-t pt-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/70">{t("vocab_example_label")}: </span>
              {word.exampleSentence}
            </p>
            <button
              type="button"
              onClick={() => speakJapanese(word.exampleSentence)}
              className="shrink-0 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-primary"
              title={t("vocab_listen_sentence")}
              aria-label={t("vocab_listen_sentence")}
            >
              <Volume2 className="size-4" />
            </button>
          </div>
          <p className="text-xs italic text-muted-foreground/80">{word.exampleSentenceMeaning}</p>
        </div>

        <button
          type="button"
          onClick={() => toggleWordLearned(word.id)}
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            learned
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Check className={cn("size-3.5", learned ? "opacity-100" : "opacity-40")} />
          {learned ? t("vocab_marked_learned") : t("vocab_mark_learned")}
        </button>
      </CardContent>
    </Card>
  );
}
