"use client";

import { MapPin, Volume2 } from "lucide-react";
import { speakJapanese } from "@/lib/speech";

export function KatakanaConfusingPairs() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 sm:p-5 dark:border-amber-900/40 dark:bg-amber-950/10 shadow-2xs print:hidden">
      {/* Header Line */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-amber-200/60 pb-3 dark:border-amber-900/40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400">
            <MapPin className="size-4" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-extrabold text-foreground">
              Mẹo Phân Biệt Nét Bút Katakana Dễ Nhầm Lẫn
            </h2>
            <p className="text-xs text-muted-foreground">
              Hai cặp chữ tử huyệt trong Katakana: Hướng xuất phát nét bút và góc nghiêng chuẩn mực
            </p>
          </div>
        </div>

        <span className="rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider self-start sm:self-auto">
          MỤC GHI NHỚ VÀNG
        </span>
      </div>

      {/* 2 Comparison Card Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
        {/* Block 1: シ (shi) vs ツ (tsu) */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-background p-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 inline-block" />
              Cặp 1: シ (shi) vs ツ (tsu)
            </span>
            <span className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Hướng Nét Dưới Lên vs Trên Xuống
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Card シ (shi) */}
            <div className="flex flex-col items-center gap-2 rounded-xl border border-red-300/80 bg-red-50/40 p-3 text-center dark:border-red-900/60 dark:bg-red-950/30">
              <div className="relative flex size-20 items-center justify-center rounded-xl bg-background border border-red-200/80 dark:border-red-900/40 shadow-inner">
                {/* Visual stroke direction arrow indicator */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full p-2 text-red-600">
                  <path d="M 30 75 Q 40 45 75 25" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" />
                  <polygon points="75,25 65,30 70,38" fill="currentColor" />
                </svg>
                <span className="text-4xl font-extrabold text-red-600 dark:text-red-400 select-none z-10">
                  シ
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese("シ")}
                  className="absolute right-1 bottom-1 rounded-full p-1 text-red-600/70 hover:bg-red-100 hover:text-red-700 transition-colors z-20"
                >
                  <Volume2 className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                  シ (shi)
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  3 nét • Nét 3 hất DƯỚI LÊN
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-snug">
                Hai nét chấm nằm ngang, nét vuốt từ <strong className="text-red-600 font-bold">gốc dưới-trái hất chếch lên trên</strong>. Hãy nhớ: <em className="text-red-600 not-italic font-semibold">Nước biển dâng lên (Sóng - Shi)</em>.
              </p>
            </div>

            {/* Card ツ (tsu) */}
            <div className="flex flex-col items-center gap-2 rounded-xl border border-emerald-300/80 bg-emerald-50/40 p-3 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="relative flex size-20 items-center justify-center rounded-xl bg-background border border-emerald-200/80 dark:border-emerald-900/40 shadow-inner">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full p-2 text-emerald-600">
                  <path d="M 75 25 Q 60 55 35 75" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" />
                  <polygon points="35,75 42,66 48,72" fill="currentColor" />
                </svg>
                <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 select-none z-10">
                  ツ
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese("ツ")}
                  className="absolute right-1 bottom-1 rounded-full p-1 text-emerald-600/70 hover:bg-emerald-100 hover:text-emerald-700 transition-colors z-20"
                >
                  <Volume2 className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  ツ (tsu)
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  3 nét • Nét 3 giáng TRÊN XUỐNG
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-snug">
                Hai nét chấm xếp thẳng đứng hơn, nét vuốt từ <strong className="text-emerald-600 font-bold">trên bố thẳng dốc xuống</strong>. Gợi nhớ: <em className="text-emerald-600 not-italic font-semibold">Mưa giáng từ trời xuống (Tsunami - Tsu)</em>.
              </p>
            </div>
          </div>
        </div>

        {/* Block 2: ソ (so) vs ン (n) */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-background p-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500 inline-block" />
              Cặp 2: ソ (so) vs ン (n)
            </span>
            <span className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Nét Đứng Đổ Dốc vs Nét Nằm Hất Lên
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Card ソ (so) */}
            <div className="flex flex-col items-center gap-2 rounded-xl border border-red-300/80 bg-red-50/40 p-3 text-center dark:border-red-900/60 dark:bg-red-950/30">
              <div className="relative flex size-20 items-center justify-center rounded-xl bg-background border border-red-200/80 dark:border-red-900/40 shadow-inner">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full p-2 text-red-600">
                  <path d="M 65 25 Q 50 55 35 75" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" />
                  <polygon points="35,75 42,66 48,72" fill="currentColor" />
                </svg>
                <span className="text-4xl font-extrabold text-red-600 dark:text-red-400 select-none z-10">
                  ソ
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese("ソ")}
                  className="absolute right-1 bottom-1 rounded-full p-1 text-red-600/70 hover:bg-red-100 hover:text-red-700 transition-colors z-20"
                >
                  <Volume2 className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                  ソ (so)
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  2 nét • Bút vuốt TỪ TRÊN XUỐNG
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-snug">
                Chấm nét 1 dốc đứng, nét chính bắt đầu ngang đỉnh và kéo dốc thẳng xuống. Tương tự chữ <strong className="text-red-600 font-bold">ツ</strong> rút gọn.
              </p>
            </div>

            {/* Card ン (n) */}
            <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50/40 p-3 text-center dark:border-amber-900/60 dark:bg-amber-950/30">
              <div className="relative flex size-20 items-center justify-center rounded-xl bg-background border border-amber-200/80 dark:border-amber-900/40 shadow-inner">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full p-2 text-amber-600">
                  <path d="M 30 75 Q 40 45 75 25" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" />
                  <polygon points="75,25 65,30 70,38" fill="currentColor" />
                </svg>
                <span className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 select-none z-10">
                  ン
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese("ン")}
                  className="absolute right-1 bottom-1 rounded-full p-1 text-amber-600/70 hover:bg-amber-100 hover:text-amber-700 transition-colors z-20"
                >
                  <Volume2 className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                  ン (n)
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  2 nét • Bút hất TỪ DƯỚI LÊN
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-snug">
                Chấm nét 1 nằm ngang bè ra, nét chính bắt đầu thấp ở đáy rồi vuốt xiên ngược lên. Tương tự chữ <strong className="text-amber-600 font-bold">シ</strong> rút gọn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
