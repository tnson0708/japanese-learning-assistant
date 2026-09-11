"use client";

import { useMemo } from "react";
import { Volume2 } from "lucide-react";
import {
  GROUP_ORDER,
  getGroupSection,
  getKanaByScript,
  sortByGroup,
  type Kana,
  type Script,
  type KanaSection,
} from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { KatakanaConfusingPairs } from "@/components/kana/katakana-confusing-pairs";

export const ROW_DESCRIPTIONS: Record<string, string> = {
  vowel: "HÀNG 1: Nguyên âm",
  k: "HÀNG K: Ka-gyō",
  s: "HÀNG S: Sa-gyō",
  t: "HÀNG T: Ta-gyō",
  n: "HÀNG N: Na-gyō",
  h: "HÀNG H: Ha-gyō",
  m: "HÀNG M: Ma-gyō",
  y: "HÀNG Y: Ya-gyō",
  r: "HÀNG R: Ra-gyō",
  w: "HÀNG W/N: Wa & N",
  "k-dakuten": "HÀNG G: Ga (が)",
  "s-dakuten": "HÀNG Z: Za (ざ)",
  "t-dakuten": "HÀNG D: Da (だ)",
  "h-dakuten": "HÀNG B: Ba (ば)",
  "h-handakuten": "HÀNG P: Bán đục (ぱ)",
  "k-youon": "HÀNG KY (き + ゃ・ゅ・ょ)",
  "s-youon": "HÀNG SH (し + ゃ・ゅ・ょ)",
  "t-youon": "HÀNG CH (ち + ゃ・ゅ・ょ)",
  "n-youon": "HÀNG NY (に + ゃ・ゅ・ょ)",
  "h-youon": "HÀNG HY (ひ + ゃ・ゅ・ょ)",
  "m-youon": "HÀNG MY (み + ゃ・ゅ・ょ)",
  "r-youon": "HÀNG RY (り + ゃ・ゅ・ょ)",
  "k-dakuten-youon": "HÀNG GY (ぎ + ゃ・ゅ・ょ)",
  "s-dakuten-youon": "HÀNG J (じ + ゃ・ゅ・ょ)",
  "h-dakuten-youon": "HÀNG BY (び + ゃ・ゅ・ょ)",
  "h-handakuten-youon": "HÀNG PY (ぴ + ゃ・ゅ・ょ)",
};

function getConfusingConfig(script: Script, char: string) {
  if (script !== "katakana") return null;

  switch (char) {
    case "シ":
      return {
        badge: "3 NÉT • DƯỚI LÊN",
        borderClass: "border-red-400/90 bg-red-50/50 dark:bg-red-950/30 dark:border-red-900/60",
        textClass: "text-red-600 dark:text-red-400",
        vsText: "vs ツ",
      };
    case "ツ":
      return {
        badge: "3 NÉT • TRÊN XUỐNG",
        borderClass: "border-emerald-400/90 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900/60",
        textClass: "text-emerald-600 dark:text-emerald-400",
        vsText: "vs シ",
      };
    case "ソ":
      return {
        badge: "2 NÉT • TRÊN XUỐNG",
        borderClass: "border-red-400/90 bg-red-50/50 dark:bg-red-950/30 dark:border-red-900/60",
        textClass: "text-red-600 dark:text-red-400",
        vsText: "vs ン",
      };
    case "ン":
      return {
        badge: "2 NÉT • DƯỚI LÊN",
        borderClass: "border-amber-400/90 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-900/60",
        textClass: "text-amber-600 dark:text-amber-400",
        vsText: "vs ソ",
      };
    default:
      return null;
  }
}

export function KanaTableGrid({
  script,
  section,
  searchQuery,
  showRomaji = true,
  selectedKana,
  onSelectKana,
}: {
  script: Script;
  section: KanaSection;
  searchQuery: string;
  showRomaji?: boolean;
  selectedKana: Kana;
  onSelectKana: (k: Kana) => void;
}) {
  const allKana = useMemo(() => sortByGroup(getKanaByScript(script)), [script]);

  const groupedMap = useMemo(() => {
    const map = new Map<string, Kana[]>();
    for (const k of allKana) {
      const arr = map.get(k.group) ?? [];
      arr.push(k);
      map.set(k.group, arr);
    }
    return map;
  }, [allKana]);

  const query = searchQuery.trim().toLowerCase();

  // Search Results View
  if (query) {
    const searchResults = allKana.filter(
      (k) => k.romaji.toLowerCase().includes(query) || k.char.includes(query)
    );

    if (searchResults.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          Không tìm thấy ký tự Kana phù hợp với từ khóa &quot;{searchQuery}&quot;.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {script === "katakana" && <KatakanaConfusingPairs />}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {searchResults.map((k) => (
            <KanaCardItem
              key={k.id}
              kana={k}
              showRomaji={showRomaji}
              isSelected={selectedKana.id === k.id}
              onSelect={() => onSelectKana(k)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Section Grouping Definitions
  const mainGroups = GROUP_ORDER.filter((g) => groupedMap.has(g) && getGroupSection(g) === "main");
  const dakutenGroups = GROUP_ORDER.filter((g) => groupedMap.has(g) && getGroupSection(g) === "dakuten");
  const youonGroups = GROUP_ORDER.filter((g) => groupedMap.has(g) && getGroupSection(g) === "youon");

  return (
    <div className="flex flex-col gap-8">
      {/* Katakana Confusing Pairs Notice Banner */}
      {script === "katakana" && <KatakanaConfusingPairs />}

      {/* 1. Âm chính (Ngũ Thập Âm / Gojūon) */}
      {(section === "all" || section === "main") && mainGroups.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-red-600 text-xs font-extrabold text-white shadow-2xs">
                1
              </span>
              <div className="flex flex-col">
                <h2 className="text-base font-extrabold text-foreground">
                  {script === "katakana" ? "Katakana Ngũ Thập Âm (五十音 - Gojūon)" : "Âm chính (Ngũ Thập Âm)"}
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  46 ký tự nền tảng sắp xếp theo 10 hàng âm vị chuẩn (a, i, u, e, o)
                </span>
              </div>
            </div>
            <span className="rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              46 KÝ TỰ
            </span>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-3">
            {mainGroups.map((groupKey) => (
              <KanaRowItem
                key={groupKey}
                groupKey={groupKey}
                items={groupedMap.get(groupKey)!}
                showRomaji={showRomaji}
                selectedKana={selectedKana}
                onSelectKana={onSelectKana}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Âm đục & Bán đục */}
      {(section === "all" || section === "dakuten") && dakutenGroups.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-amber-600 text-xs font-extrabold text-white shadow-2xs">
                2
              </span>
              <div className="flex flex-col">
                <h2 className="text-base font-extrabold text-foreground">
                  Âm đục & Bán đục
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  Dakuten (テンテン ゛) & Handakuten (マル ゜) • 25 ký tự chuyển âm
                </span>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              25 KÝ TỰ
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {dakutenGroups.map((groupKey) => (
              <KanaRowItem
                key={groupKey}
                groupKey={groupKey}
                items={groupedMap.get(groupKey)!}
                showRomaji={showRomaji}
                selectedKana={selectedKana}
                onSelectKana={onSelectKana}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Ảo âm / Âm ghép (Yōon) */}
      {(section === "all" || section === "youon") && youonGroups.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-xs font-extrabold text-white shadow-2xs">
                3
              </span>
              <div className="flex flex-col">
                <h2 className="text-base font-extrabold text-foreground">
                  Ảo âm / Âm ghép (Yōon)
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  Các phụ âm cột i kết hợp cùng ya (ゃ), yu (ゅ), yo (ょ) nhỏ • 33 cụm âm
                </span>
              </div>
            </div>
            <span className="rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              33 CỤM ÂM
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {youonGroups.map((groupKey) => (
              <KanaRowItem
                key={groupKey}
                groupKey={groupKey}
                items={groupedMap.get(groupKey)!}
                showRomaji={showRomaji}
                selectedKana={selectedKana}
                onSelectKana={onSelectKana}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KanaRowItem({
  groupKey,
  items,
  showRomaji,
  selectedKana,
  onSelectKana,
}: {
  groupKey: string;
  items: Kana[];
  showRomaji: boolean;
  selectedKana: Kana;
  onSelectKana: (k: Kana) => void;
}) {
  const rowLabel = ROW_DESCRIPTIONS[groupKey] || groupKey;
  const is3Cols = items.length === 3;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {rowLabel}
      </span>
      <div className={cn("grid gap-2", is3Cols ? "grid-cols-3" : "grid-cols-5")}>
        {items.map((k) => (
          <KanaCardItem
            key={k.id}
            kana={k}
            showRomaji={showRomaji}
            isSelected={selectedKana.id === k.id}
            onSelect={() => onSelectKana(k)}
          />
        ))}
      </div>
    </div>
  );
}

function KanaCardItem({
  kana,
  showRomaji,
  isSelected,
  onSelect,
}: {
  kana: Kana;
  showRomaji: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const confusing = getConfusingConfig(kana.script, kana.char);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakJapanese(kana.char);
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-xl border p-2.5 shadow-2xs transition-all duration-150 cursor-pointer min-h-[76px] select-none",
        confusing ? confusing.borderClass : "",
        isSelected
          ? "border-red-600 bg-red-50/60 dark:bg-red-950/40 ring-1 ring-red-600 shadow-xs"
          : confusing
          ? "hover:shadow-xs"
          : "bg-card border-border/70 hover:border-red-500/40 hover:bg-accent/40"
      )}
    >
      {/* Top right stroke count / direction badge */}
      {confusing ? (
        <span className="absolute right-2 top-1.5 text-[8px] font-extrabold uppercase tracking-tight text-red-600 dark:text-red-400">
          {confusing.badge}
        </span>
      ) : (
        kana.strokeCount > 0 && (
          <span className="absolute right-2 top-1.5 text-[9px] font-semibold text-muted-foreground/70">
            {kana.strokeCount} nét
          </span>
        )
      )}

      {/* Main Kana Character */}
      <span
        className={cn(
          "text-2xl font-extrabold tracking-tight transition-colors mt-1 font-kanji-mincho",
          confusing ? confusing.textClass : "",
          isSelected
            ? "text-red-600 dark:text-red-400"
            : !confusing && "text-foreground group-hover:text-red-600"
        )}
      >
        {kana.char}
      </span>

      {/* Bottom Row: Romaji + vsText + Audio Icon */}
      <div className="flex items-center justify-between w-full mt-1 px-1">
        {showRomaji ? (
          <span
            className={cn(
              "text-[11px] font-bold",
              confusing ? confusing.textClass : "text-muted-foreground/80"
            )}
          >
            {kana.romaji}
          </span>
        ) : (
          <span />
        )}

        {confusing?.vsText && (
          <span className="text-[9px] font-bold text-muted-foreground/70">
            {confusing.vsText}
          </span>
        )}

        <button
          type="button"
          onClick={handleAudio}
          className="rounded-full p-0.5 text-muted-foreground/50 hover:text-red-600 transition-colors"
          title={`Nghe: ${kana.char}`}
        >
          <Volume2 className="size-3" />
        </button>
      </div>
    </div>
  );
}
