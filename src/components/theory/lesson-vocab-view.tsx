"use client";

import { useState } from "react";
import {
  BookOpen,
  Info,
  MessageSquare,
  Search,
  Subtitles,
  Volume2,
} from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { kanaToRomaji } from "@/lib/romaji";
import { cn } from "@/lib/utils";
import type { Lesson, VocabItem, ContentBlock } from "@/lib/theory";

interface ExtendedVocabItem extends VocabItem {
  id: string;
  groupLabel: string;
  isConversation?: boolean;
}

export function LessonVocabView({ lesson }: { lesson: Lesson }) {
  const [showFurigana, setShowFurigana] = useState(true);

  // Extract vocabulary section
  const vocabSection = lesson.sections.find((s) => s.id === "vocabulary");
  if (!vocabSection) return null;

  // Gather all vocabulary items and group information
  const allWords: ExtendedVocabItem[] = [];
  const groupsInfo: { heading: string; count: number }[] = [];
  const notesList: string[] = [];

  let itemCounter = 1;

  vocabSection.blocks.forEach((block: ContentBlock) => {
    if (block.type === "vocab-list") {
      const label = "Từ vựng chung";
      let count = 0;
      block.items.forEach((item) => {
        allWords.push({
          ...item,
          id: `v-${itemCounter++}`,
          groupLabel: label,
        });
        count++;
      });
      if (count > 0) {
        const existing = groupsInfo.find((g) => g.heading === label);
        if (existing) existing.count += count;
        else groupsInfo.push({ heading: label, count });
      }
    } else if (block.type === "vocab-group") {
      const label = block.heading || "Từ vựng nhóm";
      const isConv = /練習C|会話|Mẫu câu|chào hỏi/i.test(label);
      let count = 0;
      block.items.forEach((item) => {
        allWords.push({
          ...item,
          id: `v-${itemCounter++}`,
          groupLabel: label,
          isConversation: isConv,
        });
        count++;
      });
      if (count > 0) {
        const existing = groupsInfo.find((g) => g.heading === label);
        if (existing) existing.count += count;
        else groupsInfo.push({ heading: label, count });
      }
    } else if (block.type === "note") {
      notesList.push(block.text);
    }
  });

  const handlePlayWord = (text: string) => {
    speakJapanese(text.replace(/[\.…]/g, "").trim());
  };

  const handlePlayAllVocab = () => {
    const wordList = allWords.map((w) => (w.kanji || w.jp).replace(/[\.…]/g, "").trim());
    let index = 0;
    const playNext = () => {
      if (index < wordList.length) {
        speakJapanese(wordList[index]);
        index++;
        setTimeout(playNext, 1800);
      }
    };
    playNext();
  };

  // Check if there are conversation phrase groups
  const conversationGroups = vocabSection.blocks.filter(
    (b): b is Extract<ContentBlock, { type: "vocab-group" }> =>
      b.type === "vocab-group" && /練習C|会話|Mẫu câu|chào hỏi/i.test(b.heading || "")
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner Control Bar (Audio Play & Furigana Toggle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <BookOpen className="size-4 text-red-600" />
          <span>Danh mục {allWords.length} từ vựng chuẩn Minna no Nihongo Bài {lesson.id}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFurigana((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
              showFurigana
                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/80"
                : "bg-background border-border/60 text-muted-foreground hover:bg-accent"
            )}
          >
            <Subtitles className="size-3.5" />
            <span>{showFurigana ? "Ẩn Furigana" : "Hiện Furigana"}</span>
          </button>

          <button
            type="button"
            onClick={handlePlayAllVocab}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Volume2 className="size-3.5" />
            <span>Nghe toàn bộ từ vựng</span>
          </button>
        </div>
      </div>

      {/* Core Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allWords.map((item) => {
          const romaji = kanaToRomaji(item.jp);

          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 bg-card shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handlePlayWord(item.kanji || item.jp)}
                  className="size-9 rounded-lg bg-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 flex items-center justify-center text-muted-foreground transition-colors shrink-0 cursor-pointer mt-0.5"
                  title={`Phát âm ${item.jp}`}
                >
                  <Volume2 className="size-4" />
                </button>

                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    {item.kanji ? (
                      <div className="flex flex-col leading-none">
                        {showFurigana && (
                          <span className="text-[11px] text-red-600 font-medium mb-0.5">
                            {item.jp}
                          </span>
                        )}
                        <span className="text-lg font-bold text-foreground">
                          {item.kanji}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-foreground">
                        {item.jp}
                      </span>
                    )}
                    {romaji && (
                      <span className="text-[11px] text-muted-foreground/75 font-mono lowercase">
                        {romaji.toLowerCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-foreground font-medium mt-1">
                    {item.meaning}
                  </p>

                  {item.note && (
                    <span className="text-[11px] mt-1 font-medium leading-relaxed text-muted-foreground">
                      {item.note}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SPECIAL SECTION: Conversation / Practice Groups (if any) */}
      {conversationGroups.map((group, gi) => (
        <div key={gi} className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                <MessageSquare className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {group.heading || "Mẫu câu giao tiếp & Chào hỏi"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Các câu nói giao tiếp chuẩn xác trong bài
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-medium w-fit">
              Chuẩn Minna no Nihongo Bài {lesson.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.items.map((phrase, pi) => (
              <div
                key={pi}
                className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex items-start gap-3 hover:bg-muted/70 transition-colors group"
              >
                <span className="size-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {String(pi + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      {phrase.kanji || phrase.jp}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayWord(phrase.kanji || phrase.jp)}
                      className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Volume2 className="size-4" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {phrase.meaning}
                  </p>
                  {phrase.note && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      {phrase.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SPECIAL SECTION: Lesson Notes (if any) */}
      {notesList.map((noteText, ni) => (
        <div
          key={ni}
          className="p-4 rounded-xl bg-muted/60 border border-border/60 flex items-start gap-3"
        >
          <Info className="size-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Lưu ý trong bài:</strong> {noteText}
          </p>
        </div>
      ))}
    </div>
  );
}
