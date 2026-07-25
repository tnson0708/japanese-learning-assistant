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
  randomWordByDifficulty,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS,
  type WordDifficulty,
} from "@/lib/words";
import { cn } from "@/lib/utils";

type Scope = Script | "both";
type ContentType = "character" | "word";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

const SECTION_OPTIONS: { value: KanaSection; label: string }[] = [
  { value: "all", label: "All" },
  { value: "main", label: "Main (五十音)" },
  { value: "dakuten", label: "Dakuten (濁音)" },
  { value: "youon", label: "Youon (拗音)" },
];

const DIRECTION_OPTIONS: { value: PaperDirection; label: string }[] = [
  { value: "write", label: "Write (romaji → kana)" },
  { value: "read", label: "Read (kana → romaji)" },
];

const CONTENT_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "character", label: "Character" },
  { value: "word", label: "Word" },
];

const DIFFICULTY_OPTIONS: { value: WordDifficulty; label: string }[] = WORD_DIFFICULTIES.map(
  (d) => ({ value: d, label: WORD_DIFFICULTY_LABELS[d] })
);

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
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Practice
        </h1>
        <p className="text-sm text-muted-foreground">
          Train your handwriting digitally with stroke recognition, or step away from the screen for timed paper drills.
        </p>
      </div>

      {/* Practice Mode Selector */}
      <Tabs defaultValue="paper">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="paper" className="flex items-center gap-2">
            <FileText className="size-4" />
            <span>Paper Drill</span>
          </TabsTrigger>
          <TabsTrigger value="handwriting" className="flex items-center gap-2">
            <PenTool className="size-4" />
            <span>Handwriting</span>
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
  const [started, setStarted] = useState(false);
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [sessionKey, setSessionKey] = useState(0);

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  const [startKana, setStartKana] = useState(() => randomKana(scope, section));

  if (!started) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Handwriting Practice Setup</h2>
          <p className="text-sm text-muted-foreground">
            Draw characters on screen using stroke recognition. Practice copying stroke shapes or recalling them from memory.
          </p>
        </div>

        {/* Script Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Script
          </span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} size="sm" />
        </div>

        {/* Section Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              {poolCount} characters in pool
            </span>
          </div>
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <OptionGroup
              options={SECTION_OPTIONS}
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
          Start Handwriting Practice
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
        ← Change Settings
      </button>

      <PracticeSession key={sessionKey} initialKana={startKana} scope={scope} section={section} />
    </div>
  );
}

function PaperPanel() {
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

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">Paper Practice Setup</h2>
          <p className="text-sm text-muted-foreground">
            A prompt flashes on screen, then hides — write or read it on real paper before the reveal checks your answer.
          </p>
        </div>

        {/* Content Type */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Content
          </span>
          <OptionGroup
            options={CONTENT_OPTIONS}
            value={contentType}
            onChange={setContentType}
            size="sm"
          />
        </div>

        {/* Script Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Script
          </span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} size="sm" />
        </div>

        {/* Kana Section (only when Content is Character) */}
        {contentType === "character" && (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kana Section
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                {poolCount} characters in pool
              </span>
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <OptionGroup
                options={SECTION_OPTIONS}
                value={section}
                onChange={setSection}
                size="sm"
                className="flex-nowrap"
              />
            </div>
          </div>
        )}

        {/* Word Level (only when Content is Word) */}
        {contentType === "word" && (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Word Level
            </span>
            <OptionGroup options={DIFFICULTY_OPTIONS} value={difficulty} onChange={setDifficulty} size="sm" />
          </div>
        )}


        {/* Direction */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Direction
          </span>
          <OptionGroup
            options={DIRECTION_OPTIONS}
            value={direction}
            onChange={setDirection}
            size="sm"
          />
        </div>

        {/* Prompt Time */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Prompt Display Time
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <OptionGroup
              options={PROMPT_SECONDS_OPTIONS.map((s) => ({
                value: s,
                label: `${s}s`,
              }))}
              value={promptSeconds}
              onChange={setPromptSeconds}
              size="sm"
            />
            <CustomSecondsInput value={promptSeconds} onChange={setPromptSeconds} />
          </div>
        </div>

        {/* Reveal Time */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Check Answer Time
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <OptionGroup
              options={REVEAL_SECONDS_OPTIONS.map((s) => ({
                value: s,
                label: `${s}s`,
              }))}
              value={revealSeconds}
              onChange={setRevealSeconds}
              size="sm"
            />
            <CustomSecondsInput value={revealSeconds} onChange={setRevealSeconds} />
          </div>
        </div>

        {/* Audio Option */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pronunciation
          </span>
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
            Auto-play pronunciation on check
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
          Start Paper Practice
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
        ← Change Settings
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

function CustomSecondsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
      Custom
      <input
        type="number"
        min={1}
        max={60}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n) && n > 0) onChange(Math.min(60, n));
        }}
        className="w-14 rounded-md border bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      s
    </label>
  );
}

