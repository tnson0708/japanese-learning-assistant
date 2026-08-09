"use client";

import { useState } from "react";
import { Eye, EyeOff, Languages, MessageSquare, Sparkles, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JapaneseText } from "@/components/theory/japanese-text";
import type { TranslationSentenceItem, TranslationDialogueLine } from "@/lib/theory";

export function TranslationBlock({
  title,
  instruction,
  sentences,
  examples,
  dialogueTitle,
  dialogueLines,
}: {
  title: string;
  instruction?: string;
  sentences?: TranslationSentenceItem[];
  examples?: TranslationSentenceItem[];
  dialogueTitle?: string;
  dialogueLines?: TranslationDialogueLine[];
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
    <Card className="border-primary/20 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Languages className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleAll}
            className="gap-1.5 text-xs font-semibold"
          >
            {showAll ? (
              <>
                <EyeOff className="size-3.5" /> Ẩn tất cả tiếng Nhật
              </>
            ) : (
              <>
                <Eye className="size-3.5" /> Hiện tất cả tiếng Nhật
              </>
            )}
          </Button>
        </div>

        {instruction && (
          <p className="text-xs text-muted-foreground">{instruction}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* 1. Mẫu câu (Sentence Patterns) */}
        {sentences && sentences.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b pb-1.5">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Mẫu câu</h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {sentences.map((item) => {
                const isRevealed = showAll || !!revealedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2 text-xs sm:text-sm font-medium text-foreground">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                          {item.num}
                        </span>
                        <span className="leading-relaxed">{item.vi}</span>
                      </div>

                      <Button
                        type="button"
                        variant={isRevealed ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleItem(item.id)}
                        className="h-7 px-2.5 text-[11px] font-semibold shrink-0 gap-1"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="size-3" /> Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="size-3" /> Xem đáp án
                          </>
                        )}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="mt-1 flex flex-col gap-1 rounded-lg bg-background p-2.5 text-sm border border-primary/20 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between gap-2">
                          <JapaneseText
                            text={item.jp}
                            className="text-base font-semibold text-primary"
                          />
                        </div>
                        {item.note && (
                          <p className="text-xs text-muted-foreground italic">
                            {item.note}
                          </p>
                        )}
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
            <div className="flex items-center gap-2 border-b pb-1.5">
              <MessageSquare className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Ví dụ</h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {examples.map((item) => {
                const isRevealed = showAll || !!revealedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2 text-xs sm:text-sm font-medium text-foreground">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                          {item.num}
                        </span>
                        <div className="whitespace-pre-line leading-relaxed">
                          {item.vi}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant={isRevealed ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleItem(item.id)}
                        className="h-7 px-2.5 text-[11px] font-semibold shrink-0 gap-1"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="size-3" /> Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="size-3" /> Xem đáp án
                          </>
                        )}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="mt-1 flex flex-col gap-1 rounded-lg bg-background p-2.5 text-sm border border-primary/20 animate-in fade-in duration-150">
                        <div className="whitespace-pre-line">
                          {item.jp.split("\n").map((line, idx) => (
                            <div key={idx} className="py-0.5">
                              <JapaneseText
                                text={line}
                                className="text-base font-semibold text-primary"
                              />
                            </div>
                          ))}
                        </div>
                        {item.note && (
                          <p className="text-xs text-muted-foreground italic pt-1 border-t">
                            {item.note}
                          </p>
                        )}
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
            <div className="flex items-center justify-between border-b pb-1.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Hội thoại: {dialogueTitle || "Bài hội thoại"}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-4 shadow-2xs">
              {dialogueLines.map((line, idx) => {
                const lineId = `dialogue-${idx}`;
                const isRevealed = showAll || !!revealedItems[lineId];

                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 border-b border-border/50 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-2 text-xs sm:text-sm">
                        <Badge
                          variant="outline"
                          className="font-bold shrink-0 bg-primary/5 text-primary"
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
                        className="h-6 px-2 text-[10px] font-semibold shrink-0 gap-1"
                      >
                        {isRevealed ? "Ẩn" : "Xem đáp án"}
                      </Button>
                    </div>

                    {isRevealed && (
                      <div className="ml-2 pl-3 border-l-2 border-primary/50 py-1 text-sm animate-in fade-in duration-150">
                        {line.speakerJp && (
                          <span className="text-xs font-bold text-muted-foreground mr-2">
                            {line.speakerJp}:
                          </span>
                        )}
                        <JapaneseText
                          text={line.jp}
                          className="text-base font-semibold text-primary"
                        />
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
