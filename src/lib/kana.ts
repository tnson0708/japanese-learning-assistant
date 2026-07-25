import kanaStrokesRaw from "@/data/kana-strokes.json";

export type Script = "hiragana" | "katakana";

export interface KanaStroke {
  order: number;
  d: string;
}

export interface Kana {
  id: string;
  char: string;
  script: Script;
  romaji: string;
  group: string;
  codepoint: number;
  viewBox: number;
  strokeCount: number;
  strokes: KanaStroke[];
}

export const kanaList = kanaStrokesRaw as Kana[];

const byId = new Map(kanaList.map((k) => [k.id, k]));

export function getKanaById(id: string): Kana | undefined {
  return byId.get(id);
}

export function getKanaByScript(script: Script): Kana[] {
  return kanaList.filter((k) => k.script === script);
}

// Display order for the kana chart, grouped the way it's traditionally taught.
export const GROUP_ORDER = [
  "vowel",
  "k",
  "s",
  "t",
  "n",
  "h",
  "m",
  "y",
  "r",
  "w",
  "k-dakuten",
  "s-dakuten",
  "t-dakuten",
  "h-dakuten",
  "h-handakuten",
  "k-youon",
  "s-youon",
  "t-youon",
  "n-youon",
  "h-youon",
  "m-youon",
  "r-youon",
  "k-dakuten-youon",
  "s-dakuten-youon",
  "h-dakuten-youon",
  "h-handakuten-youon",
] as const;

export const GROUP_LABELS: Record<string, string> = {
  vowel: "Vowels",
  k: "K",
  s: "S",
  t: "T",
  n: "N",
  h: "H",
  m: "M",
  y: "Y",
  r: "R",
  w: "W",
  "k-dakuten": "K (dakuten)",
  "s-dakuten": "S (dakuten)",
  "t-dakuten": "T (dakuten)",
  "h-dakuten": "H (dakuten)",
  "h-handakuten": "H (handakuten)",
  "k-youon": "Youon — K",
  "s-youon": "Youon — Sh",
  "t-youon": "Youon — Ch",
  "n-youon": "Youon — N",
  "h-youon": "Youon — H",
  "m-youon": "Youon — M",
  "r-youon": "Youon — R",
  "k-dakuten-youon": "Youon — G",
  "s-dakuten-youon": "Youon — J",
  "h-dakuten-youon": "Youon — B",
  "h-handakuten-youon": "Youon — P",
};

export function sortByGroup(list: Kana[]): Kana[] {
  return [...list].sort((a, b) => {
    const ga = GROUP_ORDER.indexOf(a.group as (typeof GROUP_ORDER)[number]);
    const gb = GROUP_ORDER.indexOf(b.group as (typeof GROUP_ORDER)[number]);
    if (ga !== gb) return ga - gb;
    return a.codepoint - b.codepoint;
  });
}

export type KanaSection = "all" | "main" | "dakuten" | "youon";

export const MAIN_GROUPS = new Set([
  "vowel",
  "k",
  "s",
  "t",
  "n",
  "h",
  "m",
  "y",
  "r",
  "w",
]);

export const DAKUTEN_GROUPS = new Set([
  "k-dakuten",
  "s-dakuten",
  "t-dakuten",
  "h-dakuten",
  "h-handakuten",
]);

export function getKanaSection(group: string): "main" | "dakuten" | "youon" {
  if (MAIN_GROUPS.has(group)) return "main";
  if (DAKUTEN_GROUPS.has(group)) return "dakuten";
  return "youon";
}

export function filterKana(
  script: Script | "both" = "both",
  section: KanaSection = "all"
): Kana[] {
  return kanaList.filter((k) => {
    if (script !== "both" && k.script !== script) return false;
    if (section !== "all" && getKanaSection(k.group) !== section) return false;
    return true;
  });
}

export function randomKana(
  script: Script | "both" = "both",
  section: KanaSection = "all"
): Kana {
  const pool = filterKana(script, section);
  if (pool.length === 0) return kanaList[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

