"use client";

import { useState } from "react";
import { Eye, EyeOff, Languages, MessageSquare, Sparkles, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JapaneseText } from "@/components/theory/japanese-text";
import { ExerciseAudioPlayer } from "@/components/theory/exercise-blocks";
import { speakJapanese } from "@/lib/speech";
import type { TranslationSentenceItem, TranslationDialogueLine } from "@/lib/theory";

export function TranslationBlock({
  title,
  instruction,
  sentences,
  examples,
  dialogueTitle,
  dialogueLines,
  dialogueAudioUrl,
}: {
  title: string;
  instruction?: string;
  sentences?: TranslationSentenceItem[];
  examples?: TranslationSentenceItem[];
  dialogueTitle?: string;
  dialogueLines?: TranslationDialogueLine[];
  dialogueAudioUrl?: string;
}) {
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const toggleItem = (id: string) => {
    setRevealedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    const nextState = !showAll;
    setShowAll(nextState);

    const allKeys: Record<string, boolean> = {};
    if (sentences) sentences.forEach((s) => (allKeys[s.id] = nextState));
    if (examples) examples.forEach((e) => (allKeys[e.id] = nextState));
    if (dialogueLines) dialogueLines.forEach((_, idx) => (allKeys[`dialogue-${idx}`] = nextState));
    setRevealedItems(allKeys);
  };

  return (
    <Card className="border-border/80 bg-card shadow-2xs rounded-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
              <Languages className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {title}
              </CardTitle>
              {instruction && (
                <p className="text-xs text-muted-foreground mt-0.5">{instruction}</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleAll}
            className="gap-1.5 text-xs font-semibold border-border/80 hover:bg-accent cursor-pointer"
          >
            {showAll ? (
              <>
                <EyeOff className="size-3.5 text-red-600" /> Ẩn tất cả tiếng Nhật
              </>
            ) : (
              <>
                <Eye className="size-3.5 text-red-600" /> Hiện tất cả tiếng Nhật
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-5">
        {/* 1. Mẫu câu (Sentence Patterns) */}
        {sentences && sentences.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <Sparkles className="size-4 text-red-600" />
              <h3 className="text-sm font-bold text-foreground">Mẫu câu chính</h3>
            </div>

            <div className="flex flex-col gap-3">
              {sentences.map((item) => {
                const isRevealed = showAll || !!revealedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:border-red-200/80 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2 text-xs sm:text-sm font-medium text-foreground">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[11px]">
                          {item.num}
                        </span>
                        <span className="leading-relaxed font-medium">{item.vi}</span>
                      </div>

                      <Button
                        type="button"
                        variant={isRevealed ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleItem(item.id)}
                        className="h-7 px-2.5 text-[11px] font-semibold shrink-0 gap-1 cursor-pointer"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="size-3 text-red-600" /> Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="size-3 text-red-600" /> Xem đáp án
                          </>
                        )}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="mt-1 flex items-center justify-between gap-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 p-3 text-sm border border-red-200/60 dark:border-red-900/30 animate-in fade-in duration-150">
                        <div className="flex flex-col gap-0.5">
                          <JapaneseText
                            text={item.jp}
                            hideIcon
                            className="text-base font-bold text-foreground"
                          />
                          {item.note && (
                            <p className="text-xs text-muted-foreground italic">
                              {item.note}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => speakJapanese(item.jp)}
                          className="size-8 rounded-lg bg-card hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 flex items-center justify-center text-muted-foreground transition-colors shrink-0 cursor-pointer shadow-2xs border border-border/50"
                          title="Phát âm tiếng Nhật"
                        >
                          <Volume2 className="size-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Ví dụ (Example Dialogues) */}
        {examples && examples.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <MessageSquare className="size-4 text-red-600" />
              <h3 className="text-sm font-bold text-foreground">Ví dụ hội thoại ngắn</h3>
            </div>

            <div className="flex flex-col gap-3">
              {examples.map((item) => {
                const isRevealed = showAll || !!revealedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:border-red-200/80 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2 text-xs sm:text-sm font-medium text-foreground">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[11px]">
                          {item.num}
                        </span>
                        <div className="whitespace-pre-line leading-relaxed font-medium">
                          {item.vi}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant={isRevealed ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleItem(item.id)}
                        className="h-7 px-2.5 text-[11px] font-semibold shrink-0 gap-1 cursor-pointer"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="size-3 text-red-600" /> Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="size-3 text-red-600" /> Xem đáp án
                          </>
                        )}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="mt-1 flex items-start justify-between gap-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 p-3 text-sm border border-red-200/60 dark:border-red-900/30 animate-in fade-in duration-150">
                        <div className="whitespace-pre-line flex-1">
                          {item.jp.split("\n").map((line, idx) => (
                            <div key={idx} className="py-0.5 flex items-center justify-between gap-2">
                              <JapaneseText
                                text={line}
                                hideIcon
                                className="text-base font-bold text-foreground"
                              />
                              {line.trim() && (
                                <button
                                  type="button"
                                  onClick={() => speakJapanese(line.replace(/[\.…]/g, "").trim())}
                                  className="text-muted-foreground hover:text-red-600 transition-colors p-1 cursor-pointer shrink-0"
                                  title="Phát âm"
                                >
                                  <Volume2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          {item.note && (
                            <p className="text-xs text-muted-foreground italic pt-1.5 border-t border-red-200/40 mt-1">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Hội thoại (Main Conversation) */}
        {dialogueLines && dialogueLines.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-red-600" />
                <h3 className="text-sm font-bold text-foreground">
                  Hội thoại: {dialogueTitle || "Bài hội thoại"}
                </h3>
              </div>
            </div>

            <ExerciseAudioPlayer audioUrl={dialogueAudioUrl} />

            <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
              {dialogueLines.map((line, idx) => {
                const lineId = `dialogue-${idx}`;
                const isRevealed = showAll || !!revealedItems[lineId];

                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 border-b border-border/50 pb-3.5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2 text-xs sm:text-sm">
                        <Badge
                          variant="outline"
                          className="font-bold shrink-0 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/80"
                        >
                          {line.speakerVi}
                        </Badge>
                        <span className="font-medium text-foreground leading-relaxed">
                          {line.vi}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant={isRevealed ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleItem(lineId)}
                        className="h-6 px-2 text-[10px] font-semibold shrink-0 gap-1 cursor-pointer"
                      >
                        {isRevealed ? "Ẩn" : "Xem đáp án"}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="ml-2 pl-3 border-l-2 border-red-600 py-1.5 text-sm flex items-center justify-between gap-2 animate-in fade-in duration-150 bg-muted/20 rounded-r-lg">
                        <div className="flex items-baseline gap-2">
                          {line.speakerJp && (
                            <span className="text-xs font-bold text-red-600">
                              {line.speakerJp}:
                            </span>
                          )}
                          <JapaneseText
                            text={line.jp}
                            hideIcon
                            className="text-base font-bold text-foreground"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => speakJapanese(line.jp)}
                          className="size-7 rounded-lg bg-card hover:bg-red-100 hover:text-red-600 text-muted-foreground transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-2xs border border-border/40"
                          title="Phát âm"
                        >
                          <Volume2 className="size-3.5 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
