"use client";

import { useRouter } from "next/navigation";
import { getSubtopicName, subtopicWordCount, type Subtopic } from "@/lib/vocabulary";
import { useLanguage } from "@/lib/language-context";

export function SubtopicCard({ domainId, subtopic }: { domainId: string; subtopic: Subtopic }) {
  const { language } = useLanguage();
  const router = useRouter();

  const levels = Array.from(new Set(subtopic.words.map((w) => w.jlptLevel))).sort();
  const types = Array.from(new Set(subtopic.words.map((w) => w.wordType)));

  const formatWordType = (type: string) => {
    switch (type) {
      case "kanji":
        return "Kanji";
      case "katakana":
        return "Katakana";
      case "hiragana":
        return "Hiragana";
      default:
        return type;
    }
  };

  return (
    <div
      onClick={() => router.push(`/vocabulary/${domainId}/${subtopic.id}`)}
      className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-md cursor-pointer gap-4 min-h-[150px]"
    >
      <div className="flex flex-col gap-2.5">
        <h3 className="text-base font-extrabold text-foreground group-hover:text-red-600 transition-colors">
          {getSubtopicName(subtopic, language)}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5">
          {levels.map((lvl) => (
            <span
              key={lvl}
              className="rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase"
            >
              {lvl}
            </span>
          ))}
          {types.map((wt) => (
            <span
              key={wt}
              className="rounded-full bg-muted/40 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground/80"
            >
              {formatWordType(wt)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs font-medium text-muted-foreground/80">
        <span>{subtopicWordCount(subtopic)} từ</span>
      </div>
    </div>
  );
}
