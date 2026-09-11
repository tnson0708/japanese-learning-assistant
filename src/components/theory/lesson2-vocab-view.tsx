"use client";

import { useState } from "react";
import {
  BookOpen,
  Box,
  Gift,
  HelpCircle,
  MessageSquare,
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
  category: "demonstrative" | "item" | "language" | "phrase";
  categoryLabel: string;
}

const LESSON_2_WORDS: VocabCardItem[] = [
  {
    id: "w1",
    jp: "これ",
    romaji: "kore",
    meaning: "cái này, đây (vật ở gần người nói)",
    category: "demonstrative",
    categoryLabel: "Chỉ định từ",
  },
  {
    id: "w2",
    jp: "それ",
    romaji: "sore",
    meaning: "cái đó, đó (vật ở gần người nghe)",
    category: "demonstrative",
    categoryLabel: "Chỉ định từ",
  },
  {
    id: "w3",
    jp: "あれ",
    romaji: "are",
    meaning: "cái kia, kia (vật ở xa cả người nói và người nghe)",
    category: "demonstrative",
    categoryLabel: "Chỉ định từ",
  },
  {
    id: "w4",
    jp: "この ～",
    romaji: "kono ~",
    meaning: "~ này (vật/người ở gần người nói)",
    note: "Luôn đi kèm danh từ ngay phía sau (vd: この ほん)",
    noteWarning: true,
    category: "demonstrative",
    categoryLabel: "Chỉ định từ",
  },
  {
    id: "w5",
    jp: "その ～",
    romaji: "sono ~",
    meaning: "~ đó (vật/người ở gần người nghe)",
    note: "Luôn đi kèm danh từ ngay phía sau (vd: その かばん)",
    noteWarning: true,
    category: "demonstrative",
    categoryLabel: "Chỉ định từ",
  },
  {
    id: "w6",
    jp: "あの ～",
    romaji: "ano ~",
    meaning: "~ kia (vật/người ở xa cả người nói và nghe)",
    note: "Luôn đi kèm danh từ ngay phía sau (vd: あの かた)",
    noteWarning: true,
    category: "demonstrative",
    categoryLabel: "Chỉ định từ",
  },
  {
    id: "w7",
    jp: "ほん",
    kanji: "本",
    romaji: "hon",
    meaning: "sách",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w8",
    jp: "じしょ",
    kanji: "辞書",
    romaji: "jisho",
    meaning: "từ điển",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w9",
    jp: "ざっし",
    kanji: "雑誌",
    romaji: "zasshi",
    meaning: "tạp chí",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w10",
    jp: "しんぶん",
    kanji: "新聞",
    romaji: "shinbun",
    meaning: "báo",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w11",
    jp: "ノート",
    romaji: "no-to",
    meaning: "vở, quyển vở",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w12",
    jp: "てちょう",
    kanji: "手帳",
    romaji: "techou",
    meaning: "sổ tay",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w13",
    jp: "めいし",
    kanji: "名刺",
    romaji: "meishi",
    meaning: "danh thiếp",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w14",
    jp: "カード",
    romaji: "ka-do",
    meaning: "thẻ (tín dụng), cạc",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w15",
    jp: "えんぴつ",
    kanji: "鉛筆",
    romaji: "enpitsu",
    meaning: "bút chì",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w16",
    jp: "ボールペン",
    romaji: "bo-rupen",
    meaning: "bút bi",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w17",
    jp: "シャープペンシル",
    romaji: "sha-pupenshiru",
    meaning: "bút chì kim, bút chì bấm",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w18",
    jp: "かぎ",
    romaji: "kagi",
    meaning: "chìa khóa",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w19",
    jp: "とけい",
    kanji: "時計",
    romaji: "tokei",
    meaning: "đồng hồ",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w20",
    jp: "かさ",
    kanji: "傘",
    romaji: "kasa",
    meaning: "ô, dù",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w21",
    jp: "かばん",
    romaji: "kaban",
    meaning: "cặp sách, túi sách",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w22",
    jp: "CD",
    romaji: "shi-dei-",
    meaning: "đĩa CD",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w23",
    jp: "テレビ",
    romaji: "terebi",
    meaning: "tivi",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w24",
    jp: "ラジオ",
    romaji: "rajio",
    meaning: "radio",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w25",
    jp: "カメラ",
    romaji: "kamera",
    meaning: "máy ảnh",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w26",
    jp: "コンピューター",
    romaji: "konpyu-ta-",
    meaning: "máy vi tính",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w27",
    jp: "くるま",
    kanji: "車",
    romaji: "kuruma",
    meaning: "ô tô, xe hơi",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w28",
    jp: "つくえ",
    kanji: "机",
    romaji: "tsukue",
    meaning: "bàn",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w29",
    jp: "いす",
    romaji: "isu",
    meaning: "ghế",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w30",
    jp: "チョコレート",
    romaji: "chokore-to",
    meaning: "sôcôla",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w31",
    jp: "コーヒー",
    romaji: "ko-hi-",
    meaning: "cà phê",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w32",
    jp: "［お］みやげ",
    kanji: "［お］土産",
    romaji: "[o]miyage",
    meaning: "quà (mua khi đi xa về hoặc mang đi thăm nhà)",
    note: "Tiền tố お～ thể hiện thái độ lịch sự, trang trọng.",
    category: "item",
    categoryLabel: "Đồ vật",
  },
  {
    id: "w33",
    jp: "えいご",
    kanji: "英語",
    romaji: "eigo",
    meaning: "tiếng Anh",
    category: "language",
    categoryLabel: "Ngôn ngữ",
  },
  {
    id: "w34",
    jp: "にほんご",
    kanji: "日本語",
    romaji: "nihongo",
    meaning: "tiếng Nhật",
    category: "language",
    categoryLabel: "Ngôn ngữ",
  },
  {
    id: "w35",
    jp: "～ご",
    kanji: "～語",
    romaji: "~ go",
    meaning: "tiếng ~ (vd: ベトナムご = tiếng Việt)",
    category: "language",
    categoryLabel: "Hậu tố",
  },
  {
    id: "w36",
    jp: "なん",
    kanji: "何",
    romaji: "nan",
    meaning: "gì, cái gì",
    category: "demonstrative",
    categoryLabel: "Nghi vấn từ",
  },
  {
    id: "w37",
    jp: "そう",
    romaji: "sou",
    meaning: "vậy, như thế (dùng trong はい、そうです / そうですか)",
    category: "phrase",
    categoryLabel: "Đối đáp",
  },
];

const CONVERSATION_PHRASES = [
  {
    num: "01",
    jp: "あのう",
    vi: "À, ờ...",
    desc: "Dùng để mở lời một cách lịch sự, biểu thị sự ngại ngùng hay do dự khi làm phiền người khác.",
  },
  {
    num: "02",
    jp: "ほんの 気持ちです。",
    reading: "ほんの きもちです。",
    vi: "Đây chỉ là chút tấm lòng thành của tôi.",
    desc: "Câu nói lịch sự khi trao quà biếu/quà thăm hỏi cho người khác (vd: ほんの 気持ちです。……コーヒーです。どうぞ。).",
  },
  {
    num: "03",
    jp: "どうぞ。",
    vi: "Xin mời.",
    desc: "Dùng khi trao đồ vật hoặc mời đối phương làm gì đó (vào nhà, ngồi ghế, nhận quà...).",
  },
  {
    num: "04",
    jp: "［どうも］ ありがとう ［ございます］。",
    vi: "Xin chân thành cảm ơn / Cảm ơn anh/chị rất nhiều.",
    desc: "Lời cảm ơn lịch sự trang trọng khi nhận quà hoặc nhận sự giúp đỡ.",
  },
  {
    num: "05",
    jp: "そうですか。",
    vi: "Thế à / Vậy à.",
    desc: "Dùng khi nhận được thông tin mới và biểu thị đã hiểu. Phát âm hạ giọng ở cuối câu.",
  },
  {
    num: "06",
    jp: "これから お世話に なります。",
    reading: "これから おせわに なります。",
    vi: "Từ nay tôi rất mong được sự giúp đỡ của anh/chị.",
    desc: "Mẫu câu xã giao chuẩn mực khi dọn đến nhà mới chào hàng xóm hoặc bắt đầu công việc mới.",
  },
  {
    num: "07",
    jp: "こちらこそ ［どうぞ］ よろしく ［おねがいします］。",
    vi: "Chính tôi mới là người mong được sự giúp đỡ của anh/chị.",
    desc: "Lời đáp lại lịch sự và nhún nhường đối với câu chào よろしく おねがいします.",
  },
];

export function Lesson2VocabView() {
  const [showFurigana, setShowFurigana] = useState(true);

  const handlePlayWord = (text: string) => {
    speakJapanese(text.replace(/[\.…]/g, "").trim());
  };

  const handlePlayAllVocab = () => {
    const wordList = LESSON_2_WORDS.map((w) => (w.kanji || w.jp).replace(/[\.…]/g, "").trim());
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

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner Control Bar (Audio Play & Furigana Toggle) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <BookOpen className="size-4 text-red-600" />
          <span>Danh mục 45 từ vựng chuẩn Minna no Nihongo Bài 2</span>
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

      {/* Core Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LESSON_2_WORDS.map((item) => (
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
                  <span className="text-[11px] text-muted-foreground/75 font-mono lowercase">
                    {item.romaji.toLowerCase()}
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
          </div>
        ))}
      </div>

      {/* Special Highlight Box 1: Phân biệt これ/それ/あれ vs この/その/あの */}
      <div className="rounded-xl border border-red-200/80 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20 p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold">
              Lưu ý ngữ pháp cốt lõi
            </span>
            <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">
              Phân biệt 指示詞 (Chỉ định từ vật &amp; Bổ nghĩa danh từ)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          <div className="bg-card p-3.5 rounded-lg border border-border/80 shadow-2xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">
                これ / それ / あれ
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("これは 辞書です")}
                className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
              >
                <Volume2 className="size-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-red-600">
              Đại từ chỉ định độc lập (Cái này / Cái đó / Cái kia)
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Đứng độc lập làm chủ ngữ trước trợ từ <strong>は</strong>. Không đi liền sau danh từ.<br />
              <strong className="text-foreground">Ví dụ:</strong> これ<strong className="text-red-600">は</strong> 辞書です。(Đây là từ điển.)
            </p>
          </div>

          <div className="bg-card p-3.5 rounded-lg border border-border/80 shadow-2xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">
                この / その / あの + Danh từ
              </span>
              <button
                type="button"
                onClick={() => handlePlayWord("この 本は わたしのです")}
                className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
              >
                <Volume2 className="size-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Tính từ chỉ định (Bắt buộc phải đi kèm Danh từ)
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Luôn đứng trực tiếp trước 1 Danh từ để bổ nghĩa. KHÔNG đứng một mình.<br />
              <strong className="text-foreground">Ví dụ:</strong> この<strong className="text-emerald-600 dark:text-emerald-400"> 本は</strong> わたしのです。(Quyển sách này là của tôi.)
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: 練習C & 会話 — MẪU CÂU CHÀO HỎI HÀNG XÓM & TẶNG QUÀ */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
              <Gift className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                会話 &amp; 練習C — Mẫu câu giao tiếp, tặng quà &amp; chào hàng xóm mới
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Các câu nói cửa miệng chuẩn văn hóa khi biếu quà lưu niệm và ra mắt hàng xóm/đồng nghiệp
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-medium w-fit">
            Chuẩn Minna no Nihongo II
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
    </div>
  );
}
