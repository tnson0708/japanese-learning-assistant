"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Scissors,
  CheckCircle2,
  Volume2,
  Sparkles,
  LayoutGrid,
  List,
  Tag,
  Compass,
  ArrowRight,
} from "lucide-react";
import { WordCard } from "@/components/vocabulary/word-card";
import { PrintCutoutSheet } from "@/components/vocabulary/print-cutout-sheet";
import { PrintLabelsButton } from "@/components/vocabulary/print-labels-button";
import { useLanguage } from "@/lib/language-context";
import { speakJapanese } from "@/lib/speech";
import {
  getDomainName,
  getSubtopicName,
  type Domain,
  type Subtopic,
  type JlptLevel,
} from "@/lib/vocabulary";
import { cn } from "@/lib/utils";

export function SubtopicStudyView({ domain, subtopic }: { domain: Domain; subtopic: Subtopic }) {
  const { t, language } = useLanguage();

  const [selectedLevel, setSelectedLevel] = useState<JlptLevel | "all">("all");
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"cards" | "list" | "labels">("cards");

  const domainName = getDomainName(domain, language);
  const subtopicName = getSubtopicName(subtopic, language);

  // Compute counts per JLPT level
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { all: subtopic.words.length };
    subtopic.words.forEach((w) => {
      counts[w.jlptLevel] = (counts[w.jlptLevel] || 0) + 1;
    });
    return counts;
  }, [subtopic.words]);

  // Derived filtered words based on selected level
  const filteredWords = useMemo(() => {
    if (selectedLevel === "all") return subtopic.words;
    return subtopic.words.filter((w) => w.jlptLevel === selectedLevel);
  }, [subtopic.words, selectedLevel]);

  // Derived other subtopics in the same domain for "HÀNH TRÌNH HỌC TIẾP THEO"
  const nextSubtopics = useMemo(() => {
    return domain.subtopics.filter((s) => s.id !== subtopic.id);
  }, [domain.subtopics, subtopic.id]);

  return (
    <div className="flex flex-col gap-6">
      {/* Printable cutout sheet container */}
      <PrintCutoutSheet title={subtopicName} groups={[{ words: subtopic.words }]} />

      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 print:hidden">
        <Link href="/vocabulary" className="hover:underline">
          {domain.name.toUpperCase()}
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-muted-foreground">{subtopicName.toUpperCase()}</span>
      </nav>

      {/* 2. Header & Action Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between print:hidden">
        <div className="flex flex-col gap-2.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex flex-wrap items-baseline gap-2">
            {subtopicName}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Tổng hợp <strong className="font-bold text-foreground">{subtopic.words.length} từ vựng thiết yếu</strong> thuộc chủ đề {subtopicName}. 100% kèm phát âm bản xứ và chữ Hán - Việt tương ứng.
          </p>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              {subtopic.words.length} Từ vựng cốt lõi
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              JLPT N5 - N2
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/60">
              <span className="size-1.5 rounded-full bg-amber-600" />
              100% Kèm ví dụ & Audio
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200/60">
              <span className="size-1.5 rounded-full bg-red-600" />
              Thẻ dán đồ vật thực tế
            </span>
          </div>
        </div>

        {/* Print Labels Action Button */}
        <div className="shrink-0 pt-1">
          <PrintLabelsButton />
        </div>
      </div>

      {/* 3. Sticky Label Technique Tip Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-red-200/80 bg-red-50/40 p-4 sm:p-5 dark:border-red-900/40 dark:bg-red-950/20 lg:flex-row lg:items-center lg:justify-between print:hidden shadow-2xs">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400">
            <Scissors className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Phương pháp &quot;Dán nhãn thực tế&quot; (Sticky Label Technique)
              </h3>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400">
                KHUYÊN DÙNG
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cắt dọc theo nét đứt ✂️ của bản in thẻ A4 và dán trực tiếp lên đồ vật tương ứng xung quanh bạn. Não bộ sẽ liên kết từ vựng với vật thể thật nhanh gấp 3 lần!
            </p>
          </div>
        </div>

        {/* Mini Cutout Preview Cards */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 shrink-0">
          {subtopic.words.slice(0, 3).map((w, i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 rounded-lg border border-dashed border-red-300 bg-background p-2 text-center text-[10px] shadow-2xs w-24 shrink-0 dark:border-red-900/60"
            >
              <span className="text-[9px] font-bold uppercase text-red-600 tracking-wider">
                ✂️ CẮT • DÁN
              </span>
              <span className="font-extrabold text-foreground text-xs truncate">
                {w.word}
              </span>
              <span className="text-muted-foreground truncate">{w.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Controls & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs print:hidden">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Level Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              CẤP ĐỘ:
            </span>
            <button
              type="button"
              onClick={() => setSelectedLevel("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                selectedLevel === "all"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              Tất cả ({subtopic.words.length})
            </button>
            {(["N5", "N4", "N3", "N2", "N1"] as JlptLevel[]).map((lvl) => {
              const count = levelCounts[lvl] || 0;
              if (count === 0) return null;
              const isActive = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-red-600 text-white shadow-2xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {lvl} ({count})
                </button>
              );
            })}
          </div>

          {/* Furigana Toggle + View Mode Toggle */}
          <div className="flex items-center gap-4">
            {/* Furigana Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Furigana (Phiên âm)
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showFurigana}
                onClick={() => setShowFurigana(!showFurigana)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  showFurigana ? "bg-red-600" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    showFurigana ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 border border-border/40">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "cards"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="size-3.5" />
                <span>Thẻ chi tiết</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="size-3.5" />
                <span>Danh sách</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("labels")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "labels"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Tag className="size-3.5" />
                <span>Nhãn dán</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info text */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <span>
            Hiển thị <strong className="font-bold text-foreground">{filteredWords.length}</strong> / {subtopic.words.length} mục từ • Chủ đề: {subtopicName}
          </span>
          <span className="hidden sm:inline-block italic text-muted-foreground/70">
            [Bấm vào từ vựng hoặc biểu tượng 🔊 để nghe âm thanh phát âm bản xứ]
          </span>
        </div>
      </div>

      {/* 5. Main Content Views */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 print:hidden">
          {filteredWords.map((word) => (
            <WordCard key={word.id} word={word} showFurigana={showFurigana} />
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="rounded-2xl border border-border/80 bg-card shadow-2xs overflow-hidden print:hidden">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Cấp độ</th>
                <th className="px-4 py-3">Từ vựng (Kanji / Reading)</th>
                <th className="px-4 py-3">Ý nghĩa tiếng Việt</th>
                <th className="px-4 py-3">Ví dụ ứng dụng</th>
                <th className="px-4 py-3 text-right">Phát âm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredWords.map((w) => (
                <tr key={w.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-4 py-3 font-semibold">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold">
                      {w.jlptLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-foreground text-base block">{w.word}</span>
                    <span className="text-xs text-muted-foreground">{w.reading}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">{w.meaning}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{w.exampleSentence}</p>
                    <p className="italic">{w.exampleSentenceMeaning}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => speakJapanese(w.reading || w.word)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Volume2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "labels" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 print:hidden">
          {filteredWords.map((w) => (
            <div
              key={w.id}
              className="flex flex-col justify-between rounded-xl border border-dashed border-red-300 dark:border-red-900/60 bg-card p-3 text-center shadow-2xs gap-2 min-h-[110px]"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-red-600 uppercase">
                <span>✂️ CẮT • DÁN</span>
                <span>{w.jlptLevel}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-foreground">{w.word}</span>
                <span className="text-xs text-muted-foreground">{w.reading}</span>
              </div>
              <span className="text-xs font-semibold text-foreground border-t pt-1 truncate">
                {w.meaning}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 6. Culture & Skill Notes Section */}
      <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-5 dark:border-amber-900/40 dark:bg-amber-950/10 print:hidden shadow-2xs mt-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
            <Compass className="size-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            Văn hóa & Kỹ năng thực tế tại Nhật Bản
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1 */}
          <div className="flex flex-col gap-2 rounded-xl border border-amber-200/60 bg-background p-4 shadow-2xs dark:border-amber-900/40">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              01. Khay tiền (Tsurisen Tray)
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tại hầu hết các quầy thu ngân (レジ), người Nhật không đưa tiền trực tiếp từ tay sang tay. Bạn hãy đặt tiền mặt, thẻ ngân hàng hoặc tiền xu vào khay nhỏ (カルトン - Karton) trên quầy. Nhân viên cũng sẽ thối tiền thừa (お釣り) vào khay này.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-2 rounded-xl border border-amber-200/60 bg-background p-4 shadow-2xs dark:border-amber-900/40">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              02. Thanh toán không tiền mặt
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ngoài tiền mặt (現金), bạn có thể chạm thẻ IC giao thông (Suica, Pasmo) hoặc mã QR (PayPay, LinePay). Khi thanh toán, chỉ cần nói với nhân viên: 『Suicaでお願いします』 (Cho tôi thanh toán bằng Suica).
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-2 rounded-xl border border-amber-200/60 bg-background p-4 shadow-2xs dark:border-amber-900/40">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              03. Hóa đơn đỏ (領収書)
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Khác với hóa đơn đời thường (レシート), nếu bạn đi công tác hoặc muốn lấy hóa đơn tài chính chính thức có tên công ty, hãy nói: 『領収書をお願いします』 (Ryōshūsho o onegaishimasu).
            </p>
          </div>
        </div>
      </div>

      {/* 7. Next Step Navigation Bar */}
      {nextSubtopics.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 print:hidden shadow-2xs mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              HÀNH TRÌNH HỌC TIẾP THEO
            </span>
            <h3 className="text-sm font-bold text-foreground">
              Chủ đề tiếp theo trong nhóm {domainName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {nextSubtopics.map((st, i) => (
              <Link
                key={st.id}
                href={`/vocabulary/${domain.id}/${st.id}`}
                className="group flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-4 py-2.5 text-xs font-bold text-foreground hover:border-red-500/40 hover:bg-red-50/40 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              >
                <span>0{i + 2}. {getSubtopicName(st, language)}</span>
                <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
