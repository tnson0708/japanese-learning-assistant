"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ArrowRight,
  CheckCircle2,
  Table,
  Eye,
  Clock,
  FileText,
  PenTool,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function HistorySection() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);

  const milestones = [
    {
      id: 1,
      period: isVi ? "Thời Cổ Đại (Trước TK IV)" : "Ancient Era (Pre-4th Century)",
      subPeriod: isVi ? "Thời kỳ cổ đại (Trước thế kỷ IV) • Yamato-kotoba (大和言葉 / 和語)" : "Ancient Period • Yamato-kotoba",
      tag: "Yamato-kotoba (大和言葉)",
      badge: isVi ? "Truyền khẩu (Oral Tradition)" : "Oral Tradition",
      title: isVi ? "1. Tiếng Yamato thuần truyền miệng" : "1. Spoken Yamato Language",
      shortDesc: isVi
        ? "Thời kỳ Jōmon và Yayoi, người Nhật chỉ có ngôn ngữ nói (Yamato-kotoba) hoàn toàn không có ký tự chữ viết."
        : "Jōmon & Yayoi periods: Japanese only had spoken Yamato-kotoba with no written script.",
      details: (
        <>
          <p>
            Trước thế kỷ thứ IV (thời kỳ <strong className="text-foreground">Jōmon</strong> và <strong className="text-foreground">Yayoi</strong>), cư dân bản địa của quần đảo Nhật Bản sử dụng một ngôn ngữ thuần nói được gọi là <strong className="text-red-600 dark:text-red-400 font-kanji">Yamato-kotoba (大和言葉)</strong> hay <strong className="text-red-600 dark:text-red-400 font-kanji">Wago (和語)</strong>. Tại thời điểm này, nước Nhật chưa có bất kỳ hệ thống ký tự văn tự riêng biệt nào.
          </p>
          <p>
            Mọi câu chuyện lịch sử, các bài ca dân gian truyền tụng, luật tục thị tộc và thần thoại Shinto (Thần đạo) đều được lưu giữ và lưu truyền qua nhiều thế hệ bằng miệng bởi những nghệ nhân kể chuyện chuyên nghiệp được tôn kính gọi là <strong className="text-foreground font-kanji">Kataribe (語部)</strong>. Ngôn ngữ Yamato cổ nổi bật với đặc tính giàu nhạc điệu, âm tiết kết thúc mở bởi 5 nguyên âm cơ bản (a, i, u, e, o), nhẹ nhàng và hòa hợp với thiên nhiên.
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Các từ gốc thuần Nhật (Wago / Yamato-kotoba) thường mang tính miêu tả trực quan, gần gũi với thiên nhiên và đời sống tinh thần. Khi giao tiếp, việc dùng từ Yamato-kotoba tạo nên cảm giác ấm áp, mộc mạc và chân thành hơn so với các từ ghép Hán-Nhật (Kango) vốn mang tính học thuật, trang trọng."
        : "Native Wago words convey warmth and natural imagery. They create an authentic, friendly tone compared to formal Sino-Japanese Kango compounds.",
      examples: [
        { jp: "さくら", kanji: "桜", meaning: isVi ? "Hoa anh đào" : "Cherry blossom", desc: "Tượng trưng cho vẻ đẹp tinh khôi, sự tái sinh của mùa xuân." },
        { jp: "こころ", kanji: "心", meaning: isVi ? "Trái tim, tâm hồn" : "Heart & Soul", desc: "Chỉ tâm thức, lòng trắc ẩn và cảm xúc thẳm sâu của con người." },
        { jp: "やま", kanji: "山", meaning: isVi ? "Ngọn núi" : "Mountain", desc: "Biểu tượng của sự vững chãi, nơi ngự trị linh thiêng của các vị thần Kami." },
      ],
      icon: Clock,
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    {
      id: 2,
      period: isVi ? "TK IV – VIII (Thời Nara)" : "4th - 8th Century (Nara Period)",
      subPeriod: isVi ? "Thế kỷ IV - VIII • Man'yōgana (万葉仮名 / 漢語)" : "4th - 8th Century • Man'yōgana",
      tag: "Man'yōgana (万葉仮名)",
      badge: isVi ? "Hán tự ký âm" : "Phonetic Kanji",
      title: isVi ? "2. Chữ Hán du nhập & Man'yōgana" : "2. Arrival of Kanji & Man'yōgana",
      shortDesc: isVi
        ? "Hán tự truyền qua bán đảo Triều Tiên. Người Nhật mượn âm đọc của chữ Hán để ký âm cho tiếng nói (Vạn Diệp Giả Danh)."
        : "Kanji arrived via Korea. Japanese borrowed Chinese character sounds to phonetically spell spoken words.",
      details: (
        <>
          <p>
            Vào khoảng thế kỷ IV - V, thông qua ngoại giao và Phật giáo từ Bán đảo Triều Tiên (nước Bách Tế - Baekje) và Trung Quốc, <strong className="text-foreground">chữ Hán (Kanji - 漢字)</strong> du nhập vào Nhật Bản. Đây là lần đầu tiên người Nhật tiếp xúc với chữ viết.
          </p>
          <p>
            Vì cấu trúc tiếng Trung và tiếng Nhật khác hẳn nhau, người Nhật đã sáng tạo ra hệ chữ <strong className="text-red-600 dark:text-red-400 font-kanji">Man'yōgana (万葉仮名 - Vạn Diệp Giả Danh)</strong>: sử dụng âm đọc của chữ Hán để ghi lại phát âm của các từ thuần Nhật (bỏ qua nghĩa của chữ Hán đó). Ví dụ: chữ 夜麻 đọc là <em>Yama</em> (núi), 波奈 đọc là <em>Hana</em> (hoa). Tác phẩm nổi tiếng <em>Vạn Diệp Tập (Man'yōshū)</em> với 4,500 bài thơ cổ đã được ghi chép bằng hệ chữ này.
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Man'yōgana chính là chiếc cầu nối lịch sử trực tiếp dẫn đến sự ra đời của bảng chữ Hiragana và Katakana sau này."
        : "Man'yōgana served as the direct evolutionary bridge to modern Hiragana and Katakana.",
      examples: [
        { jp: "夜麻", kanji: "Yama", meaning: isVi ? "Ghi âm Yama (Núi)" : "Spelling Yama", desc: "Mượn âm 夜 (Ya) + 麻 (Ma) để ghi từ 'Yama'." },
        { jp: "波奈", kanji: "Hana", meaning: isVi ? "Ghi âm Hana (Hoa)" : "Spelling Hana", desc: "Mượn âm 波 (Ha) + 奈 (Na) để ghi từ 'Hana'." },
        { jp: "阿", kanji: "a", meaning: isVi ? "Tiền thân chữ あ" : "Ancestor of あ", desc: "Chữ Hán 阿 biến tấu nét thành chữ mềm あ ngày nay." },
      ],
      icon: Scroll,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      id: 3,
      period: isVi ? "TK IX – XII (Thời Heian)" : "9th - 12th Century (Heian Period)",
      subPeriod: isVi ? "Thế kỷ IX - XII • Sáng tạo Hiragana & Katakana" : "9th - 12th Century • Heian Revolution",
      tag: "Hiragana & Katakana",
      badge: isVi ? "Bảng chữ Kana" : "Kana Revolution",
      title: isVi ? "3. Cuộc cách mạng sáng tạo Kana" : "3. The Kana Revolution",
      shortDesc: isVi
        ? "Hiragana được phụ nữ cung đình sáng tạo từ lối viết thảo; Katakana được giới tăng lữ lược trích để chú âm kinh Phật."
        : "Hiragana was created by court noblewomen from cursive Kanji; Katakana was simplified by monks for sutras.",
      details: (
        <>
          <p>
            Vào thời Heian (thế kỷ IX), hai bảng chữ Kana độc đáo ra đời:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-foreground font-kanji">Hiragana (平仮名 - Onnade / Chữ phụ nữ)</strong>: Được các phụ nữ quý tộc sáng tạo bằng cách biến tấu nét uốn mềm mại (Thảo thư - 草書) của chữ Hán (vd: 安 → あ, 以 → い). Nhờ Hiragana, nữ giới thời Heian đã sáng tạo nên những kiệt tác văn học thế giới như <em>Truyện Genji (Genji Monogatari)</em> của Murasaki Shikibu.
            </li>
            <li>
              <strong className="text-foreground font-kanji">Katakana (片仮名)</strong>: Được các nhà sư và học giả tạo ra bằng cách cắt lấy một phần nét (片) của chữ Hán (vd: 伊 → イ, 江 → エ) để làm ký hiệu ghi chú phát âm nhanh bên cạnh kinh Phật.
            </li>
          </ul>
        </>
      ),
      keyTakeaway: isVi
        ? "Sự ra đời của Kana giải phóng người Nhật khỏi sự phụ thuộc hoàn toàn vào chữ Hán, tạo nên bản sắc văn hóa và văn học riêng biệt."
        : "Kana liberated Japan from total reliance on Chinese syntax, creating a unique national literary identity.",
      examples: [
        { jp: "安 → あ", kanji: "Hiragana あ", meaning: isVi ? "Biến tấu chữ 安" : "Evolved from 安", desc: "Chữ Hán 'An' uốn mềm thành nét chữ あ." },
        { jp: "以 → い", kanji: "Hiragana い", meaning: isVi ? "Biến tấu chữ 以" : "Evolved from 以", desc: "Chữ Hán 'Dĩ' biến đổi nét thành chữ い." },
        { jp: "伊 → イ", kanji: "Katakana イ", meaning: isVi ? "Lược trích bộ nhân 亻" : "Fragment of 伊", desc: "Rút một phần bên trái của chữ 伊 thành イ." },
      ],
      icon: PenTool,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      id: 4,
      period: isVi ? "TK XVI – XIX (Thời Edo)" : "16th - 19th Century (Edo Period)",
      subPeriod: isVi ? "Thế kỷ XVI - XIX • Từ mượn Phương Tây & Tiếng Edo" : "16th - 19th Century • Edo Shift",
      tag: "Gairaigo & Giọng Edo",
      badge: isVi ? "Giao thoa Văn hóa" : "Western Exchange",
      title: isVi ? "4. Tiếp xúc Tây phương & Tiếng Edo" : "4. Western Contact & Edo Shift",
      shortDesc: isVi
        ? "Thương nhân Bồ Đào Nha & Hà Lan du nhập từ vựng khoa học. Phương ngữ Edo dần trở thành tiếng Nhật chuẩn quốc gia."
        : "Portuguese & Dutch loanwords arrived. Edo (Tokyo) dialect evolved into national Standard Japanese.",
      details: (
        <>
          <p>
            Vào thế kỷ XVI, thương nhân và nhà truyền giáo Bồ Đào Nha đến Nhật Bản, mang theo những từ mượn phương Tây đầu tiên (Gairaigo): <em>Pan (bánh mì - từ pão)</em>, <em>Tempura</em>, <em>Tabako (thuốc lá)</em>. Sau đó thời Edo, Nhật Bản thực hiện chính sách bế quan tỏa cảng (Sakoku), chỉ duy trì thương mại với Hà Lan tại đảo Dejima (Nagasaki), nhập khẩu các thuật ngữ khoa học Hà Lan (Hà Lan học - Rangaku).
          </p>
          <p>
            Cùng thời gian này, khi Tướng quân Tokugawa chuyển trung tâm chính trị về Edo (nay là Tokyo), giọng nói vùng Edo bắt đầu phát triển mạnh mẽ và dần thay thế giọng Kansai (Kyoto/Osaka) để trở thành nền tảng cho <strong className="text-foreground font-kanji">tiếng Nhật chuẩn (Hyōjungo - 標準語)</strong>.
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Từ mượn Bồ Đào Nha như パン (Pan) hay ボタン (Botan) đã hòa nhập sâu sắc và được người Nhật sử dụng tự nhiên đến tận ngày nay."
        : "Early Western loanwords like パン (Pan) became permanent everyday Japanese vocabulary.",
      examples: [
        { jp: "パン", kanji: "Pan", meaning: isVi ? "Bánh mì (từ pão)" : "Bread (from pão)", desc: "Du nhập từ thương nhân Bồ Đào Nha thế kỷ 16." },
        { jp: "ボタン", kanji: "Botan", meaning: isVi ? "Nút áo (từ botão)" : "Button (from botão)", desc: "Từ mượn phục trang Bồ Đào Nha." },
        { jp: "コップ", kanji: "Koppu", meaning: isVi ? "Cái cốc (từ kop)" : "Glass (from kop)", desc: "Từ mượn khoa học gia dụng Hà Lan." },
      ],
      icon: Compass,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      id: 5,
      period: isVi ? "TK XIX – XX (Thời Meiji)" : "19th - 20th Century (Meiji Era)",
      subPeriod: isVi ? "Thế kỷ XIX - XX • Wasei-Kango (和製漢語)" : "19th - 20th Century • Meiji Modernization",
      tag: "Wasei-Kango (和製漢語)",
      badge: isVi ? "Sáng tạo Hán tự" : "Meiji Coinages",
      title: isVi ? "5. Hiện đại hóa & Wasei-Kango" : "5. Meiji Modernization & Wasei-Kango",
      shortDesc: isVi
        ? "Học giả thời Minh Trị sáng tạo hàng ngàn từ Hán mới (Hòa chế Hán từ) để dịch thuật các khái niệm triết học & kỹ thuật phương Tây."
        : "Japanese scholars coined new Kanji compounds (Wasei-Kango) to translate modern Western concepts.",
      details: (
        <>
          <p>
            Thời kỳ Minh Trị (Meiji - 1868), Nhật Bản cải cách mở cửa học hỏi Tây phương. Các nhà khoa học và học giả Nhật Bản (như Fukuzawa Yukichi) đã thông minh kết hợp các chữ Hán có sẵn để dịch hàng ngàn thuật ngữ triết học, khoa học và xã hội phương Tây — gọi là <strong className="text-red-600 dark:text-red-400 font-kanji">Wasei-Kango (和製漢語 - Hán tự do người Nhật tạo ra)</strong>.
          </p>
          <p>
            Những từ mới này thành công rực rỡ đến mức sau đó Trung Quốc, Hàn Quốc và Việt Nam đã mượn lại toàn bộ các từ này vào từ vựng quốc gia mình: <em>Khoa học (科学)</em>, <em>Xã hội (社会)</em>, <em>Kinh tế (経済)</em>, <em>Triết học (哲学)</em>, <em>Văn hóa (文化)</em>, <em>Bác sĩ (医師)</em>, <em>Điện thoại (電話)</em>.
          </p>
        </>
      ),
      keyTakeaway: isVi
        ? "Wasei-Kango chứng minh trí tuệ ngôn ngữ độc đáo của người Nhật: vừa tiếp thu cái mới vừa gìn giữ cấu trúc chữ Hán truyền thống."
        : "Wasei-Kango highlights Japanese linguistic ingenuity: absorbing modern concepts while maintaining traditional Kanji roots.",
      examples: [
        { jp: "科学", kanji: "Kagaku", meaning: isVi ? "Khoa học" : "Science", desc: "Chữ 'Khoa' + 'Học' ghép dịch từ Science." },
        { jp: "社会", kanji: "Shakai", meaning: isVi ? "Xã hội" : "Society", desc: "Chữ 'Xã' + 'Hội' ghép dịch từ Society." },
        { jp: "電話", kanji: "Denwa", meaning: isVi ? "Điện thoại" : "Telephone", desc: "Chữ 'Điện' + 'Thoại' ghép dịch từ Telephone." },
      ],
      icon: Building2,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      id: 6,
      period: isVi ? "TK XXI (Kỷ Nguyên Số)" : "21st Century (Global Era)",
      subPeriod: isVi ? "Thế kỷ XXI • Kanji + Hiragana + Katakana" : "21st Century • 3-Script Synergy",
      tag: "Kanji + Hiragana + Katakana",
      badge: isVi ? "Cấu trúc Hiện đại" : "Modern Synergy",
      title: isVi ? "6. Sự phối hợp 3 bộ chữ độc đáo" : "6. The Modern 3-Script Synergy",
      shortDesc: isVi
        ? "Kanji biểu đạt ý nghĩa trọng tâm, Hiragana thể hiện ngữ pháp, Katakana tiếp nhận thuật ngữ quốc tế trong cùng một câu nói."
        : "Kanji conveys root meaning, Hiragana expresses grammar, Katakana captures foreign loanwords in one sentence.",
      details: (
        <>
          <p>
            Ngày nay, tiếng Nhật là ngôn ngữ duy nhất trên thế giới sử dụng phối hợp đồng thời 3 hệ chữ viết trong cùng một câu văn:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground font-kanji">Kanji (漢字)</strong>: Biểu thị ý nghĩa (danh từ, gốc động từ, tính từ).</li>
            <li><strong className="text-foreground font-kanji">Hiragana (平仮名)</strong>: Biểu thị trợ từ, trợ động từ, biến đổi ngữ pháp và từ thuần Nhật.</li>
            <li><strong className="text-foreground font-kanji">Katakana (片仮名)</strong>: Ghi từ mượn tiếng nước ngoài, tên riêng quốc tế, từ tượng thanh/tượng hình và nhấn mạnh.</li>
            <li><strong className="text-foreground font-kanji">Romaji (ローマ字)</strong>: Ký tự Latinh hỗ trợ nhập liệu bàn phím máy tính.</li>
          </ul>
        </>
      ),
      keyTakeaway: isVi
        ? "Sự phối hợp 3 bộ chữ giúp câu văn tiếng Nhật ngắn gọn, biểu thị nghĩa rõ ràng không bị trùng lặp âm đọc và không cần dùng khoảng trắng."
        : "Mixing 3 scripts lets Japanese sentences convey meaning concisely without spaces or homophone confusion.",
      examples: [
        { jp: "私", kanji: "Kanji", meaning: isVi ? "Danh từ 'Tôi'" : "Noun 'I / Me'", desc: "Chữ Hán biểu thị ý nghĩa trọng tâm." },
        { jp: "フランスパン", kanji: "Katakana", meaning: isVi ? "Từ mượn 'Bánh mì Pháp'" : "Loanword 'French Bread'", desc: "Chữ cứng ghi phiên âm quốc tế." },
        { jp: "は / を / 食べました", kanji: "Hiragana", meaning: isVi ? "Trợ từ & Chia động từ" : "Particles & Verb endings", desc: "Chữ mềm thể hiện cấu trúc ngữ pháp." },
      ],
      icon: Layers,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
  ];

  const current = milestones[selectedMilestone];
  const IconComponent = current.icon;

  return (
    <div className="flex flex-col gap-10">
      {/* SECTION 1: Breadcrumb & Hero Header Banner */}
      <section className="flex flex-col gap-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link href="/" className="hover:text-red-600 flex items-center gap-1 transition-colors">
            <span>Trang chủ</span>
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-semibold">Lý thuyết & Nguồn gốc</span>
        </nav>

        {/* Hero Banner Box */}
        <div className="relative overflow-hidden bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-wide">
              <Clock className="size-3.5" />
              <span>JAPANESE HISTORY & ORIGINS • HÀNH TRÌNH NGHÌN NĂM</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Lịch sử & Sự phát triển của <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-rose-600">
                Chữ Viết Tiếng Nhật
              </span>
            </h1>

            {/* Subtitle Narrative */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Hành trình hơn một ngàn năm từ thời kỳ tiếng cổ <strong className="text-foreground">Yamato-kotoba</strong> thuần truyền khẩu, bước ngoặt tiếp nhận chữ Hán (<strong className="text-foreground">Man'yōgana</strong>), cuộc cách mạng sáng tạo hệ song ngữ Kana thời Heian, cho đến cấu trúc kết hợp 3 bộ chữ độc nhất vô nhị trên thế giới ngày nay.
            </p>

            {/* Metric Tags */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/60 text-foreground text-xs font-semibold rounded-lg border border-border/80">
                <span className="size-2 rounded-full bg-emerald-500" />
                6 Mốc thời kỳ tiến hóa
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/60 text-foreground text-xs font-semibold rounded-lg border border-border/80">
                <span className="size-2 rounded-full bg-red-600" />
                3 Hệ chữ viết hiện đại
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/60 text-foreground text-xs font-semibold rounded-lg border border-border/80">
                <span className="size-2 rounded-full bg-amber-500" />
                Chữ Hán Vạn Diệp (Man'yōgana)
              </span>
            </div>
          </div>

          {/* Background Kanji Watermark */}
          <span className="absolute -right-6 -bottom-10 opacity-[0.04] select-none pointer-events-none text-[16rem] sm:text-[18rem] font-black text-foreground font-kanji-mincho leading-none">
            和
          </span>
        </div>
      </section>

      {/* SECTION 2: Historical Timeline 6-Era Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/80 pb-4">
          <div>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
              Biên niên sử tiến hóa
            </span>
            <h2 className="text-2xl font-black text-foreground">6 Giai đoạn hình thành Văn tự Nhật Bản</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Chọn một thời kỳ để xem phân tích chi tiết</p>
        </div>

        {/* 6-Era Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {milestones.map((m, idx) => {
            const isActive = selectedMilestone === idx;
            const Icon = m.icon;

            return (
              <article
                key={m.id}
                onClick={() => setSelectedMilestone(idx)}
                className={cn(
                  "relative flex flex-col justify-between p-5 sm:p-6 bg-card rounded-2xl border transition-all duration-200 cursor-pointer select-none group shadow-2xs",
                  isActive
                    ? "border-red-600 dark:border-red-500 bg-red-500/5 ring-2 ring-red-600/20 shadow-sm"
                    : "border-border/80 hover:border-border hover:shadow-xs"
                )}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center font-bold border", m.color)}>
                      <Icon className="size-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-muted/60 text-muted-foreground border border-border/60">
                      {m.period}
                    </span>
                  </div>

                  <h3 className={cn("text-base font-bold transition-colors", isActive ? "text-red-600 dark:text-red-400" : "text-foreground group-hover:text-red-600")}>
                    {m.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {m.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
                  <span className={isActive ? "text-red-600 dark:text-red-400" : "text-muted-foreground group-hover:text-foreground"}>
                    {isActive ? "Đang hiển thị chi tiết" : "Tìm hiểu mốc này"}
                  </span>
                  <span className={cn("transition-transform", isActive ? "text-red-600" : "text-muted-foreground group-hover:translate-x-1")}>
                    →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Detailed Era Feature Focus (Deep Dive Panel) */}
      <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xs">
        {/* Detail Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div className="flex items-center gap-4">
            <div className={cn("size-12 rounded-2xl flex items-center justify-center border shrink-0", current.color)}>
              <IconComponent className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-kanji-mincho">
                  {current.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  {current.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium pt-0.5">
                {current.subPeriod}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground italic">
            * Giai đoạn mốc lịch sử #{current.id} trong tiến hóa văn tự
          </div>
        </div>

        {/* Narrative Text */}
        <div className="space-y-4 text-foreground/90 text-sm sm:text-base leading-relaxed">
          {current.details}
        </div>

        {/* Historical Examples Grid */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
            {isVi ? "Ví dụ về các từ & nét ký tự thời kỳ này:" : "Historical Word & Script Examples:"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {current.examples.map((ex) => (
              <div key={ex.jp} className="p-4 rounded-2xl bg-muted/30 border border-border/80 flex flex-col justify-between hover:border-border transition-colors">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold text-foreground font-kanji-mincho">
                    {ex.jp} <span className="text-xs text-muted-foreground font-normal">({ex.kanji})</span>
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                    {ex.meaning}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {ex.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insight For Learners Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4 text-amber-800 dark:text-amber-300">
          <div className="text-xl sm:text-2xl mt-0.5 shrink-0">💡</div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
              Lời khuyên cốt lõi cho người học tiếng Nhật (Key Insight for Learners):
            </h5>
            <p className="text-xs sm:text-sm leading-relaxed">
              {current.keyTakeaway}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Three Writing Systems Summary (Cấu trúc chữ viết hiện đại) */}
      <section className="space-y-6">
        <div className="space-y-1 border-b border-border/80 pb-4">
          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
            Cấu trúc chữ viết hiện đại
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Tổng quan 3 Hệ thống Chữ viết Tiếng Nhật
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sự hòa quyện tuyệt đẹp giữa biểu âm và biểu ý tạo nên ngôn ngữ văn bản giàu sắc thái nhất phương Đông
          </p>
        </div>

        {/* 3 Systems Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* System 1: Hiragana */}
          <div className="relative bg-card rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-red-600 dark:text-red-400 font-kanji-mincho">あ</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                  Hiragana (平仮名)
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">CHỮ MỀM • NGỮ PHÁP & TỪ GỐC</h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">Biểu âm • 46 ký tự cơ bản</p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Phát triển từ lối viết thảo nhanh của chữ Hán <span className="font-kanji-mincho font-bold text-foreground">(安 → あ)</span> bởi giới phụ nữ quý tộc thời Heian. Dùng để ghi trợ từ, đuôi biến đổi của động từ/tính từ (Okurigana) và các từ thuần Nhật không có Kanji.
              </p>

              {/* Transformation Visual */}
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs flex items-center justify-between text-center">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Chữ Hán gốc</span>
                  <span className="text-sm font-bold text-foreground font-kanji-mincho">安</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Thảo thư</span>
                  <span className="text-sm font-medium text-muted-foreground font-kanji-mincho">あ</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Chữ mềm</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400 font-kanji-mincho">あ</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground block">Ví dụ trong câu:</span>
              <span className="text-sm font-bold text-foreground font-kanji-mincho">
                わたし<span className="text-red-600 dark:text-red-400">は</span>がくせい<span className="text-red-600 dark:text-red-400">です</span>
              </span>
            </div>
          </div>

          {/* System 2: Katakana */}
          <div className="relative bg-card rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-kanji-mincho">ア</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                  Katakana (片仮名)
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">CHỮ CỨNG • TỪ MƯỢN & NHẤN MẠNH</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">Biểu âm • 46 ký tự nét thẳng</p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tạo ra bởi các nhà sư Phật giáo bằng cách trích một phần/mảnh nét của chữ Hán <span className="font-kanji-mincho font-bold text-foreground">(伊 → イ)</span> để ghi nhanh âm đọc. Hiện nay dùng ghi từ mượn tiếng nước ngoài, tên quốc tế, âm tượng thanh hoặc gây ấn tượng quảng cáo.
              </p>

              {/* Transformation Visual */}
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs flex items-center justify-between text-center">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Chữ Hán gốc</span>
                  <span className="text-sm font-bold text-foreground font-kanji-mincho">伊</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Bộ nhân 亻</span>
                  <span className="text-sm font-medium text-muted-foreground font-kanji-mincho">亻</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Chữ cứng</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-kanji-mincho">イ</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground block">Ví dụ trong câu:</span>
              <span className="text-sm font-bold text-foreground font-kanji-mincho">
                <span className="text-blue-600 dark:text-blue-400">コーヒー</span>をのみます
              </span>
            </div>
          </div>

          {/* System 3: Kanji */}
          <div className="relative bg-card rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-kanji-mincho">漢</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                  Kanji (漢字)
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">CHỮ HÁN • GỐC RỄ Ý NGHĨA</h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Biểu ý • 2.136 chữ thông dụng (Jōyō)</p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Các ký tự tượng hình truyền tải trực tiếp nghĩa cốt lõi, giúp người đọc nắm bắt ý nghĩa câu văn trong nháy mắt mà không sợ hiểu nhầm các từ đồng âm dị nghĩa (homophones) vốn cực kỳ nhiều trong tiếng Nhật.
              </p>

              {/* Transformation Visual */}
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs flex items-center justify-between text-center">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Mặt trời</span>
                  <span className="text-sm font-bold text-foreground font-kanji-mincho">日</span>
                </div>
                <span className="text-muted-foreground">+</span>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Gốc rễ</span>
                  <span className="text-sm font-bold text-foreground font-kanji-mincho">本</span>
                </div>
                <span className="text-muted-foreground">=</span>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Nhật Bản</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-kanji-mincho">日本</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground block">Ví dụ trong câu:</span>
              <span className="text-sm font-bold text-foreground font-kanji-mincho">
                <span className="text-amber-600 dark:text-amber-400">日本語</span>を<span className="text-amber-600 dark:text-amber-400">勉強</span>します
              </span>
            </div>
          </div>
        </div>

        {/* Real Example Sentence Breakdown Box */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <h4 className="text-sm font-bold text-foreground">Ví dụ sự kết hợp thực tế của 3 hệ chữ trong 1 câu văn duy nhất:</h4>
          <div className="flex flex-wrap items-center gap-2 text-base sm:text-xl font-kanji-mincho font-bold p-4 bg-muted/40 rounded-xl border border-border/60">
            <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20" title="Kanji: Tôi (Danh từ)">
              私 (Watashi)
            </span>
            <span className="text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20" title="Hiragana: Trợ từ chủ ngữ">
              は (wa)
            </span>
            <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20" title="Katakana: Từ mượn tiếng Pháp (Bánh mì)">
              フランスパン (furansupan)
            </span>
            <span className="text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20" title="Hiragana: Trợ từ tân ngữ">
              を (o)
            </span>
            <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20" title="Kanji: Gốc động từ Ăn">
              食 (ta)
            </span>
            <span className="text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20" title="Hiragana: Đuôi chia thì quá khứ lịch sự">
              べました (bemashita)。
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            * Dịch nghĩa: <em>"Tôi đã ăn bánh mì Pháp."</em> — Không có sự kết hợp này, tiếng Nhật viết sẽ không có khoảng trắng ngắt từ và trở nên vô cùng khó đọc.
          </p>
        </div>
      </section>

      {/* SECTION 5: Call to Action Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        {/* Background Watermark */}
        <span className="absolute -right-10 -bottom-12 opacity-10 select-none pointer-events-none text-[14rem] font-black font-kanji-mincho leading-none">
          道
        </span>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Khởi đầu hành trình ngay hôm nay</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Sẵn sàng chinh phục tiếng Nhật cùng 仮名道場?</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Khám phá trọn bộ bảng chữ cái Kana, luyện viết nét chuẩn KanjiVG, mở rộng vốn từ vựng theo chủ đề và cấu trúc ngữ pháp có hệ thống.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/kana"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="size-4" />
              <span>Bảng chữ Kana</span>
            </Link>

            <Link
              href="/vocabulary"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/15 backdrop-blur-xs transition-colors"
            >
              <Table className="size-4" />
              <span>Từ vựng chủ đề</span>
            </Link>

            <Link
              href="/theory"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/15 backdrop-blur-xs transition-colors"
            >
              <GraduationCap className="size-4" />
              <span>Lý thuyết Minna</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
