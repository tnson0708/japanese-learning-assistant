"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  PenTool,
  Volume2,
  FileText,
  Pencil,
  RotateCcw,
  Sparkles,
  MoveLeft,
  MoveRight,
  Check,
  X,
  BookOpen,
  LayoutGrid,
  BookMarked,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { MINNA_LESSON_SLIDES } from "@/components/teaching/lesson-slides-data";

export interface TeachingSlide {
  id: string;
  title: string;
  subtitle?: string;
  type: "title" | "content" | "kana_grid" | "vocabulary" | "grammar" | "dialogue";
  japanese?: string;
  romaji?: string;
  translation?: string;
  bullets?: string[];
  notes?: string;
  theme: "indigo" | "emerald" | "amber" | "rose" | "dark";
}

const SLIDE_TYPES = ["title", "content", "kana_grid", "vocabulary", "grammar", "dialogue"] as const;
const THEMES = ["indigo", "emerald", "amber", "rose", "dark"] as const;

const TYPE_META: Record<TeachingSlide["type"], { icon: LucideIcon; label: { en: string; vi: string } }> = {
  title: { icon: Sparkles, label: { en: "Overview", vi: "Tổng quan" } },
  grammar: { icon: BookOpen, label: { en: "Grammar Point", vi: "Ngữ pháp" } },
  kana_grid: { icon: LayoutGrid, label: { en: "Writing System", vi: "Bảng chữ cái" } },
  vocabulary: { icon: BookMarked, label: { en: "Vocabulary", vi: "Từ vựng" } },
  content: { icon: FileText, label: { en: "Lesson Content", vi: "Nội dung" } },
  dialogue: { icon: MessageCircle, label: { en: "Dialogue Practice", vi: "Hội thoại" } },
};

const THEME_STAGE_STYLES: Record<TeachingSlide["theme"], string> = {
  indigo: "from-slate-900 via-indigo-950 to-slate-950 text-white border-indigo-500/30",
  emerald: "from-slate-900 via-emerald-950 to-slate-950 text-white border-emerald-500/30",
  amber: "from-stone-900 via-amber-950 to-stone-950 text-white border-amber-500/30",
  rose: "from-slate-900 via-rose-950 to-slate-950 text-white border-rose-500/30",
  dark: "from-zinc-950 via-zinc-900 to-black text-white border-zinc-700/40",
};

const INITIAL_SLIDES: TeachingSlide[] = MINNA_LESSON_SLIDES;

const STORAGE_KEY = "kana_dojo_teaching_slides_v2";

export function TeachingDeck() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  // Start with the deterministic default on both server and client so the
  // first paint always matches, then swap in any saved deck after mount.
  const [slides, setSlides] = useState<TeachingSlide[]>(INITIAL_SLIDES);
  const [hydrated, setHydrated] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [editingSlide, setEditingSlide] = useState<TeachingSlide | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Canvas ref for laser / drawing annotation overlay
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const currentSlide = slides[currentIndex] || slides[0];
  const typeMeta = TYPE_META[currentSlide.type] || TYPE_META.content;
  const TypeIcon = typeMeta.icon;

  // Load any saved deck after mount (client-only, avoids SSR hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
      } catch {
        // Fallback if JSON parse fails
      }
    }
    setHydrated(true);
  }, []);

  // Persist edits to localStorage, but not before the saved deck has loaded
  // (otherwise this would immediately overwrite it with the default deck)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  }, [slides, hydrated]);

  const toggleFullscreen = () => {
    const elem = document.getElementById("teaching-presentation-stage");
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => console.error(err));
    }
  };

  // Handle keyboard navigation for live screen-sharing presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings if user is typing in an input, textarea, or select
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  // Canvas drawing handlers for laser pointer (scaled from CSS size to the canvas's drawing-buffer resolution)
  const canvasPoint = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isLaserActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = canvasPoint(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#ef4444"; // Red laser pen
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isLaserActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = canvasPoint(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Slide Operations
  const handleAddSlide = () => {
    const newSlide: TeachingSlide = {
      id: `slide-${Date.now()}`,
      title: isVi ? "Slide bài giảng mới" : "New Lesson Slide",
      subtitle: isVi ? "Nhập phụ đề hoặc thông tin lớp học" : "Enter subtitle or class notes",
      type: "content",
      japanese: "日本語",
      romaji: "Nihongo",
      translation: isVi ? "Tiếng Nhật" : "Japanese Language",
      bullets: [
        isVi ? "Nội dung trọng tâm 1" : "Key teaching point 1",
        isVi ? "Ví dụ thực hành 2" : "Practice example 2",
      ],
      notes: isVi ? "Ghi chú dành cho giáo viên" : "Speaker notes for teacher",
      theme: "indigo",
    };

    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentIndex(currentIndex + 1);
  };

  const handleDuplicateSlide = () => {
    const slideToClone = slides[currentIndex];
    const clonedSlide: TeachingSlide = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
      title: `${slideToClone.title} (Copy)`,
    };

    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, clonedSlide);
    setSlides(newSlides);
    setCurrentIndex(currentIndex + 1);
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, idx) => idx !== currentIndex);
    setSlides(newSlides);
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleMoveSlide = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex === 0) return;
    if (direction === "next" && currentIndex === slides.length - 1) return;

    const targetIdx = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    const newSlides = [...slides];
    const temp = newSlides[currentIndex];
    newSlides[currentIndex] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    setSlides(newSlides);
    setCurrentIndex(targetIdx);
  };

  const handleResetDefaults = () => {
    if (confirm(isVi ? "Khôi phục bộ bài giảng 25 bài gốc? Các chỉnh sửa hiện tại sẽ mất." : "Reset to the original 25-lesson deck? Current edits will be lost.")) {
      setSlides(INITIAL_SLIDES);
      setCurrentIndex(0);
    }
  };

  const handleSaveEdit = (updated: TeachingSlide) => {
    const newSlides = [...slides];
    newSlides[currentIndex] = updated;
    setSlides(newSlides);
    setEditingSlide(null);
  };

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(slides.length - 1, i + 1));

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Teacher Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4 shadow-2xs">
        {/* Row 1: position + jump-to-slide */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-foreground shrink-0">
            <TypeIcon className="size-4 text-primary" />
            <span>
              {currentIndex + 1} / {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleMoveSlide("prev")}
              disabled={currentIndex === 0}
              title={isVi ? "Di chuyển slide sang trái" : "Move slide left"}
            >
              <MoveLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleMoveSlide("next")}
              disabled={currentIndex === slides.length - 1}
              title={isVi ? "Di chuyển slide sang phải" : "Move slide right"}
            >
              <MoveRight className="size-3.5" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <select
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="min-w-0 flex-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-primary"
            aria-label={isVi ? "Đi tới slide" : "Jump to slide"}
          >
            {slides.map((s, idx) => (
              <option key={s.id} value={idx}>
                {idx + 1}. {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: slide operations + presentation tools */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleAddSlide} className="gap-1.5 text-xs font-semibold">
            <Plus className="size-4" />
            {isVi ? "Thêm slide" : "Add Slide"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicateSlide}
            className="gap-1.5 text-xs font-semibold"
          >
            <Copy className="size-3.5" />
            {isVi ? "Sao chép" : "Duplicate"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingSlide(currentSlide)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Pencil className="size-3.5 text-primary" />
            {isVi ? "Sửa nội dung" : "Edit Slide"}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSlide}
            disabled={slides.length <= 1}
            className="gap-1.5 text-xs font-semibold"
          >
            <Trash2 className="size-3.5" />
            {isVi ? "Xóa" : "Delete"}
          </Button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <Button
            variant={isLaserActive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLaserActive(!isLaserActive)}
            className="gap-1.5 text-xs font-semibold"
          >
            <PenTool className="size-3.5" />
            {isVi ? "Bút laser" : "Laser"}
          </Button>

          <Button
            variant={showNotes ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="gap-1.5 text-xs font-semibold"
          >
            <FileText className="size-3.5" />
            {isVi ? "Ghi chú (N)" : "Notes (N)"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="gap-1.5 text-xs font-semibold"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            {isFullscreen ? (isVi ? "Thoát (F)" : "Exit (F)") : (isVi ? "Trình chiếu (F)" : "Fullscreen (F)")}
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleResetDefaults}
            title={isVi ? "Khôi phục bộ bài giảng gốc" : "Reset to default deck"}
            className="ml-auto"
          >
            <RotateCcw className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Presentation Stage (16:9 HD) */}
      <div
        id="teaching-presentation-stage"
        className={cn(
          "relative w-full aspect-video rounded-2xl border bg-gradient-to-br shadow-2xl overflow-hidden select-none transition-all duration-300",
          THEME_STAGE_STYLES[currentSlide.theme] || THEME_STAGE_STYLES.indigo
        )}
      >
        {/* Laser Annotation Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={cn(
            "absolute inset-0 z-30 w-full h-full pointer-events-none",
            isLaserActive && "pointer-events-auto cursor-crosshair"
          )}
        />

        {/* Clear Laser Drawing Floating Button */}
        {isLaserActive && (
          <button
            type="button"
            onClick={clearCanvas}
            className="absolute top-3 right-3 z-40 rounded-full bg-red-600/90 hover:bg-red-600 text-white px-3 py-1 text-xs font-bold shadow-md transition-all flex items-center gap-1"
          >
            <X className="size-3.5" />
            {isVi ? "Xóa nét bút" : "Clear Drawings"}
          </button>
        )}

        {/* Stage content: fixed header/footer, scrollable body */}
        <div className="relative z-10 flex h-full flex-col gap-3 p-5 sm:p-7 lg:p-9">
          {/* Fixed: type badge + counter */}
          <div className="flex shrink-0 items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/90">
              <TypeIcon className="size-3.5 text-amber-400" />
              {isVi ? typeMeta.label.vi : typeMeta.label.en}
            </span>
            <span className="text-[11px] font-mono text-white/60">
              {currentIndex + 1} / {slides.length}
            </span>
          </div>

          {/* Fixed: title + subtitle */}
          <div className="shrink-0">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-white drop-shadow-sm">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="mt-1 text-[11px] sm:text-sm text-white/70">{currentSlide.subtitle}</p>
            )}
          </div>

          {/* Scrollable: japanese example + bullets, so long content never gets clipped */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {currentSlide.japanese && (
              <div className="flex flex-col gap-2 rounded-2xl bg-white/10 backdrop-blur-md p-3.5 sm:p-4 border border-white/15">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-lg sm:text-2xl lg:text-3xl font-medium leading-snug tracking-tight text-white whitespace-pre-line">
                    {currentSlide.japanese}
                  </span>

                  <button
                    type="button"
                    onClick={() => speakJapanese(currentSlide.japanese || "")}
                    className="rounded-full bg-white/20 hover:bg-white/30 p-2 sm:p-2.5 text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shrink-0"
                    title={isVi ? "Phát âm" : "Pronounce Japanese text"}
                    aria-label={isVi ? "Phát âm" : "Pronounce Japanese text"}
                  >
                    <Volume2 className="size-4 sm:size-5" />
                  </button>
                </div>

                {currentSlide.romaji && (
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300/90 whitespace-pre-line">
                    {currentSlide.romaji}
                  </span>
                )}

                {currentSlide.translation && (
                  <span className="text-xs sm:text-sm text-white/80 italic whitespace-pre-line">
                    {currentSlide.translation}
                  </span>
                )}
              </div>
            )}

            {currentSlide.bullets && currentSlide.bullets.length > 0 && (
              <div className="flex flex-col gap-2">
                {currentSlide.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-black/20 p-2.5 sm:p-3 backdrop-blur-xs border border-white/10"
                  >
                    <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white/90">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-white/95 leading-relaxed">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixed: prev/next + progress */}
          <div className="flex shrink-0 items-center gap-3 border-t border-white/15 pt-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/15 disabled:opacity-30"
              title={isVi ? "Trang trước" : "Previous"}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/70 transition-all"
                style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
              />
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={goNext}
              disabled={currentIndex === slides.length - 1}
              className="text-white hover:bg-white/15 disabled:opacity-30"
              title={isVi ? "Trang sau" : "Next"}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Speaker Notes Collapsible Drawer */}
      {showNotes && (
        <div className="rounded-xl border bg-amber-500/10 border-amber-500/30 p-4 shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="size-4" />
              {isVi ? "Ghi chú dành cho Giáo viên" : "Teacher Speaker Notes"}
            </span>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-line">
            {currentSlide.notes || (isVi ? "Chưa có ghi chú cho slide này. Hãy bấm 'Sửa nội dung' để thêm ghi chú giáo án." : "No speaker notes for this slide. Click 'Edit Slide' to add teacher notes.")}
          </p>
        </div>
      )}

      {/* Slide Edit Modal / Drawer */}
      {editingSlide && (
        <EditSlideModal
          slide={editingSlide}
          onSave={handleSaveEdit}
          onCancel={() => setEditingSlide(null)}
          isVi={isVi}
        />
      )}
    </div>
  );
}

// Modal component for editing slide information
function EditSlideModal({
  slide,
  onSave,
  onCancel,
  isVi,
}: {
  slide: TeachingSlide;
  onSave: (updated: TeachingSlide) => void;
  onCancel: () => void;
  isVi: boolean;
}) {
  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle || "");
  const [type, setType] = useState<TeachingSlide["type"]>(slide.type);
  const [japanese, setJapanese] = useState(slide.japanese || "");
  const [romaji, setRomaji] = useState(slide.romaji || "");
  const [translation, setTranslation] = useState(slide.translation || "");
  const [bulletsText, setBulletsText] = useState((slide.bullets || []).join("\n"));
  const [notes, setNotes] = useState(slide.notes || "");
  const [theme, setTheme] = useState(slide.theme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...slide,
      title: title.trim(),
      subtitle: subtitle.trim(),
      type,
      japanese: japanese.trim(),
      romaji: romaji.trim(),
      translation: translation.trim(),
      bullets: bulletsText
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean),
      notes: notes.trim(),
      theme,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="font-bold text-base sm:text-lg">
            {isVi ? "Chỉnh sửa thông tin Slide" : "Edit Slide Information"}
          </h3>
          <Button variant="ghost" size="icon-sm" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          {/* Slide Title */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Tiêu đề Slide" : "Slide Title"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Phụ đề / Ghi chú ngắn" : "Subtitle / Short Description"}
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Slide Type */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Loại slide" : "Slide Type"}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TeachingSlide["type"])}
              className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
            >
              {SLIDE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {isVi ? TYPE_META[t].label.vi : TYPE_META[t].label.en}
                </option>
              ))}
            </select>
          </div>

          {/* Japanese Text & Romaji */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-muted-foreground">
                {isVi ? "Chữ tiếng Nhật" : "Japanese Text"}
              </label>
              <textarea
                value={japanese}
                onChange={(e) => setJapanese(e.target.value)}
                rows={3}
                className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary font-medium"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-muted-foreground">
                Romaji
              </label>
              <textarea
                value={romaji}
                onChange={(e) => setRomaji(e.target.value)}
                rows={3}
                className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary font-mono"
              />
            </div>
          </div>

          {/* Translation */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Bản dịch" : "Translation"}
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Bullet Items (One per line) */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Danh sách ý chính (Mỗi dòng 1 ý)" : "Bullet points (One per line)"}
            </label>
            <textarea
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              rows={4}
              className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Speaker Notes */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Ghi chú giáo án cho Giáo viên" : "Teacher Speaker Notes"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="rounded-lg border bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Color Theme Selection */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-muted-foreground">
              {isVi ? "Giao diện màu sắc" : "Slide Color Theme"}
            </label>
            <div className="flex items-center gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold capitalize border transition-all",
                    theme === t ? "ring-2 ring-primary border-primary font-bold" : "border-border opacity-70"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t mt-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              {isVi ? "Hủy" : "Cancel"}
            </Button>
            <Button type="submit" size="sm" className="gap-1 font-semibold">
              <Check className="size-4" />
              {isVi ? "Lưu thay đổi" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
