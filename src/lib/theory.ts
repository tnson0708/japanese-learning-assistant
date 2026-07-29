import { lesson1 } from "@/data/theory/lesson-1";
import { lesson2 } from "@/data/theory/lesson-2";

/** A single vocabulary/phrase entry: Japanese reading, optional Kanji, Vietnamese meaning, optional usage note. */
export interface VocabItem {
  jp: string;
  kanji?: string;
  meaning: string;
  note?: string;
}

/** One Japanese/Vietnamese example sentence pair inside a grammar point. */
export interface GrammarExample {
  jp: string;
  vi: string;
}

/** One numbered/lettered explanation sub-point inside a grammar point (e.g. "1) Trợ từ は ..."). */
export interface GrammarSubPoint {
  label?: string;
  text: string;
}

/**
 * A single piece of lesson content. Every lesson section is just an ordered
 * list of these — lessons are free to mix, omit, or repeat block types as
 * needed, so differently-structured lessons don't require a schema change.
 */
export type ContentBlock =
  | { type: "vocab-list"; items: VocabItem[] }
  | { type: "vocab-group"; heading?: string; items: VocabItem[] }
  | {
      type: "table";
      title?: string;
      columns: string[];
      rows: string[][];
      /** Column indexes (0-based) whose cell text is Japanese and should get a speaker icon. */
      speakableColumns?: number[];
    }
  | {
      type: "grammar-pattern";
      pattern: string;
      explanation?: string;
      subPoints?: GrammarSubPoint[];
      notes?: string[];
      examples?: GrammarExample[];
    }
  | { type: "note"; text: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string };

export type SectionId = "vocabulary" | "reference" | "grammar";

export interface LessonSection {
  id: SectionId;
  title: string;
  blocks: ContentBlock[];
}

export interface Lesson {
  id: number;
  title: string;
  sections: LessonSection[];
}

// Add each new lesson's file here as it's transcribed.
export const lessonList: Lesson[] = [lesson1, lesson2];

export function getLessonById(id: number): Lesson | undefined {
  return lessonList.find((l) => l.id === id);
}

export function getAdjacentLessons(id: number): { prev?: Lesson; next?: Lesson } {
  const idx = lessonList.findIndex((l) => l.id === id);
  if (idx === -1) return {};
  return { prev: lessonList[idx - 1], next: lessonList[idx + 1] };
}
