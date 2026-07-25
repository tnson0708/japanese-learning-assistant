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

export type CategoryTheme =
  | "all"
  | "daily_life"
  | "time_numbers"
  | "nature_places"
  | "school_work"
  | "concepts_actions";

export interface ThemeOption {
  id: CategoryTheme;
  label: string;
  categories: WordCategory[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "all", label: "All Themes", categories: CATEGORY_ORDER },
  {
    id: "daily_life",
    label: "🏠 Daily Life",
    categories: [
      "family_people",
      "body_health",
      "food_drink",
      "home_daily_life",
      "clothing_appearance",
    ],
  },
  {
    id: "time_numbers",
    label: "⏰ Time & Numbers",
    categories: ["time_calendar", "numbers_counting"],
  },
  {
    id: "nature_places",
    label: "🌿 Nature & Places",
    categories: [
      "nature_weather",
      "animals_plants",
      "places_directions",
      "transportation_travel",
    ],
  },
  {
    id: "school_work",
    label: "💼 School & Work",
    categories: [
      "school_work",
      "technology_communication",
      "money_shopping",
    ],
  },
  {
    id: "concepts_actions",
    label: "💬 Concepts & Actions",
    categories: [
      "emotions_personality",
      "society_culture_business",
      "thinking_abstract",
      "actions_general",
      "grammar_words",
      "other",
    ],
  },
];

export function getSubCategory(word: Word): string {
  if (word.notes?.includes("Special reading")) return "Days of the Month";

  const cat = word.category;
  const w = word.word;
  const k = word.kanji || "";
  const m = word.meaning || "";

  if (cat === "time_calendar") {
    if (word.id.startsWith("day-") || m.includes("day of the month")) {
      return "Days of the Month";
    }
    if (w.endsWith("ようび") || k.endsWith("曜日") || m.includes("thứ") || m.includes("Monday") || m.includes("Sunday")) {
      return "Days of the Week";
    }
    if (w.endsWith("がつ") || k.endsWith("月") || m.includes("tháng")) {
      return "Months of the Year";
    }
    if (["きょう", "あした", "きのう", "あさ", "ひる", "よる", "いま", "こんばん", "けさ", "らいしゅう", "こんしゅう", "せんしゅう"].includes(w)) {
      return "Relative Time & Seasons";
    }
    return "General Time Words";
  }

  if (cat === "numbers_counting") {
    if (["ひとつ", "ふたつ", "みっつ", "よっつ", "いつつ", "むっつ", "ななつ", "やつ", "ここのつ", "とお", "ひとり", "ふたり"].includes(w) || w.startsWith("～")) {
      return "Counters & Quantities";
    }
    return "Basic Numbers";
  }

  if (cat === "family_people") {
    if (["おとうさん", "おかあさん", "あに", "あね", "おとうと", "いもうと", "かぞく", "りょうしん", "そふ", "そぼ", "ちち", "はは"].includes(w)) {
      return "Family Members";
    }
    return "People & Relationships";
  }

  if (cat === "food_drink") {
    if (["おちゃ", "みず", "ぎゅうにゅう", "おさけ", "コーヒー", "ジュース", "ごはん", "あさごはん", "ひるごはん", "ばんごはん"].includes(w)) {
      return "Meals & Drinks";
    }
    return "Food & Ingredients";
  }

  if (cat === "places_directions") {
    if (["うえ", "した", "まえ", "うしろ", "みぎ", "ひだり", "なか", "そと", "となり", "ちかく", "ひがし", "にし", "みなみ", "きた"].includes(w)) {
      return "Directions & Positions";
    }
    return "Places & Locations";
  }

  if (cat === "actions_general") {
    if (["いく", "くる", "かえる", "あるく", "はしる", "およぐ", "でかける", "のる", "おりる"].includes(w)) {
      return "Movement & Travel";
    }
    if (["みる", "きく", "はなす", "よむ", "かく", "べんきょうする", "おしえる", "ならう"].includes(w)) {
      return "Communication & Study";
    }
    return "Daily Action Verbs";
  }

  return "General Words";
}


// ~500 words per level, written in kana (no kanji) to stay consistent with
// this app's kana-only scope. Sourced from a community JLPT 10k vocabulary
// deck (readings + word forms), romanized programmatically, and translated
// to Vietnamese. Level assignments are approximate: the modern JLPT does not
// publish an official vocabulary list, and the source deck only distinguishes
// a combined "N5–N4" tier — that tier was split in half by deck order (a
// frequency/difficulty proxy) into separate N5 and N4 sets here.
export const DAYS_OF_THE_MONTH: Word[] = [
  { id: "day-1", word: "ついたち", kanji: "一日", romaji: "tsuitachi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "1st day of the month", notes: "Special reading" },
  { id: "day-2", word: "ふつか", kanji: "二日", romaji: "futsuka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "2nd day of the month", notes: "Special reading" },
  { id: "day-3", word: "みっか", kanji: "三日", romaji: "mikka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "3rd day of the month", notes: "Special reading" },
  { id: "day-4", word: "よっか", kanji: "四日", romaji: "yokka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "4th day of the month", notes: "Special reading" },
  { id: "day-5", word: "いつか", kanji: "五日", romaji: "itsuka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "5th day of the month", notes: "Special reading" },
  { id: "day-6", word: "むいか", kanji: "六日", romaji: "muika", level: "n5", script: "hiragana", category: "time_calendar", meaning: "6th day of the month", notes: "Special reading" },
  { id: "day-7", word: "なのか", kanji: "七日", romaji: "nanoka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "7th day of the month", notes: "Special reading" },
  { id: "day-8", word: "ようか", kanji: "八日", romaji: "youka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "8th day of the month", notes: "Special reading" },
  { id: "day-9", word: "ここのか", kanji: "九日", romaji: "kokonoka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "9th day of the month", notes: "Special reading" },
  { id: "day-10", word: "とおか", kanji: "十日", romaji: "tooka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "10th day of the month", notes: "Special reading" },
  { id: "day-11", word: "じゅういちにち", kanji: "十一日", romaji: "juuichinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "11th day of the month" },
  { id: "day-12", word: "じゅうににち", kanji: "十二日", romaji: "juuninichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "12th day of the month" },
  { id: "day-13", word: "じゅうさんにち", kanji: "十三日", romaji: "juusannichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "13th day of the month" },
  { id: "day-14", word: "じゅうよっか", kanji: "十四日", romaji: "juuyokka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "14th day of the month", notes: "Special reading" },
  { id: "day-15", word: "じゅうごにち", kanji: "十五日", romaji: "juugonichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "15th day of the month" },
  { id: "day-16", word: "じゅうろくにち", kanji: "十六日", romaji: "juurokunichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "16th day of the month" },
  { id: "day-17", word: "じゅうしちにち", kanji: "十七日", romaji: "juushichinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "17th day of the month" },
  { id: "day-18", word: "じゅうはちにち", kanji: "十八日", romaji: "juuhachinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "18th day of the month" },
  { id: "day-19", word: "じゅうくにち", kanji: "十九日", romaji: "juukunichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "19th day of the month" },
  { id: "day-20", word: "はつか", kanji: "二十日", romaji: "hatsuka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "20th day of the month", notes: "Special reading" },
  { id: "day-21", word: "にじゅういちにち", kanji: "二十一日", romaji: "nijuuichinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "21st day of the month" },
  { id: "day-22", word: "にじゅうににち", kanji: "二十二日", romaji: "nijuuninichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "22nd day of the month" },
  { id: "day-23", word: "にじゅうさんにち", kanji: "二十三日", romaji: "nijuusannichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "23rd day of the month" },
  { id: "day-24", word: "にじゅうよっか", kanji: "二十四日", romaji: "nijuuyokka", level: "n5", script: "hiragana", category: "time_calendar", meaning: "24th day of the month", notes: "Special reading" },
  { id: "day-25", word: "にじゅうごにち", kanji: "二十五日", romaji: "nijuugonichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "25th day of the month" },
  { id: "day-26", word: "にじゅうろくにち", kanji: "二十六日", romaji: "nijuurokunichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "26th day of the month" },
  { id: "day-27", word: "にじゅうしちにち", kanji: "二十七日", romaji: "nijuushichinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "27th day of the month" },
  { id: "day-28", word: "にじゅうはちにち", kanji: "二十八日", romaji: "nijuuhachinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "28th day of the month" },
  { id: "day-29", word: "にじゅうくにち", kanji: "二十九日", romaji: "nijuukunichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "29th day of the month" },
  { id: "day-30", word: "さんじゅうにち", kanji: "三十日", romaji: "sanjuunichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "30th day of the month" },
  { id: "day-31", word: "さんじゅういちにち", kanji: "三十一日", romaji: "sanjuuichinichi", level: "n5", script: "hiragana", category: "time_calendar", meaning: "31st day of the month" },
];

const dayWordsSet = new Set(DAYS_OF_THE_MONTH.map((d) => d.word));

const baseMappedWords: Word[] = (jlptWordsRaw as Word[])
  .filter((w) => !dayWordsSet.has(w.word))
  .map((w) => {
    const mappedKanji = KANJI_MAP[w.word];
    if (mappedKanji && !w.kanji) {
      return { ...w, kanji: mappedKanji };
    }
    return w;
  });

export const wordList: Word[] = [...DAYS_OF_THE_MONTH, ...baseMappedWords];



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

