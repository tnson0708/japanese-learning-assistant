"use client";

import { Volume2 } from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";

/**
 * Renders a piece of Japanese text next to a small speaker icon that plays
 * it aloud via the app's existing TTS pipeline (src/lib/speech.ts). Used
 * throughout the theory/grammar pages so every Japanese word or example
 * sentence is clickable-to-listen.
 */
export function JapaneseText({
  text,
  className,
  iconClassName,
  rate,
}: {
  text: string;
  className?: string;
  iconClassName?: string;
  rate?: number;
}) {
  if (!text) return null;

  // Strip leading circled numbers / bullet markers (①②③...) and Japanese
  // colons before speaking, so audio doesn't try to pronounce punctuation.
  const spoken = text.replace(/^[①-⑳\s]+/, "").trim();

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span>{text}</span>
      <button
        type="button"
        onClick={() => speakJapanese(spoken || text, undefined, rate)}
        className={cn(
          "shrink-0 rounded-full p-0.5 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-primary",
          iconClassName
        )}
        aria-label={`Nghe phát âm: ${text}`}
        title="Nghe phát âm"
      >
        <Volume2 className="size-3.5" />
      </button>
    </span>
  );
}
