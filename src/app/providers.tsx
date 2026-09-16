"use client";

import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { VocabProgressProvider } from "@/lib/vocab-progress-context";
import { MaintenanceProvider } from "@/lib/maintenance-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MaintenanceProvider>
        <LanguageProvider>
          <VocabProgressProvider>{children}</VocabProgressProvider>
        </LanguageProvider>
      </MaintenanceProvider>
    </ThemeProvider>
  );
}
