"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Domain, Subtopic } from "@/lib/vocabulary";
import { getAllSubtopicsInStudyOrder } from "@/data/vocabulary";

const STORAGE_KEY = "kana_dojo_vocab_progress_v1";

interface PersistedProgress {
  version: 1;
  learnedWordIds: Record<string, true>;
}

interface ProgressStats {
  learned: number;
  total: number;
  percent: number;
}

interface VocabProgressContextType {
  isWordLearned: (wordId: string) => boolean;
  toggleWordLearned: (wordId: string) => void;
  markWordLearned: (wordId: string, learned: boolean) => void;
  getSubtopicProgress: (subtopic: Subtopic) => ProgressStats;
  getDomainProgress: (domain: Domain) => ProgressStats;
  getNextIncompleteSubtopic: () => { domainId: string; subtopicId: string } | null;
}

const VocabProgressContext = createContext<VocabProgressContextType | undefined>(undefined);

function computeStats(wordIds: string[], learnedWordIds: Record<string, true>): ProgressStats {
  const total = wordIds.length;
  const learned = wordIds.filter((id) => learnedWordIds[id]).length;
  const percent = total === 0 ? 0 : Math.round((learned / total) * 100);
  return { learned, total, percent };
}

export function VocabProgressProvider({ children }: { children: React.ReactNode }) {
  const [learnedWordIds, setLearnedWordIds] = useState<Record<string, true>>({});

  // Hydrate from localStorage after mount (not in a lazy useState initializer)
  // so the server-rendered and first client-rendered output both start from
  // an empty state and stay in sync — reading localStorage before hydration
  // would desync from the server-rendered HTML and trigger a hydration error.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedProgress;
        if (parsed && parsed.version === 1 && parsed.learnedWordIds) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration read, see comment above
          setLearnedWordIds(parsed.learnedWordIds);
        }
      }
    } catch {
      // Ignore malformed/unavailable localStorage; start from empty progress.
    }
  }, []);

  const persist = (next: Record<string, true>) => {
    setLearnedWordIds(next);
    try {
      const payload: PersistedProgress = { version: 1, learnedWordIds: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore write failures (e.g. private browsing / storage quota).
    }
  };

  const markWordLearned = (wordId: string, learned: boolean) => {
    const next = { ...learnedWordIds };
    if (learned) {
      next[wordId] = true;
    } else {
      delete next[wordId];
    }
    persist(next);
  };

  const toggleWordLearned = (wordId: string) => {
    markWordLearned(wordId, !learnedWordIds[wordId]);
  };

  const isWordLearned = (wordId: string) => !!learnedWordIds[wordId];

  const getSubtopicProgress = (subtopic: Subtopic): ProgressStats =>
    computeStats(subtopic.words.map((w) => w.id), learnedWordIds);

  const getDomainProgress = (domain: Domain): ProgressStats =>
    computeStats(
      domain.subtopics.flatMap((s) => s.words.map((w) => w.id)),
      learnedWordIds
    );

  const getNextIncompleteSubtopic = () => {
    const ordered = getAllSubtopicsInStudyOrder();
    for (const subtopic of ordered) {
      const stats = getSubtopicProgress(subtopic);
      if (stats.learned < stats.total) {
        return { domainId: subtopic.domainId, subtopicId: subtopic.id };
      }
    }
    return null;
  };

  return (
    <VocabProgressContext.Provider
      value={{
        isWordLearned,
        toggleWordLearned,
        markWordLearned,
        getSubtopicProgress,
        getDomainProgress,
        getNextIncompleteSubtopic,
      }}
    >
      {children}
    </VocabProgressContext.Provider>
  );
}

export function useVocabProgress(): VocabProgressContextType {
  const context = useContext(VocabProgressContext);
  if (!context) {
    // Fallback if rendered outside provider — mirrors useLanguage()'s no-crash pattern.
    return {
      isWordLearned: () => false,
      toggleWordLearned: () => {},
      markWordLearned: () => {},
      getSubtopicProgress: (subtopic) => computeStats(subtopic.words.map((w) => w.id), {}),
      getDomainProgress: (domain) =>
        computeStats(
          domain.subtopics.flatMap((s) => s.words.map((w) => w.id)),
          {}
        ),
      getNextIncompleteSubtopic: () => null,
    };
  }
  return context;
}
