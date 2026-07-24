"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GROUP_LABELS,
  GROUP_ORDER,
  getKanaByScript,
  sortByGroup,
  type Kana,
  type Script,
} from "@/lib/kana";

function KanaGrid({ script }: { script: Script }) {
  const grouped = useMemo(() => {
    const list = sortByGroup(getKanaByScript(script));
    const map = new Map<string, Kana[]>();
    for (const k of list) {
      const arr = map.get(k.group) ?? [];
      arr.push(k);
      map.set(k.group, arr);
    }
    return map;
  }, [script]);

  return (
    <div className="flex flex-col gap-6">
      {GROUP_ORDER.filter((g) => grouped.has(g)).map((group) => (
        <div key={group}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {GROUP_LABELS[group]}
          </h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {grouped.get(group)!.map((k) => (
              <Link
                key={k.id}
                href={`/kana/${k.id}`}
                className="flex flex-col items-center justify-center gap-0.5 rounded-lg border bg-card py-3 transition-colors hover:border-primary/60 hover:bg-accent/50"
              >
                <span className="text-2xl leading-none">{k.char}</span>
                <span className="text-[11px] text-muted-foreground">
                  {k.romaji}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KanaChartPage() {
  const [tab, setTab] = useState<Script>("hiragana");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learn Kana</h1>
        <p className="text-sm text-muted-foreground">
          Tap a character to see its stroke order and hear it pronounced.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Script)}>
        <TabsList>
          <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana">Katakana</TabsTrigger>
        </TabsList>
        <TabsContent value="hiragana" className="pt-4">
          <KanaGrid script="hiragana" />
        </TabsContent>
        <TabsContent value="katakana" className="pt-4">
          <KanaGrid script="katakana" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
