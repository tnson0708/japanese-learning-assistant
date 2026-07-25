"use client";

import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full border bg-muted/80 p-1 text-xs shadow-2xs">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all duration-150",
          language === "en"
            ? "bg-primary text-primary-foreground shadow-xs scale-100"
            : "text-muted-foreground hover:text-foreground font-normal opacity-70 hover:opacity-100"
        )}
        aria-label="Switch to English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("vi")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all duration-150",
          language === "vi"
            ? "bg-primary text-primary-foreground shadow-xs scale-100"
            : "text-muted-foreground hover:text-foreground font-normal opacity-70 hover:opacity-100"
        )}
        aria-label="Chuyển sang Tiếng Việt"
      >
        <span>🇻🇳</span>
        <span>VI</span>
      </button>
    </div>
  );
}

