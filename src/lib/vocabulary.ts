/**
 * Vocabulary feature data model: Domains (life areas) broken into Subtopics
 * (~15-25 words each). Independent from `src/lib/words.ts` (the older flat
 * JLPT word list still used by the Practice feature) — different field
 * shapes and JLPT-level casing, deliberately not reconciled.
 */

export type WordType = "kanji" | "hiragana" | "katakana";
export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface VocabWord {
  id: string; // globally unique, e.g. "food-drink.drinks-snacks.coffee"
  word: string; // kanji form if wordType==="kanji", else the kana word itself
  reading: string; // kana reading; for hiragana/katakana words, reading === word
  meaning: string; // Vietnamese meaning
  wordType: WordType;
  jlptLevel: JlptLevel;
  /** Sino-Vietnamese cognate gloss, shown alongside the meaning for faster recall. Only on select kanji words. */
  hanVietHint?: string;
  /** Loanword origin, e.g. "coffee" for コーヒー. Required for a katakana word to be usable in the quiz mode. */
  englishSource?: string;
  exampleSentence: string;
  /** Vietnamese translation of exampleSentence (not just the word's gloss) — powers the listen-to-sentence feature. */
  exampleSentenceMeaning: string;
}

export interface Subtopic {
  id: string; // kebab-case, unique within its domain
  name: string;
  domainId: string;
  /** Global study-order index across all domains/subtopics — drives "Continue Learning". */
  order: number;
  words: VocabWord[];
}

export interface Domain {
  id: string;
  name: string;
  /** Key into DOMAIN_ICON_MAP in the component layer. */
  icon: string;
  subtopics: Subtopic[];
}

export type LevelFilter = JlptLevel | "all";
export type TypeFilter = WordType | "all";

export function wordMatchesFilters(
  word: VocabWord,
  level: LevelFilter,
  type: TypeFilter
): boolean {
  if (level !== "all" && word.jlptLevel !== level) return false;
  if (type !== "all" && word.wordType !== type) return false;
  return true;
}

export function subtopicMatchesFilters(
  subtopic: Subtopic,
  level: LevelFilter,
  type: TypeFilter
): boolean {
  return subtopic.words.some((w) => wordMatchesFilters(w, level, type));
}

export function domainWordCount(domain: Domain): number {
  return domain.subtopics.reduce((sum, s) => sum + s.words.length, 0);
}

export function subtopicWordCount(subtopic: Subtopic): number {
  return subtopic.words.length;
}

export function domainMatchesFilters(
  domain: Domain,
  level: LevelFilter,
  type: TypeFilter
): boolean {
  return domain.subtopics.some((s) => subtopicMatchesFilters(s, level, type));
}
