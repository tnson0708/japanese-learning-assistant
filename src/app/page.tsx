"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
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
import { randomKana } from "@/lib/kana";

const MODULES = [
  {
    href: "/kana",
    title: "Learn Kana",
    kicker: "あ ア",
    icon: BookOpen,
    badge: "104 Characters",
    description:
      "Explore Hiragana & Katakana charts in 5-column Gojūon grids with animated stroke order and audio pronunciation.",
  },
  {
    href: "/vocabulary",
    title: "Vocabulary Table",
    kicker: "単語",
    icon: Table,
    badge: "2,500+ Words",
    description:
      "Study categorized vocabulary words across 4 difficulty levels (Easy, Medium, Advanced, Native) with Kanji, Romaji, and notes.",
  },
  {
    href: "/practice",
    title: "Practice Writing",
    kicker: "手書き",
    icon: PenTool,
    badge: "2 Modes",
    description:
      "Score your handwriting digitally with stroke recognition, or step away from the screen for timed paper drills.",
  },
  {
    href: "/quiz",
    title: "Quiz Yourself",
    kicker: "テスト",
    icon: HelpCircle,
    badge: "Multiple-Choice",
    description:
      "Test Kana & Romaji recognition with customizable drills, instant feedback, and session score tracking.",
  },
];

const HIGHLIGHTS = [
  {
    title: "104 Kana Characters",
    description: "Complete Gojūon, Dakuten & Youon (拗音) charts for Hiragana and Katakana.",
  },
  {
    title: "2,500+ Categorized Words",
    description: "Vocabulary organized into Easy, Medium, Advanced, and Native levels with Kanji.",
  },
  {
    title: "Dual Practice Modes",
    description: "Digital stroke recognition matching + timed off-screen paper drills.",
  },
];

export default function Home() {
  const [featuredKana, setFeaturedKana] = useState(() => randomKana("hiragana"));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12 lg:gap-16 lg:py-16">
      {/* Hero Section */}
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
            <Sparkles className="size-3.5 text-primary" />
            <span>仮名道場 • Master Japanese Kana & Vocabulary</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Master Japanese Kana & Vocabulary with Confidence
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            A focused learning suite for Hiragana, Katakana, and Japanese vocabulary — browse Gojūon grids, train handwriting with stroke recognition, run paper drills, and study categorized words.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              render={<Link href="/kana" />}
              nativeButton={false}
              size="lg"
              className="gap-2 font-semibold"
            >
              Explore Kana Charts
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
              Start Paper Drill
            </Button>
          </div>
        </div>

        {/* Interactive Character Spotlight Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/60 p-6 shadow-2xs backdrop-blur-xs text-center transition-all hover:border-primary/50">
            <div className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground">
              <span className="uppercase tracking-wider">Spotlight Kana</span>
              <button
                type="button"
                onClick={() => setFeaturedKana(randomKana())}
                className="text-xs text-primary hover:underline"
              >
                Shuffle 🎲
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
              <span>{featuredKana.strokeCount} strokes</span>
            </div>

            <Button
              render={<Link href={`/kana/${featuredKana.id}`} />}
              nativeButton={false}
              variant="secondary"
              size="sm"
              className="w-full mt-2"
            >
              View Stroke Order
            </Button>

          </div>
        </div>
      </div>

      {/* Core Learning Modules */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Learning Modules
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick a module to start learning, practicing, or testing your knowledge.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {MODULES.map((m) => {
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
          {HIGHLIGHTS.map((h) => (
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

