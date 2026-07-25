"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PencilLine, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrokeOrderSvg } from "@/components/kana/stroke-order-svg";
import { getKanaById, kanaList, sortByGroup } from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";

export default function KanaDetailPage() {
  const params = useParams<{ id: string }>();
  const kana = getKanaById(params.id);

  if (!kana) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-muted-foreground">Character not found.</p>
        <Button render={<Link href="/kana" />} nativeButton={false} variant="outline">
          Back to kana chart
        </Button>
      </div>
    );
  }

  const scriptList = sortByGroup(
    kanaList.filter((k) => k.script === kana.script)
  );
  const idx = scriptList.findIndex((k) => k.id === kana.id);
  const prev = scriptList[(idx - 1 + scriptList.length) % scriptList.length];
  const next = scriptList[(idx + 1) % scriptList.length];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:max-w-xl lg:py-12">
      <Link
        href="/kana"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to chart
      </Link>

      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 lg:p-10">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {kana.script}
        </span>
        <StrokeOrderSvg kana={kana} className="w-40 text-foreground sm:w-48 lg:w-56" />
        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold lg:text-4xl">{kana.romaji}</span>
          <button
            type="button"
            onClick={() => speakJapanese(kana.char)}
            className="rounded-full border p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={`Play pronunciation of ${kana.char}`}
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        <Button
          render={<Link href={`/practice/${kana.id}`} />}
          nativeButton={false}
          className="w-full"
        >
          <PencilLine className="size-4" />
          Practice writing this
        </Button>
      </div>

      <div className="flex justify-between">
        <Button
          render={<Link href={`/kana/${prev.id}`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          ← {prev.char}
        </Button>
        <Button
          render={<Link href={`/kana/${next.id}`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          {next.char} →
        </Button>
      </div>
    </div>
  );
}
