"use client";

import { useState } from "react";
import {
  BookOpen,
  Building2,
  Cake,
  Globe2,
  Search,
  Subtitles,
  Volume2,
} from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface VocabCardItem {
  id: string;
  jp: string;
  kanji?: string;
  romaji: string;
  meaning: string;
  note?: string;
  noteWarning?: boolean;
  category: "pronoun" | "job" | "location" | "suffix" | "question" | "response" | "country";
  categoryLabel: string;
}

const LESSON_1_WORDS: VocabCardItem[] = [
  {
    id: "w1",
    jp: "わたし",
    romaji: "watashi",
    meaning: "tôi (đại từ nhân xưng ngôi thứ I)",
    category: "pronoun",
    categoryLabel: "Đại từ",
  },
  {
    id: "w2",
    jp: "あなた",
    romaji: "anata",
    meaning: "anh / chị, ông / bà, bạn (ngôi thứ II số ít)",
    note: "Hạn chế dùng khi đã biết tên người đối thoại",
    category: "pronoun",
    categoryLabel: "Đại từ",
  },
  {
    id: "w3",
    jp: "あのひと",
    kanji: "あの人",
    romaji: "ano hito",
    meaning: "người kia, người đó, anh/chị kia",
    note: "あのかた (あの方) là cách nói lịch sự, tôn kính.",
    category: "pronoun",
    categoryLabel: "Chỉ định",
  },
  {
    id: "w4",
    jp: "～さん",
    romaji: "~ san",
    meaning: "anh, chị, ông, bà (hậu tố lịch sự)",
    note: "Tuyệt đối không gắn vào tên của chính mình!",
    noteWarning: true,
    category: "suffix",
    categoryLabel: "Hậu tố",
  },
  {
    id: "w5",
    jp: "～ちゃん",
    romaji: "~ chan",
    meaning: "bé, em (hậu tố thêm vào sau tên trẻ em, bạn gái thân mật)",
    category: "suffix",
    categoryLabel: "Hậu tố",
  },
  {
    id: "w6",
    jp: "～じん",
    kanji: "～人",
    romaji: "~ jin",
    meaning: "người nước ~ (chỉ quốc tịch)",
    note: "Ví dụ: アメリカじん (Người Mỹ), ベトナムじん (Người VN)",
    category: "suffix",
    categoryLabel: "Hậu tố",
  },
  {
    id: "w8",
    jp: "がくせい",
    kanji: "学生",
    romaji: "gakusei",
    meaning: "học sinh, sinh viên",
    category: "job",
    categoryLabel: "Nghề nghiệp",
  },
  {
    id: "w9",
    jp: "かいしゃいん",
    kanji: "会社員",
    romaji: "kaishain",
    meaning: "nhân viên công ty (nói chung)",
    note: "So sánh với 社員 (しゃいん): dùng kèm tên công ty cụ thể (vd: IMCの 社員).",
    category: "job",
    categoryLabel: "Nghề nghiệp",
  },
  {
    id: "w10",
    jp: "ぎんこういん",
    kanji: "銀行員",
    romaji: "ginkouin",
    meaning: "nhân viên ngân hàng",
    category: "job",
    categoryLabel: "Nghề nghiệp",
  },
  {
    id: "w11",
    jp: "いしゃ",
    kanji: "医者",
    romaji: "isha",
    meaning: "bác sĩ",
    category: "job",
    categoryLabel: "Nghề nghiệp",
  },
  {
    id: "w12",
    jp: "けんきゅうしゃ",
    kanji: "研究者",
    romaji: "kenkyuusha",
    meaning: "nhà nghiên cứu",
    category: "job",
    categoryLabel: "Nghề nghiệp",
  },
  {
    id: "w13",
    jp: "だいがく / びょういん",
    kanji: "大学 / 病院",
    romaji: "daigaku / byouin",
    meaning: "trường đại học / bệnh viện",
    category: "location",
    categoryLabel: "Địa điểm",
  },
  {
    id: "w14",
    jp: "だれ",
    romaji: "dare",
    meaning: "ai (từ để hỏi người)",
    note: "どなた là dạng lịch sự trang trọng (vị nào).",
    category: "question",
    categoryLabel: "Nghi vấn từ",
  },
  {
    id: "w15",
    jp: "はい / いいえ",
    romaji: "hai / iie",
    meaning: "vâng, dạ (khẳng định) / không (phủ định)",
    category: "response",
    categoryLabel: "Đối đáp",
  },
];

const COUNTRIES = [
  { jp: "アメリカ", romaji: "Mỹ (Hoa Kỳ)" },
  { jp: "イギリス", romaji: "Anh Quốc" },
  { jp: "インド", romaji: "Ấn Độ" },
  { jp: "インドネシア", romaji: "In-đô-nê-xi-a" },
  { jp: "かんこく", kanji: "韓国", romaji: "Hàn Quốc" },
  { jp: "タイ", romaji: "Thái Lan" },
  { jp: "ちゅうごく", kanji: "中国", romaji: "Trung Quốc" },
  { jp: "ドイツ", romaji: "Nước Đức" },
  { jp: "にほん", kanji: "日本", romaji: "Nhật Bản" },
  { jp: "ブラジル", romaji: "Braxin" },
];

const CONVERSATION_PHRASES = [
  {
    num: "01",
    jp: "はじめまして。",
    vi: "Rất hân hạnh được gặp anh/chị.",
    desc: "Lời chào khi người lần đầu gặp — câu nói mở đầu tiên trước khi giới thiệu tên và quốc tịch.",
  },
  {
    num: "02",
    jp: "～から きました。",
    vi: "Tôi đến từ ~.",
    desc: "Dùng để nói về xuất thân, quê hương hoặc đất nước của mình (vd: ベトナムから きました).",
  },
  {
    num: "03",
    jp: "［どうぞ］よろしく［おねがいします］。",
    vi: "Rất vui được làm quen / Rất mong được sự giúp đỡ của anh/chị.",
    desc: "Luôn dùng làm câu kết thúc sau khi giới thiệu xong thông tin về mình.",
  },
  {
    num: "04",
    jp: "しつれいですが、お名前は？",
    reading: "おなまえは？",
    vi: "Xin lỗi, tên anh/chị là gì ạ?",
    desc: "Dùng khi muốn hỏi lịch sự thông tin cá nhân của đối phương.",
  },
  {
    num: "05",
    jp: "こちらは ～さんです。",
    vi: "Đây là anh / chị / ông / bà ~.",
    desc: "Mẫu câu dùng để giới thiệu người thứ ba với đối phương trong buổi gặp gỡ.",
  },
];

export function Lesson1VocabView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showFurigana, setShowFurigana] = useState(true);

  // Play audio for all main words sequentially or play single word
  const handlePlayWord = (text: string) => {
    speakJapanese(text.split("/")[0].trim());
  };

  const handlePlayAllVocab = () => {
    const wordList = LESSON_1_WORDS.map((w) => w.jp.split("/")[0].trim());
    let index = 0;
    const playNext = () => {
      if (index < wordList.length) {
        speakJapanese(wordList[index]);
        index++;
        setTimeout(playNext, 1800);
      }
    };
    playNext();
  };

  // Filter words
  const filteredWords = LESSON_1_WORDS.filter((item) => {
    if (activeCategory !== "all") {
      if (activeCategory === "pronoun" && item.category !== "pronoun") return false;
      if (activeCategory === "job" && item.category !== "job" && item.category !== "location") return false;
      if (activeCategory === "age" && item.id !== "w16") return false;
      if (activeCategory === "chat" && item.category !== "response") return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.jp.toLowerCase().includes(q) ||
      (item.kanji && item.kanji.toLowerCase().includes(q)) ||
      item.romaji.toLowerCase().includes(q) ||
      item.meaning.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner Control Bar (Audio Play & Flashcards & Furigana Toggle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <BookOpen className="size-4 text-red-600" />
          <span>Danh mục 35 từ vựng chuẩn Minna no Nihongo Bài 1</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFurigana((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
              showFurigana
                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/80"
                : "bg-background border-border/60 text-muted-foreground hover:bg-accent"
            )}
          >
            <Subtitles className="size-3.5" />
            <span>{showFurigana ? "Ẩn Furigana" : "Hiện Furigana"}</span>
          </button>

          <button
            type="button"
            onClick={handlePlayAllVocab}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Volume2 className="size-3.5" />
            <span>Nghe toàn bộ từ vựng</span>
          </button>
        </div>
      </div>

      {/* Vocabulary Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo Hiragana, Kanji hoặc nghĩa tiếng Việt..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg bg-background border border-border/60 focus:outline-none focus:ring-1 focus:ring-red-500/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0",
              activeCategory === "all"
                ? "bg-red-600 text-white"
                : "bg-background border border-border/60 text-muted-foreground hover:bg-accent"
            )}
          >
            Tất cả (35)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("pronoun")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0",
              activeCategory === "pronoun"
                ? "bg-red-600 text-white font-semibold"
                : "bg-background border border-border/60 text-muted-foreground hover:bg-accent"
            )}
          >
            Đại từ &amp; Người
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("job")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0",
              activeCategory === "job"
                ? "bg-red-600 text-white font-semibold"
                : "bg-background border border-border/60 text-muted-foreground hover:bg-accent"
            )}
          >
            Nghề nghiệp &amp; Nơi chốn
          </button>
        </div>
      </div>

      {/* Core Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredWords.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 bg-card shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => handlePlayWord(item.kanji || item.jp)}
                className="size-9 rounded-lg bg-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 flex items-center justify-center text-muted-foreground transition-colors shrink-0 cursor-pointer mt-0.5"
                title={`Phát âm ${item.jp}`}
              >
                <Volume2 className="size-4" />
              </button>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  {item.kanji ? (
                    <div className="flex flex-col leading-none">
                      {showFurigana && (
                        <span className="text-[11px] text-red-600 font-medium mb-0.5">
                          {item.jp}
                        </span>
                      )}
                      <span className="text-lg font-bold text-foreground">
                        {item.kanji}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-foreground">
                      {item.jp}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono uppercase">
                    {item.romaji}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-foreground font-medium mt-1">
                  {item.meaning}
                </p>

                {item.note && (
                  <span
                    className={cn(
                      "text-[11px] mt-1 font-medium leading-relaxed",
                      item.noteWarning
                        ? "text-red-600 font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.note}
                  </span>
                )}
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground shrink-0">
              {item.categoryLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Special Highlight Box: Phân biệt 先生 và 教師 */}
      <div className="rounded-xl border border-red-200/80 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20 p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold">
              Lưu ý then chốt
            </span>
            <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">
              Phân biệt 先生 (Sensei) và 教師 (Kyoushi)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          <div className="bg-card p-3.5 rounded-lg border border-border/80 shadow-2xs flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {showFurigana && (
                  <span className="text-[11px] text-red-600 font-medium">
                    せんせい
                  </span>
                )}
                <span className="text-base font-bold text-foreground">
                  先生
                </span>
              </div>
              <button
                type="button"
                onClick={() => handlePlayWord("先生")}
                className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
              >
                <Volume2 className="size-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-foreground mt-1">
              Thầy / cô giáo (Danh xưng tôn kính)
            </p>
            <p className="text-[11px] text-red-600 font-medium leading-relaxed">
              Không dùng khi giới thiệu nghề nghiệp của chính mình.
            </p>
          </div>

          <div className="bg-card p-3.5 rounded-lg border border-border/80 shadow-2xs flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {showFurigana && (
                  <span className="text-[11px] text-red-600 font-medium">
                    きょうし
                  </span>
                )}
                <span className="text-base font-bold text-foreground">
                  教師
                </span>
              </div>
              <button
                type="button"
                onClick={() => handlePlayWord("教師")}
                className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
              >
                <Volume2 className="size-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-foreground mt-1">
              Giáo viên (Nghề nghiệp)
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed">
              Dùng để nói về nghề nghiệp bản thân: わたしは 教師です。
            </p>
          </div>
        </div>
      </div>

      {/* SPECIAL SECTION: AGE COUNTING & PHONETIC RULES */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Cake className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Quy tắc đếm tuổi (～歳 / ～さい) &amp; Các biến âm đặc biệt
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Hỏi tuổi: <strong className="text-foreground">何歳 (なんさい)</strong> • Lịch sự: <strong className="text-foreground">おいくつ</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* 1 tuổi */}
          <div className="p-3 rounded-lg bg-red-50/60 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-600 uppercase">
                Biến âm
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("いっさい")}
                className="text-red-600 hover:scale-110 cursor-pointer"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>
            <span className="text-base font-bold text-foreground">1歳 (いっさい)</span>
            <span className="text-[11px] text-muted-foreground">1 tuổi (1 + さい → いっさい)</span>
          </div>

          {/* 8 tuổi */}
          <div className="p-3 rounded-lg bg-red-50/60 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-600 uppercase">
                Biến âm
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("はっさい")}
                className="text-red-600 hover:scale-110 cursor-pointer"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>
            <span className="text-base font-bold text-foreground">8歳 (はっさい)</span>
            <span className="text-[11px] text-muted-foreground">8 tuổi (8 + さい → はっさい)</span>
          </div>

          {/* 10 tuổi */}
          <div className="p-3 rounded-lg bg-red-50/60 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-600 uppercase">
                Biến âm
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("じゅっさい")}
                className="text-red-600 hover:scale-110 cursor-pointer"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>
            <span className="text-base font-bold text-foreground">10歳 (じゅっさい)</span>
            <span className="text-[11px] text-muted-foreground">10 tuổi (hoặc じっさい)</span>
          </div>

          {/* 20 tuổi SPECIAL */}
          <div className="p-3 rounded-lg bg-red-600 text-white shadow-2xs flex flex-col gap-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase bg-white/20 px-1.5 py-0.5 rounded text-white">
                ĐẶC BIỆT
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("はたち")}
                className="text-white hover:scale-110 cursor-pointer"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-white">20歳</span>
              <span className="text-xs font-semibold text-white/90">はたち</span>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">
              Tuổi trưởng thành. Không dùng さい!
            </span>
          </div>

          {/* Hỏi tuổi */}
          <div className="p-3 rounded-lg bg-muted/60 border border-border/50 flex flex-col gap-1 col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Hỏi tuổi
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("なんさい")}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>
            <span className="text-xs font-bold text-foreground">何歳 / おいくつ</span>
            <span className="text-[11px] text-muted-foreground">Bao nhiêu tuổi (Thường / Kính ngữ)</span>
          </div>
        </div>
      </div>

      {/* SECTION: 練習C — MẪU CÂU CHÀO HỎI & LÀM QUEN */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
              会
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                練習C — Mẫu câu chào hỏi &amp; làm quen giao tiếp
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Các câu cửa miệng chuẩn xác khi lần đầu gặp mặt và tự giới thiệu bản thân
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-medium w-fit">
            Chuẩn Minna no Nihongo I
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONVERSATION_PHRASES.map((phrase) => (
            <div
              key={phrase.num}
              className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex items-start gap-3 hover:bg-muted/70 transition-colors group"
            >
              <span className="size-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {phrase.num}
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    {phrase.jp}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayWord(phrase.jp)}
                    className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Volume2 className="size-4" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {phrase.vi}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  {phrase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: COUNTRIES (国名) */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <Globe2 className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Tên các quốc gia (国名)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Tên các quốc gia phổ biến xuất hiện trong hội thoại và bài tập Bài 1
              </p>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">10 Quốc gia</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {COUNTRIES.map((c) => (
            <div
              key={c.jp}
              className="p-2.5 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-between gap-1.5 hover:bg-muted/70 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  {c.kanji || c.jp}
                </span>
                <span className="text-[10px] text-muted-foreground">{c.romaji}</span>
              </div>
              <button
                type="button"
                onClick={() => handlePlayWord(c.kanji || c.jp)}
                className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
              >
                <Volume2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Fictional Entities Note */}
        <div className="p-3 rounded-xl bg-muted/60 border border-border/50 flex items-start gap-2.5">
          <Building2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Tên các tổ chức giả định dùng trong sách Minna no Nihongo:</strong>{" "}
            <span className="font-semibold text-foreground">IMC / パワー電気 / ブラジルエアー</span> (tên công ty),{" "}
            <span className="font-semibold text-foreground">AKC</span> (tên viện nghiên cứu),{" "}
            <span className="font-semibold text-foreground">神戸病院</span> (tên bệnh viện Kobe),{" "}
            <span className="font-semibold text-foreground">さくら大学 / 富士大学</span> (tên các trường đại học Sakura &amp; Fuji).
          </p>
        </div>
      </div>
    </div>
  );
}
