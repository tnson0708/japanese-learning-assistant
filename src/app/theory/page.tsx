"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Search,
  Star,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export interface TheoryLessonMeta {
  id: number;
  group: "1-5" | "6-12" | "13-19" | "20-25";
  levelTagEn: string;
  levelTagVi: string;
  jpTitle: string;
  patternsCount: string;
  descriptionVi: string;
  descriptionEn: string;
}

export const THEORY_LESSONS: TheoryLessonMeta[] = [
  {
    id: 1,
    group: "1-5",
    levelTagVi: "BÀI 1 • SƠ CẤP",
    levelTagEn: "LESSON 1 • BASIC",
    jpTitle: "わたしは マイク・ミラーです",
    patternsCount: "6 Mẫu",
    descriptionVi:
      "Giới thiệu bản thân, họ tên, quốc tịch, tuổi tác & nghề nghiệp (N1 は N2 です, じゃありません, ですか)",
    descriptionEn:
      "Self-introduction, name, nationality, age & occupation (N1 は N2 です, じゃありません, ですか)",
  },
  {
    id: 2,
    group: "1-5",
    levelTagVi: "BÀI 2 • SƠ CẤP",
    levelTagEn: "LESSON 2 • BASIC",
    jpTitle: "これ・それ・あれ",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Chỉ định từ và hỏi đồ vật xung quanh, sở hữu của ai & phân biệt これ / それ / あれ và この / その / あの",
    descriptionEn:
      "Demonstrative pronouns for objects, possession & distinguishing これ / それ / あれ and この / その / あの",
  },
  {
    id: 3,
    group: "1-5",
    levelTagVi: "BÀI 3 • SƠ CẤP",
    levelTagEn: "LESSON 3 • BASIC",
    jpTitle: "ここ・そこ・あそこ",
    patternsCount: "6 Mẫu",
    descriptionVi:
      "Hỏi và chỉ địa điểm, vị trí phòng ban, phương hướng こちら / そちら, nguồn gốc xuất xứ và giá tiền",
    descriptionEn:
      "Asking and indicating places, department locations, directions こちら / そちら, country of origin and prices",
  },
  {
    id: 4,
    group: "1-5",
    levelTagVi: "BÀI 4 • SƠ CẤP",
    levelTagEn: "LESSON 4 • BASIC",
    jpTitle: "今 －時 －分です",
    patternsCount: "7 Mẫu",
    descriptionVi:
      "Thời gian, giờ phút, các thứ trong tuần, động từ thể lịch sự ます / ません / ました & khoảng thời gian から～まで",
    descriptionEn:
      "Time, hours/minutes, days of the week, polite verbs ます / ません / ました & time spans から～まで",
  },
  {
    id: 5,
    group: "1-5",
    levelTagVi: "BÀI 5 • SƠ CẤP",
    levelTagEn: "LESSON 5 • BASIC",
    jpTitle: "行きます・来ます・帰ります",
    patternsCount: "6 Mẫu",
    descriptionVi:
      "Động từ di chuyển, phương tiện đi lại で, đi cùng ai と, mốc ngày tháng năm & từ nghi vấn いつ",
    descriptionEn:
      "Verbs of movement, modes of transportation で, accompanying person と, dates & question word いつ",
  },
  {
    id: 6,
    group: "6-12",
    levelTagVi: "BÀI 6 • SƠ CẤP 1",
    levelTagEn: "LESSON 6 • ELEMENTARY 1",
    jpTitle: "わたしは 本を 読みます",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Tân ngữ trực tiếp を, nơi chốn xảy ra hành động で, câu mời rủ ませんか / ましょう & rủ rê cùng làm gì",
    descriptionEn:
      "Direct objects を, location of action で, invitations ませんか / ましょう & suggesting activities",
  },
  {
    id: 7,
    group: "6-12",
    levelTagVi: "BÀI 7 • SƠ CẤP 1",
    levelTagEn: "LESSON 7 • ELEMENTARY 1",
    jpTitle: "はしで 食べます",
    patternsCount: "6 Mẫu",
    descriptionVi:
      "Công cụ và phương tiện で, cho và nhận あげます / もらいます, đã làm xong / chưa làm もう / まだ",
    descriptionEn:
      "Tools and instruments で, giving and receiving あげます / もらいます, already done / not yet もう / まだ",
  },
  {
    id: 8,
    group: "6-12",
    levelTagVi: "BÀI 8 • SƠ CẤP 1",
    levelTagEn: "LESSON 8 • ELEMENTARY 1",
    jpTitle: "桜は きれいです",
    patternsCount: "6 Mẫu",
    descriptionVi:
      "Tính từ đuôi い & đuôi な, dạng phủ định, phó từ とても / あまり & cách hỏi tính chất どう / どんな",
    descriptionEn:
      "i-Adjectives & na-Adjectives, negative forms, adverbs とても / あまり & asking characteristics どう / どんな",
  },
  {
    id: 9,
    group: "6-12",
    levelTagVi: "BÀI 9 • SƠ CẤP 1",
    levelTagEn: "LESSON 9 • ELEMENTARY 1",
    jpTitle: "イタリア料理が 好きです",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Bày tỏ sở thích 好き/嫌い, năng lực 上手/下手/わかります, sở hữu あります, phó từ số lượng & lý do から / どうして",
    descriptionEn:
      "Expressing likes/dislikes 好き/嫌い, ability 上手/下手/わかります, possession あります & reasons から / どうして",
  },
  {
    id: 10,
    group: "6-12",
    levelTagVi: "BÀI 10 • SƠ CẤP 1",
    levelTagEn: "LESSON 10 • ELEMENTARY 1",
    jpTitle: "あそこに コンビニが あります",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Biểu thị sự tồn tại của vật (あります) và sinh vật (います), vị trí không gian (上, 下, 前, 後ろ...) & liệt kê や / など",
    descriptionEn:
      "Existence of inanimate objects (あります) and animate beings (います), spatial positions (上, 下, 前...) & listing や / など",
  },
  {
    id: 11,
    group: "6-12",
    levelTagVi: "BÀI 11 • SƠ CẤP 1",
    levelTagEn: "LESSON 11 • ELEMENTARY 1",
    jpTitle: "会議室に テーブルが ７つ あります",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Số từ & lượng từ, cách đếm đồ vật/người/con vật, khoảng thời gian, tần suất に và giới hạn くらい / だけ",
    descriptionEn:
      "Counters & quantity words, counting items/people, duration, frequency に and limits くらい / だけ",
  },
  {
    id: 12,
    group: "6-12",
    levelTagVi: "BÀI 12 • SƠ CẤP 1",
    levelTagEn: "LESSON 12 • ELEMENTARY 1",
    jpTitle: "昨日は 雨でした",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Thời quá khứ của Danh từ & Tính từ, so sánh giữa hai đối tượng より / ほうが và so sánh nhất 一番",
    descriptionEn:
      "Past tense of Nouns & Adjectives, comparisons between two items より / ほうが and superlatives 一番",
  },
  {
    id: 13,
    group: "13-19",
    levelTagVi: "BÀI 13 • SƠ CẤP 2",
    levelTagEn: "LESSON 13 • ELEMENTARY 2",
    jpTitle: "わたしは ほしいです",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Nguyện vọng mong muốn Nがほしい, V-たい (muốn làm gì), và cấu trúc mục đích di chuyển V-に 行きます/来ます/帰ります",
    descriptionEn:
      "Desires Nがほしい, V-たい (want to do), and purpose of movement V-に 行きます/来ます/帰ります",
  },
  {
    id: 14,
    group: "13-19",
    levelTagVi: "BÀI 14 • SƠ CẤP 2",
    levelTagEn: "LESSON 14 • ELEMENTARY 2",
    jpTitle: "ちょっと 待ってください",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Phân loại động từ nhóm I/II/III, quy tắc chia Thể て (Te-form), câu yêu cầu lịch sự V-てください & hành động đang diễn ra V-ています",
    descriptionEn:
      "Verb Group I/II/III classification, Te-form conjugation, requests V-てください & ongoing actions V-ています",
  },
  {
    id: 15,
    group: "13-19",
    levelTagVi: "BÀI 15 • SƠ CẤP 2",
    levelTagEn: "LESSON 15 • ELEMENTARY 2",
    jpTitle: "写真を 撮っても いいです",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Xin phép và cho phép làm gì (V-てもいいです), cấm đoán (V-てはいけません), và trạng thái kéo dài kết quả (V-ています)",
    descriptionEn:
      "Asking and giving permission (V-てもいいです), prohibition (V-てはいけません), and resulting states (V-ています)",
  },
  {
    id: 16,
    group: "13-19",
    levelTagVi: "BÀI 16 • SƠ CẤP 2",
    levelTagEn: "LESSON 16 • ELEMENTARY 2",
    jpTitle: "朝 ジョギングをして、シャワーを浴びて",
    patternsCount: "5 Mẫu",
    descriptionVi:
      "Nối chuỗi các hành động liên tiếp V-て, cấu trúc sau khi làm gì V-てから, và mô tả đặc điểm N1 は N2 が Adjective",
    descriptionEn:
      "Chaining sequential actions V-て, after doing something V-てから, and describing features N1 は N2 が Adjective",
  },
  {
    id: 17,
    group: "13-19",
    levelTagVi: "BÀI 17 • SƠ CẤP 2",
    levelTagEn: "LESSON 17 • ELEMENTARY 2",
    jpTitle: "写真を 撮らないで ください",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Cách chia Thể ない (Nai-form), khuyên đừng làm V-ないでください, phải làm V-なければなりません & không cần V-なくてもいいです",
    descriptionEn:
      "Nai-form conjugation, advising not to do V-ないでください, obligation V-なければなりません & V-なくてもいいです",
  },
  {
    id: 18,
    group: "13-19",
    levelTagVi: "BÀI 18 • SƠ CẤP 2",
    levelTagEn: "LESSON 18 • ELEMENTARY 2",
    jpTitle: "漢字を 読む ことが できます",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Thể nguyên dạng (Jisho-form), khả năng làm được gì V-ことができます, sở thích 趣味は V-ことです & trước khi V-まえに",
    descriptionEn:
      "Dictionary form (Jisho-form), expressing ability V-ことができます, hobbies 趣味は V-ことです & before V-まえに",
  },
  {
    id: 19,
    group: "13-19",
    levelTagVi: "BÀI 19 • SƠ CẤP 2",
    levelTagEn: "LESSON 19 • ELEMENTARY 2",
    jpTitle: "相撲を 見た ことが あります",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Thể た (Ta-form), nói về trải nghiệm quá khứ V-たことがあります, liệt kê hành động V-たり V-たりします & biến đổi tính chất になります",
    descriptionEn:
      "Ta-form conjugation, past experiences V-たことがあります, listing actions V-たり V-たりします & change of state になります",
  },
  {
    id: 20,
    group: "20-25",
    levelTagVi: "BÀI 20 • HOÀN THÀNH N5",
    levelTagEn: "LESSON 20 • N5 COMPLETION",
    jpTitle: "サントスさんは 来なかった",
    patternsCount: "3 Mẫu",
    descriptionVi:
      "Thể thông thường (Plain Form - 普通形) & Thể lịch sự (Polite Form - 丁寧形), hội thoại thân mật trong đời sống",
    descriptionEn:
      "Plain Form (普通形) vs. Polite Form (丁寧形), casual conversation in daily life",
  },
  {
    id: 21,
    group: "20-25",
    levelTagVi: "BÀI 21 • HOÀN THÀNH N5",
    levelTagEn: "LESSON 21 • N5 COMPLETION",
    jpTitle: "明日 雨が 降ると 思います",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Bày tỏ suy đoán và ý kiến cá nhân と思います, trích dẫn gián tiếp と言いました, và phỏng đoán xác nhận でしょう",
    descriptionEn:
      "Expressing opinions and thoughts と思います, indirect quotes と言いました, and confirmation でしょう",
  },
  {
    id: 22,
    group: "20-25",
    levelTagVi: "BÀI 22 • HOÀN THÀNH N5",
    levelTagEn: "LESSON 22 • N5 COMPLETION",
    jpTitle: "これは ミラーさんが 作った ケーキです",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Mệnh đề định ngữ bổ nghĩa cho danh từ (名詞修飾節) và diễn đạt thời gian thực hiện việc gì đó (時間 / 約束があります)",
    descriptionEn:
      "Noun-modifying clauses (名詞修飾節) and expressing time/appointments to do something (時間 / 約束があります)",
  },
  {
    id: 23,
    group: "20-25",
    levelTagVi: "BÀI 23 • HOÀN THÀNH N5",
    levelTagEn: "LESSON 23 • N5 COMPLETION",
    jpTitle: "本を 借りる とき、カードが 要ります",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Chỉ thời điểm và tình huống とき (khi...), hệ quả tất nhiên / hướng dẫn đường đi với trợ từ と (hễ mà... thì...)",
    descriptionEn:
      "Indicating time/situations とき (when...), natural consequences / directions with particle と (whenever...)",
  },
  {
    id: 24,
    group: "20-25",
    levelTagVi: "BÀI 24 • HOÀN THÀNH N5",
    levelTagEn: "LESSON 24 • N5 COMPLETION",
    jpTitle: "佐藤さんが チョコを くれました",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Cho và nhận hành động/ân huệ: くれます, V-てあげます (làm cho), V-てもらいます (được làm cho), V-てくれます (làm cho tôi)",
    descriptionEn:
      "Giving and receiving favors/actions: くれます, V-てあげます (do for), V-てもらいます (have done for), V-てくれます (do for me)",
  },
  {
    id: 25,
    group: "20-25",
    levelTagVi: "BÀI 25 • HOÀN THÀNH N5",
    levelTagEn: "LESSON 25 • N5 COMPLETION",
    jpTitle: "明日 雨が 降ったら、出かけません",
    patternsCount: "4 Mẫu",
    descriptionVi:
      "Điều kiện giả định và chắc chắn xảy ra V-たら (nếu / sau khi...), điều kiện nhượng bộ V-ても (cho dù... thì vẫn)",
    descriptionEn:
      "Conditional and temporal assumption V-たら (if / after...), concessive condition V-ても (even if...)",
  },
];

const FILTER_PILLS = [
  { id: "all", labelVi: "Tất cả 25 bài", labelEn: "All 25 Lessons" },
  { id: "1-5", labelVi: "Bài 1 – 5 (Cơ bản)", labelEn: "Lessons 1 – 5 (Basic)" },
  { id: "6-12", labelVi: "Bài 6 – 12 (Sơ cấp 1)", labelEn: "Lessons 6 – 12 (Elem 1)" },
  { id: "13-19", labelVi: "Bài 13 – 19 (Sơ cấp 2)", labelEn: "Lessons 13 – 19 (Elem 2)" },
  { id: "20-25", labelVi: "Bài 20 – 25 (Hoàn thành N5)", labelEn: "Lessons 20 – 25 (N5 End)" },
];

export default function TheoryListPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kana_dojo_theory_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompletedCount(parsed.length);
        }
      }
      const b = localStorage.getItem("kana_dojo_summary_bookmarked");
      if (b === "true") {
        setIsBookmarked(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      localStorage.setItem("kana_dojo_summary_bookmarked", String(next));
      return next;
    });
  };

  // Filter lessons
  const filteredLessons = THEORY_LESSONS.filter((lesson) => {
    if (activeFilter !== "all" && lesson.group !== activeFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchId = String(lesson.id) === q || `bài ${lesson.id}` === q || `lesson ${lesson.id}` === q;
    const matchTitle = lesson.jpTitle.toLowerCase().includes(q);
    const matchDescVi = lesson.descriptionVi.toLowerCase().includes(q);
    const matchDescEn = lesson.descriptionEn.toLowerCase().includes(q);
    const matchLevel = (isVi ? lesson.levelTagVi : lesson.levelTagEn).toLowerCase().includes(q);

    return matchId || matchTitle || matchDescVi || matchDescEn || matchLevel;
  });

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col gap-6 px-4 py-5 sm:px-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-2 pt-1 pb-2">
        <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200/80 dark:border-red-900/40 text-[11px] font-semibold">
          <BookOpen className="size-3.5 text-red-600" />
          <span>
            {isVi
              ? "GIÁO TRÌNH CHUẨN MINNA NO NIHONGO"
              : "MINNA NO NIHONGO STANDARD CURRICULUM"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          {isVi ? "Lý thuyết theo bài" : "Lesson Theory"}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {isVi
            ? "Từ vựng, bản dịch mẫu câu, từ và thông tin tham khảo kèm giải thích ngữ pháp chi tiết theo từng bài trong giáo trình Minna no Nihongo I."
            : "Vocabulary, sentence patterns, translations, reference guides, and detailed grammar explanations lesson by lesson."}
        </p>
      </div>

      {/* Search & Filter Controls: Compact search bar + Filter Pills */}
      <div className="flex flex-col gap-3">
        {/* Compact Search Bar */}
        <div className="relative max-w-lg w-full">
          <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isVi
                ? "Tìm kiếm bài học, mẫu ngữ pháp, ví dụ (phím tắt ⌘K)..."
                : "Search lessons, grammar patterns, examples (⌘K)..."
            }
            className="w-full h-10 pl-10 pr-16 rounded-xl border border-border/80 bg-card shadow-2xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm text-foreground placeholder:text-muted-foreground transition-all"
          />
          <div className="absolute right-2.5 top-2 hidden sm:flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/60">
            <kbd className="font-mono">⌘</kbd>
            <kbd className="font-mono">K</kbd>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveFilter(pill.id)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 font-bold shadow-2xs"
                    : "bg-card border-border/80 text-foreground hover:bg-accent"
                )}
              >
                {isVi ? pill.labelVi : pill.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Banner: Summary handbook for Lessons 1-25 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-8 border border-slate-800 shadow-md">
        {/* Japanese Watermark Kanji */}
        <div className="absolute right-4 -bottom-6 select-none opacity-5 font-bold text-[130px] font-serif pointer-events-none text-white">
          文法
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span>
                {isVi
                  ? "SỔ TAY TỔNG HỢP TOÀN BỘ N5"
                  : "N5 GRAMMAR SUMMARY HANDBOOK"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isVi
                ? "Tổng hợp ngữ pháp · Bài 1–25"
                : "Grammar Summary · Lessons 1–25"}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isVi
                ? "Sổ tay tra cứu và ôn tập thần tốc tất cả cấu trúc, mẫu câu, liên kết trợ từ cốt lõi trong suốt 25 bài học sơ cấp."
                : "Quick-reference handbook for review of all core structures, sentence patterns, and particle usages across all 25 elementary lessons."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-4 text-red-500" />
                <span>{isVi ? "25 Bài trọn vẹn" : "25 Lessons"}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-4 text-red-500" />
                <span>{isVi ? "120+ Mẫu ngữ pháp" : "120+ Patterns"}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-4 text-red-500" />
                <span>
                  {isVi
                    ? "Ví dụ song ngữ kèm Furigana"
                    : "Bilingual Examples"}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href="/theory/summary"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-900/30 active:scale-95 whitespace-nowrap"
            >
              <span>{isVi ? "Ôn tập ngay" : "Review Now"}</span>
              <ArrowRight className="size-4" />
            </Link>

            <button
              type="button"
              onClick={toggleBookmark}
              className={cn(
                "p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-center",
                isBookmarked
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                  : "bg-white/10 hover:bg-white/15 text-white border-white/10"
              )}
              title={isBookmarked ? "Saved to bookmarks" : "Bookmark this handbook"}
            >
              <Bookmark
                className={cn(
                  "size-5",
                  isBookmarked && "fill-amber-400 text-amber-400"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-1.5 h-4 bg-red-600 rounded-sm inline-block" />
          <span>
            {isVi
              ? "Danh sách 25 Bài học Minna no Nihongo"
              : "25 Minna no Nihongo Lessons List"}
          </span>
        </h2>
        <span className="text-xs text-muted-foreground font-medium">
          {isVi
            ? `Hiển thị ${filteredLessons.length} / 25 bài`
            : `Showing ${filteredLessons.length} of 25 lessons`}
        </span>
      </div>

      {/* Main Grid of 25 Lessons */}
      {filteredLessons.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-sm">
          {isVi
            ? "Không tìm thấy bài học nào phù hợp với từ khóa tìm kiếm."
            : "No lessons match your search query."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {filteredLessons.map((lesson) => {
            return (
              <Link
                key={lesson.id}
                href={`/theory/${lesson.id}`}
                className="group flex flex-col justify-between p-5 bg-card rounded-2xl border border-border/80 hover:border-red-500/70 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div>
                  {/* Top Card Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center size-9 rounded-lg font-black text-sm border shrink-0 transition-colors bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/60 dark:border-red-900/40 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600">
                        {String(lesson.id).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block">
                          {isVi ? lesson.levelTagVi : lesson.levelTagEn}
                        </span>
                        <h3 className="text-base font-bold text-foreground group-hover:text-red-600 transition-colors">
                          {lesson.jpTitle}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-medium shrink-0 bg-muted text-muted-foreground">
                      {lesson.patternsCount}
                    </span>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed pl-12 mb-4">
                    {isVi ? lesson.descriptionVi : lesson.descriptionEn}
                  </p>
                </div>

                {/* Sub-section Tags */}
                <div className="flex flex-wrap gap-1.5 pl-12 pt-2 border-t border-border/30 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-muted-foreground font-medium">
                    {isVi ? "Từ vựng" : "Vocab"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-muted-foreground font-medium">
                    {isVi ? "Bản dịch" : "Translations"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-muted-foreground font-medium">
                    {isVi ? "Tham khảo" : "References"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-muted-foreground font-medium">
                    {isVi ? "Ngữ pháp" : "Grammar"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-muted-foreground font-medium">
                    {isVi ? "Bài tập" : "Exercises"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
