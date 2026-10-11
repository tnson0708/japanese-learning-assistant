"use client";

import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const next = language === "vi" ? "en" : "vi";

  return (
    <>
      {/* Mobile: one button showing the current language, tap to switch */}
      <button
        type="button"
        onClick={() => setLanguage(next)}
        className="sm:hidden inline-flex h-9 items-center gap-1 rounded-lg border bg-background/80 px-2 text-[11px] font-bold text-foreground shadow-2xs cursor-pointer"
        aria-label={
          next === "en" ? "Switch to English" : "Chuyển sang Tiếng Việt"
        }
        title={next === "en" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      >
        <span className="text-xs">{language === "vi" ? "🇻🇳" : "🇺🇸"}</span>
        <span>{language === "vi" ? "VI" : "EN"}</span>
      </button>

      <div className="hidden sm:flex items-center rounded-lg border bg-background/80 p-0.5 text-xs shadow-2xs">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all duration-150 cursor-pointer",
            language === "en"
              ? "bg-muted text-foreground font-bold shadow-2xs border border-border/50"
              : "text-muted-foreground hover:text-foreground font-normal"
          )}
          aria-label="Switch to English"
        >
          <span className="text-xs">🇺🇸</span>
          <span>EN</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("vi")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all duration-150 cursor-pointer",
            language === "vi"
              ? "bg-muted text-foreground font-bold shadow-2xs border border-border/50"
              : "text-muted-foreground hover:text-foreground font-normal"
          )}
          aria-label="Chuyển sang Tiếng Việt"
        >
          <span className="text-xs">🇻🇳</span>
          <span>VI</span>
        </button>
      </div>
    </>
  );
}
