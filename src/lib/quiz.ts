import { filterKana, type Kana, type KanaSection, type Script } from "./kana";

export type QuizScope = Script | "both";
export type QuizDirection = "kana-to-romaji" | "romaji-to-kana" | "mixed";

export interface QuizQuestion {
  kana: Kana;
  direction: "kana-to-romaji" | "romaji-to-kana";
  choices: string[]; // either romaji strings or kana chars, depending on direction
  correctAnswer: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pool(scope: QuizScope, section: KanaSection = "all"): Kana[] {
  return filterKana(scope, section);
}

/** Kana whose romaji doesn't collide with another kana in the same pool (e.g. じ/ぢ both "ji"). */
function unambiguousRomajiPool(candidates: Kana[]): Kana[] {
  const counts = new Map<string, number>();
  for (const k of candidates) counts.set(k.romaji, (counts.get(k.romaji) ?? 0) + 1);
  return candidates.filter((k) => counts.get(k.romaji) === 1);
}

function pickDistractors<T>(
  correct: T,
  candidates: T[],
  count: number,
  key: (v: T) => string
): T[] {
  const correctKey = key(correct);
  const uniqueByKey = new Map<string, T>();
  for (const c of shuffle(candidates)) {
    const k = key(c);
    if (k === correctKey || uniqueByKey.has(k)) continue;
    uniqueByKey.set(k, c);
    if (uniqueByKey.size >= count) break;
  }
  return [...uniqueByKey.values()];
}

export function generateQuestions(
  scope: QuizScope,
  direction: QuizDirection,
  count: number,
  section: KanaSection = "all"
): QuizQuestion[] {
  const basePool = pool(scope, section);
  const romajiToKanaPool = unambiguousRomajiPool(basePool);


  const questions: QuizQuestion[] = [];
  let lastChar: string | null = null;

  for (let i = 0; i < count; i++) {
    const dir: "kana-to-romaji" | "romaji-to-kana" =
      direction === "mixed"
        ? Math.random() < 0.5
          ? "kana-to-romaji"
          : "romaji-to-kana"
        : direction;

    const sourcePool = dir === "romaji-to-kana" ? romajiToKanaPool : basePool;
    let candidates = sourcePool.filter((k) => k.char !== lastChar);
    if (candidates.length === 0) candidates = sourcePool;
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    lastChar = target.char;

    if (dir === "kana-to-romaji") {
      const distractors = pickDistractors(
        target,
        basePool,
        3,
        (k) => k.romaji
      );
      const choices = shuffle([target, ...distractors].map((k) => k.romaji));
      questions.push({
        kana: target,
        direction: dir,
        choices,
        correctAnswer: target.romaji,
      });
    } else {
      const distractors = pickDistractors(
        target,
        romajiToKanaPool,
        3,
        (k) => k.char
      );
      const choices = shuffle([target, ...distractors].map((k) => k.char));
      questions.push({
        kana: target,
        direction: dir,
        choices,
        correctAnswer: target.char,
      });
    }
  }

  return questions;
}
