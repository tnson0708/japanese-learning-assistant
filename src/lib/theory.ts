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

/** One playable listening track from the physical textbook (e.g. a Mondai audio clip). */
export interface ListeningTrackItem {
  label: string;
  /** Path under /public, e.g. "/audio/lessons/lesson-4/第4課 問題 1 Mondai 1.mp3" — encoded at render time. */
  url: string;
}

export interface ReorderQuestionItem {
  id: string;
  words: string[];
  correctOrder: string[];
  fullSentenceJp: string;
  fullSentenceVi: string;
  explanation?: string;
}

/** The worked example row of a picture-cued particle+sentence writing drill (e.g. 電車（で） 会社へ行きます。). */
export interface PictureFillExample {
  cue: string;
  particle: string;
  sentence: string;
}

/**
 * One numbered blank row: 1-2 cue words each get a small particle blank
 * (e.g. "友達（　）"), followed by one shared long blank line for the
 * learner's own full sentence. There's no fixed correct sentence — only the
 * picture (not reproducible here as an exact scan) determines it.
 */
export interface PictureFillItem {
  id: string;
  num: string;
  cues: string[];
}

/**
 * One numbered row of a picture-cued drill where the surrounding sentence is
 * fixed (a common verb shared by every item, e.g. "～を　貸します。") and only
 * the object noun in the middle is blank — the opposite shape from
 * `PictureFillItem`, where the particle was the blank instead.
 */
export interface CuedWriteItem {
  id: string;
  num: string;
  prefixJp: string;
}

/** One free-write blank line inside a self-introduction template (e.g. "わたしは ___です。"). */
export interface SelfIntroLine {
  before: string;
  after?: string;
  placeholder: string;
}

/** One reply line inside a dialogue-completion item — fixed lead-in text, then a blank, then a period. */
export interface DialogueCompletionLine {
  prefixJp: string;
  /** Filled in for the worked example line; left undefined for the learner's own items. */
  answerJp?: string;
}

/** One question + reply-lines set (練習C-style もう／まだ drill). */
export interface DialogueCompletionItem {
  id: string;
  num: string;
  questionJp: string;
  lines: DialogueCompletionLine[];
}

/**
 * One blank line of a "listen and write the answer following the given
 * pattern" drill (Mondai-1-style in Minna no Nihongo). The correct
 * transcript is only known once someone transcribes it from the textbook's
 * answer key — left undefined until then, so the item still renders as a
 * self-check practice line with no wrong "correct answer" guessed at.
 */
export interface ListeningDictationItem {
  id: string;
  num: number;
  answerJp?: string;
  answerVi?: string;
}

/** Which simple built-in icon to draw for a listening-picture-choice option, standing in for the textbook's actual illustration. */
export type ListeningPictureIcon =
  | "greeting-night"
  | "greeting-dawn"
  | "greeting-day"
  | "greet-crowd"
  | "greet-handshake"
  | "greet-distant"
  | "name-badge";

export interface ListeningPictureOption {
  id: string;
  label: string;
  /** Built-in placeholder icon, used when no real image is available yet. Ignored once `imageUrl` is set. */
  icon?: ListeningPictureIcon;
  /** Path under /public to the textbook's actual picture, once someone saves it into the repo. */
  imageUrl?: string;
  badgeName?: string;
  badgeNumber?: string;
}

/** One numbered set of 2-3 pictures the learner picks from after listening (Mondai-2-style). */
export interface ListeningPictureGroup {
  id: string;
  num: string;
  options: ListeningPictureOption[];
  /** id of the correct option, once known from the answer key. */
  correctOptionId?: string;
}

/** One ○/× (true/false) item (Mondai-3-style, or a reading-comprehension statement). Examples are pre-marked and shown as reference, not clickable. */
export interface ListeningTrueFalseItem {
  id: string;
  num: string;
  isExample?: boolean;
  exampleAnswer?: boolean;
  correctAnswer?: boolean;
  /** The written Japanese statement to judge — used by the reading-comprehension variant, where (unlike audio) the statement is shown, not just heard. */
  statementJp?: string;
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
      /** Full conversation recording from the textbook, played above the dialogue lines. */
      dialogueAudioUrl?: string;
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
    }
  | {
      type: "listening-audio-list";
      title: string;
      instruction?: string;
      items: ListeningTrackItem[];
    }
  | {
      type: "exercise-listening-dictation";
      title: string;
      instruction?: string;
      audioUrl?: string;
      exampleJp?: string;
      exampleVi?: string;
      items: ListeningDictationItem[];
    }
  | {
      type: "exercise-listening-picture-choice";
      title: string;
      instruction?: string;
      audioUrl?: string;
      groups: ListeningPictureGroup[];
    }
  | {
      type: "exercise-listening-truefalse";
      title: string;
      instruction?: string;
      audioUrl?: string;
      items: ListeningTrueFalseItem[];
    }
  | {
      type: "exercise-self-intro";
      title: string;
      instruction?: string;
      introText?: string;
      lines: SelfIntroLine[];
      closingText?: string;
      sampleAnswerJp?: string;
      sampleAnswerVi?: string;
    }
  | {
      type: "exercise-reading-comprehension";
      title: string;
      instruction?: string;
      passageTitle?: string;
      passageJp: string;
      passageVi?: string;
      /** Path under /public to an illustration accompanying the passage, once someone saves it into the repo. */
      passageImageUrl?: string;
      items: ListeningTrueFalseItem[];
    }
  | {
      type: "exercise-picture-particle-write";
      title: string;
      instruction?: string;
      /** Path under /public to the textbook's picture strip, once someone saves it into the repo. */
      imageUrl?: string;
      imageAlt?: string;
      example: PictureFillExample;
      items: PictureFillItem[];
    }
  | {
      type: "exercise-picture-cued-write";
      title: string;
      instruction?: string;
      imageUrl?: string;
      imageAlt?: string;
      /** Fixed text shared by every row, shown after the blank object noun (e.g. "を 貸します"). */
      suffixJp: string;
      example: { prefixJp: string; answerJp: string };
      items: CuedWriteItem[];
    }
  | {
      type: "exercise-dialogue-completion";
      title: string;
      instruction?: string;
      example: DialogueCompletionItem;
      items: DialogueCompletionItem[];
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
