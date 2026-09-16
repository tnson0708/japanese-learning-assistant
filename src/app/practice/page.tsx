"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Volume2,
  Clock,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Eye,
  CheckCircle2,
  Sparkles,
  Zap,
  BookOpen,
  Layers,
  Award,
  Maximize2,
  Shuffle,
  RefreshCw,
} from "lucide-react";
import { filterKana } from "@/lib/kana";
import { KANJI_RADICALS, type KanjiRadical } from "@/lib/kanji-radicals";
import { BASIC_KANJI_WORDS, type BasicKanjiWord } from "@/lib/basic-kanji";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export interface PracticeCardItem {
  id: string;
  type: "hiragana" | "katakana" | "radical" | "kanji";
  typeLabel: string;
  char: string;
  mainReading: string;
  subReading?: string;
  meaningVi: string;
  strokes?: number;
  example?: string;
}

export default function PracticePage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  // Category Selection Toggles
  const [includeHiragana, setIncludeHiragana] = useState(true);
  const [includeKatakana, setIncludeKatakana] = useState(true);
  const [includeRadicals, setIncludeRadicals] = useState(true);
  const [includeKanji, setIncludeKanji] = useState(true);

  // Timing Settings
  const [promptSeconds, setPromptSeconds] = useState<number>(5);
  const [revealSeconds, setRevealSeconds] = useState<number>(2);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [shuffleMode, setShuffleMode] = useState(true);

  // Active Flashcard Drill Engine State
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "reveal">("prompt");
  const [promptRemainingMs, setPromptRemainingMs] = useState(5000);
  const [revealRemainingMs, setRevealRemainingMs] = useState(2000);
  const [completedCount, setCompletedCount] = useState(0);

  // Build Unified Dataset Pool from selected categories
  const pool = useMemo<PracticeCardItem[]>(() => {
    const items: PracticeCardItem[] = [];

    // 1. Hiragana
    if (includeHiragana) {
      const hiraList = filterKana("hiragana", "all");
      hiraList.forEach((k) => {
        items.push({
          id: `hira-${k.id}`,
          type: "hiragana",
          typeLabel: "HIRAGANA",
          char: k.char,
          mainReading: k.romaji,
          meaningVi: `Chữ cái Hiragana phiên âm /${k.romaji}/`,
          strokes: k.strokes ? k.strokes.length : undefined,
        });
      });
    }

    // 2. Katakana
    if (includeKatakana) {
      const kataList = filterKana("katakana", "all");
      kataList.forEach((k) => {
        items.push({
          id: `kata-${k.id}`,
          type: "katakana",
          typeLabel: "KATAKANA",
          char: k.char,
          mainReading: k.romaji,
          meaningVi: `Chữ cái Katakana phiên âm /${k.romaji}/`,
          strokes: k.strokes ? k.strokes.length : undefined,
        });
      });
    }

    // 3. Bộ Thủ (Radicals)
    if (includeRadicals) {
      KANJI_RADICALS.forEach((rad) => {
        items.push({
          id: `rad-${rad.id}`,
          type: "radical",
          typeLabel: "BỘ THỦ",
          char: rad.char,
          mainReading: rad.hanViet,
          meaningVi: rad.meaningVi,
          strokes: rad.strokes,
          example: rad.exampleKanji.length > 0
            ? rad.exampleKanji.map((e) => `${e.char} (${e.hanViet})`).slice(0, 3).join(", ")
            : undefined,
        });
      });
    }

    // 4. Hán Tự (100 Kanji)
    if (includeKanji) {
      BASIC_KANJI_WORDS.forEach((kanji) => {
        items.push({
          id: `kanji-${kanji.id}`,
          type: "kanji",
          typeLabel: "HÁN TỰ 100",
          char: kanji.char,
          mainReading: kanji.hanViet,
          subReading: kanji.hiragana,
          meaningVi: kanji.meaningVi,
          strokes: kanji.strokes,
          example: kanji.exampleWords.length > 0
            ? kanji.exampleWords.map((e) => `${e.word} (${e.reading}): ${e.meaning}`).slice(0, 2).join(" • ")
            : undefined,
        });
      });
    }

    // Fallback if user unchecks all 4 options
    if (items.length === 0) {
      const fallbackHira = filterKana("hiragana", "all");
      fallbackHira.forEach((k) => {
        items.push({
          id: `hira-${k.id}`,
          type: "hiragana",
          typeLabel: "HIRAGANA",
          char: k.char,
          mainReading: k.romaji,
          meaningVi: `Chữ cái Hiragana phiên âm /${k.romaji}/`,
          strokes: k.strokes ? k.strokes.length : undefined,
        });
      });
    }

    return items;
  }, [includeHiragana, includeKatakana, includeRadicals, includeKanji]);

  // Client Mounting Check (Prevents SSR Hydration Mismatch from Math.random)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shuffled or Sequential Order Map (Deterministic during SSR to prevent Hydration Mismatch)
  const activeOrder = useMemo(() => {
    const indices = Array.from({ length: pool.length }, (_, i) => i);
    if (!mounted || !shuffleMode) return indices;

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [pool.length, shuffleMode, mounted]);

  const poolCount = pool.length;
  const safeOrderIndex = poolCount > 0 ? ((currentIndex % poolCount) + poolCount) % poolCount : 0;
  const targetPoolIndex = activeOrder[safeOrderIndex] ?? 0;
  const currentItem = pool[targetPoolIndex] || pool[0];

  // Action Handlers
  const handleStart = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
    setStarted(true);
    setPaused(false);
    setPhase("prompt");
    setCurrentIndex(0);
    setCompletedCount(0);
    setPromptRemainingMs(promptSeconds > 0 ? promptSeconds * 1000 : 0);
    setRevealRemainingMs(revealSeconds * 1000);
  };

  const handleNext = () => {
    setPhase("prompt");
    setCurrentIndex((prev) => (prev + 1) % (poolCount || 1));
    setCompletedCount((c) => c + 1);
    setPromptRemainingMs(promptSeconds > 0 ? promptSeconds * 1000 : 0);
    setRevealRemainingMs(revealSeconds * 1000);
  };

  const handlePrev = () => {
    setPhase("prompt");
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : (poolCount || 1) - 1));
    setPromptRemainingMs(promptSeconds > 0 ? promptSeconds * 1000 : 0);
    setRevealRemainingMs(revealSeconds * 1000);
  };

  const toggleReveal = () => {
    setPhase((prev) => {
      const nextPhase = prev === "prompt" ? "reveal" : "prompt";
      if (nextPhase === "reveal" && autoPlayAudio && currentItem) {
        speakJapanese(currentItem.char);
      }
      return nextPhase;
    });
    setRevealRemainingMs(revealSeconds * 1000);
  };

  // Timer Effect (100ms interval ticks)
  useEffect(() => {
    if (!started || paused) return;

    const stepMs = 100;

    const timer = setInterval(() => {
      if (phase === "prompt") {
        if (promptSeconds <= 0) return; // Manual mode

        setPromptRemainingMs((prev) => {
          if (prev <= stepMs) {
            // Prompt time expired -> Switch to Reveal phase
            setPhase("reveal");
            if (autoPlayAudio && currentItem) {
              speakJapanese(currentItem.char);
            }
            return promptSeconds * 1000;
          }
          return prev - stepMs;
        });
      } else if (phase === "reveal") {
        if (revealSeconds <= 0) return;

        setRevealRemainingMs((prev) => {
          if (prev <= stepMs) {
            // Reveal time expired -> Auto-advance to next card
            setCurrentIndex((idx) => (idx + 1) % (poolCount || 1));
            setCompletedCount((c) => c + 1);
            setPhase("prompt");
            setPromptRemainingMs(promptSeconds > 0 ? promptSeconds * 1000 : 0);
            return revealSeconds * 1000;
          }
          return prev - stepMs;
        });
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [started, paused, phase, promptSeconds, revealSeconds, autoPlayAudio, currentItem, poolCount]);

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        toggleReveal();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!started) {
          handleStart();
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!started) {
          handleStart();
        } else {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, promptSeconds, revealSeconds, autoPlayAudio, currentItem, poolCount]);

  // Progress Percentages for Visual Progress Bars
  const promptProgressPercent = promptSeconds > 0 ? (promptRemainingMs / (promptSeconds * 1000)) * 100 : 100;
  const revealProgressPercent = revealSeconds > 0 ? (revealRemainingMs / (revealSeconds * 1000)) * 100 : 100;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* 1. Header Title & Description */}
      <div className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <Zap className="size-3.5" />
              Luyện Phản Xạ Ký Tự
            </span>
            <span className="text-xs text-muted-foreground">• Mặc định 5s hiển thị / 2s đáp án</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            Luyện Nhớ Mặt Chữ, Bộ Thủ & Hán Tự
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Hệ thống hiển thị ngẫu nhiên ký tự Kana, Bộ thủ hoặc chữ Hán cơ bản. Bạn có 5 giây phản xạ xem mình đã nhớ tên gọi/phiên âm chưa, sau đó kết quả sẽ tự động lật mở trong 2 giây.
          </p>
        </div>

        {/* Header Quick Counter Stats */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2.5 rounded-2xl border bg-card px-4 py-2.5 shadow-2xs">
            <span className="text-lg">🎴</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">KHO THẺ CHỌN</span>
              <span className="text-sm font-black text-red-600 dark:text-red-400">{poolCount} Thẻ</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border bg-card px-4 py-2.5 shadow-2xs">
            <span className="text-lg">⚡</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ĐÃ PHẢN XẠ</span>
              <span className="text-sm font-black text-foreground">{completedCount} Lượt</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Practice Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: Data Selection & Timing Controls (5 Columns) */}
        <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs lg:col-span-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground">Cấu hình bài luyện tập</h2>
              <p className="text-xs text-muted-foreground">Chọn danh mục và tốc độ đếm ngược tự động</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIncludeHiragana(true);
                setIncludeKatakana(true);
                setIncludeRadicals(true);
                setIncludeKanji(true);
                setPromptSeconds(5);
                setRevealSeconds(2);
                setStarted(false);
              }}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
              title="Khôi phục mặc định"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>

          {/* SECTION 1: Chọn Nguồn Dữ Liệu Luyện Tập */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-red-600" />
                1. Chọn bộ ký tự / Hán tự
              </span>
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                Tổng {poolCount} thẻ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Hiragana */}
              <label
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all select-none",
                  includeHiragana
                    ? "border-red-600/50 bg-red-500/5 ring-1 ring-red-600/30 text-foreground"
                    : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeHiragana}
                    onChange={(e) => {
                      setIncludeHiragana(e.target.checked);
                      setStarted(false);
                    }}
                    className="size-4 rounded accent-red-600 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Hiragana</span>
                    <span className="text-[10px] text-muted-foreground">46 Chữ cái</span>
                  </div>
                </div>
                <span className="text-sm font-bold font-kanji-mincho text-red-600">あ</span>
              </label>

              {/* Option 2: Katakana */}
              <label
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all select-none",
                  includeKatakana
                    ? "border-red-600/50 bg-red-500/5 ring-1 ring-red-600/30 text-foreground"
                    : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeKatakana}
                    onChange={(e) => {
                      setIncludeKatakana(e.target.checked);
                      setStarted(false);
                    }}
                    className="size-4 rounded accent-red-600 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Katakana</span>
                    <span className="text-[10px] text-muted-foreground">46 Chữ cái</span>
                  </div>
                </div>
                <span className="text-sm font-bold font-kanji-mincho text-red-600">ア</span>
              </label>

              {/* Option 3: Bộ Thủ (Radicals) */}
              <label
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all select-none",
                  includeRadicals
                    ? "border-red-600/50 bg-red-500/5 ring-1 ring-red-600/30 text-foreground"
                    : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeRadicals}
                    onChange={(e) => {
                      setIncludeRadicals(e.target.checked);
                      setStarted(false);
                    }}
                    className="size-4 rounded accent-red-600 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Bộ Thủ</span>
                    <span className="text-[10px] text-muted-foreground">88 Bộ thủ</span>
                  </div>
                </div>
                <span className="text-sm font-bold font-kanji-mincho text-red-600">氵</span>
              </label>

              {/* Option 4: Hán Tự (100 Kanji) */}
              <label
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all select-none",
                  includeKanji
                    ? "border-red-600/50 bg-red-500/5 ring-1 ring-red-600/30 text-foreground"
                    : "bg-muted/30 border-border/70 text-muted-foreground hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeKanji}
                    onChange={(e) => {
                      setIncludeKanji(e.target.checked);
                      setStarted(false);
                    }}
                    className="size-4 rounded accent-red-600 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Hán Tự</span>
                    <span className="text-[10px] text-muted-foreground">100 Từ Kanji</span>
                  </div>
                </div>
                <span className="text-sm font-bold font-kanji-mincho text-red-600">日</span>
              </label>
            </div>
          </div>

          {/* SECTION 2: Thời gian hiển thị ký tự (Prompt Duration) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" />
                2. Thời gian xem ký tự
              </span>
              <span className="text-[11px] font-extrabold text-red-600">
                {promptSeconds > 0 ? `${promptSeconds}s (Mặc định 5s)` : "Thủ công (Tay)"}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { label: "⚡ 3s", val: 3 },
                { label: "🎯 5s", val: 5 },
                { label: "⏳ 8s", val: 8 },
                { label: "🐢 10s", val: 10 },
                { label: "🖐️ Tay", val: 0 },
              ].map((sp) => (
                <button
                  key={sp.val}
                  type="button"
                  onClick={() => {
                    setPromptSeconds(sp.val);
                    setPromptRemainingMs(sp.val * 1000);
                  }}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-xs font-bold transition-all cursor-pointer text-center",
                    promptSeconds === sp.val
                      ? "border-red-600 bg-red-600 text-white shadow-2xs"
                      : "bg-background border-border/80 text-foreground hover:bg-accent"
                  )}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: Thời gian hiển thị kết quả (Result Duration) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="size-3.5" />
                3. Thời gian xem kết quả
              </span>
              <span className="text-[11px] font-extrabold text-red-600">
                {revealSeconds > 0 ? `${revealSeconds}s (Mặc định 2s)` : "Dừng mở"}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "⚡ 1.5s", val: 1.5 },
                { label: "🎯 2s", val: 2 },
                { label: "⏳ 3s", val: 3 },
                { label: "🐢 5s", val: 5 },
              ].map((rv) => (
                <button
                  key={rv.val}
                  type="button"
                  onClick={() => {
                    setRevealSeconds(rv.val);
                    setRevealRemainingMs(rv.val * 1000);
                  }}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-xs font-bold transition-all cursor-pointer text-center",
                    revealSeconds === rv.val
                      ? "border-red-600 bg-red-600 text-white shadow-2xs"
                      : "bg-background border-border/80 text-foreground hover:bg-accent"
                  )}
                >
                  {rv.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 pt-2 border-t text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Tự động phát âm thanh khi hiển thị kết quả</span>
              <button
                type="button"
                onClick={() => setAutoPlayAudio((v) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                  autoPlayAudio ? "bg-red-600" : "bg-input"
                )}
              >
                <span className={cn("inline-block size-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out", autoPlayAudio ? "translate-x-4" : "translate-x-0")} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Xáo trộn ngẫu nhiên bộ thẻ (Shuffle)</span>
              <button
                type="button"
                onClick={() => setShuffleMode((v) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                  shuffleMode ? "bg-red-600" : "bg-input"
                )}
              >
                <span className={cn("inline-block size-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out", shuffleMode ? "translate-x-4" : "translate-x-0")} />
              </button>
            </div>
          </div>

          {/* Main Action Trigger Button */}
          <div className="flex flex-col gap-2.5 pt-3 border-t">
            <button
              type="button"
              onClick={started ? handleNext : handleStart}
              className="w-full inline-flex items-center justify-between bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm py-4 px-5 rounded-xl shadow-md cursor-pointer transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Play className="size-5 fill-white" />
                <span>{started ? "Thẻ tiếp theo" : "Bắt đầu Luyện Phản Xạ 5s"}</span>
              </span>
              <span className="rounded bg-white/20 px-2.5 py-1 text-[11px] font-mono text-white">
                Mũi tên →
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Practice Card Canvas (7 Columns) */}
        <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-7 shadow-2xs lg:col-span-7 relative overflow-hidden">
          {/* Background Watermark */}
          <span className="absolute -right-6 -top-8 text-8xl sm:text-9xl font-black text-muted-foreground/5 select-none pointer-events-none font-kanji-mincho">
            {currentItem.char}
          </span>

          {/* Top Status & Timer Info Bar */}
          <div className="flex flex-col gap-2.5 border-b pb-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "size-2.5 rounded-full",
                  started ? (paused ? "bg-amber-500" : "bg-red-600 animate-ping") : "bg-muted-foreground"
                )} />
                <span className="font-extrabold text-foreground">
                  Thẻ số {poolCount > 0 ? safeOrderIndex + 1 : 0} / {poolCount}
                </span>
                <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase">
                  {currentItem.typeLabel}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1 text-xs font-bold text-foreground hover:bg-accent cursor-pointer transition-all"
                >
                  {paused ? <Play className="size-3.5 text-amber-500 fill-amber-500" /> : <Pause className="size-3.5 text-muted-foreground" />}
                  <span>{paused ? "Tiếp tục" : "Tạm dừng"}</span>
                </button>
              </div>
            </div>

            {/* Countdown Progress Timer Bars */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className={cn("size-3.5", started && !paused ? "text-red-600 animate-spin" : "text-muted-foreground")} />
                  {phase === "prompt"
                    ? `Đang xem ký tự: ${(promptRemainingMs / 1000).toFixed(1)}s / ${promptSeconds}s`
                    : `Đang mở kết quả: ${(revealRemainingMs / 1000).toFixed(1)}s / ${revealSeconds}s`}
                </span>
                <span className={cn("font-bold uppercase tracking-wider", phase === "reveal" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600")}>
                  {phase === "prompt" ? "Giai đoạn Gợi ý (5s)" : "ĐÃ HIỂN THỊ KẾT QUẢ (2s)"}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
                <div
                  className={cn(
                    "h-full transition-all duration-100 ease-linear rounded-full",
                    phase === "prompt" ? "bg-red-600" : "bg-emerald-500"
                  )}
                  style={{
                    width: `${phase === "prompt" ? promptProgressPercent : revealProgressPercent}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* MAIN CARD CANVAS: Prominent Symbol Prompt Area */}
          <div className="flex flex-col items-center justify-center gap-4 py-8 border-b text-center relative bg-muted/20 rounded-2xl p-6 border border-dashed border-red-500/20">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              {currentItem.typeLabel} • NẠP PHẢN XẠ NHÌN MẶT CHỮ
            </span>

            {/* Rice Grid Box Container (米字格) - Dynamically sized for multi-char combinations like Youon */}
            <div className={cn(
              "relative flex items-center justify-center rounded-2xl border-2 border-red-500/40 bg-background shadow-md overflow-hidden shrink-0 transition-all duration-300",
              currentItem.char.length > 1 ? "w-60 sm:w-72 h-40 sm:h-48 px-4" : "size-40 sm:size-48"
            )}>
              {/* Grid Guidelines */}
              <div className="absolute inset-0 border-b border-r border-red-500/15 border-dashed pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full border-t border-red-500/25 border-dashed" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full border-l border-red-500/25 border-dashed" />
              </div>

              {/* Character Glyph */}
              <span className={cn(
                "font-black font-kanji-mincho text-foreground select-none whitespace-nowrap leading-none transition-all",
                currentItem.char.length === 1 && "text-7xl sm:text-8xl",
                currentItem.char.length === 2 && "text-5xl sm:text-6xl tracking-normal",
                currentItem.char.length >= 3 && "text-4xl sm:text-5xl tracking-normal"
              )}>
                {currentItem.char}
              </span>
            </div>

            <p className="text-xs font-semibold text-muted-foreground max-w-sm leading-relaxed">
              Nhìn mặt chữ trong <strong>5 giây</strong> và tự đọc nhẩm tên/âm đọc. Kết quả sẽ tự động hiện ra trong <strong>2 giây</strong>!
            </p>
          </div>

          {/* RESULT BOX AREA: Automatic 2s Result Verification */}
          <div
            onClick={toggleReveal}
            className={cn(
              "relative flex flex-col gap-3 rounded-2xl border p-5 transition-all cursor-pointer select-none",
              phase === "reveal"
                ? "border-emerald-500/50 bg-emerald-500/5 ring-2 ring-emerald-500/20 dark:bg-emerald-950/20"
                : "border-border bg-card hover:border-border/80"
            )}
          >
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "size-2 rounded-full",
                  phase === "reveal" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                )} />
                <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                  {phase === "reveal" ? "KẾT QUẢ PHIÊN ÂM & TÊN GỌI" : "KẾT QUẢ ĐANG ẨN (LẬT TRONG 5S)"}
                </span>
              </div>

              <span className="text-[11px] font-bold text-muted-foreground">
                {phase === "reveal" ? "Bấm Space để ẩn" : "Bấm Space để mở ngay"}
              </span>
            </div>

            {/* Revealed Result Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={cn(
                  "text-2xl sm:text-3xl font-black transition-all",
                  phase === "reveal" ? "text-red-600 dark:text-red-400 scale-100 opacity-100" : "text-foreground/15 blur-xs scale-95"
                )}>
                  {currentItem.mainReading}
                </span>

                {currentItem.subReading && (
                  <span className={cn(
                    "text-sm font-bold transition-all bg-muted/60 px-2.5 py-1 rounded-lg text-foreground",
                    phase === "reveal" ? "opacity-100" : "opacity-15 blur-xs"
                  )}>
                    Âm đọc Nhật: {currentItem.subReading}
                  </span>
                )}

                {currentItem.strokes && (
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase ml-auto">
                    {currentItem.strokes} NÉT VIẾT
                  </span>
                )}
              </div>

              {/* Meaning & Explanation */}
              <p className={cn(
                "text-xs sm:text-sm font-medium transition-all text-muted-foreground leading-relaxed",
                phase === "reveal" ? "opacity-100" : "opacity-15 blur-xs"
              )}>
                {currentItem.meaningVi}
              </p>

              {/* Example Usage */}
              {currentItem.example && (
                <div className={cn(
                  "text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl transition-all border border-emerald-500/20 mt-1",
                  phase === "reveal" ? "opacity-100" : "opacity-10 blur-xs"
                )}>
                  💡 Ví dụ: {currentItem.example}
                </div>
              )}

              {/* Speech Audio Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(currentItem.char);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  <Volume2 className="size-4" />
                  <span>Nghe phát âm /{currentItem.mainReading}/</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t text-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 font-bold text-xs py-2.5 px-4 rounded-xl border border-border/80 bg-background hover:bg-accent text-foreground cursor-pointer transition-all"
            >
              <ChevronLeft className="size-4" />
              <span>Chữ trước (←)</span>
            </button>

            <span className="text-[11px] text-muted-foreground hidden sm:inline font-mono">
              Phím tắt: Mũi tên phải → (Thẻ tiếp theo) • Space (Lật đáp án)
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <span>Thẻ tiếp theo (→)</span>
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Session Progress Footer Note */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>
                <strong className="font-bold">Đang phản xạ liên tục:</strong> Đã phản xạ thành công {completedCount} thẻ trong phiên học này.
              </span>
            </div>
            <button
              type="button"
              onClick={handleStart}
              className="font-bold underline whitespace-nowrap text-emerald-800 dark:text-emerald-200 hover:opacity-80 cursor-pointer"
            >
              Reset phiên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
