"use client";

import { SlidersHorizontal } from "lucide-react";
import type { LevelFilter, TypeFilter } from "@/lib/vocabulary";
import { cn } from "@/lib/utils";

export function VocabFilterBar({
  level,
  onLevelChange,
  type,
  onTypeChange,
  totalVisible = 9,
}: {
  level: LevelFilter;
  onLevelChange: (v: LevelFilter) => void;
  type: TypeFilter;
  onTypeChange: (v: TypeFilter) => void;
  totalVisible?: number;
}) {
  const levelOptions: { value: LevelFilter; label: string }[] = [
    { value: "all", label: "Tất cả cấp độ" },
    { value: "N5", label: "N5 (Cơ bản)" },
    { value: "N4", label: "N4 (Sơ cấp)" },
    { value: "N3", label: "N3 (Trung cấp)" },
    { value: "N2", label: "N2 (Nâng cao)" },
    { value: "N1", label: "N1 (Thành thạo)" },
  ];

  const typeOptions: { value: TypeFilter; label: string }[] = [
    { value: "all", label: "Tất cả loại từ" },
    { value: "kanji", label: "漢字 Hán tự" },
    { value: "hiragana", label: "ひらがな Thuần Nhật" },
    { value: "katakana", label: "カタカナ Từ mượn" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
      {/* Top Header: Title */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-red-600 shrink-0" />
        <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
          Bộ lọc từ vựng thông minh
          <span className="text-xs font-normal text-muted-foreground">
            (Hiển thị tất cả {totalVisible} chủ đề)
          </span>
        </h2>
      </div>

      {/* Filter Rows */}
      <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
        {/* Row 1: CẤP ĐỘ JLPT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 sm:w-32">
            Cấp độ JLPT
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {levelOptions.map((opt) => {
              const isActive = level === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onLevelChange(opt.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none",
                    isActive
                      ? "bg-red-600 text-white shadow-2xs hover:bg-red-700"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground border border-border/40"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: LOẠI TỪ / KÝ TỰ */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 sm:w-32">
            Loại từ / Ký tự
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {typeOptions.map((opt) => {
              const isActive = type === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onTypeChange(opt.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none",
                    isActive
                      ? "bg-red-600 text-white shadow-2xs hover:bg-red-700"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground border border-border/40"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
