"use client";

import { OptionGroup } from "@/components/option-group";
import { useLanguage } from "@/lib/language-context";
import type { LevelFilter, TypeFilter } from "@/lib/vocabulary";

export function VocabFilterBar({
  level,
  onLevelChange,
  type,
  onTypeChange,
}: {
  level: LevelFilter;
  onLevelChange: (v: LevelFilter) => void;
  type: TypeFilter;
  onTypeChange: (v: TypeFilter) => void;
}) {
  const { t } = useLanguage();

  const levelOptions: { value: LevelFilter; label: string }[] = [
    { value: "all", label: t("vocab_filter_all_levels") },
    { value: "N5", label: "N5" },
    { value: "N4", label: "N4" },
    { value: "N3", label: "N3" },
    { value: "N2", label: "N2" },
    { value: "N1", label: "N1" },
  ];

  const typeOptions: { value: TypeFilter; label: string }[] = [
    { value: "all", label: t("vocab_filter_all_types") },
    { value: "kanji", label: t("vocab_type_kanji") },
    { value: "hiragana", label: t("vocab_type_hiragana") },
    { value: "katakana", label: t("vocab_type_katakana") },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-2xs sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap sm:w-28">
          {t("vocab_filter_level")}
        </span>
        <div className="overflow-x-auto pb-1 scrollbar-none sm:pb-0">
          <OptionGroup options={levelOptions} value={level} onChange={onLevelChange} size="sm" className="flex-nowrap" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap sm:w-28">
          {t("vocab_filter_type")}
        </span>
        <div className="overflow-x-auto pb-1 scrollbar-none sm:pb-0">
          <OptionGroup options={typeOptions} value={type} onChange={onTypeChange} size="sm" className="flex-nowrap" />
        </div>
      </div>
    </div>
  );
}
