"use client";

import React, { useState } from "react";
import {
  History,
  Scroll,
  Sparkles,
  BookOpen,
  Globe,
  Layers,
  GraduationCap,
  Compass,
  Building2,
  BookMarked,
  Lightbulb,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function HistorySection() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);

  const milestones = [
    {
      period: isVi ? "Thời Cổ Đại (Trước Thế Kỷ IV)" : "Ancient Era (Pre-4th Century)",
      tag: "Yamato-kotoba (大和言葉)",
      title: isVi ? "1. Ngôn Ngữ Nói Nguyên Thủy" : "1. Spoken Yamato Language",
      badge: isVi ? "Truyền miệng" : "Oral Tradition",
      summary: isVi
        ? "Tiếng Nhật ban đầu là ngôn ngữ thuần nói (Yamato-kotoba), hoàn toàn chưa có hệ chữ viết."
        : "Ancient Japanese (Yamato-kotoba) was purely spoken with no written alphabet.",
      details: isVi ? (
        <>
          <p>
            Trước thế kỷ thứ 4 (thời kỳ Jōmon và Yayoi), người Nhật bản địa sử dụng ngôn ngữ gọi là <strong>Yamato-kotoba (大和言葉 - tiếng Yamato)</strong> để giao tiếp hàng ngày. Lúc này, đất nước Nhật Bản hoàn toàn chưa có bất kỳ hệ thống ký tự hay chữ viết nào.
          </p>
          <p>
            Mọi văn hóa, bài hát dân gian và truyền thuyết Thần đạo (Shinto) đều được lưu giữ qua truyền miệng nhờ những người giữ kịch truyền miệng gọi là <em>Kataribe (語部)</em>. Ngôn ngữ Yamato-kotoba có đặc trưng là âm điệu mượt mà, chủ yếu kết thúc bằng các nguyên âm tự nhiên (a, i, u, e, o).
          </p>
        </>
      ) : (
        <>
          <p>
            Before the 4th century (Jōmon & Yayoi periods), native Japanese spoke <strong>Yamato-kotoba (大和言葉)</strong>. At this time, Japan had no native written characters.
          </p>
          <p>
            All stories, folk songs, and Shinto legends were preserved orally by storytellers called <em>Kataribe (語部)</em>. Yamato-kotoba is characterized by smooth, open-vowel acoustics (ending in a, i, u, e, o).
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Những từ thuần Nhật từ thời Yamato (như Sakura, Yamato, Kokoro) vẫn là cốt lõi cảm xúc trong vốn từ vựng tiếng Nhật ngày nay."
        : "Ancient native words (like Sakura, Yamato, Kokoro) remain the emotional core of Japanese vocabulary today.",
      examples: [
        { jp: "さくら (桜)", meaning: isVi ? "Hoa anh đào" : "Cherry blossom" },
        { jp: "こころ (心)", meaning: isVi ? "Trái tim, tâm hồn" : "Heart, soul" },
        { jp: "やま (山)", meaning: isVi ? "Ngọn núi" : "Mountain" },
      ],
      icon: History,
      color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      period: isVi ? "Thế Kỷ IV - VIII (Thời Asuka & Nara)" : "4th - 8th Century (Nara Period)",
      tag: "Kanji & Man'yōgana (万葉仮名)",
      title: isVi ? "2. Du Nhập Hán Tự & Man'yōgana" : "2. Arrival of Kanji & Man'yōgana",
      badge: isVi ? "Mượn chữ Hán" : "Phonetic Kanji",
      summary: isVi
        ? "Chữ Hán (Kanji) du nhập từ Trung Quốc. Người Nhật dùng chữ Hán để mượn âm (Man'yōgana)."
        : "Chinese characters arrived via Korea. Japanese used Kanji phonetically as Man'yōgana.",
      details: isVi ? (
        <>
          <p>
            Vào khoảng thế kỷ 4 - 5, thông qua ngoại giao và Phật giáo từ Bán đảo Triều Tiên (nước Bách Tế - Baekje) và Trung Quốc, <strong>chữ Hán (Kanji - 漢字)</strong> du nhập vào Nhật Bản. Đây là lần đầu tiên người Nhật tiếp xúc với chữ viết.
          </p>
          <p>
            Vì cấu trúc tiếng Trung và tiếng Nhật khác hẳn nhau, người Nhật đã sáng tạo ra hệ chữ <strong>Man'yōgana (万葉仮名)</strong>: sử dụng âm đọc của chữ Hán để ghi lại phát âm của các từ thuần Nhật (bỏ qua nghĩa của chữ Hán đó). Ví dụ: chữ 夜麻 đọc là <em>Yama</em> (núi), 波奈 đọc là <em>Hana</em> (hoa). Tác phẩm nổi tiếng <em>Vạn Diệp Tập (Man'yōshū)</em> với 4,500 bài thơ cổ đã được ghi chép bằng hệ chữ này.
          </p>
        </>
      ) : (
        <>
          <p>
            Around the 4th-5th centuries, <strong>Kanji (漢字)</strong> entered Japan via Korea and China along with Buddhism and trade. This gave Japan its first writing system.
          </p>
          <p>
            Because Chinese and Japanese grammar differed completely, the Japanese invented <strong>Man'yōgana (万葉仮名)</strong>: using Chinese characters strictly for their sound values to spell native Japanese words, disregarding character meanings. For example, 夜麻 spelled <em>Yama</em> (mountain).
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Man'yōgana chính là chiếc cầu nối lịch sử trực tiếp dẫn đến sự ra đời của bảng chữ Hiragana và Katakana."
        : "Man'yōgana served as the direct evolutionary bridge to modern Hiragana and Katakana.",
      examples: [
        { jp: "夜麻 → やま", meaning: isVi ? "Man'yōgana ghi âm Yama (Núi)" : "Spelling 'Yama' (Mountain)" },
        { jp: "波奈 → はな", meaning: isVi ? "Man'yōgana ghi âm Hana (Hoa)" : "Spelling 'Hana' (Flower)" },
        { jp: "阿 → あ", meaning: isVi ? "Tiền thân chữ あ" : "Ancestor of あ" },
      ],
      icon: Scroll,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      period: isVi ? "Thế Kỷ IX - XII (Thời Heian)" : "9th - 12th Century (Heian Period)",
      tag: "Sáng tạo Hiragana & Katakana",
      title: isVi ? "3. Cuộc Cách Mạng Chữ Kana" : "3. The Kana Revolution",
      badge: isVi ? "Bảng chữ Kana" : "Hiragana & Katakana",
      summary: isVi
        ? "Hiragana được nữ quý tộc uốn mềm từ chữ Hán. Katakana do các nhà sư rút nét chữ Hán."
        : "Hiragana evolved from cursive Kanji by noblewomen. Katakana was simplified by monks.",
      details: isVi ? (
        <>
          <p>
            Vào thời Heian (thế kỷ 9), hai bảng chữ Kana độc đáo ra đời:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Hiragana (平仮名 - Onnade / Chữ phụ nữ)</strong>: Được các phụ nữ quý tộc sáng tạo bằng cách biến tấu nét uốn mềm mại (Thảo thư - 草書) của chữ Hán (vd: 安 → あ, 以 → い). Nhờ Hiragana, nữ giới thời Heian đã sáng tạo nên những kiệt tác văn học thế giới như <em>Truyện Genji (Genji Monogatari)</em> của Murasaki Shikibu.
            </li>
            <li>
              <strong>Katakana (片仮名)</strong>: Được các nhà sư và học giả tạo ra bằng cách cắt lấy một phần nét (片) của chữ Hán (vd: 伊 → イ, 江 → エ) để làm ký hiệu ghi chú phát âm nhanh bên cạnh kinh Phật.
            </li>
          </ul>
        </>
      ) : (
        <>
          <p>During the Heian Period (9th century), two distinct Kana scripts emerged:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Hiragana (平仮名)</strong>: Evolved from smooth cursive Kanji (e.g. 安 → あ). Created by court noblewomen who wrote timeless literary masterpieces like <em>The Tale of Genji</em>.
            </li>
            <li>
              <strong>Katakana (片仮名)</strong>: Created by Buddhist monks taking fragments of Kanji (e.g. 伊 → イ) to quickly annotate pronunciations next to sutras.
            </li>
          </ul>
        </>
      ),
      keyTakeaway: isVi
        ? "Sự ra đời của Kana giải phóng người Nhật khỏi sự phụ thuộc hoàn toàn vào chữ Hán, tạo nên bản sắc văn hóa riêng biệt."
        : "Kana liberated Japan from total reliance on Chinese syntax, creating a unique national literary identity.",
      examples: [
        { jp: "安 → あ", meaning: isVi ? "Chữ Hán 安 thành Hiragana あ" : "Kanji 安 into Hiragana あ" },
        { jp: "以 → い", meaning: isVi ? "Chữ Hán 以 thành Hiragana い" : "Kanji 以 into Hiragana い" },
        { jp: "伊 → イ", meaning: isVi ? "Nét cắt của 伊 thành Katakana イ" : "Fragment of 伊 into Katakana イ" },
      ],
      icon: Sparkles,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      period: isVi ? "Thế Kỷ XVI - XIX (Thời Muromachi & Edo)" : "16th - 19th Century (Edo Period)",
      tag: "Tiếp xúc Phương Tây & Giọng Edo",
      title: isVi ? "4. Giao Thoa Phương Tây & Chuẩn Hóa Edo" : "4. Western Contact & Edo Shift",
      badge: isVi ? "Từ mượn đầu tiên" : "First Loanwords",
      summary: isVi
        ? "Du nhập từ mượn Bồ Đào Nha/Hà Lan. Giọng nói Edo (Tokyo) trở thành chuẩn mực."
        : "Portuguese & Dutch loanwords arrived. Edo (Tokyo) speech became standard.",
      details: isVi ? (
        <>
          <p>
            Vào thế kỷ 16, thương nhân và nhà truyền giáo Bồ Đào Nha đến Nhật Bản, mang theo những từ mượn phương Tây đầu tiên (Gairaigo): <em>Pan (bánh mì - từ pão)</em>, <em>Tempura</em>, <em>Tabako (thuốc lá)</em>. Sau đó thời Edo, Nhật Bản thực hiện chính sách bế quan tỏa cảng (Sakoku), chỉ duy trì thương mại với Hà Lan tại đảo Dejima (Nagasaki), nhập khẩu các thuật ngữ khoa học Hà Lan (Hà Lan học - Rangaku).
          </p>
          <p>
            Cùng thời gian này, khi Tướng quân Tokugawa chuyển trung tâm chính trị về Edo (nay là Tokyo), giọng nói vùng Edo bắt đầu phát triển mạnh mẽ và dần thay thế giọng Kansai (Kyoto/Osaka) để trở thành nền tảng cho <strong>tiếng Nhật chuẩn (Hyōjungo - 標準語)</strong>.
          </p>
        </>
      ) : (
        <>
          <p>
            In the 16th century, Portuguese traders introduced Japan's first Western loanwords: <em>Pan (bread, from pão)</em>, <em>Tempura</em>, and <em>Tabako (tobacco)</em>. Later in the Edo period, Dutch studies (Rangaku) introduced scientific terms through Dejima port.
          </p>
          <p>
            As Shogun Tokugawa established his capital in Edo (modern Tokyo), Edo dialect gradually displaced the Kansai dialect (Kyoto) to become the basis of <strong>Standard Japanese (Hyōjungo)</strong>.
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Từ mượn Bồ Đào Nha như パン (Pan) hay ボタン (Botan) đã hòa nhập sâu sắc và được người Nhật sử dụng tự nhiên đến tận ngày nay."
        : "Early loanwords like パン (Pan - bread) became permanent everyday Japanese vocabulary.",
      examples: [
        { jp: "パン (Pan)", meaning: isVi ? "Bánh mì (từ Bồ Đào Nha pão)" : "Bread (from Portuguese pão)" },
        { jp: "ボタン (Botan)", meaning: isVi ? "Nút áo (từ Bồ Đào Nha botão)" : "Button (from Portuguese botão)" },
        { jp: "コップ (Koppu)", meaning: isVi ? "Cái cốc (từ Hà Lan kop)" : "Glass cup (from Dutch kop)" },
      ],
      icon: Compass,
      color: "from-amber-500/20 to-yellow-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      period: isVi ? "Thế Kỷ XIX - XX (Thời Meiji & Hiện Đại)" : "19th - 20th Century (Meiji Era)",
      tag: "Wasei-Kango (和製漢語) & Cải cách",
      title: isVi ? "5. Thời Kì Minh Trị & Sáng Tạo Từ Mới" : "5. Meiji Modernization & Wasei-Kango",
      badge: isVi ? "Sáng tạo Hán tự" : "Meiji Coinages",
      summary: isVi
        ? "Người Nhật sáng tạo Hán tự dịch thuật (Wasei-Kango) để dịch khái niệm Tây phương."
        : "Japanese scholars coined Kanji terms (Wasei-Kango) to translate Western concepts.",
      details: isVi ? (
        <>
          <p>
            Thời kỳ Minh Trị (Meiji - 1868), Nhật Bản cải cách mở cửa học hỏi Tây phương. Các nhà khoa học và học giả Nhật Bản (như Fukuzawa Yukichi) đã thông minh kết hợp các chữ Hán có sẵn để dịch hàng ngàn thuật ngữ triết học, khoa học và xã hội phương Tây — gọi là <strong>Wasei-Kango (和製漢語 - Hán tự do người Nhật tạo ra)</strong>.
          </p>
          <p>
            Những từ mới này thành công rực rỡ đến mức sau đó Trung Quốc, Hàn Quốc và Việt Nam đã mượn lại toàn bộ các từ này vào từ vựng quốc gia mình: <em>Khoa học (科学)</em>, <em>Xã hội (社会)</em>, <em>Kinh tế (経済)</em>, <em>Triết học (哲学)</em>, <em>Văn hóa (文化)</em>, <em>Bác sĩ (医師)</em>, <em>Điện thoại (電話)</em>.
          </p>
        </>
      ) : (
        <>
          <p>
            During the Meiji Restoration (1868), Japan modernized rapidly. Scholars combined existing Kanji to invent thousands of new terms translating Western scientific & philosophical concepts — known as <strong>Wasei-Kango (和製漢語)</strong>.
          </p>
          <p>
            These new coinages were so brilliant that China, Korea, and Vietnam borrowed them into their own modern vocabularies: <em>Science (科学)</em>, <em>Society (社会)</em>, <em>Economy (経済)</em>, <em>Culture (文化)</em>, and <em>Telephone (電話)</em>.
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Wasei-Kango chứng minh trí tuệ ngôn ngữ độc đáo của người Nhật: vừa tiếp thu cái mới vừa gìn giữ cấu trúc chữ Hán truyền thống."
        : "Wasei-Kango highlights Japanese linguistic ingenuity: absorbing modern concepts while maintaining traditional Kanji roots.",
      examples: [
        { jp: "科学 (Kagaku)", meaning: isVi ? "Khoa học" : "Science" },
        { jp: "社会 (Shakai)", meaning: isVi ? "Xã hội" : "Society" },
        { jp: "経済 (Keizai)", meaning: isVi ? "Kinh tế" : "Economy" },
        { jp: "電話 (Denwa)", meaning: isVi ? "Điện thoại" : "Telephone" },
      ],
      icon: Building2,
      color: "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      period: isVi ? "Thế Kỷ XXI (Hiện Đại Toàn Cầu)" : "21st Century (Global Era)",
      tag: "Kanji + Hiragana + Katakana + Romaji",
      title: isVi ? "6. Hệ Thống 3 Chữ Độc Nhất Vô Nhị" : "6. The Modern 3-Script Synergy",
      badge: isVi ? "Ngôn ngữ hiện đại" : "Modern Synergy",
      summary: isVi
        ? "Tiếng Nhật phối hợp đồng thời 3 bảng chữ (Kanji, Hiragana, Katakana) trong một câu."
        : "Japanese uses 3 writing systems simultaneously in a single sentence.",
      details: isVi ? (
        <>
          <p>
            Ngày nay, tiếng Nhật là ngôn ngữ duy nhất trên thế giới sử dụng phối hợp đồng thời 3 hệ chữ viết trong cùng một câu văn:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Kanji (漢字)</strong>: Biểu thị ý nghĩa (danh từ, gốc động từ, tính từ).</li>
            <li><strong>Hiragana (平仮名)</strong>: Biểu thị trợ từ, trợ động từ, biến đổi ngữ pháp và từ thuần Nhật.</li>
            <li><strong>Katakana (片仮名)</strong>: Ghi từ mượn tiếng nước ngoài, tên riêng quốc tế, từ tượng thanh/tượng hình và nhấn mạnh.</li>
            <li><strong>Romaji (ローマ字)</strong>: Ký tự Latinh hỗ trợ nhập liệu bàn phím máy tính.</li>
          </ul>
        </>
      ) : (
        <>
          <p>Today, Japanese is the world's only language seamlessly mixing 3 writing systems in one sentence:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Kanji</strong>: Nouns, verb & adjective roots (meaning).</li>
            <li><strong>Hiragana</strong>: Grammatical particles, verb endings, and native words.</li>
            <li><strong>Katakana</strong>: Foreign loanwords, technical terms, and emphasis.</li>
            <li><strong>Romaji</strong>: Latin script for digital input & global accessibility.</li>
          </ul>
        </>
      ),
      keyTakeaway: isVi
        ? "Ví dụ câu hoàn chỉnh: 私はコンピューターを買いました。(Tôi đã mua máy vi tính) — chứa đủ cả Kanji (私, 買), Katakana (コンピューター), và Hiragana (は, を, まし, た)!"
        : "Example sentence: 私はコンピューターを買いました (I bought a computer) — effortlessly combining Kanji, Katakana, and Hiragana!",
      examples: [
        { jp: "私 (Kanji)", meaning: isVi ? "Biểu thị ý nghĩa 'Tôi'" : "Kanji for 'I / Me'" },
        { jp: "コンピューター (Katakana)", meaning: isVi ? "Từ mượn 'Computer'" : "Loanword for 'Computer'" },
        { jp: "は / を / 買いました (Hiragana)", meaning: isVi ? "Trợ từ & Ngữ pháp" : "Particles & Grammar endings" },
      ],
      icon: Layers,
      color: "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  const current = milestones[selectedMilestone];
  const IconComponent = current.icon;

  return (
    <section className="flex flex-col gap-6 rounded-2xl border bg-card/60 p-6 sm:p-8 shadow-2xs backdrop-blur-xs">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary w-fit">
          <History className="size-3.5" />
          <span>{isVi ? "Lịch sử & Nguồn gốc Tiếng Nhật" : "Japanese History & Origin"}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {isVi ? "Lịch Sử & Sự Hình Thành Tiếng Nhật" : "History & Evolution of the Japanese Language"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          {isVi
            ? "Hành trình nghìn năm lịch sử từ ngôn ngữ nói nguyên thủy Yamato-kotoba, cuộc cách mạng sáng tạo chữ Kana thời Heian, đến sự hình thành hệ thống 3 chữ viết (Kanji, Hiragana, Katakana) độc nhất vô nhị trên thế giới."
            : "A thousand-year journey from ancient spoken Yamato-kotoba to the Heian Kana revolution and today's unique 3-script writing system."}
        </p>
      </div>

      {/* Timeline Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {milestones.map((m, idx) => {
          const active = selectedMilestone === idx;
          const Icon = m.icon;

          return (
            <button
              key={m.title}
              type="button"
              onClick={() => setSelectedMilestone(idx)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer select-none",
                active
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                  : "bg-background/60 hover:border-primary/40 hover:bg-accent/40"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg bg-gradient-to-br font-bold text-xs",
                    m.color
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.period}
                </span>
              </div>

              <span className={cn("text-sm font-bold tracking-tight mt-1", active ? "text-primary" : "text-foreground")}>
                {m.title}
              </span>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {m.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Milestone Detail Display Card */}
      <div className="rounded-xl border bg-background p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br font-bold",
                current.color
              )}
            >
              <IconComponent className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {current.title}
                </h2>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {current.badge}
                </span>
              </div>
              <span className="text-xs font-semibold text-primary">
                {current.period} • {current.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="flex flex-col gap-3 text-sm text-foreground/90 leading-relaxed">
          {current.details}
        </div>

        {/* Examples Section */}
        {current.examples && current.examples.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isVi ? "Ví dụ minh họa lịch sử:" : "Historical Word Examples:"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {current.examples.map((ex) => (
                <div key={ex.jp} className="flex flex-col rounded-lg border bg-accent/30 p-2.5">
                  <span className="text-sm font-bold text-foreground">{ex.jp}</span>
                  <span className="text-xs text-muted-foreground">{ex.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Takeaway / Learning Insight */}
        <div className="rounded-lg bg-accent/40 border border-primary/20 p-4 flex items-start gap-3">
          <GraduationCap className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {isVi ? "Ý nghĩa kiến thức cho người học:" : "Key Insight for Learners:"}
            </span>
            <span className="text-xs text-foreground/90 font-medium">
              {current.keyTakeaway}
            </span>
          </div>
        </div>
      </div>

      {/* Script Breakdown Overview */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isVi ? "Tóm tắt vai trò 3 bảng chữ viết tiếng Nhật:" : "Summary of Japanese Writing Systems:"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-medium text-primary">あ</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Hiragana (平仮名)
              </span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isVi ? "Chữ Mềm • Từ Thuần Nhật & Ngữ Pháp" : "Soft Script • Grammar & Native Words"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? "46 ký tự uốn mềm sáng tạo thời Heian (từ chữ Hán 安→あ), dùng ghi âm tiết từ thuần Nhật, trợ từ và đuôi ngữ pháp."
                : "46 phonetic characters created in Heian period (from Kanji 安→あ), used for native words and grammatical particles."}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-medium text-primary">ア</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Katakana (片仮名)
              </span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isVi ? "Chữ Cứng • Từ Mượn Ngoại Quốc" : "Angular Script • Foreign Loanwords"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? "46 ký tự nét ngắt sắc sảo do các nhà sư tạo ra (từ chữ Hán 伊→イ), dùng ghi từ mượn nước ngoài, tên riêng quốc tế và từ tượng thanh."
                : "46 angular characters created by monks (from Kanji 伊→イ), used for foreign loanwords and international names."}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-medium text-primary">漢</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Kanji (漢字)
              </span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isVi ? "Hán Tự • Biểu Thị Ý Nghĩa" : "Chinese Characters • Root Meanings"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? "Ký tự biểu ý mượn từ chữ Hán, đọng lại cốt lõi ý nghĩa của danh từ, động từ và tính từ (như 日本 Nhật Bản, 先生 giáo viên)."
                : "Ideographic characters conveying direct meanings for nouns, verbs, and adjectives (e.g. 日本 Japan)."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
