"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeSession } from "@/components/practice/practice-session";
import {
  PaperPracticeSession,
  type PaperDirection,
} from "@/components/practice/paper-practice-session";
import { randomKana, type Script } from "@/lib/kana";

type Scope = Script | "both";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

const DIRECTION_OPTIONS: { value: PaperDirection; label: string }[] = [
  { value: "write", label: "Write (romaji → kana)" },
  { value: "read", label: "Read (kana → romaji)" },
];

const PROMPT_SECONDS_OPTIONS = [3, 5, 8, 10];
const REVEAL_SECONDS_OPTIONS = [2, 3, 5];

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

      <Tabs defaultValue="handwriting">
        <TabsList className="w-full">
          <TabsTrigger value="handwriting">Handwriting</TabsTrigger>
          <TabsTrigger value="paper">Paper</TabsTrigger>
        </TabsList>
        <TabsContent value="handwriting" className="mt-6">
          <HandwritingPanel />
        </TabsContent>
        <TabsContent value="paper" className="mt-6">
          <PaperPanel />
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
  const [scope, setScope] = useState<Scope>("hiragana");
  const [direction, setDirection] = useState<PaperDirection>("write");
  const [promptSeconds, setPromptSeconds] = useState(5);
  const [revealSeconds, setRevealSeconds] = useState(3);
  const [sessionKey, setSessionKey] = useState(0);

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          A character (or its romaji) flashes on screen, then hides — grab a
          pen and write or read it on real paper before the reveal checks
          your answer.
        </p>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Script</span>
          <OptionGroup options={SCOPE_OPTIONS} value={scope} onChange={setScope} />
        </div>
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

  return (
    <PaperPracticeSession
      key={sessionKey}
      scope={scope}
      direction={direction}
      promptSeconds={promptSeconds}
      revealSeconds={revealSeconds}
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
