"use client";

import { useEffect, useState } from "react";
import {
  Volume2,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  X,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { speakJapanese } from "@/lib/speech";
import type { VocabWord } from "@/lib/vocabulary";

export function KatakanaQuizSession({ words, onEnd }: { words: VocabWord[]; onEnd: () => void }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Tracks which item index is currently revealed, instead of a plain boolean
  // reset in an effect — comparing against currentIndex means switching items
  // naturally re-hides the answer with no extra setState-in-effect needed.
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  const currentWord = words[currentIndex];
  const revealed = revealedIndex === currentIndex;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (currentWord) speakJapanese(currentWord.word);
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentWord) return null;

  const handleReplay = () => speakJapanese(currentWord.word);
  const handleNext = () => setCurrentIndex((idx) => (idx + 1) % words.length);
  const handlePrev = () => setCurrentIndex((idx) => (idx - 1 + words.length) % words.length);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:gap-5">
      <div className="flex items-center justify-between gap-2 rounded-xl border bg-card/80 px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-xs shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <Target className="size-4 shrink-0 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {t("vocab_quiz_entry")}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0">
            #{currentIndex + 1} / {words.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onEnd}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
          <span>{t("vocab_quiz_exit")}</span>
        </button>
      </div>

      <div className="relative flex flex-col items-center gap-4 sm:gap-6 rounded-2xl border bg-card p-4 sm:p-7 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center my-1 sm:my-2">
          <button
            type="button"
            onClick={handleReplay}
            className="group relative flex size-20 sm:size-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <Volume2 className="size-8 sm:size-10 transition-transform group-hover:scale-110" />
            <span className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-ping pointer-events-none" />
          </button>
          <p className="text-2xl font-bold tracking-tight text-foreground">{currentWord.word}</p>
        </div>

        <div className="w-full rounded-xl border bg-accent/30 p-3.5 sm:p-5">
          {!revealed ? (
            <div className="flex flex-col items-center gap-2 py-1 sm:py-2 text-center">
              <EyeOff className="size-5 sm:size-6 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground">{t("vocab_quiz_prompt")}</p>
              <Button variant="outline" size="sm" onClick={() => setRevealedIndex(currentIndex)} className="mt-1 gap-2 font-medium">
                <Eye className="size-4" />
                {t("vocab_quiz_reveal")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="size-3.5" />
                  {t("vocab_quiz_revealed")}
                </div>
                <button
                  type="button"
                  onClick={() => setRevealedIndex(null)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <EyeOff className="size-3.5" />
                  {t("vocab_quiz_hide")}
                </button>
              </div>

              <p className="text-xl sm:text-2xl font-bold tracking-tight text-primary mt-0.5">
                {currentWord.englishSource}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground border-t pt-1.5 w-full">
                {currentWord.meaning}
              </p>
            </div>
          )}
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev} className="flex items-center justify-center gap-1 font-medium">
            <ChevronLeft className="size-3.5 shrink-0" />
            <span>Prev</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleReplay} className="flex items-center justify-center gap-1.5 font-medium">
            <RotateCcw className="size-3.5 shrink-0" />
          </Button>
          <Button size="sm" onClick={handleNext} className="flex items-center justify-center gap-1 font-semibold">
            <span>Next</span>
            <ChevronRight className="size-3.5 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
