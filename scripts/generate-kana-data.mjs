// Fetches stroke-order SVG data from KanjiVG for every Hiragana/Katakana
// character and bundles it into src/data/kana-strokes.json for offline use.
//
// KanjiVG data is (C) Ulrich Apel, distributed under CC BY-SA 3.0.
// https://kanjivg.tagaini.net/
//
// Run with: node scripts/generate-kana-data.mjs

import { writeFile } from "node:fs/promises";
import path from "node:path";

const KANJIVG_BASE =
  "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";

// Base gojuon + dakuten/handakuten, as [hiragana, romaji, group] tuples.
// Katakana codepoints are derived by +0x60 from hiragana (verified: あ 3042 -> ア 30A2).
const HIRAGANA_TABLE = [
  ["あ", "a", "vowel"], ["い", "i", "vowel"], ["う", "u", "vowel"], ["え", "e", "vowel"], ["お", "o", "vowel"],
  ["か", "ka", "k"], ["き", "ki", "k"], ["く", "ku", "k"], ["け", "ke", "k"], ["こ", "ko", "k"],
  ["さ", "sa", "s"], ["し", "shi", "s"], ["す", "su", "s"], ["せ", "se", "s"], ["そ", "so", "s"],
  ["た", "ta", "t"], ["ち", "chi", "t"], ["つ", "tsu", "t"], ["て", "te", "t"], ["と", "to", "t"],
  ["な", "na", "n"], ["に", "ni", "n"], ["ぬ", "nu", "n"], ["ね", "ne", "n"], ["の", "no", "n"],
  ["は", "ha", "h"], ["ひ", "hi", "h"], ["ふ", "fu", "h"], ["へ", "he", "h"], ["ほ", "ho", "h"],
  ["ま", "ma", "m"], ["み", "mi", "m"], ["む", "mu", "m"], ["め", "me", "m"], ["も", "mo", "m"],
  ["や", "ya", "y"], ["ゆ", "yu", "y"], ["よ", "yo", "y"],
  ["ら", "ra", "r"], ["り", "ri", "r"], ["る", "ru", "r"], ["れ", "re", "r"], ["ろ", "ro", "r"],
  ["わ", "wa", "w"], ["を", "wo", "w"], ["ん", "n", "w"],
  ["が", "ga", "k-dakuten"], ["ぎ", "gi", "k-dakuten"], ["ぐ", "gu", "k-dakuten"], ["げ", "ge", "k-dakuten"], ["ご", "go", "k-dakuten"],
  ["ざ", "za", "s-dakuten"], ["じ", "ji", "s-dakuten"], ["ず", "zu", "s-dakuten"], ["ぜ", "ze", "s-dakuten"], ["ぞ", "zo", "s-dakuten"],
  ["だ", "da", "t-dakuten"], ["ぢ", "ji", "t-dakuten"], ["づ", "zu", "t-dakuten"], ["で", "de", "t-dakuten"], ["ど", "do", "t-dakuten"],
  ["ば", "ba", "h-dakuten"], ["び", "bi", "h-dakuten"], ["ぶ", "bu", "h-dakuten"], ["べ", "be", "h-dakuten"], ["ぼ", "bo", "h-dakuten"],
  ["ぱ", "pa", "h-handakuten"], ["ぴ", "pi", "h-handakuten"], ["ぷ", "pu", "h-handakuten"], ["ぺ", "pe", "h-handakuten"], ["ぽ", "po", "h-handakuten"],
];

const KATAKANA_OFFSET = 0x60;

function toEntries() {
  const entries = [];
  for (const [hira, romaji, group] of HIRAGANA_TABLE) {
    const hiraCp = hira.codePointAt(0);
    const kataCp = hiraCp + KATAKANA_OFFSET;
    const kata = String.fromCodePoint(kataCp);
    entries.push({
      id: `hiragana-${romaji}-${hiraCp.toString(16)}`,
      char: hira,
      script: "hiragana",
      romaji,
      group,
      codepoint: hiraCp,
    });
    entries.push({
      id: `katakana-${romaji}-${kataCp.toString(16)}`,
      char: kata,
      script: "katakana",
      romaji,
      group,
      codepoint: kataCp,
    });
  }
  return entries;
}

function svgUrlFor(codepoint) {
  const hex = codepoint.toString(16).padStart(5, "0");
  return `${KANJIVG_BASE}${hex}.svg`;
}

// Very small, purpose-built SVG parser: we only need ordered stroke <path d="...">
// entries out of KanjiVG's fixed structure, so a regex scan is sufficient and
// avoids adding an XML/DOM dependency.
function parseStrokes(svgText) {
  const strokeGroupMatch = svgText.match(
    /<g id="kvg:StrokePaths_[0-9a-f]+"[^>]*>([\s\S]*?)<\/g>\s*<g id="kvg:StrokeNumbers/
  );
  const strokeSection = strokeGroupMatch ? strokeGroupMatch[1] : svgText;
  const pathRegex = /<path\s+id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g;
  const strokes = [];
  let match;
  while ((match = pathRegex.exec(strokeSection)) !== null) {
    strokes.push({ order: Number(match[1]), d: match[2] });
  }
  strokes.sort((a, b) => a.order - b.order);
  return strokes;
}

async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
  return null;
}

async function main() {
  const entries = toEntries();
  const results = [];
  const missing = [];

  const concurrency = 8;
  let cursor = 0;

  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      const url = svgUrlFor(entry.codepoint);
      const svgText = await fetchWithRetry(url);
      if (!svgText) {
        missing.push(entry);
        continue;
      }
      const strokes = parseStrokes(svgText);
      if (strokes.length === 0) {
        missing.push(entry);
        continue;
      }
      results.push({
        ...entry,
        viewBox: 109,
        strokeCount: strokes.length,
        strokes,
      });
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  results.sort((a, b) => a.codepoint - b.codepoint);

  console.log(`Fetched ${results.length}/${entries.length} characters.`);
  if (missing.length) {
    console.log(
      "Missing:",
      missing.map((m) => `${m.char}(${m.script})`).join(", ")
    );
  }

  const outPath = path.join(process.cwd(), "src/data/kana-strokes.json");
  await writeFile(outPath, JSON.stringify(results, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
