"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeSession } from "@/components/practice/practice-session";
import {
  PaperPracticeSession,
  type PaperDirection,
  type PaperItem,
} from "@/components/practice/paper-practice-session";
import { randomKana, type Script } from "@/lib/kana";
import {
  JLPT_LEVELS,
  JLPT_LEVEL_LABELS,
  randomWord,
  type JlptLevel,
} from "@/lib/words";
import { cn } from "@/lib/utils";

type Scope = Script | "both";
type ContentType = "character" | "word";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

const DIRECTION_OPTIONS: { value: PaperDirection; label: string }[] = [
  { value: "write", label: "Write (romaji → kana)" },
  { value: "read", label: "Read (kana → romaji)" },
];

const CONTENT_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "character", label: "Character" },
  { value: "word", label: "Word" },
];

const LEVEL_OPTIONS: { value: JlptLevel; label: string }[] = JLPT_LEVELS.map(
  (level) => ({ value: level, label: JLPT_LEVEL_LABELS[level] })
);

const PROMPT_SECONDS_OPTIONS = [3, 5, 8, 10];
const REVEAL_SECONDS_OPTIONS = [2, 3, 5];

function pickNextKana(scope: Scope, excludeId: string): PaperItem {
  let candidate = randomKana(scope);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomKana(scope);
  }
  return candidate;
}

function pickNextWord(
  level: JlptLevel,
  scope: Scope,
  excludeId: string
): PaperItem {
  let candidate = randomWord(level, scope);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomWord(level, scope);
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
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
        <p className="text-sm text-muted-foreground">
          Drill your kana digitally, or step away from the screen and write on
          paper.
        </p>
      </div>

      <Tabs defaultValue="paper">
        <TabsList className="w-full">
          <TabsTrigger value="paper">Paper</TabsTrigger>
          <TabsTrigger value="handwriting">Handwriting</TabsTrigger>
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
  const [sessionKey, setSessionKey] = useState(0);
  const [startKana, setStartKana] = useState(() => randomKana("hiragana"));

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Write with your finger, mouse, or Apple Pencil. Your attempt is
          scored against the correct stroke shapes.
        </p>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Script</span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} />
        </div>
        <Button
          size="lg"
          onClick={() => {
            setStartKana(randomKana(scope));
            setSessionKey((k) => k + 1);
            setStarted(true);
          }}
        >
          Start Practice
        </Button>
      </div>
    );
  }

  return (
    <PracticeSession key={sessionKey} initialKana={startKana} scope={scope} />
  );
}

function PaperPanel() {
  const [started, setStarted] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("character");
  const [scope, setScope] = useState<Scope>("hiragana");
  const [level, setLevel] = useState<JlptLevel>("n5");
  const [direction, setDirection] = useState<PaperDirection>("write");
  const [promptSeconds, setPromptSeconds] = useState(5);
  const [revealSeconds, setRevealSeconds] = useState(3);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [sessionKey, setSessionKey] = useState(0);

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          A character, or a JLPT vocabulary word (or its romaji), flashes on
          screen, then hides — grab a pen and write or read it on real paper
          before the reveal checks your answer.
        </p>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Content</span>
          <OptionGroup
            options={CONTENT_OPTIONS}
            value={contentType}
            onChange={setContentType}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Script</span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} />
        </div>
        {contentType === "word" && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">JLPT Level</span>
            <OptionGroup options={LEVEL_OPTIONS} value={level} onChange={setLevel} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Direction</span>
          <OptionGroup
            options={DIRECTION_OPTIONS}
            value={direction}
            onChange={setDirection}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Prompt time</span>
          <div className="flex flex-wrap items-center gap-2">
            <OptionGroup
              options={PROMPT_SECONDS_OPTIONS.map((s) => ({
                value: s,
                label: `${s}s`,
              }))}
              value={promptSeconds}
              onChange={setPromptSeconds}
            />
            <CustomSecondsInput value={promptSeconds} onChange={setPromptSeconds} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Check time</span>
          <div className="flex flex-wrap items-center gap-2">
            <OptionGroup
              options={REVEAL_SECONDS_OPTIONS.map((s) => ({
                value: s,
                label: `${s}s`,
              }))}
              value={revealSeconds}
              onChange={setRevealSeconds}
            />
            <CustomSecondsInput value={revealSeconds} onChange={setRevealSeconds} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Pronunciation</span>
          <button
            type="button"
            onClick={() => setAutoPlayAudio((v) => !v)}
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              autoPlayAudio
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {autoPlayAudio ? (
              <Volume2 className="size-3.5" />
            ) : (
              <VolumeX className="size-3.5" />
            )}
            Auto-play on check
          </button>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setSessionKey((k) => k + 1);
            setStarted(true);
          }}
        >
          Start Paper Practice
        </Button>
      </div>
    );
  }

  const pickNext = (excludeId: string) =>
    contentType === "character"
      ? pickNextKana(scope, excludeId)
      : pickNextWord(level, scope, excludeId);

  return (
    <PaperPracticeSession
      key={sessionKey}
      direction={direction}
      promptSeconds={promptSeconds}
      revealSeconds={revealSeconds}
      autoPlayAudio={autoPlayAudio}
      pickNext={pickNext}
      onEnd={() => setStarted(false)}
    />
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
    <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
        className="w-16 rounded-lg border bg-background px-2 py-1 text-sm text-foreground"
      />
      s
    </label>
  );
}
