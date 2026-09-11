"use client";

import { Languages } from "lucide-react";

export function VocabHeader({
  domainCount = 9,
  wordCount = 674,
  subtopicCount = 32,
}: {
  domainCount?: number;
  wordCount?: number;
  subtopicCount?: number;
}) {
  return (
    <div className="flex flex-col gap-6 pt-2 pb-1 lg:flex-row lg:items-start lg:justify-between">
      {/* Title & Description */}
      <div className="flex max-w-2xl flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 shrink-0 shadow-2xs">
            <Languages className="size-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Từ vựng theo chủ đề
            </h1>
            <p className="text-xs font-semibold text-muted-foreground/80 tracking-wide">
              Vocabulary by Life Domain • 語彙カテゴリー
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-0.5">
          Khám phá vốn từ vựng tiếng Nhật cốt lõi được tuyển chọn theo từng lĩnh vực đời sống, chia nhỏ theo chủ đề con trực quan, tích hợp âm thanh bản ngữ, thẻ nhớ tương tác và phân loại chi tiết theo cấp độ JLPT (N5 - N1).
        </p>
      </div>

      {/* Right side Statistics Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:w-auto shrink-0">
        <div className="flex flex-col justify-center rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Lĩnh vực
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-foreground sm:text-2xl">
              {domainCount}
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/80 mt-0.5">
            Đời sống & Xã hội
          </span>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Tổng vốn từ
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-red-600 dark:text-red-400 sm:text-2xl">
              {wordCount}+
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/80 mt-0.5">
            Từ vựng thiết yếu
          </span>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Chủ đề con
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-foreground sm:text-2xl">
              {subtopicCount}
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/80 mt-0.5">
            Nhóm phân loại
          </span>
        </div>
      </div>
    </div>
  );
}
