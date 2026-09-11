"use client";

import { Volume2 } from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { renderFurigana } from "@/lib/furigana";
import type { VocabWord } from "@/lib/vocabulary";
import { cn } from "@/lib/utils";

function getJlptBadgeColor(level: string) {
  switch (level) {
    case "N5":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/40";
    case "N4":
      return "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/40";
    case "N3":
      return "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/40";
    case "N2":
      return "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/40";
    default:
      return "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/40";
  }
}

function getWordTypeLabel(type: string) {
  switch (type) {
    case "kanji":
      return "Danh từ";
    case "katakana":
      return "Từ mượn (Katakana)";
    case "hiragana":
      return "Thuần Nhật (Hiragana)";
    default:
      return type;
  }
}

export function WordCard({
  word,
  showFurigana = true,
}: {
  word: VocabWord;
  showFurigana?: boolean;
}) {
  const isKanji = word.wordType === "kanji" && word.word !== word.reading;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs transition-all duration-200 hover:border-red-500/30 hover:shadow-xs gap-3">
      <div className="flex flex-col gap-3">
        {/* Top Bar: Level Badge + Word Type + Han-Viet + Audio Button */}
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                getJlptBadgeColor(word.jlptLevel)
              )}
            >
              {word.jlptLevel}
            </span>

            <span className="text-[11px] font-semibold text-muted-foreground">
              {getWordTypeLabel(word.wordType)}
            </span>

            {word.hanVietHint && (
              <span className="text-[11px] font-medium text-muted-foreground/80">
                • Hán-Việt: <strong className="font-semibold text-foreground">{word.hanVietHint}</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => speakJapanese(word.reading || word.word)}
            className="shrink-0 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 cursor-pointer"
            title={`Nghe phát âm: ${word.word}`}
            aria-label={`Nghe phát âm: ${word.word}`}
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        {/* Main Word & Reading */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <div className="flex items-baseline gap-2">
            {isKanji && showFurigana ? (
              <ruby className="text-2xl font-extrabold tracking-tight text-foreground">
                {word.word}
                <rt className="text-[0.5em] font-normal text-muted-foreground select-none">
                  {word.reading}
                </rt>
              </ruby>
            ) : (
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                {word.word}
              </span>
            )}
          </div>

          {word.reading && (
            <span className="text-xs font-medium text-muted-foreground/80">
              {word.reading}
              {word.englishSource && ` (${word.englishSource})`}
            </span>
          )}
        </div>

        {/* Meaning */}
        <div className="pt-0.5">
          <p className="text-sm font-bold text-foreground leading-snug">
            {word.meaning}
          </p>
        </div>
      </div>

      {/* Example Sentence Box */}
      {word.exampleSentence && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/20 p-3 mt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Ví dụ ứng dụng
            </span>
            <button
              type="button"
              onClick={() => speakJapanese(word.exampleSentence)}
              className="shrink-0 rounded-full p-1 text-muted-foreground/60 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
              title="Nghe câu ví dụ"
            >
              <Volume2 className="size-3.5" />
            </button>
          </div>

          <p className="text-xs font-semibold text-foreground leading-relaxed">
            {showFurigana ? renderFurigana(word.exampleSentence) : word.exampleSentence}
          </p>
          <p className="text-xs italic font-medium text-muted-foreground leading-relaxed">
            {word.exampleSentenceMeaning}
          </p>
        </div>
      )}
    </div>
  );
}
