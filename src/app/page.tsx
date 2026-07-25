"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  MessageSquare,
  PenTool,
  Sparkles,
  Table,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { speakJapanese } from "@/lib/speech";
import { getKanaById, kanaList, randomKana } from "@/lib/kana";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { t } = useLanguage();
  const [featuredKana, setFeaturedKana] = useState(
    () => getKanaById("hiragana-a-3042") || kanaList[0]
  );



  const modules = [
    {
      href: "/kana",
      title: t("mod_learn_title"),
      kicker: "あ ア",
      icon: BookOpen,
      badge: t("mod_learn_badge"),
      description: t("mod_learn_desc"),
    },
    {
      href: "/vocabulary",
      title: t("mod_vocab_title"),
      kicker: "単語",
      icon: Table,
      badge: t("mod_vocab_badge"),
      description: t("mod_vocab_desc"),
    },
    {
      href: "/phrases",
      title: t("mod_phrases_title"),
      kicker: "会話",
      icon: MessageSquare,
      badge: t("mod_phrases_badge"),
      description: t("mod_phrases_desc"),
    },
    {
      href: "/practice",
      title: t("mod_practice_title"),
      kicker: "手書き",
      icon: PenTool,
      badge: t("mod_practice_badge"),
      description: t("mod_practice_desc"),
    },
    {
      href: "/quiz",
      title: t("mod_quiz_title"),
      kicker: "テスト",
      icon: HelpCircle,
      badge: t("mod_quiz_badge"),
      description: t("mod_quiz_desc"),
    },
  ];


  const highlights = [
    {
      title: t("hl_kana_title"),
      description: t("hl_kana_desc"),
    },
    {
      title: t("hl_vocab_title"),
      description: t("hl_vocab_desc"),
    },
    {
      title: t("hl_modes_title"),
      description: t("hl_modes_desc"),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12 lg:gap-16 lg:py-16">
      {/* Hero Section */}
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
            <Sparkles className="size-3.5 text-primary" />
            <span>{t("hero_badge")}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("hero_title")}
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            {t("hero_subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              render={<Link href="/kana" />}
              nativeButton={false}
              size="lg"
              className="gap-2 font-semibold"
            >
              {t("hero_btn_explore")}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/practice" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="gap-2 font-semibold"
            >
              <FileText className="size-4" />
              {t("hero_btn_paper")}
            </Button>
          </div>
        </div>

        {/* Interactive Character Spotlight Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/60 p-6 shadow-2xs backdrop-blur-xs text-center transition-all hover:border-primary/50">
            <div className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground">
              <span className="uppercase tracking-wider">{t("spotlight_title")}</span>
              <button
                type="button"
                onClick={() => setFeaturedKana(randomKana())}
                className="text-xs text-primary hover:underline"
              >
                {t("spotlight_shuffle")}
              </button>
            </div>

            <span className="text-6xl font-medium tracking-tight py-2">
              {featuredKana.char}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold uppercase tracking-wider text-foreground">
                {featuredKana.romaji}
              </span>
              <button
                type="button"
                onClick={() => speakJapanese(featuredKana.char)}
                className="rounded-full border bg-background p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={`Pronounce ${featuredKana.char}`}
              >
                <Volume2 className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-2 py-0.5 font-medium uppercase">
                {featuredKana.script}
              </span>
              <span>•</span>
              <span>{featuredKana.strokeCount} {t("spotlight_stroke")}</span>
            </div>

            <Button
              render={<Link href={`/kana/${featuredKana.id}`} />}
              nativeButton={false}
              variant="secondary"
              size="sm"
              className="w-full mt-2"
            >
              {t("spotlight_btn_view")}
            </Button>
          </div>
        </div>
      </div>

      {/* Core Learning Modules */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("modules_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("modules_subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="group">
                <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-md">
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl border bg-accent/50 p-2.5 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {m.badge}
                      </span>
                    </div>

                    <CardTitle className="mt-2 text-lg font-bold group-hover:text-primary">
                      {m.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {m.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-2xs">
        <div className="grid gap-6 sm:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <h3 className="text-sm font-bold tracking-tight">{h.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                {h.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


