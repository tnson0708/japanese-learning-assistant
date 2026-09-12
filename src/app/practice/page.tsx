"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Volume2,
  PenTool,
  FileText,
  Sparkles,
  Headphones,
  Clock,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Check,
  HelpCircle,
  X,
  Download,
  Lightbulb,
  BarChart3,
  Maximize2,
  Eye,
  EyeOff,
  Printer,
  Zap,
  Turtle,
  Hourglass,
  Hand,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PracticeSession } from "@/components/practice/practice-session";
import {
  PaperPracticeSession,
  type PaperDirection,
  type PaperItem,
} from "@/components/practice/paper-practice-session";
import { speakJapanese } from "@/lib/speech";
import {
  ListeningPracticeSession,
  type ListeningItem,
} from "@/components/practice/listening-practice-session";
import {
  filterKana,
  randomKana,
  type KanaSection,
  type Script,
} from "@/lib/kana";
import {
  getAllWords,
  getWordsByDifficulty,
  randomWordByDifficulty,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS_BILINGUAL,
  DIFFICULTY_JLPT_MAP,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getSubCategory,
  SUB_CATEGORY_LABELS,
  type WordDifficulty,
  type WordCategory,
} from "@/lib/words";
import {
  PHRASE_LIST,
  PHRASE_THEMES,
  PHRASE_TOPICS,
  type PhraseTheme,
  type PhraseTopic,
} from "@/lib/phrases";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type Scope = Script | "both";
type ContentType = "character" | "word";

function pickNextKana(scope: Scope, section: KanaSection, excludeId: string): PaperItem {
  let candidate = randomKana(scope, section);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomKana(scope, section);
  }
  return candidate;
}

function pickNextWord(
  difficulty: WordDifficulty,
  scope: Scope,
  excludeId: string
): PaperItem {
  let candidate = randomWordByDifficulty(difficulty, scope);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomWordByDifficulty(difficulty, scope);
  }
  return {
    id: candidate.id,
    char: candidate.word,
    romaji: candidate.romaji,
    meaning: candidate.meaning,
  };
}

export default function PracticePage() {
  const { t, language } = useLanguage();
  const isVi = language === "vi";
  const [activeTab, setActiveTab] = useState<"paper" | "handwriting" | "listening">("paper");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:py-8">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {isVi ? "Luyện tập Chữ cái & Viết tiếng Nhật" : "Japanese Kana & Writing Practice"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isVi
              ? "Rèn luyện khả năng nhớ chữ, tốc độ phản xạ và độ chuẩn xác của nét bút qua các bài kiểm tra flashcard trên giấy, đố chữ trực tiếp trên màn hình cảm ứng hoặc luyện nghe viết chuẩn Tokyo."
              : "Train character memory, reaction speed, and stroke precision with paper flashcard drills, on-screen touch handwriting recognition, or native Tokyo audio listening."}
          </p>
        </div>

        {/* Top Right Stats Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 shadow-2xs">
            <span className="text-base">📕</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">KHO KÝ TỰ</span>
              <span className="text-xs font-extrabold text-foreground">104 Chữ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 shadow-2xs">
            <span className="text-base">📑</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CHẾ ĐỘ</span>
              <span className="text-xs font-extrabold text-foreground">3 Chế độ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 shadow-2xs">
            <span className="text-base">🖨️</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">IN ẤN</span>
              <span className="text-xs font-extrabold text-foreground">PDF A4</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Mode Selection Cards (3 Cards Grid) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Paper Drill */}
        <div
          onClick={() => setActiveTab("paper")}
          className={cn(
            "relative flex flex-col justify-between gap-3 rounded-2xl border p-5 shadow-2xs transition-all cursor-pointer select-none",
            activeTab === "paper"
              ? "border-red-600 bg-red-500/5 ring-2 ring-red-600/20 dark:bg-red-950/20"
              : "bg-card border-border/80 hover:border-border hover:shadow-xs"
          )}
        >
          {/* Recommended Badge */}
          <span className="absolute right-4 top-4 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
            KHUYÊN DÙNG
          </span>

          <div className="flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-red-600/10 text-red-600">
              <FileText className="size-5" />
            </div>
            <div className="flex items-baseline gap-1.5 pt-1">
              <h3 className="text-base font-bold text-foreground">Paper Drill</h3>
              <span className="text-xs font-medium text-muted-foreground">(Luyện giấy)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nhìn màn hình, viết ra giấy tập, sau đó bấm mở kết quả để tự chấm điểm phản xạ thực tế.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs font-bold text-red-600 dark:text-red-400">
            <span className="flex items-center gap-1">
              {activeTab === "paper" ? "Đang mở cấu hình ↓" : "Chuyển sang chế độ paper →"}
            </span>
            {activeTab === "paper" && <span className="size-2 rounded-full bg-red-600 animate-pulse" />}
          </div>
        </div>

        {/* Card 2: Digital Handwriting */}
        <div
          onClick={() => setActiveTab("handwriting")}
          className={cn(
            "relative flex flex-col justify-between gap-3 rounded-2xl border p-5 shadow-2xs transition-all cursor-pointer select-none",
            activeTab === "handwriting"
              ? "border-blue-600 bg-blue-500/5 ring-2 ring-blue-600/20 dark:bg-blue-950/20"
              : "bg-card border-border/80 hover:border-border hover:shadow-xs"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
              <PenTool className="size-5" />
            </div>
            <div className="flex items-baseline gap-1.5 pt-1">
              <h3 className="text-base font-bold text-foreground">Đố nét màn hình</h3>
              <span className="text-xs font-medium text-muted-foreground">(Digital)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tự tay đố và viết nét trực tiếp trên bảng Canvas mô phỏng ô ly Mễ Tự Cách (米字格) với cảm biến thứ tự nét.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>Chuyển sang chế độ vẽ →</span>
            <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              Canvas HTML5
            </span>
          </div>
        </div>

        {/* Card 3: Listening */}
        <div
          onClick={() => setActiveTab("listening")}
          className={cn(
            "relative flex flex-col justify-between gap-3 rounded-2xl border p-5 shadow-2xs transition-all cursor-pointer select-none",
            activeTab === "listening"
              ? "border-purple-600 bg-purple-500/5 ring-2 ring-purple-600/20 dark:bg-purple-950/20"
              : "bg-card border-border/80 hover:border-border hover:shadow-xs"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600">
              <Headphones className="size-5" />
            </div>
            <div className="flex items-baseline gap-1.5 pt-1">
              <h3 className="text-base font-bold text-foreground">Nghe & Viết</h3>
              <span className="text-xs font-medium text-muted-foreground">(Listening)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nghe audio phát âm bản xứ chuẩn Tokyo rồi gõ hoặc viết lại chữ cái và từ vựng tương ứng mà không cần nhìn gợi ý.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>Chuyển sang chế độ nghe →</span>
            <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              Tokyo Accent
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Practice Panels */}
      {activeTab === "paper" && <PaperPanelFullLayout />}
      {activeTab === "handwriting" && <HandwritingPanelLayout />}
      {activeTab === "listening" && <ListeningPanelLayout />}

    </div>
  );
}

{/* -------------------------------------------------------------------------------- */}
{/* Paper Panel 2-Column Full Layout (Matching Mockup 1:1) */}
{/* -------------------------------------------------------------------------------- */}

function PaperPanelFullLayout() {
  const { t, language } = useLanguage();
  const isVi = language === "vi";

  // Drill options
  const [contentType, setContentType] = useState<ContentType>("character");
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("main");
  const [direction, setDirection] = useState<PaperDirection>("write");
  const [speedSeconds, setSpeedSeconds] = useState<number>(3);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [shuffle, setShuffle] = useState(true);
  const [showStrokeHint, setShowStrokeHint] = useState(false);

  // Active Card Drill Engine State
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "reveal">("prompt");
  const [remainingMs, setRemainingMs] = useState(3000);
  const [completedCount, setCompletedCount] = useState(0);

  // Construct Pool & Current Item
  const itemPool = useMemo(() => {
    if (contentType === "character") {
      const kanas = filterKana(scope, section);
      return kanas.map((k) => ({
        id: k.id,
        char: k.char,
        romaji: k.romaji,
        strokes: k.strokes ? k.strokes.length : 3,
        word: `${k.char} (${k.romaji})`,
        meaning: `Ký tự ${k.script === "hiragana" ? "Hiragana" : "Katakana"} - âm /${k.romaji}/`,
      }));
    } else {
      const words = getAllWords();
      return words.map((w) => ({
        id: w.id,
        char: w.kanji || w.word,
        romaji: w.romaji,
        strokes: w.kanji ? `${w.kanji.length} Kanji` : "Kana",
        word: w.kanji ? `${w.kanji} (${w.word})` : w.word,
        meaning: w.meaning,
      }));
    }
  }, [contentType, scope, section]);

  const poolCount = itemPool.length;
  const safeIndex = poolCount > 0 ? ((itemIndex % poolCount) + poolCount) % poolCount : 0;
  const currentItem = itemPool[safeIndex] || {
    id: "ka",
    char: "か",
    romaji: "ka",
    strokes: 3,
    word: "かさ (kasa)",
    meaning: "Cái ô / Cái dù",
  };

  const handleStart = () => {
    setStarted(true);
    setPaused(false);
    setPhase("prompt");
    setItemIndex(0);
    setCompletedCount(0);
    setRemainingMs(speedSeconds > 0 ? speedSeconds * 1000 : 0);
  };

  const handleNext = () => {
    setPhase("prompt");
    setItemIndex((prev) => (prev + 1) % (poolCount || 1));
    setCompletedCount((c) => c + 1);
    setRemainingMs(speedSeconds > 0 ? speedSeconds * 1000 : 0);
  };

  const handlePrev = () => {
    setPhase("prompt");
    setItemIndex((prev) => (prev > 0 ? prev - 1 : (poolCount || 1) - 1));
    setRemainingMs(speedSeconds > 0 ? speedSeconds * 1000 : 0);
  };

  const toggleReveal = () => {
    setPhase((prev) => {
      const nextPhase = prev === "prompt" ? "reveal" : "prompt";
      if (nextPhase === "reveal" && autoPlayAudio && currentItem) {
        speakJapanese(currentItem.char);
      }
      return nextPhase;
    });
    if (speedSeconds > 0) {
      setRemainingMs(Math.max(1500, speedSeconds * 1000));
    }
  };

  // Timer Interval Effect (100ms ticks)
  useEffect(() => {
    if (!started || paused || speedSeconds <= 0) return;

    const stepMs = 100;
    const timer = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= stepMs) {
          if (phase === "prompt") {
            setPhase("reveal");
            return Math.max(1500, speedSeconds * 1000);
          } else {
            setItemIndex((idx) => (idx + 1) % (poolCount || 1));
            setCompletedCount((c) => c + 1);
            setPhase("prompt");
            return speedSeconds * 1000;
          }
        }
        return prev - stepMs;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [started, paused, speedSeconds, phase, poolCount]);

  // Auto-play audio on reveal phase transition
  useEffect(() => {
    if (started && phase === "reveal" && autoPlayAudio && currentItem) {
      speakJapanese(currentItem.char);
    }
  }, [started, phase, currentItem?.id, autoPlayAudio]);

  // Keyboard Shortcuts Listener
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
        } else {
          handleNext();
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
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
  }, [started, speedSeconds, poolCount, autoPlayAudio, currentItem]);

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start">
      {/* LEFT COLUMN: Setting Controls Panel (5 Columns) */}
      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs lg:col-span-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Thiết lập Paper Drill</h2>
            <p className="text-xs text-muted-foreground">Tùy biến bộ thẻ theo mục tiêu buổi luyện tập hôm nay</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setContentType("character");
              setScope("hiragana");
              setSection("main");
              setDirection("write");
              setSpeedSeconds(3);
              setStarted(false);
            }}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* 1. Nội dung luyện tập */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Nội dung luyện tập
            </span>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
              {poolCount} {contentType === "character" ? "Chữ cái" : "Từ vựng"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/50 rounded-xl">
            <button
              type="button"
              onClick={() => { setContentType("character"); setStarted(false); }}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer",
                contentType === "character" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              • Chữ cái đơn (Kana)
            </button>
            <button
              type="button"
              onClick={() => { setContentType("word"); setStarted(false); }}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer",
                contentType === "word" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Từ vựng thực tế
            </button>
          </div>
        </div>

        {/* 2. Hệ thống chữ viết (Script) */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            2. Hệ thống chữ viết (Script)
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/50 rounded-xl">
            <button
              type="button"
              onClick={() => { setScope("hiragana"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-2 text-xs font-bold transition-all cursor-pointer text-center",
                scope === "hiragana" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Hiragana
            </button>
            <button
              type="button"
              onClick={() => { setScope("katakana"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-2 text-xs font-bold transition-all cursor-pointer text-center",
                scope === "katakana" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Katakana
            </button>
            <button
              type="button"
              onClick={() => { setScope("both"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-2 text-xs font-bold transition-all cursor-pointer text-center",
                scope === "both" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Cả hai
            </button>
          </div>
        </div>

        {/* 3. Nhóm phát âm (Section) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3. Nhóm phát âm (Section)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-muted/50 rounded-xl">
            <button
              type="button"
              onClick={() => { setSection("all"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs font-bold transition-all cursor-pointer text-center",
                section === "all" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tất cả (All)
            </button>
            <button
              type="button"
              onClick={() => { setSection("main"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs font-bold transition-all cursor-pointer text-center",
                section === "main" ? "bg-background text-red-600 dark:text-red-400 shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Cơ bản
            </button>
            <button
              type="button"
              onClick={() => { setSection("dakuten"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs font-bold transition-all cursor-pointer text-center",
                section === "dakuten" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Âm đục
            </button>
            <button
              type="button"
              onClick={() => { setSection("youon"); setStarted(false); }}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs font-bold transition-all cursor-pointer text-center",
                section === "youon" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Âm ghép
            </button>
          </div>
        </div>

        {/* 4. Chiều kiểm tra phản xạ (Direction) */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            4. Chiều kiểm tra phản xạ (Direction)
          </span>
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setDirection("write")}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all",
                direction === "write" ? "border-red-500/50 bg-red-500/5 ring-1 ring-red-500/30" : "bg-card hover:bg-accent/40"
              )}
            >
              <input
                type="radio"
                name="direction"
                checked={direction === "write"}
                onChange={() => setDirection("write")}
                className="mt-0.5 accent-red-600 cursor-pointer"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  Luyện phản xạ: Romaji → Chữ Kana
                  <PenTool className="size-3 text-red-600" />
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Nhìn chữ Latinh viết ngay ra mặt chữ Nhật
                </span>
              </div>
            </div>

            <div
              onClick={() => setDirection("read")}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all",
                direction === "read" ? "border-red-500/50 bg-red-500/5 ring-1 ring-red-500/30" : "bg-card hover:bg-accent/40"
              )}
            >
              <input
                type="radio"
                name="direction"
                checked={direction === "read"}
                onChange={() => setDirection("read")}
                className="mt-0.5 accent-red-600 cursor-pointer"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  Nhận diện mặt chữ: Chữ Kana → Romaji
                  <Eye className="size-3 text-muted-foreground" />
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Nhìn chữ tiếng Nhật đọc tên phiên âm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Tốc độ chuyển thẻ tự động */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              5. Tốc độ chuyển thẻ tự động
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Mặc định: {speedSeconds > 0 ? `${speedSeconds}s` : "Thủ công"}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { label: "⚡ 1.5s", val: 1.5 },
              { label: "⏳ 3s", val: 3 },
              { label: "🐢 5s", val: 5 },
              { label: "⌛ 8s", val: 8 },
              { label: "🖐️ Tay", val: 0 },
            ].map((sp) => (
              <button
                key={sp.val}
                type="button"
                onClick={() => {
                  setSpeedSeconds(sp.val);
                  setRemainingMs(sp.val * 1000);
                }}
                className={cn(
                  "rounded-xl border px-2 py-1.5 text-xs font-bold transition-all cursor-pointer text-center",
                  speedSeconds === sp.val ? "border-red-600 bg-red-600 text-white shadow-2xs" : "bg-background border-border/80 text-foreground hover:bg-accent"
                )}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 pt-2 border-t text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Tự động phát âm thanh khi lật thẻ</span>
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
            <span className="font-semibold text-foreground">Xáo trộn ngẫu nhiên thứ tự chữ (Shuffle)</span>
            <button
              type="button"
              onClick={() => setShuffle((v) => !v)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                shuffle ? "bg-red-600" : "bg-input"
              )}
            >
              <span className={cn("inline-block size-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out", shuffle ? "translate-x-4" : "translate-x-0")} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Hiển thị gợi ý số nét viết ban đầu</span>
            <button
              type="button"
              onClick={() => setShowStrokeHint((v) => !v)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                showStrokeHint ? "bg-red-600" : "bg-input"
              )}
            >
              <span className={cn("inline-block size-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out", showStrokeHint ? "translate-x-4" : "translate-x-0")} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-3 border-t">
          <button
            type="button"
            onClick={started ? handleNext : handleStart}
            className="w-full inline-flex items-center justify-between bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-md cursor-pointer transition-all"
          >
            <span className="flex items-center gap-2">
              <Play className="size-4 fill-white" />
              <span>{started ? "Chữ tiếp theo (Hoặc Tái khởi động)" : "Bắt đầu Luyện tập trên màn hình"}</span>
            </span>
            <span className="rounded bg-white/20 px-2 py-0.5 text-[11px] font-mono text-white">
              Phím Enter
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Live Practice Card (7 Columns) */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs lg:col-span-7 relative overflow-hidden">
        {/* Background Kanji Watermark */}
        <span className="absolute -right-6 -top-6 text-8xl sm:text-9xl font-black text-muted-foreground/5 select-none pointer-events-none font-kanji-mincho">
          練
        </span>

        {/* Top Info Bar */}
        <div className="flex items-center justify-between border-b pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={cn(
              "size-2 rounded-full",
              started ? (paused ? "bg-amber-500" : "bg-red-600 animate-ping") : "bg-muted-foreground"
            )} />
            <span className="font-bold text-foreground">
              Chữ thứ {poolCount > 0 ? safeIndex + 1 : 0} / {poolCount}
            </span>
            <span className="text-muted-foreground">
              • Đã làm: {completedCount} chữ ({poolCount > 0 ? Math.round(((safeIndex + 1) / poolCount) * 100) : 0}%)
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-mono font-bold flex items-center gap-1.5 text-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
              <Clock className={cn("size-3.5", started && !paused ? "text-red-600 animate-spin" : "text-muted-foreground")} />
              <span>
                {speedSeconds === 0
                  ? "Thủ công"
                  : `${(remainingMs / 1000).toFixed(1)}s / ${speedSeconds}s`}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="hover:text-foreground cursor-pointer p-1 rounded hover:bg-accent"
              title={paused ? "Tiếp tục" : "Tạm dừng"}
            >
              {paused ? <Play className="size-4 text-amber-500 fill-amber-500" /> : <Pause className="size-4" />}
            </button>
          </div>
        </div>

        {/* Prompt Card Area */}
        <div className="flex flex-col items-center justify-center gap-2 py-6 border-b text-center relative">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full">
            {direction === "write" ? "ROMAJI GỢI Ý (ĐỌC & VIẾT KANA)" : "KÝ TỰ TIẾNG NHẬT (KANA)"}
          </span>
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-foreground font-mono">
            {direction === "write" ? currentItem.romaji : currentItem.char}
          </span>
          <p className="text-xs text-muted-foreground">
            {direction === "write"
              ? "Hãy đọc Romaji và nhanh chóng viết ký tự Kana tương ứng ra giấy tập"
              : "Hãy nhìn mặt chữ Kana và đọc nhẩm tên phiên âm Romaji tương ứng"}
          </p>
        </div>

        {/* Answer Box Container with Rice Grid (米字格) */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-dashed border-red-500/30 bg-muted/20 p-5 shadow-2xs">
          {/* Rice Grid Container */}
          <div className="relative size-32 sm:size-36 flex items-center justify-center rounded-xl border border-red-500/40 bg-background shadow-2xs overflow-hidden shrink-0">
            {/* Grid Guidelines */}
            <div className="absolute inset-0 border-b border-r border-red-500/10 border-dashed pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full border-t border-red-500/20 border-dashed" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full border-l border-red-500/20 border-dashed" />
            </div>

            {/* Kana / Romaji Glyph */}
            <span className={cn(
              "text-6xl font-bold font-kanji-mincho transition-all duration-300",
              phase === "reveal" ? "text-red-600" : "text-muted-foreground/30"
            )}>
              {phase === "reveal" ? (direction === "write" ? currentItem.char : currentItem.romaji) : "?"}
            </span>
          </div>

          {/* Answer Metadata & Audio */}
          <div className="flex flex-1 flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
                {scope.toUpperCase()}
              </span>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                {currentItem.strokes}
              </span>
              {phase === "reveal" && (
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  ĐÁP ÁN
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                {phase === "reveal" ? currentItem.word : "••• (???)"}
              </span>
              <span className="text-xs text-muted-foreground">
                {phase === "reveal"
                  ? `Giải thích: ${currentItem.meaning}`
                  : "Giải thích: Bấm Space để hiện đáp án"}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => speakJapanese(currentItem.char)}
                disabled={phase !== "reveal"}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-500/10 disabled:hover:text-red-600"
              >
                <Volume2 className="size-3.5" />
                <span>{phase === "reveal" ? `Phát âm /${currentItem.romaji}/` : "Phát âm (ẩn)"}</span>
              </button>
            </div>
          </div>

          {/* Reveal Toggle Overlay Button */}
          <button
            type="button"
            onClick={toggleReveal}
            className="w-full sm:w-auto absolute bottom-3 right-3 rounded-xl bg-foreground text-background px-3 py-1.5 text-xs font-bold shadow-md hover:bg-foreground/90 transition-all cursor-pointer"
          >
            {phase === "reveal" ? "👁 Đã hiện đáp án • Bấm Space để ẩn" : "👁 Bấm Space để hiện đáp án"}
          </button>
        </div>

        {/* Navigation Row */}
        <div className="flex items-center justify-between pt-2 border-t text-xs">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-1 font-bold text-xs py-2 px-3.5 rounded-xl border border-border/80 bg-background hover:bg-accent text-foreground cursor-pointer transition-all"
          >
            <ChevronLeft className="size-4" />
            <span>Chữ trước (←)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent cursor-pointer flex items-center gap-1.5"
            title="Tạm dừng / Tiếp tục"
          >
            {paused ? <Play className="size-4 text-amber-500" /> : <Pause className="size-4" />}
            <span>{paused ? "Tiếp tục đếm" : "Tạm dừng"}</span>
          </button>

          <span className="text-[11px] text-muted-foreground hidden sm:inline font-mono">
            Enter: Qua chữ • Space: Hiện đáp án
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <span>Chữ tiếp theo (Enter)</span>
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Session Progress Log Banner */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-300 mt-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>
              <strong className="font-bold">Phiên học đang diễn ra:</strong> Đã hoàn thành {completedCount} lượt luyện tập phản xạ.
            </span>
          </div>
          <button type="button" onClick={handleStart} className="font-bold underline whitespace-nowrap text-emerald-800 dark:text-emerald-200 hover:opacity-80 cursor-pointer">
            Làm lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
}

{/* -------------------------------------------------------------------------------- */}
{/* Digital Handwriting Layout */}
{/* -------------------------------------------------------------------------------- */}

function HandwritingPanelLayout() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-2xl border bg-card p-6 shadow-2xs">
      <HandwritingPanel />
    </div>
  );
}

function HandwritingPanel() {
  const { t } = useLanguage();
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [startKana, setStartKana] = useState(() => randomKana(scope, section));

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1 border-b pb-3">
        <h2 className="text-lg font-bold text-foreground">Luyện viết nét màn hình (Digital Handwriting)</h2>
        <p className="text-xs text-muted-foreground">Tự tay vẽ nét chữ trên bảng ô ly Mễ Tự Cách để chấm điểm thứ tự và hình dạng nét</p>
      </div>

      <PracticeSession
        initialKana={startKana}
        scope={scope}
        section={section}
        onEnd={() => setStartKana(randomKana(scope, section))}
      />
    </div>
  );
}

{/* -------------------------------------------------------------------------------- */}
{/* Listening Panel Layout */}
{/* -------------------------------------------------------------------------------- */}

function ListeningPanelLayout() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-2xl border bg-card p-6 shadow-2xs">
      <ListeningPanel />
    </div>
  );
}

function ListeningPanel() {
  const { t, language } = useLanguage();
  const [contentType, setContentType] = useState<"word" | "sentence">("word");
  const [wordDifficulty, setWordDifficulty] = useState<WordDifficulty | "all">("all");
  const [breakSeconds, setBreakSeconds] = useState(5);
  const [speedRate, setSpeedRate] = useState<number>(0.9);
  const [autoReveal, setAutoReveal] = useState<boolean>(false);
  const [started, setStarted] = useState(false);

  const listeningPool: ListeningItem[] = useMemo(() => {
    const allWords = getAllWords();
    return allWords.map((w) => ({
      id: w.id,
      japanese: w.kanji || w.word,
      hiragana: w.word,
      romaji: w.romaji,
      meaning: w.meaning,
      type: "word",
      subLabel: CATEGORY_LABELS[w.category],
    }));
  }, []);

  if (started) {
    return (
      <ListeningPracticeSession
        items={listeningPool}
        breakSeconds={breakSeconds}
        rate={speedRate}
        autoRevealDefault={autoReveal}
        onEnd={() => setStarted(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-b pb-3">
        <h2 className="text-lg font-bold text-foreground">Luyện Nghe & Viết (Tokyo Accent)</h2>
        <p className="text-xs text-muted-foreground">Luyện phản xạ nghe âm thanh giọng chuẩn bản xứ Tokyo và gõ phiên âm tương ứng</p>
      </div>

      <div className="flex flex-col gap-4 text-xs">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-muted-foreground uppercase">Thời gian nghỉ giữa các câu</span>
          <div className="flex gap-2">
            {[3, 5, 8, 10].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setBreakSeconds(s)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 font-bold transition-all cursor-pointer",
                  breakSeconds === s ? "border-purple-600 bg-purple-600 text-white" : "bg-background text-foreground"
                )}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => setStarted(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-xl cursor-pointer mt-2"
        >
          <Headphones className="size-4 mr-2" />
          <span>Bắt đầu Luyện nghe</span>
        </Button>
      </div>
    </div>
  );
}
