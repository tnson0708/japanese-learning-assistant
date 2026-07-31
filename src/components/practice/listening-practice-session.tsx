"use client";

import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  Pause,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakJapanese } from "@/lib/speech";
import { playBeepSignal, playCardTransitionSound } from "@/lib/audio-signal";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export interface ListeningItem {
  id: string;
  japanese: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  kanji?: string;
  type: "word" | "sentence";
  subLabel?: string;
}

interface ListeningPracticeSessionProps {
  items: ListeningItem[];
  breakSeconds: number; // break time pause in seconds
  rate: number; // speech speed rate (0.9 or 0.7)
  autoRevealDefault?: boolean; // whether to automatically show answer on load
  onEnd: () => void;
}

export function ListeningPracticeSession({
  items,
  breakSeconds,
  rate,
  autoRevealDefault = false,
  onEnd,
}: ListeningPracticeSessionProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoReveal, setAutoReveal] = useState(autoRevealDefault);
  const [revealed, setRevealed] = useState(autoRevealDefault);
  const [timeLeft, setTimeLeft] = useState(breakSeconds);
  const [completedCount, setCompletedCount] = useState(0);
  const beepTriggeredRef = useRef(false);

  const currentItem = items[currentIndex];

  // Cleanup ongoing speech when exiting the practice session
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 1. Play audio whenever current item index changes
  useEffect(() => {
    if (!currentItem) return;
    setRevealed(autoReveal);
    setTimeLeft(breakSeconds);
    beepTriggeredRef.current = false;

    if (!paused) {
      speakJapanese(currentItem.japanese, undefined, rate);
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Countdown timer for writing break time
  useEffect(() => {
    if (paused || !currentItem) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Advance to next item automatically
          setCompletedCount((c) => c + 1);
          setCurrentIndex((idx) => (idx + 1) % items.length);
          return breakSeconds;
        }

        // Trigger signal sound ("bip bip bip") 2 seconds before transition
        if (prev === 3 && !beepTriggeredRef.current) {
          beepTriggeredRef.current = true;
          playBeepSignal();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, currentItem, items.length, breakSeconds]);

  const handleReplay = () => {
    if (currentItem) {
      speakJapanese(currentItem.japanese, undefined, rate);
    }
  };

  const handleTogglePause = () => {
    setPaused((prev) => {
      const nextPaused = !prev;
      if (nextPaused) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } else if (currentItem) {
        speakJapanese(currentItem.japanese, undefined, rate);
      }
      return nextPaused;
    });
  };

  const handleNext = () => {
    playCardTransitionSound();
    setCompletedCount((c) => c + 1);
    setCurrentIndex((idx) => (idx + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((idx) => (idx - 1 + items.length) % items.length);
  };

  if (!currentItem) return null;

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / breakSeconds) * 100));

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:gap-5">
      {/* Session Top Bar */}
      <div className="flex items-center justify-between gap-2 rounded-xl border bg-card/80 px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-xs shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <Headphones className="size-4 shrink-0 text-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {currentItem.type === "word" ? t("listening_type_words") : t("listening_type_sentences")}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0">
            #{currentIndex + 1} / {items.length}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Answer Auto-Reveal Toggle */}
          <button
            type="button"
            onClick={() => setAutoReveal((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              autoReveal
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            title={t("listening_auto_reveal")}
          >
            {autoReveal ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            <span className="hidden sm:inline">{t("listening_auto_reveal")}</span>
          </button>

          <button
            type="button"
            onClick={onEnd}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
            <span>{t("paper_exit")}</span>
          </button>
        </div>
      </div>

      {/* Main Practice Audio & Card Area */}
      <div className="relative flex flex-col items-center gap-4 sm:gap-6 rounded-2xl border bg-card p-4 sm:p-7 shadow-sm">
        {/* Sub-label badge (e.g. category, subgroup, or topic) */}
        {currentItem.subLabel && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground max-w-full truncate">
            <Sparkles className="size-3 text-primary shrink-0" />
            <span className="truncate">{currentItem.subLabel}</span>
          </span>
        )}

        {/* Audio Wave & Status */}
        <div className="flex flex-col items-center gap-2 text-center my-1 sm:my-2">
          <button
            type="button"
            onClick={handleReplay}
            className="group relative flex size-20 sm:size-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            title={t("listening_btn_replay")}
          >
            <Volume2 className="size-8 sm:size-10 transition-transform group-hover:scale-110" />
            {!paused && (
              <span className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-ping pointer-events-none" />
            )}
          </button>
          <p className="text-xs font-semibold text-muted-foreground">
            {paused ? t("listening_state_paused") : t("listening_state_writing")}
          </p>
        </div>

        {/* Break Time Countdown Bar */}
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{paused ? t("listening_state_paused") : `${t("listening_break_time")}: ${timeLeft}s`}</span>
            <span className="text-primary font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-linear rounded-full",
                paused ? "bg-amber-500" : timeLeft <= 3 ? "bg-red-500" : "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Answer Card (Hidden by default until revealed or autoReveal is ON) */}
        <div className="w-full rounded-xl border bg-accent/30 p-3.5 sm:p-5">
          {!revealed ? (
            <div className="flex flex-col items-center gap-2 py-1 sm:py-2 text-center">
              <EyeOff className="size-5 sm:size-6 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground">
                Listen & write on your paper first, then click below to verify.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealed(true)}
                className="mt-1 gap-2 font-medium"
              >
                <Eye className="size-4" />
                {t("listening_btn_reveal")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="size-3.5" />
                  Answer Revealed
                </div>
                <button
                  type="button"
                  onClick={() => setRevealed(false)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <EyeOff className="size-3.5" />
                  {t("listening_btn_hide")}
                </button>
              </div>

              <p className="text-xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
                {currentItem.japanese}
              </p>
              {currentItem.hiragana !== currentItem.japanese && (
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {currentItem.hiragana}
                </p>
              )}
              <p className="text-xs sm:text-sm font-semibold text-primary">
                {currentItem.romaji}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground border-t pt-1.5 w-full">
                {currentItem.meaning}
              </p>
            </div>
          )}
        </div>

        {/* Session Action Controls */}
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePause}
            className="flex items-center justify-center gap-1.5 font-medium px-2 py-2 text-xs sm:text-sm min-w-0"
          >
            {paused ? <Play className="size-3.5 text-emerald-500 shrink-0" /> : <Pause className="size-3.5 text-amber-500 shrink-0" />}
            <span className="truncate">{paused ? t("listening_btn_resume") : t("listening_btn_pause")}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReplay}
            className="flex items-center justify-center gap-1.5 font-medium px-2 py-2 text-xs sm:text-sm min-w-0"
          >
            <RotateCcw className="size-3.5 shrink-0" />
            <span className="truncate">{t("listening_btn_replay")}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="flex items-center justify-center gap-1 font-medium px-2 py-2 text-xs sm:text-sm min-w-0"
          >
            <ChevronLeft className="size-3.5 shrink-0" />
            <span>Prev</span>
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            className="flex items-center justify-center gap-1 font-semibold px-2 py-2 text-xs sm:text-sm min-w-0"
          >
            <span>Next</span>
            <ChevronRight className="size-3.5 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
