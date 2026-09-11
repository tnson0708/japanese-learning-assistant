"use client";

import Link from "next/link";
import { Volume2, MapPin, PencilLine, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrokeOrderSvg } from "@/components/kana/stroke-order-svg";
import { speakJapanese } from "@/lib/speech";
import { getKanaMeta } from "@/lib/kana-meta";
import type { Kana } from "@/lib/kana";

export function KanaInspectorCard({ kana }: { kana: Kana }) {
  const meta = getKanaMeta(kana.char);

  return (
    <div className="flex flex-col gap-5 sticky top-20 print:hidden">
      {/* 1. Main Inspector Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            THANH KIỂM TRA KÝ TỰ (INSPECTOR)
          </span>
          <span className="rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 px-2.5 py-0.5 text-[10px] font-bold">
            {meta.originName || `${kana.script === "hiragana" ? "Hiragana" : "Katakana"}`}
          </span>
        </div>

        {/* Large Character & Ghost Kanji Display */}
        <div className="relative flex flex-col items-center justify-center rounded-xl bg-muted/20 py-6 border border-border/40 overflow-hidden">
          {/* Background Ghost Origin Kanji */}
          {meta.originKanji && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl font-black text-muted-foreground/10 select-none pointer-events-none font-kanji-mincho">
              {meta.originKanji}
            </span>
          )}

          {/* Large Kana Character */}
          <span className="text-6xl font-extrabold text-foreground tracking-tight select-none font-kanji-mincho">
            {kana.char}
          </span>

          {/* Romaji & Audio Button */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-muted-foreground">
              {kana.romaji}
            </span>
            <button
              type="button"
              onClick={() => speakJapanese(kana.char)}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
            >
              <Volume2 className="size-3.5" />
              <span>Phát âm ({kana.romaji})</span>
            </button>
          </div>
        </div>

        {/* Stroke Order Animation & Step Badges */}
        <div className="flex flex-col items-center gap-2 border-t border-border/40 pt-3">
          <div className="flex items-center justify-between w-full text-xs">
            <span className="font-bold text-foreground">Thứ tự nét viết chuẩn</span>
            <span className="text-muted-foreground text-[11px] font-semibold">
              Tổng cộng: <strong className="text-foreground">{kana.strokeCount}</strong> nét bứt
            </span>
          </div>

          <div className="flex justify-center bg-background rounded-xl p-2 border border-border/50 w-full max-w-[200px]">
            <StrokeOrderSvg
              kana={kana}
              className="w-32 h-32 text-foreground"
              hideReplayButton={false}
            />
          </div>

          {/* Step badges */}
          {meta.strokeSteps && meta.strokeSteps.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 w-full">
              {meta.strokeSteps.map((step, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-muted/60 border border-border/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  {step}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Common Sample Vocabulary Words */}
        {meta.sampleWords && meta.sampleWords.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Từ vựng thông dụng chứa ký tự:
            </span>
            <div className="flex flex-col gap-1.5">
              {meta.sampleWords.map((word, idx) => (
                <div
                  key={idx}
                  onClick={() => speakJapanese(word.jp)}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs transition-all hover:bg-accent hover:border-red-500/30 cursor-pointer"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-foreground">{word.jp}</span>
                    <span className="text-[11px] text-muted-foreground">({word.romaji})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                    {word.vi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button: Practice Writing */}
        <Link
          href={`/practice/${kana.id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 shadow-2xs mt-1 transition-colors"
        >
          <PencilLine className="size-4" />
          <span>Luyện viết chữ {kana.char} ngay</span>
        </Link>
      </div>

      {/* 2. Memory Tip Card */}
      <div className="flex flex-col gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 shadow-2xs">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-red-600 shrink-0" />
          <h3 className="text-xs font-bold text-foreground">
            Mẹo ghi nhớ {kana.script === "hiragana" ? "Hiragana" : "Katakana"}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-6">
          {meta.memoryTip ||
            `Liên kết nét uốn của ${kana.char} (${kana.romaji}) với các hình ảnh đời sống giúp bộ nhớ dài hạn tiếp thu nhanh gấp 3 lần.`}
        </p>
      </div>
    </div>
  );
}
