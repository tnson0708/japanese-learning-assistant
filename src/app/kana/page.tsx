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

function KanjiSection() {
  return <KanjiRadicalGuide />;
}

function KanaPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as LearnTab | null;

  const initialTab: LearnTab =
    tabParam === "katakana" || tabParam === "hiragana" || tabParam === "pronunciation" || tabParam === "kanji"
      ? tabParam
      : "hiragana";

  const [activeTab, setActiveTab] = useState<LearnTab>(initialTab);
  const [section, setSection] = useState<KanaSection>("all");
  const [search, setSearch] = useState("");
  const [showRomaji, setShowRomaji] = useState(true);

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

  const sectionOptions: { value: KanaSection; label: string }[] = [
    { value: "all", label: "Tất cả (All)" },
    { value: "main", label: "Âm chính Ngũ Thập Âm (五十音 • 46)" },
    { value: "dakuten", label: "Âm đục & Bán đục (濁音・半濁音 • 25)" },
    { value: "youon", label: "Ảo âm / Âm ghép (拗音 • 33)" },
  ];

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
          {/* Main Learn Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-muted/60 p-1.5 border border-border/40 w-full lg:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("hiragana")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
                activeTab === "hiragana"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <span className={cn("size-2 rounded-full shrink-0", activeTab === "hiragana" ? "bg-white" : "bg-red-600")} />
              <span>Hiragana (ひらがな)</span>
              <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", activeTab === "hiragana" ? "bg-white/20 text-white" : "bg-muted/80 text-muted-foreground")}>
                104
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("katakana")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
                activeTab === "katakana"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <span>Katakana (カタカナ)</span>
              <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", activeTab === "katakana" ? "bg-white/20 text-white" : "bg-muted/80 text-muted-foreground")}>
                104
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pronunciation")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
                activeTab === "pronunciation"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <span>Phát âm & Âm điệu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kanji")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none",
                activeTab === "kanji"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <span>Kanji & Bộ thủ (漢字)</span>
            </button>
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
            {/* Section Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {sectionOptions.map((opt) => {
                const isActive = section === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSection(opt.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none",
                      isActive
                        ? "bg-red-600 text-white shadow-2xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Helper Indicators */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                Audio: Chuẩn giọng nữ Tokyo (NHK Standard)
              </span>

              <button
                type="button"
                onClick={() => setShowRomaji(!showRomaji)}
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-bold text-foreground hover:bg-accent cursor-pointer transition-colors"
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
        <KanjiSection />
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
