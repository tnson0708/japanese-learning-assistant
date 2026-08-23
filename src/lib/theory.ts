import { lesson1 } from "@/data/theory/lesson-1";
import { lesson2 } from "@/data/theory/lesson-2";
import { lesson3 } from "@/data/theory/lesson-3";
import { lesson4 } from "@/data/theory/lesson-4";
import { lesson5 } from "@/data/theory/lesson-5";
import { lesson6 } from "@/data/theory/lesson-6";
import { lesson7 } from "@/data/theory/lesson-7";
import { lesson8 } from "@/data/theory/lesson-8";
import { lesson9 } from "@/data/theory/lesson-9";
import { lesson10 } from "@/data/theory/lesson-10";
import { lesson11 } from "@/data/theory/lesson-11";
import { lesson12 } from "@/data/theory/lesson-12";
import { lesson13 } from "@/data/theory/lesson-13";
import { lesson14 } from "@/data/theory/lesson-14";
import { lesson15 } from "@/data/theory/lesson-15";
import { lesson16 } from "@/data/theory/lesson-16";
import { lesson17 } from "@/data/theory/lesson-17";
import { lesson18 } from "@/data/theory/lesson-18";
import { lesson19 } from "@/data/theory/lesson-19";
import { lesson20 } from "@/data/theory/lesson-20";
import { lesson21 } from "@/data/theory/lesson-21";
import { lesson22 } from "@/data/theory/lesson-22";
import { lesson23 } from "@/data/theory/lesson-23";
import { lesson24 } from "@/data/theory/lesson-24";
import { lesson25 } from "@/data/theory/lesson-25";

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

export interface FillInBlankQuestion {
  id: string;
  promptPre: string;
  promptPost?: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  fullSentenceJp?: string;
  fullSentenceVi?: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface SentencePracticeItem {
  id: string;
  vi: string;
  jp: string;
  hint?: string;
  breakdown?: string;
}

export interface TranslationSentenceItem {
  id: string;
  num: number;
  vi: string;
  jp: string;
  note?: string;
}

export interface TranslationDialogueLine {
  speakerVi: string;
  speakerJp?: string;
  vi: string;
  jp: string;
}

export interface ReorderQuestionItem {
  id: string;
  words: string[];
  correctOrder: string[];
  fullSentenceJp: string;
  fullSentenceVi: string;
  explanation?: string;
}

/**
 * One "character card" used by picture-based textbook drills (e.g. 練習B),
 * where the original book shows a photo + country map. Here the photo is
 * replaced by a flag emoji + structured attributes so the drill stays fully
 * data-driven instead of embedding scanned images.
 */
export interface DrillCardPerson {
  id: string;
  name: string;
  flag: string;
  countryJp: string;
  jobJp: string;
  jobVi: string;
  age?: number;
}

/** A sub-drill (e.g. 練習B's numbered items 1-7), grouped under one instruction. */
export interface PictureDrillGroup {
  heading: string;
  items: SentencePracticeItem[];
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
  | { type: "paragraph"; text: string }
  | {
      type: "translation-section";
      title: string;
      instruction?: string;
      sentences?: TranslationSentenceItem[];
      examples?: TranslationSentenceItem[];
      dialogueTitle?: string;
      dialogueLines?: TranslationDialogueLine[];
    }
  | {
      type: "exercise-fill-in-blank";
      title: string;
      instruction?: string;
      audioUrl?: string;
      questions: FillInBlankQuestion[];
    }
  | {
      type: "exercise-multiple-choice";
      title: string;
      instruction?: string;
      audioUrl?: string;
      questions: MultipleChoiceQuestion[];
    }
  | {
      type: "exercise-sentence-practice";
      title: string;
      instruction?: string;
      audioUrl?: string;
      items: SentencePracticeItem[];
    }
  | {
      type: "exercise-reorder-sentence";
      title: string;
      instruction?: string;
      audioUrl?: string;
      questions: ReorderQuestionItem[];
    }
  | {
      type: "exercise-picture-cards";
      title: string;
      instruction?: string;
      people: DrillCardPerson[];
      groups: PictureDrillGroup[];
    };

export type SectionId =
  | "vocabulary"
  | "translation"
  | "reference"
  | "grammar"
  | "exercises";

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
export const lessonList: Lesson[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6,
  lesson7,
  lesson8,
  lesson9,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
  lesson14,
  lesson15,
  lesson16,
  lesson17,
  lesson18,
  lesson19,
  lesson20,
  lesson21,
  lesson22,
  lesson23,
  lesson24,
  lesson25,
];

export function getLessonById(id: number): Lesson | undefined {
  return lessonList.find((l) => l.id === id);
}

export function getAdjacentLessons(id: number): { prev?: Lesson; next?: Lesson } {
  const idx = lessonList.findIndex((l) => l.id === id);
  if (idx === -1) return {};
  return { prev: lessonList[idx - 1], next: lessonList[idx + 1] };
}
