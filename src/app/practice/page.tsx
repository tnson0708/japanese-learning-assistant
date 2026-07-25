"use client";

import { useMemo, useState } from "react";
import { Volume2, VolumeX, PenTool, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeSession } from "@/components/practice/practice-session";
import {
  PaperPracticeSession,
  type PaperDirection,
  type PaperItem,
} from "@/components/practice/paper-practice-session";
import {
  filterKana,
  randomKana,
  type KanaSection,
  type Script,
} from "@/lib/kana";
import {
  getWordsByDifficulty,
  randomWordByDifficulty,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS_BILINGUAL,
  type WordDifficulty,
} from "@/lib/words";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type Scope = Script | "both";
type ContentType = "character" | "word";

const PROMPT_SECONDS_OPTIONS = [3, 5, 8, 10];
const REVEAL_SECONDS_OPTIONS = [2, 3, 5];

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
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {t("practice_title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("practice_subtitle")}
        </p>
      </div>

      {/* Practice Mode Selector */}
      <Tabs defaultValue="paper">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="paper" className="flex items-center gap-2 font-semibold">
            <FileText className="size-4" />
            <span>{t("practice_tab_paper")}</span>
          </TabsTrigger>
          <TabsTrigger value="handwriting" className="flex items-center gap-2 font-semibold">
            <PenTool className="size-4" />
            <span>{t("practice_tab_handwriting")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paper" className="mt-6">
          <PaperPanel />
        </TabsContent>
        <TabsContent value="handwriting" className="mt-6">
          <HandwritingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HandwritingPanel() {
  const { t } = useLanguage();
  const [started, setStarted] = useState(false);
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [sessionKey, setSessionKey] = useState(0);

  const scopeOptions: { value: Scope; label: string }[] = [
    { value: "hiragana", label: "Hiragana" },
    { value: "katakana", label: "Katakana" },
    { value: "both", label: "Both" },
  ];

  const sectionOptions: { value: KanaSection; label: string }[] = [
    { value: "all", label: t("practice_sec_all") },
    { value: "main", label: t("practice_sec_main") },
    { value: "dakuten", label: t("practice_sec_dakuten") },
    { value: "youon", label: t("practice_sec_youon") },
  ];

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  const [startKana, setStartKana] = useState(() => randomKana(scope, section));

  if (!started) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">{t("mod_practice_title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("mod_practice_desc")}
          </p>
        </div>

        {/* Script Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("practice_script")}
          </span>
          <OptionGroup options={scopeOptions} value={scope} onChange={setScope} size="sm" />
        </div>

        {/* Section Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("practice_section")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              {poolCount} {t("practice_pool_count")}
            </span>
          </div>
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <OptionGroup
              options={sectionOptions}
              value={section}
              onChange={setSection}
              size="sm"
              className="flex-nowrap"
            />
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setStartKana(randomKana(scope, section));
            setSessionKey((k) => k + 1);
            setStarted(true);
          }}
          className="mt-2 w-full text-base font-semibold"
        >
          {t("practice_btn_start_digital")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <button
        type="button"
        onClick={() => setStarted(false)}
        className="self-start text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Exit Practice
      </button>

      <PracticeSession key={sessionKey} initialKana={startKana} scope={scope} section={section} />
    </div>
  );
}

function PaperPanel() {
  const { t, language } = useLanguage();
  const [started, setStarted] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("character");
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [difficulty, setDifficulty] = useState<WordDifficulty>("easy");
  const [direction, setDirection] = useState<PaperDirection>("write");
  const [promptSeconds, setPromptSeconds] = useState(5);
  const [revealSeconds, setRevealSeconds] = useState(3);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [sessionKey, setSessionKey] = useState(0);

  const scopeOptions: { value: Scope; label: string }[] = [
    { value: "hiragana", label: "Hiragana" },
    { value: "katakana", label: "Katakana" },
    { value: "both", label: "Both" },
  ];

  const sectionOptions: { value: KanaSection; label: string }[] = [
    { value: "all", label: t("practice_sec_all") },
    { value: "main", label: t("practice_sec_main") },
    { value: "dakuten", label: t("practice_sec_dakuten") },
    { value: "youon", label: t("practice_sec_youon") },
  ];

  const contentOptions: { value: ContentType; label: string }[] = [
    { value: "character", label: t("practice_content_kana") },
    { value: "word", label: t("practice_content_words") },
  ];

  const difficultyOptions: { value: WordDifficulty; label: string }[] =
    WORD_DIFFICULTIES.map((d) => ({
      value: d,
      label: WORD_DIFFICULTY_LABELS_BILINGUAL[language][d],
    }));

  const directionOptions: { value: PaperDirection; label: string }[] = [
    { value: "write", label: `${t("practice_title")} (romaji → kana)` },
    { value: "read", label: `${t("nav_learn")} (kana → romaji)` },
  ];

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  const wordPoolCount = useMemo(
    () => getWordsByDifficulty(difficulty, scope).length,
    [difficulty, scope]
  );

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("practice_tab_paper")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("paper_ready_desc")}
          </p>
        </div>

        {/* Content Type */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("practice_content")}
          </span>
          <OptionGroup
            options={contentOptions}
            value={contentType}
            onChange={setContentType}
            size="sm"
          />
        </div>

        {/* Script Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("practice_script")}
          </span>
          <OptionGroup options={scopeOptions} value={scope} onChange={setScope} size="sm" />
        </div>

        {/* Kana Section */}
        {contentType === "character" && (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("practice_section")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                {poolCount} {t("practice_pool_count")}
              </span>
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <OptionGroup
                options={sectionOptions}
                value={section}
                onChange={setSection}
                size="sm"
                className="flex-nowrap"
              />
            </div>
          </div>
        )}

        {/* Word Level */}
        {contentType === "word" && (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("practice_difficulty")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                {wordPoolCount} {t("practice_word_pool_count")}
              </span>
            </div>
            <OptionGroup options={difficultyOptions} value={difficulty} onChange={setDifficulty} size="sm" />
          </div>
        )}

        {/* Direction */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("quiz_direction")}
          </span>
          <OptionGroup
            options={directionOptions}
            value={direction}
            onChange={setDirection}
            size="sm"
          />
        </div>

        {/* Audio Option */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <button
            type="button"
            onClick={() => setAutoPlayAudio((v) => !v)}
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              autoPlayAudio
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            )}
          >
            {autoPlayAudio ? (
              <Volume2 className="size-3.5" />
            ) : (
              <VolumeX className="size-3.5" />
            )}
            Auto-play pronunciation
          </button>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setSessionKey((k) => k + 1);
            setStarted(true);
          }}
          className="mt-2 w-full text-base font-semibold lg:col-span-2"
        >
          {t("practice_btn_start_paper")}
        </Button>
      </div>
    );
  }

  const pickNext = (excludeId: string) =>
    contentType === "character"
      ? pickNextKana(scope, section, excludeId)
      : pickNextWord(difficulty, scope, excludeId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 lg:max-w-lg">
      <button
        type="button"
        onClick={() => setStarted(false)}
        className="self-start text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Exit Practice
      </button>

      <PaperPracticeSession
        key={sessionKey}
        direction={direction}
        promptSeconds={promptSeconds}
        revealSeconds={revealSeconds}
        autoPlayAudio={autoPlayAudio}
        pickNext={pickNext}
        onEnd={() => setStarted(false)}
      />
    </div>
  );
}


