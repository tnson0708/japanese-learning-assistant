"use client";

import Link from "next/link";
import { VisitCounter } from "@/components/visit-counter";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <footer className="mt-12 border-t border-border/60 bg-muted/20 py-6 px-4 pb-24 md:pb-6 text-xs text-muted-foreground transition-colors print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Column: Branding & Tagline */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="font-extrabold text-foreground hover:text-red-600 transition-colors flex items-center gap-1.5">
            <span className="text-red-600 font-bold">仮名道場</span>
            <span>Kana Dojo</span>
          </Link>
          <span className="text-border">•</span>
          <span className="text-muted-foreground text-[11px] sm:text-xs">
            {isVi ? "Trường tập luyện chữ Nhật & Từ vựng tiếng Nhật" : "Japanese Handwriting & Vocabulary Learning Suite"}
          </span>
        </div>

        {/* Right Column: License & Visit Stats Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 text-muted-foreground/80">
            <span>{isVi ? "Dữ liệu nét bút từ" : "Stroke order data from"}</span>
            <a
              href="https://kanjivg.tagaini.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-foreground transition-colors"
            >
              KanjiVG
            </a>
            <span>(CC BY-SA 3.0)</span>
          </div>

          <span className="hidden sm:inline text-border">•</span>

          <VisitCounter variant="footer" />
        </div>
      </div>
    </footer>
  );
}
