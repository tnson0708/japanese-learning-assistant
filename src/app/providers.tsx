"use client";

import { LanguageProvider } from "@/lib/language-context";
import { VocabProgressProvider } from "@/lib/vocab-progress-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <VocabProgressProvider>{children}</VocabProgressProvider>
    </LanguageProvider>
  );
}
