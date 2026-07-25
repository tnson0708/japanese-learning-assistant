// Fetches stroke-order SVG data from KanjiVG for every Hiragana/Katakana
// character (plus youon/contracted-sound combinations like きゃ) and bundles
// it into src/data/kana-strokes.json for offline use.
//
// Youon combos (base kana + small ya/yu/yo, e.g. き + ゃ = きゃ) aren't single
// Unicode characters, so KanjiVG has no glyph for them directly. We fetch the
// base kana and the small ya/yu/yo separately, then compose a synthetic
// stroke list by scaling and repositioning each into a shared 0-109 square
// (the same coordinate space every other kana uses, so the existing
// stroke-order viewer and handwriting-practice canvas need no changes).
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

// Small ya/yu/yo, fetched only to source stroke data for the youon combos
// below — never written to the output as standalone entries.
const SMALL_YOUON_TABLE = [
  ["ゃ", "ya"],
  ["ゅ", "yu"],
  ["ょ", "yo"],
];

// Youon (contracted sound) combos: [baseHiragana, smallHiragana, romaji, group].
// Grouped alongside the base row they're taught with, suffixed "-youon".
const YOUON_TABLE = [
  ["き", "ゃ", "kya", "k-youon"], ["き", "ゅ", "kyu", "k-youon"], ["き", "ょ", "kyo", "k-youon"],
  ["し", "ゃ", "sha", "s-youon"], ["し", "ゅ", "shu", "s-youon"], ["し", "ょ", "sho", "s-youon"],
  ["ち", "ゃ", "cha", "t-youon"], ["ち", "ゅ", "chu", "t-youon"], ["ち", "ょ", "cho", "t-youon"],
  ["に", "ゃ", "nya", "n-youon"], ["に", "ゅ", "nyu", "n-youon"], ["に", "ょ", "nyo", "n-youon"],
  ["ひ", "ゃ", "hya", "h-youon"], ["ひ", "ゅ", "hyu", "h-youon"], ["ひ", "ょ", "hyo", "h-youon"],
  ["み", "ゃ", "mya", "m-youon"], ["み", "ゅ", "myu", "m-youon"], ["み", "ょ", "myo", "m-youon"],
  ["り", "ゃ", "rya", "r-youon"], ["り", "ゅ", "ryu", "r-youon"], ["り", "ょ", "ryo", "r-youon"],
  ["ぎ", "ゃ", "gya", "k-dakuten-youon"], ["ぎ", "ゅ", "gyu", "k-dakuten-youon"], ["ぎ", "ょ", "gyo", "k-dakuten-youon"],
  ["じ", "ゃ", "ja", "s-dakuten-youon"], ["じ", "ゅ", "ju", "s-dakuten-youon"], ["じ", "ょ", "jo", "s-dakuten-youon"],
  ["び", "ゃ", "bya", "h-dakuten-youon"], ["び", "ゅ", "byu", "h-dakuten-youon"], ["び", "ょ", "byo", "h-dakuten-youon"],
  ["ぴ", "ゃ", "pya", "h-handakuten-youon"], ["ぴ", "ゅ", "pyu", "h-handakuten-youon"], ["ぴ", "ょ", "pyo", "h-handakuten-youon"],
];

const KATAKANA_OFFSET = 0x60;
const CANVAS = 109;

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

async function fetchStrokes(codepoint) {
  const svgText = await fetchWithRetry(svgUrlFor(codepoint));
  if (!svgText) return null;
  const strokes = parseStrokes(svgText);
  return strokes.length ? strokes : null;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

// KanjiVG stroke paths only ever use one absolute "M x,y" moveto followed by
// relative "c" cubic-curve segments, so a full path-grammar parser isn't
// needed: transform the leading M point with the full affine (scale +
// translate), and scale every subsequent number as a delta (no translation).
function transformPathD(d, { scale, tx, ty }) {
  const mMatch = d.match(/^M\s*(-?[\d.]+)[, ]\s*(-?[\d.]+)/);
  if (!mMatch) throw new Error(`Unexpected stroke path format: ${d}`);
  const mx = round(parseFloat(mMatch[1]) * scale + tx);
  const my = round(parseFloat(mMatch[2]) * scale + ty);
  const rest = d.slice(mMatch[0].length);
  const scaledRest = rest.replace(/-?\d+\.?\d*/g, (num) =>
    String(round(parseFloat(num) * scale))
  );
  return `M${mx},${my}${scaledRest}`;
}

function transformStrokes(strokes, transform, orderOffset) {
  return strokes.map((s, i) => ({
    order: orderOffset + i + 1,
    d: transformPathD(s.d, transform),
  }));
}

// Lay the base char (larger, left) and small ya/yu/yo (smaller, bottom-right,
// slightly overlapping) out inside the same 0-109 square every other kana
// uses, so the stroke-order viewer and handwriting-practice canvas work
// unmodified for youon entries.
function composeYouonStrokes(baseStrokes, smallStrokes) {
  const BASE_SCALE = 0.64;
  const SMALL_SCALE = 0.46;
  const OVERLAP = 0.12; // fraction of the base's width the small char overlaps into

  const baseW = BASE_SCALE * CANVAS;
  const smallW = SMALL_SCALE * CANVAS;
  const totalW = baseW + smallW * (1 - OVERLAP);
  const marginX = (CANVAS - totalW) / 2;

  const txBase = marginX;
  const tyBase = (CANVAS - baseW) / 2;
  const baseTransformed = transformStrokes(
    baseStrokes,
    { scale: BASE_SCALE, tx: txBase, ty: tyBase },
    0
  );

  const txSmall = marginX + baseW - smallW * OVERLAP;
  const tySmall = tyBase + baseW - smallW; // bottom-align with the base char
  const smallTransformed = transformStrokes(
    smallStrokes,
    { scale: SMALL_SCALE, tx: txSmall, ty: tySmall },
    baseStrokes.length
  );

  return [...baseTransformed, ...smallTransformed];
}

async function main() {
  const entries = toEntries();
  const results = [];
  const missing = [];
  const strokesByKey = new Map(); // `${script}:${char}` -> strokes, for youon composition

  const smallEntries = [];
  for (const [char, romaji] of SMALL_YOUON_TABLE) {
    const hiraCp = char.codePointAt(0);
    const kataCp = hiraCp + KATAKANA_OFFSET;
    smallEntries.push({ char, script: "hiragana", codepoint: hiraCp, romaji });
    smallEntries.push({
      char: String.fromCodePoint(kataCp),
      script: "katakana",
      codepoint: kataCp,
      romaji,
    });
  }

  const fetchQueue = [...entries, ...smallEntries];
  const concurrency = 8;
  let cursor = 0;

  async function worker() {
    while (cursor < fetchQueue.length) {
      const entry = fetchQueue[cursor++];
      const strokes = await fetchStrokes(entry.codepoint);
      if (!strokes) {
        missing.push(entry);
        continue;
      }
      strokesByKey.set(`${entry.script}:${entry.char}`, strokes);
      if (entry.group) {
        results.push({
          ...entry,
          viewBox: CANVAS,
          strokeCount: strokes.length,
          strokes,
        });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  // Compose youon combos from the already-fetched base + small-kana strokes.
  let youonCodepoint = 0xf000;
  for (const [baseHira, smallHira, romaji, group] of YOUON_TABLE) {
    for (const script of ["hiragana", "katakana"]) {
      const base = script === "hiragana" ? baseHira : String.fromCodePoint(baseHira.codePointAt(0) + KATAKANA_OFFSET);
      const small = script === "hiragana" ? smallHira : String.fromCodePoint(smallHira.codePointAt(0) + KATAKANA_OFFSET);
      const baseStrokes = strokesByKey.get(`${script}:${base}`);
      const smallStrokes = strokesByKey.get(`${script}:${small}`);
      if (!baseStrokes || !smallStrokes) {
        missing.push({ char: `${base}${small}`, script });
        continue;
      }
      const strokes = composeYouonStrokes(baseStrokes, smallStrokes);
      results.push({
        id: `${script}-${romaji}-youon`,
        char: `${base}${small}`,
        script,
        romaji,
        group,
        codepoint: youonCodepoint++,
        viewBox: CANVAS,
        strokeCount: strokes.length,
        strokes,
      });
    }
  }

  results.sort((a, b) => a.codepoint - b.codepoint);

  console.log(`Fetched ${results.length} characters.`);
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
