"use client";

import { LanguageProvider } from "@/lib/language-context";
import { VocabProgressProvider } from "@/lib/vocab-progress-context";
import { MaintenanceProvider } from "@/lib/maintenance-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MaintenanceProvider>
      <LanguageProvider>
        <VocabProgressProvider>{children}</VocabProgressProvider>
      </LanguageProvider>
    </MaintenanceProvider>
  );
}
