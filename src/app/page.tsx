"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Folder,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  PenTool,
  Presentation,
  Volume2,
  Edit3,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StrokeOrderSvg } from "@/components/kana/stroke-order-svg";
import { speakJapanese } from "@/lib/speech";
import { getKanaById, kanaList, randomKana, type Kana } from "@/lib/kana";
import { useLanguage } from "@/lib/language-context";
import { VisitCounter } from "@/components/visit-counter";

const VOWEL_IDS = [
  "hiragana-a-3042",
  "hiragana-i-3044",
  "hiragana-u-3046",
  "hiragana-e-3048",
  "hiragana-o-304a",
];

export default function Home() {
  const { language, t } = useLanguage();
  const isVi = language === "vi";
  const [replayKey, setReplayKey] = useState(0);

  const vowelKanaList = VOWEL_IDS.map((id) => getKanaById(id)).filter(
    Boolean
  ) as Kana[];

  const [featuredKana, setFeaturedKana] = useState<Kana>(
    () => vowelKanaList[0] || getKanaById("hiragana-a-3042") || kanaList[0]
  );

  const modules = [
    {
      href: "/kana",
      title: t("mod_learn_title"),
      icon: LayoutGrid,
      iconColor: "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
      badge: t("mod_learn_badge"),
      description: t("mod_learn_desc"),
      tag: t("mod_tag_kana"),
    },
    {
      href: "/theory",
      title: t("mod_theory_title"),
      icon: BookOpen,
      iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
      badge: t("mod_theory_badge"),
      description: t("mod_theory_desc"),
      tag: t("mod_tag_theory"),
    },
    {
      href: "/vocabulary",
      title: t("mod_vocab_title"),
      icon: Folder,
      iconColor: "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
      badge: t("mod_vocab_badge"),
      description: t("mod_vocab_desc"),
      tag: t("mod_tag_vocab"),
    },
    {
      href: "/phrases",
      title: t("mod_phrases_title"),
      icon: MessageSquare,
      iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      badge: t("mod_phrases_badge"),
      description: t("mod_phrases_desc"),
      tag: t("mod_tag_phrases"),
    },
    {
      href: "/practice",
      title: t("mod_practice_title"),
      icon: PenTool,
      iconColor: "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
      badge: t("mod_practice_badge"),
      description: t("mod_practice_desc"),
      tag: t("mod_tag_practice"),
    },
    {
      href: "/slides",
      title: isVi ? "Slide Bài Giảng" : "Presentation Slides",
      icon: Presentation,
      iconColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
      badge: "Google Slides",
      description: isVi
        ? "Browse interactive Google Slides presentations, lecture decks, and comprehensive classroom course materials designed for educators and self-learners."
        : "Browse interactive Google Slides presentations, lecture decks, and comprehensive classroom course materials designed for educators and self-learners.",
      tag: t("mod_tag_slides"),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12 lg:gap-14 lg:py-14">
      {/* Hero Section */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Hero Left Column */}
        <div className="flex flex-col items-start gap-5 lg:col-span-7">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-red-50/80 px-3.5 py-1 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            <span>{t("hero_badge")}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
            {isVi ? (
              <>
                Làm chủ Kana &amp; Từ vựng với{" "}
                <span className="text-red-600">Sự Tự Tin</span>
              </>
            ) : (
              <>
                Master Japanese Kana &amp; Vocabulary with{" "}
                <span className="text-red-600">Confidence</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg max-w-xl">
            {t("hero_subtitle")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              render={<Link href="/kana" />}
              nativeButton={false}
              size="lg"
              className="gap-2 bg-red-600 text-white font-semibold hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 px-6 rounded-lg shadow-sm"
            >
              {t("hero_btn_explore")}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/practice" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="gap-2 font-semibold border-border/80 bg-background hover:bg-accent text-foreground px-5 rounded-lg"
            >
              <FileText className="size-4 text-muted-foreground" />
              {t("hero_btn_paper")}
            </Button>
          </div>

          {/* 3 Bullet Checklist */}
          <div className="grid gap-2.5 pt-4 text-xs sm:text-sm text-foreground/90 font-medium sm:grid-cols-3 w-full">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-red-600 shrink-0 stroke-[2.5]" />
              <span>{t("hero_check_kana")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-red-600 shrink-0 stroke-[2.5]" />
              <span>{t("hero_check_vocab")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-red-600 shrink-0 stroke-[2.5]" />
              <span>{t("hero_check_dual")}</span>
            </div>
          </div>
        </div>

        {/* Hero Right Column: Interactive Spotlight Kana Card */}
        <div className="w-full lg:col-span-5">
          <div className="flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:shadow-md">
            {/* Card Header Bar */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                <span>{t("spotlight_title")}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturedKana(randomKana())}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
              >
                {t("spotlight_shuffle")}
              </button>
            </div>

            {/* Character & Stroke Order Preview Grid */}
            <div className="grid grid-cols-2 items-center gap-4 py-5">
              {/* Character Details Left */}
              <div className="flex flex-col items-start gap-2 pl-2">
                <span className="text-6xl font-extrabold tracking-tight text-foreground">
                  {featuredKana.char}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-foreground">
                    /{featuredKana.romaji}/
                  </span>
                  <button
                    type="button"
                    onClick={() => speakJapanese(featuredKana.char)}
                    className="rounded-full border border-border/60 bg-background p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 cursor-pointer"
                    aria-label={`Pronounce ${featuredKana.char}`}
                  >
                    <Volume2 className="size-4" />
                  </button>
                </div>

                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <span>{featuredKana.script}</span>
                  <span>•</span>
                  <span>
                    {featuredKana.strokeCount} {t("spotlight_stroke")}
                  </span>
                </div>
              </div>

              {/* Stroke SVG Diagram Box Right */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200/80 bg-red-50/20 dark:border-red-900/40 dark:bg-red-950/10 p-3 relative h-36">
                <button
                  type="button"
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="absolute top-2 right-2 p-1.5 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-100/60 dark:hover:bg-red-950 transition-colors cursor-pointer"
                  title={t("detail_replay_strokes")}
                  aria-label={t("detail_replay_strokes")}
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <div className="w-20 h-20 flex items-center justify-center text-foreground">
                  <StrokeOrderSvg
                    kana={featuredKana}
                    className="w-18 h-18"
                    showNumbers={true}
                    hideReplayButton={true}
                    externalPlayKey={replayKey}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono mt-1">
                  Stroke 1 → {featuredKana.strokeCount}
                </span>
              </div>
            </div>

            {/* Red Action CTA Button */}
            <Button
              render={<Link href={`/kana/${featuredKana.id}`} />}
              nativeButton={false}
              size="default"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg gap-2"
            >
              <Edit3 className="size-4" />
              <span>{t("spotlight_btn_view")}</span>
            </Button>

            {/* Bottom Vowel Row Selector [A-I-U-E-O] */}
            <div className="mt-5 pt-4 border-t border-border/40 flex flex-col gap-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center sm:text-left">
                {t("vowel_row_label")}
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {vowelKanaList.map((vk) => {
                  const isSelected = vk.id === featuredKana.id;
                  return (
                    <button
                      key={vk.id}
                      type="button"
                      onClick={() => setFeaturedKana(vk)}
                      className={`flex flex-col items-center justify-center py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "border-red-600 bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold shadow-2xs"
                          : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="text-base leading-none">{vk.char}</span>
                      <span className="text-[10px] opacity-75 leading-tight uppercase font-mono mt-0.5">
                        {vk.romaji}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Curriculum & Learning Modules Section */}
      <div className="flex flex-col gap-6 pt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
              <LayoutGrid className="size-3.5 text-red-600" />
              <span>{t("modules_curriculum_badge")}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {t("modules_title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("modules_subtitle")}
            </p>
          </div>

          <Link
            href="/kana"
            className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors shrink-0"
          >
            <span>{t("modules_explore_all")}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* 6 Cards Grid (3 Columns x 2 Rows) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="group">
                <div className="flex flex-col justify-between h-full rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-red-500/60 hover:shadow-md">
                  <div className="flex flex-col gap-3">
                    {/* Top Row: Icon Container & Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${m.iconColor}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-full bg-muted border border-border/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {m.badge}
                      </span>
                    </div>

                    {/* Module Title */}
                    <h3 className="mt-1 text-lg font-bold text-foreground group-hover:text-red-600 transition-colors">
                      {m.title}
                    </h3>

                    {/* Module Description */}
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {m.description}
                    </p>
                  </div>

                  {/* Sub-tag Footer Line */}
                  <div className="mt-5 pt-3 border-t border-border/40 text-[11px] font-medium text-muted-foreground">
                    {m.tag}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* History & Evolution of Japanese Language Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-red-50/50 via-stone-50 to-stone-100/60 dark:from-red-950/20 dark:via-stone-900/40 dark:to-stone-900/60 p-6 sm:p-8 shadow-2xs transition-all hover:border-red-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200/80 bg-red-50 px-3 py-0.5 text-xs font-bold text-red-700 dark:border-red-900/40 dark:bg-red-950/60 dark:text-red-300 w-fit">
              <GraduationCap className="size-3.5 text-red-600" />
              <span>{isVi ? "Lịch Sử Ngôn Ngữ" : "Language History"}</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {isVi
                ? "Lịch Sử & Sự Phát Triển Của Tiếng Nhật"
                : "History & Evolution of the Japanese Language"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isVi
                ? "Khám phá hành trình độc đáo từ ngôn ngữ Yamato cổ đại đến sự ra đời của Kanji, Hiragana và Katakana. Hiểu vì sao tiếng Nhật hiện đại sử dụng 3 hệ thống chữ viết."
                : "Discover the unique journey from ancient spoken Yamato language to the creation of Kanji, Hiragana, and Katakana. Understand why modern Japanese utilizes three distinct writing systems."}
            </p>
          </div>

          <Button
            render={<Link href="/history" />}
            nativeButton={false}
            size="lg"
            className="gap-2 font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shrink-0 rounded-lg px-5 shadow-sm"
          >
            <span>{isVi ? "Khám phá lịch sử" : "Explore History"}</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Japanese Watermark Character "和" */}
        <div className="absolute right-4 bottom-[-20px] sm:right-8 sm:bottom-[-30px] text-red-950/10 dark:text-red-300/10 font-serif text-9xl sm:text-[140px] font-bold select-none pointer-events-none z-0">
          和
        </div>
      </div>

      {/* Website Status & Visit Counter */}
      <VisitCounter variant="card" />

      {/* Sub-footer Line */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground">
        <div className="font-semibold text-foreground">
          仮名道場 <span className="font-normal text-muted-foreground">— Master Japanese Kana &amp; Vocabulary</span>
        </div>
        <div>
          © 2025 Kana Dojo. {t("footer_tagline")}
        </div>
      </div>
    </div>
  );
}
