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

  if (cat === "home_daily_life" || cat === "clothing_appearance") {
    if (word.id.startsWith("color-") || ["いろ", "あか", "あかい", "あお", "あおい", "きいろ", "きいろい", "くろ", "くろい", "しろ", "しろい", "みどり", "むらさき", "ちゃいろ", "ピンク", "オレンジ", "はいいろ", "みずいろ", "きんいろ", "ぎんいろ"].includes(w)) {
      return "Colors & Appearance";
    }
  }

  if (cat === "places_directions") {
    if (word.id.startsWith("country-") || ["ベトナム", "アメリカ", "イギリス", "フランス", "ドイツ", "オーストラリア", "カナダ", "タイ", "シンガポール", "マレーシア", "インドネシア", "フィリピン", "インド", "イタリア", "スペイン", "ロシア", "ブラジル", "メキシコ", "エジプト"].includes(w)) {
      return "Countries & Nations";
    }
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

export const COUNTRY_WORDS: Word[] = [
  { id: "country-vietnam", word: "ベトナム", kanji: "べとなむ (越南)", romaji: "Betonamu", level: "n5", script: "katakana", category: "places_directions", meaning: "Vietnam", notes: "Việt Nam" },
  { id: "country-japan", word: "にほん", kanji: "日本", romaji: "Nihon", level: "n5", script: "hiragana", category: "places_directions", meaning: "Japan", notes: "Nhật Bản" },
  { id: "country-usa", word: "アメリカ", kanji: "あめりか (米国)", romaji: "Amerika", level: "n5", script: "katakana", category: "places_directions", meaning: "United States (USA)", notes: "Nước Mỹ" },
  { id: "country-uk", word: "イギリス", kanji: "いぎりす (英国)", romaji: "Igirisu", level: "n5", script: "katakana", category: "places_directions", meaning: "United Kingdom (UK)", notes: "Nước Anh" },
  { id: "country-china", word: "ちゅうごく", kanji: "中国", romaji: "Chuugoku", level: "n5", script: "hiragana", category: "places_directions", meaning: "China", notes: "Trung Quốc" },
  { id: "country-korea", word: "かんこく", kanji: "韓国", romaji: "Kankoku", level: "n5", script: "hiragana", category: "places_directions", meaning: "South Korea", notes: "Hàn Quốc" },
  { id: "country-france", word: "フランス", kanji: "ふらんす", romaji: "Furansu", level: "n5", script: "katakana", category: "places_directions", meaning: "France", notes: "Nước Pháp" },
  { id: "country-germany", word: "ドイツ", kanji: "どいつ", romaji: "Doitsu", level: "n5", script: "katakana", category: "places_directions", meaning: "Germany", notes: "Nước Đức" },
  { id: "country-australia", word: "オーストラリア", kanji: "おーすとらりあ", romaji: "Oosutoraria", level: "n5", script: "katakana", category: "places_directions", meaning: "Australia", notes: "Nước Úc" },
  { id: "country-canada", word: "カナダ", kanji: "かなだ", romaji: "Kanada", level: "n5", script: "katakana", category: "places_directions", meaning: "Canada", notes: "Canada" },
  { id: "country-thailand", word: "タイ", kanji: "たい", romaji: "Tai", level: "n5", script: "katakana", category: "places_directions", meaning: "Thailand", notes: "Thái Lan" },
  { id: "country-singapore", word: "シンガポール", kanji: "しんがぽーる", romaji: "Singapooru", level: "n5", script: "katakana", category: "places_directions", meaning: "Singapore", notes: "Singapore" },
  { id: "country-malaysia", word: "マレーシア", kanji: "まれーしあ", romaji: "Mareeshia", level: "n5", script: "katakana", category: "places_directions", meaning: "Malaysia", notes: "Malaysia" },
  { id: "country-indonesia", word: "インドネシア", kanji: "いんどねしあ", romaji: "Indoneshia", level: "n5", script: "katakana", category: "places_directions", meaning: "Indonesia", notes: "Indonesia" },
  { id: "country-philippines", word: "フィリピン", kanji: "ふぃりぴん", romaji: "Firipin", level: "n5", script: "katakana", category: "places_directions", meaning: "Philippines", notes: "Philippines" },
  { id: "country-india", word: "インド", kanji: "いんど (印度)", romaji: "Indo", level: "n5", script: "katakana", category: "places_directions", meaning: "India", notes: "Ấn Độ" },
  { id: "country-italy", word: "イタリア", kanji: "いたりあ", romaji: "Itaria", level: "n5", script: "katakana", category: "places_directions", meaning: "Italy", notes: "Nước Ý" },
  { id: "country-spain", word: "スペイン", kanji: "すぺいん", romaji: "Supein", level: "n5", script: "katakana", category: "places_directions", meaning: "Spain", notes: "Tây Ban Nha" },
  { id: "country-russia", word: "ロシア", kanji: "ろしあ", romaji: "Roshia", level: "n5", script: "katakana", category: "places_directions", meaning: "Russia", notes: "Nước Nga" },
  { id: "country-brazil", word: "ブラジル", kanji: "ぶらじる", romaji: "Buraziru", level: "n5", script: "katakana", category: "places_directions", meaning: "Brazil", notes: "Nước Brazil" },
  { id: "country-mexico", word: "メキシコ", kanji: "めきしこ", romaji: "Mekishiko", level: "n5", script: "katakana", category: "places_directions", meaning: "Mexico", notes: "Mexico" },
  { id: "country-egypt", word: "エジプト", kanji: "えじぷと", romaji: "Ejiputo", level: "n5", script: "katakana", category: "places_directions", meaning: "Egypt", notes: "Ai Cập" },
  { id: "country-switzerland", word: "スイス", kanji: "すいす", romaji: "Suisu", level: "n5", script: "katakana", category: "places_directions", meaning: "Switzerland", notes: "Thụy Sĩ" },
  { id: "country-netherlands", word: "オランダ", kanji: "おらんだ", romaji: "Oranda", level: "n5", script: "katakana", category: "places_directions", meaning: "Netherlands", notes: "Hà Lan" },
  { id: "country-belgium", word: "ベルギー", kanji: "べるぎー", romaji: "Berugii", level: "n5", script: "katakana", category: "places_directions", meaning: "Belgium", notes: "Nước Bỉ" },
  { id: "country-sweden", word: "スウェーデン", kanji: "すうぇーでん", romaji: "Suweeden", level: "n5", script: "katakana", category: "places_directions", meaning: "Sweden", notes: "Thụy Điển" },
  { id: "country-norway", word: "ノルウェー", kanji: "のるうぇー", romaji: "Noruwee", level: "n5", script: "katakana", category: "places_directions", meaning: "Norway", notes: "Na Uy" },
  { id: "country-denmark", word: "デンマーク", kanji: "でんまーく", romaji: "Denmaaku", level: "n5", script: "katakana", category: "places_directions", meaning: "Denmark", notes: "Đan Mạch" },
  { id: "country-finland", word: "フィンランド", kanji: "ふぃんらんど", romaji: "Finrando", level: "n5", script: "katakana", category: "places_directions", meaning: "Finland", notes: "Phần Lan" },
  { id: "country-newzealand", word: "ニュージーランド", kanji: "にゅーじーらんど", romaji: "Nyuujiirando", level: "n5", script: "katakana", category: "places_directions", meaning: "New Zealand", notes: "New Zealand" },
  { id: "country-turkey", word: "トルコ", kanji: "とるこ", romaji: "Toruko", level: "n5", script: "katakana", category: "places_directions", meaning: "Turkey", notes: "Thổ Nhĩ Kỳ" },
  { id: "country-saudi", word: "サウジアラビア", kanji: "さうじあらびあ", romaji: "Saujiarabia", level: "n5", script: "katakana", category: "places_directions", meaning: "Saudi Arabia", notes: "Ả Rập Xê Út" },
  { id: "country-argentina", word: "アルゼンチン", kanji: "あるぜんちん", romaji: "Aruzenchin", level: "n5", script: "katakana", category: "places_directions", meaning: "Argentina", notes: "Argentina" },
  { id: "country-chile", word: "チリ", kanji: "ちり", romaji: "Chiri", level: "n5", script: "katakana", category: "places_directions", meaning: "Chile", notes: "Chile" },
  { id: "country-colombia", word: "コロンビア", kanji: "ころんびあ", romaji: "Koronbia", level: "n5", script: "katakana", category: "places_directions", meaning: "Colombia", notes: "Colombia" },
  { id: "country-cambodia", word: "カンボジア", kanji: "かんぼじあ", romaji: "Kanbojia", level: "n5", script: "katakana", category: "places_directions", meaning: "Cambodia", notes: "Campuchia" },
  { id: "country-laos", word: "ラオス", kanji: "らおす", romaji: "Raosu", level: "n5", script: "katakana", category: "places_directions", meaning: "Laos", notes: "Nước Lào" },
  { id: "country-myanmar", word: "ミャンマー", kanji: "みゃんまー", romaji: "Myanmaa", level: "n5", script: "katakana", category: "places_directions", meaning: "Myanmar", notes: "Myanmar" },
  { id: "country-mongolia", word: "モンゴル", kanji: "もんごる (蒙古)", romaji: "Mongoru", level: "n5", script: "katakana", category: "places_directions", meaning: "Mongolia", notes: "Mông Cổ" },
  { id: "country-pakistan", word: "パキスタン", kanji: "ぱきすたん", romaji: "Pakisutan", level: "n5", script: "katakana", category: "places_directions", meaning: "Pakistan", notes: "Pakistan" },
];


export const COLOR_WORDS: Word[] = [
  { id: "color-iro", word: "いろ", kanji: "色", romaji: "Iro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Color", notes: "Màu sắc" },
  { id: "color-aka", word: "あか", kanji: "赤", romaji: "Aka", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Red (noun)", notes: "Màu đỏ" },
  { id: "color-akai", word: "あかい", kanji: "赤い", romaji: "Akai", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Red (adjective)", notes: "Đỏ" },
  { id: "color-ao", word: "あお", kanji: "青", romaji: "Ao", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Blue (noun)", notes: "Màu xanh dương" },
  { id: "color-aoi", word: "あおい", kanji: "青い", romaji: "Aoi", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Blue (adjective)", notes: "Xanh dương" },
  { id: "color-kiiro", word: "きいろ", kanji: "黄色", romaji: "Kiiro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Yellow (noun)", notes: "Màu vàng" },
  { id: "color-kiiroi", word: "きいろい", kanji: "黄色い", romaji: "Kiiroi", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Yellow (adjective)", notes: "Vàng" },
  { id: "color-kuro", word: "くろ", kanji: "黒", romaji: "Kuro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Black (noun)", notes: "Màu đen" },
  { id: "color-kuroi", word: "くろい", kanji: "黒い", romaji: "Kuroi", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Black (adjective)", notes: "Đen" },
  { id: "color-shiro", word: "しろ", kanji: "白", romaji: "Shiro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "White (noun)", notes: "Màu trắng" },
  { id: "color-shiroi", word: "しろい", kanji: "白い", romaji: "Shiroi", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "White (adjective)", notes: "Trắng" },
  { id: "color-midori", word: "みどり", kanji: "緑", romaji: "Midori", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Green", notes: "Màu xanh lá cây" },
  { id: "color-murasaki", word: "むらさき", kanji: "紫", romaji: "Murasaki", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Purple", notes: "Màu tím" },
  { id: "color-chairo", word: "ちゃいろ", kanji: "茶色", romaji: "Chairo", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Brown", notes: "Màu nâu" },
  { id: "color-pinku", word: "ピンク", kanji: "ぴんく", romaji: "Pinku", level: "n5", script: "katakana", category: "home_daily_life", meaning: "Pink", notes: "Màu hồng" },
  { id: "color-orenji", word: "オレンジ", kanji: "おれんじ", romaji: "Orenji", level: "n5", script: "katakana", category: "home_daily_life", meaning: "Orange", notes: "Màu cam" },
  { id: "color-haiiro", word: "はいいろ", kanji: "灰色", romaji: "Haiiro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Gray", notes: "Màu xám" },
  { id: "color-mizuiro", word: "みずいろ", kanji: "水色", romaji: "Mizuiro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Light blue", notes: "Màu xanh da trời" },
  { id: "color-kin", word: "きんいろ", kanji: "金色", romaji: "Kiniro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Gold", notes: "Màu vàng kim" },
  { id: "color-gin", word: "ぎんいろ", kanji: "銀色", romaji: "Giniro", level: "n5", script: "hiragana", category: "home_daily_life", meaning: "Silver", notes: "Màu bạc" },
];

export const AGE_WORDS: Word[] = [
  { id: "age-1", word: "いっさい", kanji: "1歳", romaji: "Issai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "1 year old", notes: "1 tuổi (biến âm xúc âm: いっさい)" },
  { id: "age-2", word: "にさい", kanji: "2歳", romaji: "Nisai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "2 years old", notes: "2 tuổi" },
  { id: "age-3", word: "さんさい", kanji: "3歳", romaji: "Sansai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "3 years old", notes: "3 tuổi" },
  { id: "age-4", word: "よんさい", kanji: "4歳", romaji: "Yonsai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "4 years old", notes: "4 tuổi" },
  { id: "age-5", word: "ごさい", kanji: "5歳", romaji: "Gosai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "5 years old", notes: "5 tuổi" },
  { id: "age-6", word: "ろくさい", kanji: "6歳", romaji: "Rokusai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "6 years old", notes: "6 tuổi" },
  { id: "age-7", word: "ななさい", kanji: "7歳", romaji: "Nanasai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "7 years old", notes: "7 tuổi" },
  { id: "age-8", word: "はっさい", kanji: "8歳", romaji: "Hassai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "8 years old", notes: "8 tuổi (biến âm xúc âm: はっさい)" },
  { id: "age-9", word: "きゅうさい", kanji: "9歳", romaji: "Kyūsai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "9 years old", notes: "9 tuổi" },
  { id: "age-10", word: "じゅっさい", kanji: "10歳", romaji: "Jussai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "10 years old", notes: "10 tuổi (hoặc じっさい)" },
  { id: "age-20", word: "はたち", kanji: "20歳", romaji: "Hatachi", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "20 years old", notes: "20 tuổi (cách đọc đặc biệt: はたち)" },
  { id: "age-nansai", word: "なんさい", kanji: "何歳", romaji: "Nansai", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "How old?", notes: "Mấy tuổi, bao nhiêu tuổi" },
  { id: "age-oikutsu", word: "おいくつ", kanji: "おいくつ", romaji: "Oikutsu", level: "n5", script: "hiragana", category: "numbers_counting", meaning: "How old? (Polite)", notes: "Bao nhiêu tuổi (dạng kính ngữ)" },
];

const dayWordsSet = new Set(DAYS_OF_THE_MONTH.map((d) => d.word));
const countryWordsSet = new Set(COUNTRY_WORDS.map((c) => c.word));
const colorWordsSet = new Set(COLOR_WORDS.map((c) => c.word));
const ageWordsSet = new Set(AGE_WORDS.map((a) => a.word));

const baseMappedWords: Word[] = (jlptWordsRaw as Word[])
  .filter((w) => !dayWordsSet.has(w.word) && !countryWordsSet.has(w.word) && !colorWordsSet.has(w.word) && !ageWordsSet.has(w.word))
  .map((w) => {
    const mappedKanji = KANJI_MAP[w.word];
    if (mappedKanji && !w.kanji) {
      return { ...w, kanji: mappedKanji };
    }
    return w;
  });

export const wordList: Word[] = [...AGE_WORDS, ...DAYS_OF_THE_MONTH, ...COUNTRY_WORDS, ...COLOR_WORDS, ...baseMappedWords];





export type WordDifficulty = "easy" | "medium" | "advanced" | "native";

export const WORD_DIFFICULTIES: WordDifficulty[] = [
  "easy",
  "medium",
  "advanced",
  "native",
];

export const WORD_DIFFICULTY_LABELS_BILINGUAL: Record<
  "en" | "vi",
  Record<WordDifficulty, string>
> = {
  en: {
    easy: "Easy",
    medium: "Medium",
    advanced: "Advanced",
    native: "Native",
  },
  vi: {
    easy: "Dễ",
    medium: "Trung bình",
    advanced: "Nâng cao",
    native: "Bản ngữ",
  },
};

export const WORD_DIFFICULTY_LABELS: Record<WordDifficulty, string> =
  WORD_DIFFICULTY_LABELS_BILINGUAL.en;

export const CATEGORY_LABELS_VI: Record<WordCategory, string> = {
  numbers_counting: "Con số & Phép đếm",
  time_calendar: "Thời gian & Lịch",
  family_people: "Gia đình & Con người",
  body_health: "Cơ thể & Sức khỏe",
  food_drink: "Đồ ăn & Thức uống",
  home_daily_life: "Nhà cửa & Đời sống",
  clothing_appearance: "Trang phục & Diện mạo",
  nature_weather: "Thiên nhiên & Thời tiết",
  animals_plants: "Động vật & Thực vật",
  places_directions: "Địa điểm & Phương hướng",
  transportation_travel: "Giao thông & Du lịch",
  school_work: "Trường học & Công việc",
  technology_communication: "Công nghệ & Giao tiếp",
  money_shopping: "Tiền bạc & Mua sắm",
  emotions_personality: "Cảm xúc & Tính cách",
  society_culture_business: "Xã hội & Văn hóa",
  thinking_abstract: "Tư duy & Khái niệm",
  actions_general: "Hành động chung",
  grammar_words: "Từ ngữ ngữ pháp",
  other: "Khác",
};

export const SUB_CATEGORY_LABELS: Record<string, Record<"en" | "vi", string>> = {
  "Colors & Appearance": { en: "Colors & Appearance", vi: "Màu sắc & Diện mạo" },
  "Countries & Nations": { en: "Countries & Nations", vi: "Tên các quốc gia" },
  "Days of the Month": { en: "Days of the Month", vi: "Ngày trong tháng" },
  "Days of the Week": { en: "Days of the Week", vi: "Các ngày trong tuần" },
  "Months of the Year": { en: "Months of the Year", vi: "Các tháng trong năm" },
  "Relative Time & Seasons": { en: "Relative Time & Seasons", vi: "Thời gian tương đối & Mùa" },
  "General Time Words": { en: "General Time Words", vi: "Từ chỉ thời gian chung" },
  "Basic Numbers": { en: "Basic Numbers", vi: "Số cơ bản" },
  "Counters & Quantities": { en: "Counters & Quantities", vi: "Lượng từ & Bộ đếm" },
  "General Numbers": { en: "General Numbers", vi: "Các con số khác" },
  "Family Members": { en: "Family Members", vi: "Thành viên gia đình" },
  "People & Relationships": { en: "People & Relationships", vi: "Mối quan hệ & Con người" },
  "General People Words": { en: "General People Words", vi: "Từ ngữ xưng hô" },
  "Meals & Drinks": { en: "Meals & Drinks", vi: "Bữa ăn & Đồ uống" },
  "Food & Ingredients": { en: "Food & Ingredients", vi: "Thực phẩm & Nguyên liệu" },
  "General Food Words": { en: "General Food Words", vi: "Từ vựng ẩm thực" },
  "Directions & Positions": { en: "Directions & Positions", vi: "Phương hướng & Vị trí" },
  "Places & Locations": { en: "Places & Locations", vi: "Địa điểm & Nơi chốn" },
  "General Location Words": { en: "General Location Words", vi: "Từ vựng địa điểm chung" },
  "Movement & Travel": { en: "Movement & Travel", vi: "Di chuyển & Du lịch" },
  "Communication & Study": { en: "Communication & Study", vi: "Giao tiếp & Học tập" },
  "Daily Action Verbs": { en: "Daily Action Verbs", vi: "Động từ hàng ngày" },
  "General Words": { en: "General Words", vi: "Từ vựng chung" },
};

export function getWordMeaning(word: Word, lang: "en" | "vi"): string {
  if (word.id.startsWith("day-")) {
    const dayNum = word.id.replace("day-", "");
    if (lang === "vi") return `Ngày ${dayNum} trong tháng`;
  }
  if ((word.id.startsWith("country-") || word.id.startsWith("color-") || word.id.startsWith("age-")) && word.notes && lang === "vi") {
    return word.notes;
  }
  return word.meaning;
}

export function getWordNotes(word: Word, lang: "en" | "vi"): string | undefined {
  if (!word.notes) return undefined;
  if (word.notes === "Special reading") {
    return lang === "vi" ? "Cách đọc đặc biệt" : "Special reading";
  }
  if (word.id.startsWith("country-")) {
    return lang === "vi" ? "Tên quốc gia" : "Country name";
  }
  if (word.id.startsWith("color-")) {
    return lang === "vi" ? "Từ vựng màu sắc" : "Color word";
  }
  if (word.id.startsWith("age-")) {
    return lang === "vi" ? "Cách đếm tuổi (～歳)" : "Age counting";
  }
  return word.notes;
}



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

export function getAllWords(): Word[] {
  return wordList;
}


