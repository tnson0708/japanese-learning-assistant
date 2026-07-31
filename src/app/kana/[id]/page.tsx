"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Keyboard, PencilLine, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrokeOrderSvg } from "@/components/kana/stroke-order-svg";
import { getKanaById, kanaList, sortByGroup } from "@/lib/kana";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";

export default function KanaDetailPage() {
  const { t, language } = useLanguage();
  const isVi = language === "vi";
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const kana = getKanaById(params.id);
  const [replayKey, setReplayKey] = useState(0);

  if (!kana) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("kana_no_results")}</p>
        <Button render={<Link href="/kana" />} nativeButton={false} variant="outline">
          {t("detail_back")}
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

  // Keyboard Shortcuts Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts if user is typing inside an input/textarea element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          router.push(`/kana/${next.id}`);
          break;
        case "ArrowLeft":
          e.preventDefault();
          router.push(`/kana/${prev.id}`);
          break;
        case " ":
        case "Spacebar":
          e.preventDefault();
          speakJapanese(kana.char);
          break;
        case "b":
        case "B":
        case "r":
        case "R":
          e.preventDefault();
          setReplayKey((k) => k + 1);
          break;
        case "Enter":
          e.preventDefault();
          router.push(`/practice/${kana.id}`);
          break;
        case "Backspace":
        case "Escape":
          e.preventDefault();
          router.push(`/kana?tab=${kana.script}`);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [kana.char, kana.id, kana.script, next.id, prev.id, router]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:max-w-xl lg:py-12">
      {/* Back Link */}
      <Link
        href={`/kana?tab=${kana.script}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        <span>{t("detail_back")}</span>
        <kbd className="hidden sm:inline-block rounded bg-muted border px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground ml-1">
          Backspace
        </kbd>
      </Link>

      {/* Main Kana Practice & Stroke Order Card */}
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 lg:p-10 shadow-2xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {kana.script}
        </span>

        <StrokeOrderSvg
          kana={kana}
          externalPlayKey={replayKey}
          className="w-40 text-foreground sm:w-48 lg:w-56"
        />

        <div className="flex items-center gap-3 mt-1">
          <span className="text-3xl font-bold lg:text-4xl">{kana.romaji}</span>
          <button
            type="button"
            onClick={() => speakJapanese(kana.char)}
            className="flex items-center gap-1.5 rounded-full border p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-95 cursor-pointer"
            aria-label={`Play pronunciation of ${kana.char}`}
            title="Pronounce (Space)"
          >
            <Volume2 className="size-4 text-primary" />
            <kbd className="hidden sm:inline-block rounded bg-muted border px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
              Space
            </kbd>
          </button>
        </div>

        <Button
          render={<Link href={`/practice/${kana.id}`} />}
          nativeButton={false}
          className="w-full gap-2 mt-2 font-semibold"
        >
          <PencilLine className="size-4" />
          <span>{t("detail_practice_btn")}</span>
          <kbd className="hidden sm:inline-block rounded bg-primary-foreground/20 border border-primary-foreground/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-primary-foreground">
            ↵ Enter
          </kbd>
        </Button>
      </div>

      {/* Prev / Next Character Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button
          render={<Link href={`/kana/${prev.id}`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <span className="font-mono text-xs font-bold text-muted-foreground">←</span>
          <span>{prev.char} ({prev.romaji})</span>
        </Button>

        <Button
          render={<Link href={`/kana/${next.id}`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <span>{next.char} ({next.romaji})</span>
          <span className="font-mono text-xs font-bold text-muted-foreground">→</span>
        </Button>
      </div>

      {/* Keyboard Shortcuts Helper Card */}
      <div className="rounded-xl border bg-card/60 p-4 shadow-2xs text-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground text-[11px]">
          <Keyboard className="size-4 text-primary" />
          <span>{isVi ? "Phím Tắt Bàn Phím" : "Keyboard Shortcuts"}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono font-bold text-[11px] text-foreground">← / →</kbd>
            <span>{isVi ? "Trước / Sau" : "Prev / Next"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono font-bold text-[11px] text-foreground">Space</kbd>
            <span>{isVi ? "Phát âm" : "Audio"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono font-bold text-[11px] text-foreground">B / R</kbd>
            <span>{isVi ? "Phát lại nét" : "Replay Strokes"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono font-bold text-[11px] text-foreground">Enter</kbd>
            <span>{isVi ? "Luyện viết" : "Practice Writing"}</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono font-bold text-[11px] text-foreground">Backspace</kbd>
            <span>{isVi ? "Bảng Kana" : "Kana Chart"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
