import jlptWordsRaw from "@/data/jlpt-words.json";
import type { Script } from "@/lib/kana";

export type JlptLevel = "n5" | "n4" | "n3" | "n2" | "n1";

export interface Word {
  id: string;
  word: string;
  romaji: string;
  level: JlptLevel;
  script: Script;
  /** Vietnamese meaning, shown as a check-phase hint. */
  meaning: string;
}

export const JLPT_LEVELS: JlptLevel[] = ["n5", "n4", "n3", "n2", "n1"];

export const JLPT_LEVEL_LABELS: Record<JlptLevel, string> = {
  n5: "N5",
  n4: "N4",
  n3: "N3",
  n2: "N2",
  n1: "N1",
};

// ~500 words per level, written in kana (no kanji) to stay consistent with
// this app's kana-only scope. Sourced from a community JLPT 10k vocabulary
// deck (readings + word forms), romanized programmatically, and translated
// to Vietnamese. Level assignments are approximate: the modern JLPT does not
// publish an official vocabulary list, and the source deck only distinguishes
// a combined "N5–N4" tier — that tier was split in half by deck order (a
// frequency/difficulty proxy) into separate N5 and N4 sets here.
export const wordList: Word[] = jlptWordsRaw as Word[];

export function getWordsByLevel(
  level: JlptLevel,
  script: Script | "both" = "both"
): Word[] {
  return wordList.filter(
    (w) => w.level === level && (script === "both" || w.script === script)
  );
}

export function randomWord(
  level: JlptLevel,
  script: Script | "both" = "both"
): Word {
  const pool = getWordsByLevel(level, script);
  return pool[Math.floor(Math.random() * pool.length)];
}
