"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const { language } = useLanguage();
  const label = language === "vi" ? "Đổi giao diện sáng / tối" : "Toggle light / dark theme";

  // Both icons are always rendered and swapped purely via the `.dark` class on <html>,
  // so the server HTML never disagrees with the theme the inline script applied.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-9 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-2xs"
      title={label}
      aria-label={label}
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}
