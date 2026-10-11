"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Search,
  Volume2,
  X,
  Printer,
  PencilLine,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getKanaByScript,
  getKanaById,
  getKanaSection,
  sortByGroup,
  type Kana,
  type Script,
  type KanaSection,
} from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

import { KanaTableGrid } from "@/components/kana/kana-table-grid";
import { KanaInspectorCard } from "@/components/kana/kana-inspector-card";
import { PronunciationGuide } from "@/components/kana/pronunciation-guide";
import { KanjiRadicalGuide } from "@/components/kana/kanji-radical-guide";

type LearnTab = Script | "pronunciation" | "kanji";
type KanjiSubTab = "kanji-100" | "kanji-extra" | "radicals";

function KanjiSection({ initialMainTab, initialSearch }: { initialMainTab?: KanjiSubTab; initialSearch?: string }) {
  return <KanjiRadicalGuide initialMainTab={initialMainTab} initialSearch={initialSearch} />;
}

function KanaPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as LearnTab | null;
  const subtabParam = searchParams.get("subtab") as KanjiSubTab | null;
  const qParam = searchParams.get("q");

  const initialTab: LearnTab =
    tabParam === "katakana" || tabParam === "hiragana" || tabParam === "pronunciation" || tabParam === "kanji"
      ? tabParam
      : "hiragana";

  const initialKanjiSubTab: KanjiSubTab | undefined =
    subtabParam === "kanji-100" || subtabParam === "kanji-extra" || subtabParam === "radicals"
      ? subtabParam
      : undefined;

  const [activeTab, setActiveTab] = useState<LearnTab>(initialTab);
  const [section, setSection] = useState<KanaSection>("all");
  const [search, setSearch] = useState("");
  const [showRomaji, setShowRomaji] = useState(true);

  // Re-sync the active tab when the `tab` URL param changes on an already-mounted
  // page (e.g. clicking a spotlight search result while already on /kana) — the
  // useState initializer above only runs once on mount, so without this a
  // client-side navigation to a new `tab` value would otherwise be ignored.
  useEffect(() => {
    if (tabParam === "katakana" || tabParam === "hiragana" || tabParam === "pronunciation" || tabParam === "kanji") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Default selected Kana for Inspector Panel
  const currentScriptKana = useMemo(
    () => sortByGroup(getKanaByScript(activeTab === "katakana" ? "katakana" : "hiragana")),
    [activeTab]
  );

  const [selectedKana, setSelectedKana] = useState<Kana>(
    () => currentScriptKana[0] || getKanaById("hiragana-a")!
  );

  // Sync selectedKana when script tab changes
  useEffect(() => {
    if (activeTab === "hiragana" || activeTab === "katakana") {
      const firstKana = currentScriptKana[0];
      if (firstKana) setSelectedKana(firstKana);
    }
  }, [activeTab, currentScriptKana]);

  const isKanaTab = activeTab === "hiragana" || activeTab === "katakana";

  const sectionOptions: { value: KanaSection; label: string; sub: string; title: string }[] = [
    { value: "all", label: "Tất cả", sub: "全部", title: "Tất cả (All)" },
    { value: "main", label: "Âm chính", sub: "五十音", title: "Âm chính Ngũ Thập Âm (五十音)" },
    { value: "dakuten", label: "Âm đục", sub: "濁音・半濁音", title: "Âm đục & Bán đục (濁音・半濁音)" },
    { value: "youon", label: "Âm ghép", sub: "拗音", title: "Ảo âm / Âm ghép (拗音)" },
  ];
  const sectionCount = (value: KanaSection) =>
    value === "all"
      ? currentScriptKana.length
      : currentScriptKana.filter((k) => getKanaSection(k.group) === value).length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 print:p-0 print:gap-4">
      {/* 1. Hero Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between print:hidden">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
            TÀI LIỆU CHUẨN HÓA • Bản cập nhật MinKana Master 2025
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Bảng chữ cái & Tra cứu Kana
          </h1>
          <p className="text-xs font-semibold text-muted-foreground/80 tracking-wide">
            Kana Practice & Reference
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
            Hệ thống tra cứu bảng chữ cái Hiragana & Katakana toàn diện với thứ tự nét viết động, âm thanh mẫu chuẩn Tokyo và bộ thủ Kanji tương ứng.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 font-bold text-xs rounded-xl border-border/80 hover:bg-accent cursor-pointer"
          >
            <Printer className="size-4 text-red-600" />
            <span>In bảng A4 PDF</span>
          </Button>

          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 shadow-2xs transition-colors"
          >
            <PencilLine className="size-4" />
            <span>Luyện viết giấy →</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Navigation Tabs & Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs print:hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Main Learn Tab Selector — 2×2 grid on phones, 4 equal columns on tablet, inline row on desktop */}
          <div className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1 border border-border/40 md:grid-cols-4 lg:flex lg:w-auto lg:items-center">
            {(
              [
                { id: "hiragana", glyph: "あ", label: "Hiragana", sub: "104 chữ" },
                { id: "katakana", glyph: "ア", label: "Katakana", sub: "104 chữ" },
                { id: "pronunciation", glyph: "音", label: "Phát âm", sub: "Âm điệu" },
                { id: "kanji", glyph: "漢", label: "Kanji", sub: "& Bộ thủ" },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-2 text-left sm:gap-2.5 sm:px-3 transition-all cursor-pointer select-none",
                    active
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center sm:size-8 justify-center rounded-lg text-base font-black leading-none",
                      active ? "bg-white/20 text-white" : "bg-background text-red-600 dark:text-red-400"
                    )}
                  >
                    {tab.glyph}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-bold leading-tight">{tab.label}</span>
                    <span
                      className={cn(
                        "truncate text-[10px] font-semibold leading-tight",
                        active ? "text-white/80" : "text-muted-foreground/80"
                      )}
                    >
                      {tab.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input (Shown for Kana tabs) */}
          {isKanaTab && (
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm chữ (あ), Romaji (ka)..."
                className="w-full rounded-xl border border-border/80 bg-muted/30 py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-red-600 focus:bg-background focus:outline-hidden focus:ring-1 focus:ring-red-600 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section Filter Pills + Status Indicators */}
        {isKanaTab && (
          <div className="flex flex-col gap-3 pt-3 border-t border-border/50 lg:flex-row lg:items-center lg:justify-between">
            {/* Section Filter Pills — 2×2 grid on phones, 4 columns on tablet, inline row on desktop */}
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 lg:flex lg:items-center">
              {sectionOptions.map((opt) => {
                const isActive = section === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSection(opt.value)}
                    aria-pressed={isActive}
                    title={opt.title}
                    className={cn(
                      "flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-1.5 text-left transition-all cursor-pointer select-none",
                      isActive
                        ? "border-red-600 bg-red-600 text-white shadow-2xs"
                        : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-bold leading-tight">{opt.label}</span>
                      <span className={cn("truncate text-[10px] leading-tight", isActive ? "text-white/80" : "text-muted-foreground/80")}>
                        {opt.sub}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums",
                        isActive ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
                      )}
                    >
                      {sectionCount(opt.value)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Helper Indicators */}
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground lg:shrink-0 lg:justify-end">
              <span className="inline-flex min-w-0 items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span className="truncate">Audio chuẩn giọng Tokyo (NHK)</span>
              </span>

              <button
                type="button"
                onClick={() => setShowRomaji(!showRomaji)}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                {showRomaji ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                <span>{showRomaji ? "Ẩn Romaji" : "Hiện Romaji"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Content Layout */}
      {isKanaTab ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 print:block">
          {/* Left Column: Kana Table Grid */}
          <div className="flex flex-col gap-6">
            <KanaTableGrid
              script={activeTab === "katakana" ? "katakana" : "hiragana"}
              section={section}
              searchQuery={search}
              showRomaji={showRomaji}
              selectedKana={selectedKana}
              onSelectKana={setSelectedKana}
            />
          </div>

          {/* Right Column: Sticky Inspector Panel */}
          <div className="print:hidden">
            <KanaInspectorCard kana={selectedKana} />
          </div>
        </div>
      ) : activeTab === "pronunciation" ? (
        <PronunciationGuide />
      ) : (
        <KanjiSection initialMainTab={initialKanjiSubTab} initialSearch={qParam ?? undefined} />
      )}
    </div>
  );
}

export default function KanaPage() {
  return (
    <Suspense fallback={null}>
      <KanaPageContent />
    </Suspense>
  );
}
