"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { PracticeSession } from "@/components/practice/practice-session";
import { randomKana, type Script } from "@/lib/kana";

type Scope = Script | "both";

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "both", label: "Both" },
];

export default function PracticePage() {
  const [started, setStarted] = useState(false);
  const [scope, setScope] = useState<Scope>("hiragana");
  const [sessionKey, setSessionKey] = useState(0);
  const [startKana, setStartKana] = useState(() => randomKana("hiragana"));

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Handwriting Practice
        </h1>
        <p className="text-sm text-muted-foreground">
          Write with your finger, mouse, or Apple Pencil. Your attempt is
          scored against the correct stroke shapes.
        </p>
      </div>

      {!started ? (
        <div className="flex flex-col gap-6 rounded-xl border bg-card p-6">
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
      ) : (
        <PracticeSession key={sessionKey} initialKana={startKana} scope={scope} />
      )}
    </div>
  );
}
