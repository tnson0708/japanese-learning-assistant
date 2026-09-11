"use client";

import React, { useState } from "react";
import {
  Volume2,
  Sparkles,
  Info,
  Play,
  ArrowRight,
  TrendingUp,
  VolumeX,
  Music,
  CheckCircle2,
} from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

// Audio Button Helper
function AudioButton({
  text,
  label,
  subLabel,
  variant = "default",
  className,
}: {
  text: string;
  label?: string;
  subLabel?: string;
  variant?: "default" | "outline" | "red" | "accent" | "ghost";
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaying(true);
    speakJapanese(text);
    setTimeout(() => setPlaying(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={cn(
        "inline-flex items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer select-none active:scale-[0.98]",
        variant === "red"
          ? "border-red-600 bg-red-600 text-white hover:bg-red-700 shadow-2xs"
          : variant === "accent"
          ? "border-red-200 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100"
          : variant === "outline"
          ? "border-border/80 bg-background hover:bg-accent text-foreground"
          : variant === "ghost"
          ? "border-transparent bg-muted/60 hover:bg-accent text-foreground"
          : "border-border/60 bg-card hover:border-red-500/50 hover:bg-accent/50 text-foreground",
        playing && "ring-2 ring-red-500 animate-pulse",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Volume2 className={cn("size-3.5 shrink-0", variant === "red" ? "text-white" : "text-red-600")} />
        <div className="flex flex-col text-left">
          <span>{label || text}</span>
          {subLabel && <span className="text-[10px] opacity-80 font-normal">{subLabel}</span>}
        </div>
      </div>
    </button>
  );
}

// Mouth SVG Illustrations for 5 Vowels
function VowelMouthSvg({ type, className }: { type: "a" | "i" | "u" | "e" | "o"; className?: string }) {
  switch (type) {
    case "a":
      // Wide open relaxed mouth
      return (
        <svg viewBox="0 0 100 50" className={cn("w-full h-10", className)}>
          <path d="M 15 25 Q 50 10 85 25 Q 50 48 15 25 Z" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M 25 25 Q 50 40 75 25" fill="#fca5a5" opacity="0.4" />
          <path d="M 30 20 Q 50 15 70 20" stroke="#f87171" strokeWidth="2" fill="none" />
        </svg>
      );
    case "i":
      // Wide smile, flat lips
      return (
        <svg viewBox="0 0 100 50" className={cn("w-full h-10", className)}>
          <path d="M 10 25 Q 50 18 90 25 Q 50 32 10 25 Z" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M 15 25 Q 50 28 85 25" fill="#fca5a5" opacity="0.3" />
          <path d="M 20 22 Q 50 18 80 22" stroke="#f87171" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "u":
      // Flat unrounded lips
      return (
        <svg viewBox="0 0 100 50" className={cn("w-full h-10", className)}>
          <path d="M 25 25 Q 50 21 75 25 Q 50 29 25 25 Z" fill="none" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="30" y1="25" x2="70" y2="25" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
        </svg>
      );
    case "e":
      // Medium open mouth
      return (
        <svg viewBox="0 0 100 50" className={cn("w-full h-10", className)}>
          <path d="M 18 25 Q 50 14 82 25 Q 50 40 18 25 Z" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M 28 25 Q 50 34 72 25" fill="#fca5a5" opacity="0.3" />
        </svg>
      );
    case "o":
      // Round vertical oval mouth
      return (
        <svg viewBox="0 0 100 50" className={cn("w-full h-10", className)}>
          <ellipse cx="50" cy="25" rx="24" ry="18" fill="none" stroke="#ef4444" strokeWidth="3" />
          <ellipse cx="50" cy="25" rx="16" ry="11" fill="#fca5a5" opacity="0.3" />
        </svg>
      );
  }
}

export function PronunciationGuide() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <div className="flex flex-col gap-10">
      {/* ========================================================================= */}
      {/* SECTION 1: BẢN ĐỒ 5 NGUYÊN ÂM CHUẨN (VOWEL MAP) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600">
              KHẨU HÌNH HỌC • VOWEL MAP
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              1. Bản đồ 5 Nguyên âm Chuẩn (A • I • U • E • O)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Khác biệt mấu chốt so với tiếng Việt. Mỗi ít xê dịch, độ mở hàm nông hơn và phát âm dứt khoát không ngân rung tùy tiện.
          </p>
        </div>

        {/* 5 Vowel Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: /A/ */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-red-500/40">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1">
                <span>01</span>
                <span>NGUYÊN ÂM /A/</span>
              </div>
              <div className="text-center py-2">
                <span className="text-4xl font-extrabold text-foreground">あ</span>
                <div className="text-xs text-muted-foreground font-semibold mt-1">ア • [ a ]</div>
              </div>
              <div className="my-2 rounded-xl bg-muted/40 p-2.5 flex items-center justify-center">
                <VowelMouthSvg type="a" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Miệng mở vừa phải, vòm họng thả lỏng. Âm ngắn gọn và thanh thoát hơn âm &quot;A&quot; trong tiếng Việt.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="あ" label="Nghe âm /A/" className="w-full justify-center" />
            </div>
          </div>

          {/* Card 2: /I/ */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-red-500/40">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1">
                <span>02</span>
                <span>NGUYÊN ÂM /I/</span>
              </div>
              <div className="text-center py-2">
                <span className="text-4xl font-extrabold text-foreground">い</span>
                <div className="text-xs text-muted-foreground font-semibold mt-1">イ • [ i ]</div>
              </div>
              <div className="my-2 rounded-xl bg-muted/40 p-2.5 flex items-center justify-center">
                <VowelMouthSvg type="i" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kéo nhẹ khóe miệng sang hai bên, không gồng cơ má. Lưng lưỡi dâng cao áp gần ngạc cứng.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="い" label="Nghe âm /I/" className="w-full justify-center" />
            </div>
          </div>

          {/* Card 3: /U/ (HIGHLIGHTED RED CARD) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-red-600/70 bg-red-50/50 dark:bg-red-950/20 p-4 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 rounded-bl-xl bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
              LƯU Ý ĐẶC BIỆT
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-red-600 mb-1">
                <span>03</span>
                <span>NGUYÊN ÂM /U/</span>
              </div>
              <div className="text-center py-2">
                <span className="text-4xl font-extrabold text-red-600">う</span>
                <div className="text-xs text-red-600/80 font-bold mt-1">ウ • [ ɯ ]</div>
              </div>
              <div className="my-2 rounded-xl bg-red-100/60 dark:bg-red-900/30 p-2.5 flex items-center justify-center border border-red-200/50">
                <VowelMouthSvg type="u" />
              </div>
              <p className="text-xs text-red-950 dark:text-red-200 font-medium leading-relaxed">
                <strong className="text-red-600 font-extrabold">Tuyệt đối không chu môi</strong> như &quot;U&quot; tiếng Việt. Môi dẹt tự nhiên, âm phát ra lai giữa &quot;U&quot; và &quot;Ư&quot;.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-red-200/60 dark:border-red-900/40">
              <AudioButton text="う" label="Nghe âm /U/" className="w-full justify-center" />
            </div>
          </div>

          {/* Card 4: /E/ */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-red-500/40">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1">
                <span>04</span>
                <span>NGUYÊN ÂM /E/</span>
              </div>
              <div className="text-center py-2">
                <span className="text-4xl font-extrabold text-foreground">え</span>
                <div className="text-xs text-muted-foreground font-semibold mt-1">エ • [ e ]</div>
              </div>
              <div className="my-2 rounded-xl bg-muted/40 p-2.5 flex items-center justify-center">
                <VowelMouthSvg type="e" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mở miệng tầm trung bình, phát âm nằm giữa âm &quot;Ê&quot; và &quot;È&quot; trong tiếng Việt. Lưỡi không gập cong.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="え" label="Nghe âm /E/" className="w-full justify-center" />
            </div>
          </div>

          {/* Card 5: /O/ */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-red-500/40">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1">
                <span>05</span>
                <span>NGUYÊN ÂM /O/</span>
              </div>
              <div className="text-center py-2">
                <span className="text-4xl font-extrabold text-foreground">お</span>
                <div className="text-xs text-muted-foreground font-semibold mt-1">オ • [ o ]</div>
              </div>
              <div className="my-2 rounded-xl bg-muted/40 p-2.5 flex items-center justify-center">
                <VowelMouthSvg type="o" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Môi hơi tròn nhưng không nhọn ra trước. Âm thoát ra từ sâu vòm họng, lai giữa &quot;Ô&quot; và &quot;Ơ&quot;.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="お" label="Nghe âm /O/" className="w-full justify-center" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 4 HIỆN TƯỢNG PHÁT ÂM ĐẶC THỦ CỐT LÕI */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600">
              QUY LUẬT ÂM VỊ HỌC • MORA & PHONETICS
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              2. 4 Hiện tượng Phát âm Đặc thủ Cốt lõi
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Làm chủ 4 quy tắc này sẽ giúp bạn xóa bỏ hoàn toàn ngọng điệu gượng gạo khi chuyển từ phát âm tiếng Việt sang tiếng Nhật.
          </p>
        </div>

        {/* 2x2 Grid for 4 Core Phonetic Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rule 1: Âm ngắt Sokuon (促音) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-red-600 text-white font-bold text-xs">
                    1
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">
                    1. Âm ngắt Sokuon (促音)
                  </h3>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  1 Phách (1 Mora)
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 px-2.5 py-1 text-xs font-semibold text-red-600">
                <Info className="size-3.5" />
                <span>Ký hiệu bằng chữ &quot;tsu&quot; nhỏ (っ / ッ)</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Quy tắc:</strong> Khi gặp <strong>っ</strong> đứng trước các phụ âm tắc <strong>k, s, t, p</strong>, ta giữ khẩu hình âm tiếp theo và nén hơi dừng lại đúng <strong>1 phách (Mora)</strong> rồi mới bật ra.
              </p>

              {/* Timing Diagram Box */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2">
                <div className="text-[11px] font-bold text-foreground">
                  Biểu đồ nhịp phách (Mora timing):
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-background p-2 border border-border/50">
                    <div className="font-extrabold text-foreground">き (ki)</div>
                    <div className="text-[10px] text-muted-foreground">Phách 1 • Bật âm</div>
                  </div>
                  <div className="rounded-lg bg-background p-2 border border-red-500/60 font-bold">
                    <div className="font-extrabold text-red-600">っ (pause)</div>
                    <div className="text-[10px] text-red-600/80 font-medium">Phách 2 • Nén hơi</div>
                  </div>
                  <div className="rounded-lg bg-background p-2 border border-border/50">
                    <div className="font-extrabold text-foreground">て (te)</div>
                    <div className="text-[10px] text-muted-foreground">Phách 3 • Bật mạnh</div>
                  </div>
                </div>
                <div className="text-right text-[10px] font-bold text-red-600">
                  3 Phách = 3 Nhịp gõ
                </div>
              </div>

              {/* Audio examples */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between rounded-xl bg-accent/40 p-2.5">
                  <AudioButton text="きって" label="きって [kitte] • Con tem" />
                  <span className="text-[11px] text-muted-foreground font-semibold">KHÁC: きて (kite) • HÃY ĐẾN</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-accent/40 p-2.5">
                  <AudioButton text="がっこう" label="がっこう [gakkou] • Trường học" />
                  <span className="text-[10px] text-muted-foreground font-mono">4 Phách: ga - k - ko - u</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rule 2: Trường âm Chōon (長音) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-red-600 text-white font-bold text-xs">
                    2
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">
                    2. Trường âm Chōon (長音)
                  </h3>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  2 Phách (2 Mora)
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Quy tắc:</strong> Độ dài quyết định ý nghĩa của từ. Trong Hiragana thêm nguyên âm cùng hàng (aa, ii, uu, ee/ei, oo/ou). Trong Katakana dùng dấu gạch ngang kéo dài <strong>ー</strong>.
              </p>

              {/* Pair Contrast Box */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2">
                <div className="text-[11px] font-bold text-foreground">Cặp từ đối kháng tương phản:</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-background rounded-lg p-2 border border-border/40">
                    <div>
                      <span className="font-bold text-foreground">おばさん</span>
                      <span className="text-muted-foreground text-[10px] ml-1">(Obasan - Cô/Bác)</span>
                    </div>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">2 phách</span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                    <div>
                      <span className="font-bold text-red-600">おばあさん</span>
                      <span className="text-muted-foreground text-[10px] ml-1">(Obaasan - Bà)</span>
                    </div>
                    <span className="rounded bg-red-100 dark:bg-red-950 text-red-600 px-1.5 py-0.5 text-[10px] font-mono font-bold">3 phách (1+2)</span>
                  </div>

                  <div className="flex items-center justify-between bg-background rounded-lg p-2 border border-border/40">
                    <div>
                      <span className="font-bold text-foreground">ビル</span>
                      <span className="text-muted-foreground text-[10px] ml-1">(Biru - Tòa nhà)</span>
                    </div>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">2 phách</span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                    <div>
                      <span className="font-bold text-red-600">ビール</span>
                      <span className="text-muted-foreground text-[10px] ml-1">(Bīru - Bia)</span>
                    </div>
                    <span className="rounded bg-red-100 dark:bg-red-950 text-red-600 px-1.5 py-0.5 text-[10px] font-mono font-bold">3 phách (1+2)</span>
                  </div>
                </div>
              </div>

              {/* Audio Listen Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[11px] font-bold text-muted-foreground">📌 Nghe thử phân biệt âm ngắn / trường âm:</span>
                <div className="grid grid-cols-2 gap-2">
                  <AudioButton text="ビル" label="1. Biru (2B)" variant="outline" className="justify-center" />
                  <AudioButton text="ビール" label="2. Bīru (3B)" variant="outline" className="justify-center" />
                </div>
              </div>
            </div>
          </div>

          {/* Rule 3: Âm mũi Hatsuon (撥音) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-red-600 text-white font-bold text-xs">
                    3
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">
                    3. Âm mũi Hatsuon (撥音)
                  </h3>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  3 Dạng /m/ /n/ /ng/
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Chữ <strong>&quot;ん&quot;</strong> duy nhất (ん / ン) không đứng độc lập mà thay đổi điểm tiếp xúc của vòm họng theo âm tiết đi ngay sau nó để tối ưu luồng hơi.
              </p>

              {/* 3 Form Rows */}
              <div className="space-y-2 text-xs">
                {/* Form /m/ */}
                <div className="flex items-center justify-between rounded-xl bg-accent/40 p-2.5 border border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">/m/</span>
                    <div>
                      <div className="font-bold text-foreground">Đọc thành [ m ] khi trước m, b, p</div>
                      <div className="text-[10px] text-muted-foreground">Hai môi khép chặt để đón âm tiếp theo</div>
                    </div>
                  </div>
                  <AudioButton text="さんぽ" label="さんぽ" subLabel="[sampo] • Đi dạo" variant="accent" />
                </div>

                {/* Form /n/ */}
                <div className="flex items-center justify-between rounded-xl bg-accent/40 p-2.5 border border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">/n/</span>
                    <div>
                      <div className="font-bold text-foreground">Đọc thành [ n ] khi trước n, t, d</div>
                      <div className="text-[10px] text-muted-foreground">Đầu lưỡi chạm ngạc cứng chặn hơi</div>
                    </div>
                  </div>
                  <AudioButton text="あんない" label="あんない" subLabel="[annai] • Hướng dẫn" variant="accent" />
                </div>

                {/* Form /ng/ */}
                <div className="flex items-center justify-between rounded-xl bg-accent/40 p-2.5 border border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">/ng/</span>
                    <div>
                      <div className="font-bold text-foreground">Đọc thành [ ng ] khi trước k, g hoặc cuối từ</div>
                      <div className="text-[10px] text-muted-foreground">Cuống lưỡi nâng cao chạm ngạc mềm</div>
                    </div>
                  </div>
                  <AudioButton text="まんが" label="まんが" subLabel="[manga] • Truyện tranh" variant="accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Rule 4: Nuốt nguyên âm (無声化) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-red-600 text-white font-bold text-xs">
                    4
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">
                    4. Nuốt nguyên âm (無声化)
                  </h3>
                </div>
                <span className="rounded-full bg-red-100 dark:bg-red-950 text-red-600 px-2.5 py-1 text-[11px] font-bold">
                  Âm Vô Thanh
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Quy tắc:</strong> Khi nguyên âm hẹp <strong>/i/</strong> hoặc <strong>/u/</strong> kẹp giữa các phụ âm vô thanh (<strong>k, s, t, h, p</strong>) hoặc đứng cuối câu, dây thanh không rung, tạo thành âm gió thì thầm.
              </p>

              {/* Practical Examples */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2.5">
                <div className="text-[11px] font-bold text-foreground">Ví dụ thực tế trong giao tiếp hàng ngày:</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-background rounded-lg p-2.5 border border-border/40">
                    <div>
                      <div className="font-bold text-foreground">です <span className="text-muted-foreground text-xs font-normal">thay vì đọc &quot;đề-sự&quot;</span></div>
                      <div className="text-[10px] text-muted-foreground">Âm /u/ tiêu biến → Phát âm chuẩn: <span className="font-bold text-red-600">[ des ]</span> (âm gió kết thúc)</div>
                    </div>
                    <AudioButton text="です" label="Listen" />
                  </div>

                  <div className="flex items-center justify-between bg-background rounded-lg p-2.5 border border-border/40">
                    <div>
                      <div className="font-bold text-foreground">すき (suki) • <span className="text-muted-foreground font-normal">Thích</span></div>
                      <div className="text-[10px] text-muted-foreground">/u/ nằm giữa &quot;s&quot; và &quot;k&quot; → Phát âm chuẩn: <span className="font-bold text-red-600">[ s_ki ]</span></div>
                    </div>
                    <AudioButton text="すき" label="Listen" />
                  </div>

                  <div className="flex items-center justify-between bg-background rounded-lg p-2.5 border border-border/40">
                    <div>
                      <div className="font-bold text-foreground">ひと (hito) • <span className="text-muted-foreground font-normal">Con người</span></div>
                      <div className="text-[10px] text-muted-foreground">/i/ nằm giữa &quot;h&quot; và &quot;t&quot; → Phát âm chuẩn: <span className="font-bold text-red-600">[ h_to ]</span></div>
                    </div>
                    <AudioButton text="ひと" label="Listen" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: SƠ NHẬP CAO ĐỘ ÂM ĐIỆU (TOKYO PITCH ACCENT) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600">
              NGỮ ĐIỆU CAO ĐỘ • TOKYO DIALECT
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              3. Sơ nhập Cao độ Âm điệu (Tokyo Pitch Accent 高低アクセント)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Tiếng Nhật không có dấu sắc/huyền/hỏi/ngã như tiếng Việt, nhưng có quy tắc Cao (High) và Thấp (Low) định hình bản sắc giọng nói Tokyo.
          </p>
        </div>

        {/* 4 Pitch Pattern Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pattern 1: Heiban */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">Mẫu 0 (Type 0)</span>
                <span className="font-extrabold text-xs text-foreground">平板</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground">Heiban (Bằng phẳng)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Âm đầu Thấp, các âm sau Cao và giữ nguyên khi kèm trợ từ (が/を).
              </p>

              {/* Pitch Line Diagram SVG */}
              <div className="my-3 rounded-xl bg-muted/40 p-3 flex items-center justify-center border border-border/40">
                <svg viewBox="0 0 160 50" className="w-full h-12">
                  <line x1="20" y1="35" x2="60" y2="15" stroke="#22c55e" strokeWidth="2.5" />
                  <line x1="60" y1="15" x2="140" y2="15" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="20" cy="35" r="5" fill="#22c55e" />
                  <circle cx="60" cy="15" r="5" fill="#22c55e" />
                  <circle cx="100" cy="15" r="5" fill="#22c55e" />
                  <circle cx="140" cy="15" r="5" fill="#22c55e" />
                </svg>
              </div>
              <div className="text-[11px] font-bold text-center text-foreground">
                ví dụ: <span className="text-red-600 font-extrabold">さくら [sa-KU-RA]</span>
                <div className="text-[10px] text-muted-foreground font-normal">Hoa anh đào</div>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="さくら" label="Nghe: さくら" className="w-full justify-center" />
            </div>
          </div>

          {/* Pattern 2: Atamadaka */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-red-100 dark:bg-red-950 text-red-600 px-2 py-0.5 text-[10px] font-bold">Mẫu 1 (Type 1)</span>
                <span className="font-extrabold text-xs text-red-600">頭高</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground">Atamadaka (Cao đầu)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Âm đầu tiên Cao, ngay lập tức rơi xuống Thấp ở tất cả các âm còn lại.
              </p>

              {/* Pitch Line Diagram SVG */}
              <div className="my-3 rounded-xl bg-muted/40 p-3 flex items-center justify-center border border-border/40">
                <svg viewBox="0 0 160 50" className="w-full h-12">
                  <line x1="20" y1="15" x2="60" y2="35" stroke="#ef4444" strokeWidth="2.5" />
                  <line x1="60" y1="35" x2="140" y2="35" stroke="#ef4444" strokeWidth="2.5" />
                  <circle cx="20" cy="15" r="5" fill="#ef4444" />
                  <circle cx="60" cy="35" r="5" fill="#ef4444" />
                  <circle cx="100" cy="35" r="5" fill="#ef4444" />
                  <circle cx="140" cy="35" r="5" fill="#ef4444" />
                </svg>
              </div>
              <div className="text-[11px] font-bold text-center text-foreground">
                ví dụ: <span className="text-red-600 font-extrabold">いのち [I-no-chi]</span>
                <div className="text-[10px] text-muted-foreground font-normal">Sinh mệnh, mạng sống</div>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="いのち" label="Nghe: いのち" className="w-full justify-center" />
            </div>
          </div>

          {/* Pattern 3: Nakadaka */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 px-2 py-0.5 text-[10px] font-bold">Mẫu 2/3 (Type 2/3)</span>
                <span className="font-extrabold text-xs text-amber-600">中高</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground">Nakadaka (Cao giữa)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Âm đầu Thấp, cao ở giữa từ rồi lại rơi xuống Thấp ở cuối.
              </p>

              {/* Pitch Line Diagram SVG */}
              <div className="my-3 rounded-xl bg-muted/40 p-3 flex items-center justify-center border border-border/40">
                <svg viewBox="0 0 160 50" className="w-full h-12">
                  <line x1="20" y1="35" x2="80" y2="15" stroke="#f59e0b" strokeWidth="2.5" />
                  <line x1="80" y1="15" x2="140" y2="35" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="20" cy="35" r="5" fill="#f59e0b" />
                  <circle cx="80" cy="15" r="5" fill="#f59e0b" />
                  <circle cx="140" cy="35" r="5" fill="#f59e0b" />
                </svg>
              </div>
              <div className="text-[11px] font-bold text-center text-foreground">
                ví dụ: <span className="text-red-600 font-extrabold">たまご [ta-MA-go]</span>
                <div className="text-[10px] text-muted-foreground font-normal">Quả trứng</div>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="たまご" label="Nghe: たまご" className="w-full justify-center" />
            </div>
          </div>

          {/* Pattern 4: Odaka */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 px-2 py-0.5 text-[10px] font-bold">Mẫu Aot (Type 尾)</span>
                <span className="font-extrabold text-xs text-purple-600">尾高</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground">Odaka (Cao ở đuôi)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Âm đầu Thấp, lên Cao dần đến âm cuối, nhưng sẽ <strong>tự xuống</strong> khi ghép trợ từ.
              </p>

              {/* Pitch Line Diagram SVG */}
              <div className="my-3 rounded-xl bg-muted/40 p-3 flex items-center justify-center border border-border/40">
                <svg viewBox="0 0 160 50" className="w-full h-12">
                  <line x1="20" y1="35" x2="60" y2="15" stroke="#a855f7" strokeWidth="2.5" />
                  <line x1="60" y1="15" x2="100" y2="15" stroke="#a855f7" strokeWidth="2.5" />
                  <line x1="100" y1="15" x2="140" y2="35" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3,3" />
                  <circle cx="20" cy="35" r="5" fill="#a855f7" />
                  <circle cx="60" cy="15" r="5" fill="#a855f7" />
                  <circle cx="100" cy="15" r="5" fill="#a855f7" />
                  <circle cx="140" cy="35" r="4" fill="none" stroke="#a855f7" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-[11px] font-bold text-center text-foreground">
                ví dụ: <span className="text-red-600 font-extrabold">おとこが [o-to-KO--ga↓]</span>
                <div className="text-[10px] text-muted-foreground font-normal">Người đàn ông (với ở &quot;ga&quot;)</div>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-border/40">
              <AudioButton text="おとこが" label="Nghe: おとこが" className="w-full justify-center" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PHÒNG THÍ NGHIỆM THÍNH GIÁC (PITCH ACCENT AUDIO LAB) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-5 rounded-2xl border-2 border-red-600/30 bg-card p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-red-600 animate-pulse" />
              <h3 className="font-extrabold text-lg text-foreground">
                Phòng thí nghiệm thính giác: Phân biệt Từ đồng âm dị nghĩa
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Bấm nghe và quan sát sự biến thiên cao độ làm đảo lộn hoàn toàn nghĩa của cùng một chữ Kana.
            </p>
          </div>
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shrink-0 self-start md:self-auto">
            2 Cặp Đối So Sánh
          </span>
        </div>

        {/* TEST BLOCK 1: はし (HASHI) */}
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-foreground tracking-tight">はし (Hashi)</span>
              <span className="text-xs text-muted-foreground font-medium">3 cao độ cho 3 ý nghĩa hoàn toàn khác nhau</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
              TOKYO PITCH TEST #1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hashi 1: Đũa */}
            <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="rounded bg-red-100 dark:bg-red-950 text-red-600 px-1.5 py-0.5">Type 1 頭高</span>
                  <span className="text-muted-foreground">[ HA - shi ]</span>
                </div>
                <div className="text-base font-extrabold text-foreground pt-1">
                  箸 <span className="text-xs font-bold text-red-600">(Đũa ăn)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Cao ở âm [ha], hạ thấp đột ngột ở âm [shi].
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground pt-1">
                  <span className="text-red-600 font-bold">• Cao</span>
                  <span>→</span>
                  <span>• Thấp</span>
                </div>
              </div>
              <AudioButton text="箸" label="Nghe: Đũa (箸)" variant="outline" className="w-full justify-center mt-2" />
            </div>

            {/* Hashi 2: Cây cầu */}
            <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="rounded bg-amber-100 dark:bg-amber-950 text-amber-600 px-1.5 py-0.5">Type 2 中高</span>
                  <span className="text-muted-foreground">[ ha - SHI (ga↓) ]</span>
                </div>
                <div className="text-base font-extrabold text-foreground pt-1">
                  橋 <span className="text-xs font-bold text-amber-600">(Cây cầu)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Thấp ở âm [ha], cao ở âm [shi], rơi khi thêm trợ từ.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground pt-1">
                  <span>• Thấp</span>
                  <span>→</span>
                  <span className="text-amber-600 font-bold">• Cao (rơi)</span>
                </div>
              </div>
              <AudioButton text="橋" label="Nghe: Cây cầu (橋)" variant="outline" className="w-full justify-center mt-2" />
            </div>

            {/* Hashi 3: Mép/Rìa */}
            <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="rounded bg-blue-100 dark:bg-blue-950 text-blue-600 px-1.5 py-0.5">Type 0 平板</span>
                  <span className="text-muted-foreground">[ ha - SHI (ga) ]</span>
                </div>
                <div className="text-base font-extrabold text-foreground pt-1">
                  端 <span className="text-xs font-bold text-blue-600">(Mép/Rìa đường)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Thấp ở âm [ha], lên cao ở [shi] và giữ nguyên khi kèm trợ từ.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground pt-1">
                  <span>• Thấp</span>
                  <span>→</span>
                  <span className="text-blue-600 font-bold">• Cao (bằng)</span>
                </div>
              </div>
              <AudioButton text="端" label="Nghe: Mép/Rìa (端)" variant="outline" className="w-full justify-center mt-2" />
            </div>
          </div>
        </div>

        {/* TEST BLOCK 2: あめ (AME) */}
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-foreground tracking-tight">あめ (Ame)</span>
              <span className="text-xs text-muted-foreground font-medium">Cặp từ dễ gây nhầm lẫn kinh điển nhất cho người mới bắt đầu</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
              TOKYO PITCH TEST #2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ame 1: Mưa */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded bg-red-100 dark:bg-red-950 text-red-600 px-2 py-0.5 text-[10px] font-bold">
                  Type 1 [ A-me ]
                </div>
                <div className="text-base font-extrabold text-foreground">
                  雨 <span className="text-xs font-bold text-red-600">(Mưa)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs">
                  Âm [A] nhấn cao, âm [me] rơi nhẹ. Thường gặp trong: &quot;Trời đang mưa&quot;.
                </p>
              </div>
              <AudioButton text="雨" label="Nghe (雨)" variant="outline" className="shrink-0" />
            </div>

            {/* Ame 2: Kẹo */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 px-2 py-0.5 text-[10px] font-bold">
                  Type 0 [ a-ME ]
                </div>
                <div className="text-base font-extrabold text-foreground">
                  飴 <span className="text-xs font-bold text-blue-600">(Kẹo ngọt)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs">
                  Âm [a] trầm thấp, âm [me] thanh thoát dâng cao. Thường gặp: &quot;Ăn kẹo&quot;.
                </p>
              </div>
              <AudioButton text="飴" label="Nghe (飴)" variant="outline" className="shrink-0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
