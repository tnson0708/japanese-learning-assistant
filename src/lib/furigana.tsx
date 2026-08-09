import type { ReactNode } from "react";
import { lessonList } from "@/lib/theory";

/**
 * Kanji readings that don't come from a clean VocabItem { kanji, jp } pair —
 * either a suffix stripped of its leading "～" (人/歳/語), a bracketed
 * optional prefix (お土産), or a word that only ever shows up inside a full
 * example sentence or the surnames table rather than its own vocab entry.
 */
const MANUAL_READINGS: Record<string, string> = {
  人: "じん",
  歳: "さい",
  "20歳": "はたち",
  二十歳: "はたち",
  何歳: "なんさい",
  語: "ご",
  国: "くに",
  お国: "おくに",
  円: "えん",
  階: "かい",
  何階: "なんがい",
  売り場: "うりば",
  地下: "ちか",
  自動販売機: "じどうはんばいき",
  土産: "みやげ",
  お土産: "おみやげ",
  方: "かた",
  世話: "せわ",
  佐藤: "さとう",
  鈴木: "すずき",
  高橋: "たかはし",
  田中: "たなか",
  渡辺: "わたなべ",
  伊藤: "いとう",
  山本: "やまもと",
  中村: "なかむら",
  小林: "こばやし",
  加藤: "かとう",
  吉田: "よしだ",
  山田: "やまだ",
  佐々木: "ささき",
  斎藤: "さいとう",
  山口: "やまぐち",
  松本: "まつもと",
  井上: "いのうえ",
  木村: "きむら",
  林: "はやし",
  清水: "しみず",
};

function collectVocabReadings(): Record<string, string> {
  const dict: Record<string, string> = { ...MANUAL_READINGS };
  for (const lesson of lessonList) {
    for (const section of lesson.sections) {
      for (const block of section.blocks) {
        if (block.type !== "vocab-list" && block.type !== "vocab-group") continue;
        for (const item of block.items) {
          // Skip tilde/bracket forms ("～人", "［お］土産") — those are
          // covered above by their stripped, manually-keyed equivalents.
          if (item.kanji && !/[～［］]/.test(item.kanji)) {
            dict[item.kanji] = item.jp;
          }
        }
      }
    }
  }
  return dict;
}

const FURIGANA_DICT = collectVocabReadings();

// Longest key first, so e.g. "何歳" is matched whole instead of as "何" + "歳".
const sortedKeys = Object.keys(FURIGANA_DICT).sort((a, b) => b.length - a.length);

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const matchRegex = sortedKeys.length
  ? new RegExp(sortedKeys.map(escapeRegExp).join("|"), "g")
  : null;

/**
 * Splits `text` into plain text and recognized Kanji runs, wrapping each
 * recognized run in a native <ruby>/<rt> pair so its reading floats above it
 * as furigana. Unrecognized characters (kana, punctuation, Vietnamese, or
 * Kanji outside the lesson vocabulary) pass through unchanged.
 */
export function renderFurigana(text: string): ReactNode {
  if (!matchRegex || !text) return text;

  matchRegex.lastIndex = 0;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = matchRegex.exec(text))) {
    if (m.index > lastIndex) {
      nodes.push(text.slice(lastIndex, m.index));
    }
    const word = m[0];
    nodes.push(
      <ruby key={key++}>
        {word}
        <rt className="text-[0.55em] font-normal text-muted-foreground">
          {FURIGANA_DICT[word]}
        </rt>
      </ruby>
    );
    lastIndex = m.index + word.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
