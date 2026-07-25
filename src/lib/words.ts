import jlptWordsRaw from "@/data/jlpt-words.json";
import type { Script } from "@/lib/kana";

export type JlptLevel = "n5" | "n4" | "n3" | "n2" | "n1";

export type WordCategory =
  | "numbers_counting"
  | "time_calendar"
  | "family_people"
  | "body_health"
  | "food_drink"
  | "home_daily_life"
  | "clothing_appearance"
  | "nature_weather"
  | "animals_plants"
  | "places_directions"
  | "transportation_travel"
  | "school_work"
  | "technology_communication"
  | "money_shopping"
  | "emotions_personality"
  | "society_culture_business"
  | "thinking_abstract"
  | "actions_general"
  | "grammar_words"
  | "other";

export interface Word {
  id: string;
  word: string;
  kanji?: string;
  romaji: string;
  level: JlptLevel;
  script: Script;
  category: WordCategory;
  /** Meaning, shown as a check-phase hint. */
  meaning: string;
  notes?: string;
}

const KANJI_MAP: Record<string, string> = {
  がっこう: "学校",
  せんせい: "先生",
  ともだち: "友達",
  たべる: "食べる",
  のむ: "飲む",
  みず: "水",
  ひと: "人",
  いえ: "家",
  くるま: "車",
  でんわ: "電話",
  あさ: "朝",
  ひる: "昼",
  よる: "夜",
  きょう: "今日",
  あした: "明日",
  きのう: "昨日",
  ほん: "本",
  にほん: "日本",
  にほんご: "日本語",
  えいご: "英語",
  がくせい: "学生",
  だいがく: "大学",
  しごと: "仕事",
  さかな: "魚",
  にく: "肉",
  やさい: "野菜",
  おちゃ: "お茶",
  いぬ: "犬",
  ねこ: "猫",
  とり: "鳥",
  やま: "山",
  かわ: "川",
  うみ: "海",
  そら: "空",
  あめ: "雨",
  ゆき: "雪",
  はな: "花",
  き: "木",
  つき: "月",
  ひ: "日",
  あける: "開ける",
  しめる: "閉める",
  かう: "買う",
  うる: "売る",
  いく: "行く",
  くる: "来る",
  かえる: "帰る",
  みる: "見る",
  きく: "聞く",
  はなす: "話す",
  よむ: "読む",
  かく: "書く",
  あるく: "歩く",
  はしる: "走る",
  およぐ: "泳ぐ",
  あう: "会う",
  まつ: "待つ",
  わかる: "分かる",
  つくる: "作る",
  つかう: "使う",
  おもう: "思う",
  かんがえる: "考える",
  はじめる: "始める",
  おわる: "終わる",
};


export const JLPT_LEVELS: JlptLevel[] = ["n5", "n4", "n3", "n2", "n1"];

export const JLPT_LEVEL_LABELS: Record<JlptLevel, string> = {
  n5: "N5",
  n4: "N4",
  n3: "N3",
  n2: "N2",
  n1: "N1",
};

// Display order for topic groups on the vocabulary page — concrete,
// everyday topics first, grammar/catch-all buckets last.
export const CATEGORY_ORDER: WordCategory[] = [
  "family_people",
  "body_health",
  "food_drink",
  "home_daily_life",
  "clothing_appearance",
  "nature_weather",
  "animals_plants",
  "places_directions",
  "transportation_travel",
  "school_work",
  "technology_communication",
  "money_shopping",
  "time_calendar",
  "numbers_counting",
  "emotions_personality",
  "society_culture_business",
  "thinking_abstract",
  "actions_general",
  "grammar_words",
  "other",
];

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  numbers_counting: "Numbers & Counting",
  time_calendar: "Time & Calendar",
  family_people: "Family & People",
  body_health: "Body & Health",
  food_drink: "Food & Drink",
  home_daily_life: "Home & Daily Life",
  clothing_appearance: "Clothing & Appearance",
  nature_weather: "Nature & Weather",
  animals_plants: "Animals & Plants",
  places_directions: "Places & Directions",
  transportation_travel: "Transportation & Travel",
  school_work: "School & Work",
  technology_communication: "Technology & Communication",
  money_shopping: "Money & Shopping",
  emotions_personality: "Emotions & Personality",
  society_culture_business: "Society, Culture & Business",
  thinking_abstract: "Thinking & Abstract Concepts",
  actions_general: "General Actions",
  grammar_words: "Grammar Words & Expressions",
  other: "Other",
};

// ~500 words per level, written in kana (no kanji) to stay consistent with
// this app's kana-only scope. Sourced from a community JLPT 10k vocabulary
// deck (readings + word forms), romanized programmatically, and translated
// to Vietnamese. Level assignments are approximate: the modern JLPT does not
// publish an official vocabulary list, and the source deck only distinguishes
// a combined "N5–N4" tier — that tier was split in half by deck order (a
// frequency/difficulty proxy) into separate N5 and N4 sets here.
export const wordList: Word[] = (jlptWordsRaw as Word[]).map((w) => {
  const mappedKanji = KANJI_MAP[w.word];
  if (mappedKanji && !w.kanji) {
    return { ...w, kanji: mappedKanji };
  }
  return w;
});


export type WordDifficulty = "easy" | "medium" | "advanced" | "native";

export const WORD_DIFFICULTIES: WordDifficulty[] = [
  "easy",
  "medium",
  "advanced",
  "native",
];

export const WORD_DIFFICULTY_LABELS: Record<WordDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  advanced: "Advanced",
  native: "Native",
};

export const DIFFICULTY_JLPT_MAP: Record<WordDifficulty, JlptLevel[]> = {
  easy: ["n5"],
  medium: ["n4", "n3"],
  advanced: ["n2"],
  native: ["n1"],
};

export function getWordsByDifficulty(
  difficulty: WordDifficulty,
  script: Script | "both" = "both"
): Word[] {
  const targetLevels = DIFFICULTY_JLPT_MAP[difficulty];
  return wordList.filter(
    (w) => targetLevels.includes(w.level) && (script === "both" || w.script === script)
  );
}

export function randomWordByDifficulty(
  difficulty: WordDifficulty,
  script: Script | "both" = "both"
): Word {
  const pool = getWordsByDifficulty(difficulty, script);
  if (pool.length === 0) return wordList[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function groupWordsByCategoryAndDifficulty(
  difficulty: WordDifficulty,
  script: Script | "both" = "both"
): { category: WordCategory; words: Word[] }[] {
  const words = getWordsByDifficulty(difficulty, script);
  const buckets = new Map<WordCategory, Word[]>();
  for (const w of words) {
    const bucket = buckets.get(w.category) ?? [];
    bucket.push(w);
    buckets.set(w.category, bucket);
  }
  return CATEGORY_ORDER.filter((c) => buckets.has(c)).map((category) => ({
    category,
    words: buckets.get(category)!,
  }));
}

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

/** Words for a level/script, bucketed by topic in `CATEGORY_ORDER` (empty buckets omitted). */
export function groupWordsByCategory(
  level: JlptLevel,
  script: Script | "both" = "both"
): { category: WordCategory; words: Word[] }[] {
  const words = getWordsByLevel(level, script);
  const buckets = new Map<WordCategory, Word[]>();
  for (const w of words) {
    const bucket = buckets.get(w.category) ?? [];
    bucket.push(w);
    buckets.set(w.category, bucket);
  }
  return CATEGORY_ORDER.filter((c) => buckets.has(c)).map((category) => ({
    category,
    words: buckets.get(category)!,
  }));
}

