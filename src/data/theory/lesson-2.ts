import type { Lesson } from "@/lib/theory";

export const lesson2: Lesson = {
  id: 2,
  title: "Bài 2",
  sections: [
    {
      id: "vocabulary",
      title: "I. Từ vựng",
      blocks: [
        {
          type: "vocab-list",
          items: [
            {
              jp: "これ",
              meaning: "cái này, đây (vật ở gần người nói)",
            },
            {
              jp: "それ",
              meaning: "cái đó, đó (vật ở gần người nghe)",
            },
            {
              jp: "あれ",
              meaning: "cái kia, kia (vật ở xa cả người nói và người nghe)",
            },
            {
              jp: "この ～",
              meaning: "~ này (gần người nói)",
              note: "Luôn đi kèm danh từ, vd: この ほん (quyển sách này)",
            },
            {
              jp: "その ～",
              meaning: "~ đó (gần người nghe)",
              note: "Luôn đi kèm danh từ, vd: その かばん (cái cặp đó)",
            },
            {
              jp: "あの ～",
              meaning: "~ kia (xa cả người nói và người nghe)",
              note: "Luôn đi kèm danh từ, vd: あの かた (vị kia)",
            },
            { jp: "ほん", kanji: "本", meaning: "sách" },
            { jp: "じしょ", kanji: "辞書", meaning: "từ điển" },
            { jp: "ざっし", kanji: "雑誌", meaning: "tạp chí" },
            { jp: "しんぶん", kanji: "新聞", meaning: "báo" },
            { jp: "ノート", meaning: "vở, quyển vở" },
            { jp: "てちょう", kanji: "手帳", meaning: "sổ tay" },
            { jp: "めいし", kanji: "名刺", meaning: "danh thiếp" },
            { jp: "カード", meaning: "thẻ (tín dụng), các, cạc" },
            { jp: "えんぴつ", kanji: "鉛筆", meaning: "bút chì" },
            { jp: "ボールペン", meaning: "bút bi" },
            { jp: "シャープペンシル", meaning: "bút chì kim, bút chì bấm" },
            { jp: "かぎ", meaning: "chìa khóa" },
            { jp: "とけい", kanji: "時計", meaning: "đồng hồ" },
            { jp: "かさ", kanji: "傘", meaning: "ô, dù" },
            { jp: "かばん", meaning: "cặp sách, túi sách" },
            { jp: "CD", meaning: "đĩa CD" },
            { jp: "テレビ", meaning: "tivi" },
            { jp: "ラジオ", meaning: "radio" },
            { jp: "カメラ", meaning: "máy ảnh" },
            { jp: "コンピューター", meaning: "máy vi tính" },
            { jp: "くるま", kanji: "車", meaning: "ô tô, xe hơi" },
            { jp: "つくえ", kanji: "机", meaning: "bàn" },
            { jp: "いす", meaning: "ghế" },
            { jp: "チョコレート", meaning: "sôcôla" },
            { jp: "コーヒー", meaning: "cà phê" },
            {
              jp: "［お］みやげ",
              kanji: "［お］土産",
              meaning: "quà (mua khi đi xa về hoặc mang đi khi thăm nhà người nào đó)",
            },
            { jp: "えいご", kanji: "英語", meaning: "tiếng Anh" },
            { jp: "にほんご", kanji: "日本語", meaning: "tiếng Nhật" },
            { jp: "～ご", kanji: "～語", meaning: "tiếng ~ (vd: ベトナムご = tiếng Việt)" },
            { jp: "なん", kanji: "何", meaning: "gì, cái gì" },
            { jp: "そう", meaning: "vậy, như thế" },
          ],
        },
        {
          type: "vocab-group",
          heading: "練習C — Mẫu câu giao tiếp & Thể hiện phản ứng",
          items: [
            {
              jp: "あのう",
              meaning: "à, ờ... (dùng để biểu thị sự ngại ngùng, do dự)",
            },
            {
              jp: "えっ",
              meaning: "Hả? (dùng khi nghe một điều gì không mong muốn hoặc bất ngờ)",
            },
            {
              jp: "どうぞ。",
              meaning: "Xin mời. (dùng khi mời ai đó cái gì)",
            },
            {
              jp: "［どうも］ありがとう［ございます］。",
              meaning: "Xin chân thành cảm ơn, xin cảm ơn rất nhiều.",
            },
            { jp: "そうですか。", meaning: "Thế à." },
            {
              jp: "ちがいます。",
              kanji: "違います。",
              meaning: "Không phải, không đúng, sai rồi.",
            },
            {
              jp: "あ",
              meaning: "Ôi! (dùng khi sực nhận ra điều gì)",
            },
          ],
        },
        {
          type: "vocab-group",
          heading: "会話 — Chào hỏi khi đến ở hoặc làm việc mới",
          items: [
            {
              jp: "これから お世話に なります。",
              meaning: "Từ nay tôi rất mong được sự giúp đỡ của anh/chị.",
              note: "Dùng chào hàng xóm mới hoặc đồng nghiệp mới khi chuyển đến",
            },
            {
              jp: "こちらこそ ［どうぞ］ よろしく ［おねがいします］。",
              meaning: "Chính tôi mới là người mong được sự giúp đỡ của anh/chị.",
              note: "Câu đáp lại lời chào ［どうぞ］ よろしく ［おねがいします］",
            },
          ],
        },
      ],
    },
    {
      id: "reference",
      title: "II. Từ và thông tin tham khảo",
      blocks: [
        {
          type: "table",
          title: "名前 (なまえ) — 20 Họ thường gặp nhất của người Nhật (日本の姓の全国順位)",
          columns: ["Thứ tự", "Họ (Kanji / Hiragana)", "Romaji"],
          speakableColumns: [1],
          rows: [
            ["1", "佐藤 (さとう)", "Sato"],
            ["2", "鈴木 (すずき)", "Suzuki"],
            ["3", "高橋 (たかはし)", "Takahashi"],
            ["4", "田中 (たなか)", "Tanaka"],
            ["5", "渡辺 (わたなべ)", "Watanabe"],
            ["6", "伊藤 (いとう)", "Ito"],
            ["7", "山本 (やまもと)", "Yamamoto"],
            ["8", "中村 (なかむら)", "Nakamura"],
            ["9", "小林 (こばやし)", "Kobayashi"],
            ["10", "加藤 (かとう)", "Kato"],
            ["11", "吉田 (よしだ)", "Yoshida"],
            ["12", "山田 (やまだ)", "Yamada"],
            ["13", "佐々木 (ささき)", "Sasaki"],
            ["14", "斎藤 (さいとう)", "Saito"],
            ["15", "山口 (やまぐち)", "Yamaguchi"],
            ["16", "松本 (まつもと)", "Matsumoto"],
            ["17", "井上 (いのうえ)", "Inoue"],
            ["18", "木村 (きむら)", "Kimura"],
            ["19", "林 (はやし)", "Hayashi"],
            ["20", "清水 (しみず)", "Shimizu"],
          ],
        },
        {
          type: "note",
          text: "Nguồn: Trích từ 'Cơ sở dữ liệu theo thứ tự trên toàn quốc về Họ của người Nhật' do Keiji Shirooka và Tadashige Murayama công bố tháng 8/2011.",
        },
        {
          type: "heading",
          text: "Văn hóa giao tiếp & Phong tục chào hỏi của người Nhật",
        },
        {
          type: "paragraph",
          text: "📇 Trao đổi danh thiếp (名刺): Trong công việc, khi lần đầu gặp nhau, người Nhật thường tiến hành trao đổi danh thiếp lịch sự bằng hai tay kèm theo lời chào: 「はじめまして。どうぞ よろしく おねがいします。」",
        },
        {
          type: "paragraph",
          text: "🎁 Chào hỏi hàng xóm mới: Khi chuyển nhà đến một địa điểm mới, người Nhật thường đến chào hàng xóm xung quanh và mang theo một món quà nhỏ (như khăn tắm, xà phòng, bánh kẹo...) kèm lời chào: 「これから お世話に なります。」 (Từ nay rất mong được sự giúp đỡ của anh/chị).",
        },
      ],
    },
    {
      id: "grammar",
      title: "III. Giải thích ngữ pháp",
      blocks: [
        {
          type: "grammar-pattern",
          pattern: "1. これ ／ それ ／ あれ",
          explanation:
            "これ, それ, あれ là những đại từ chỉ định vật, đóng vai trò như danh từ trong câu.",
          subPoints: [
            {
              label: "1) これ (cái này)",
              text: "Dùng để chỉ một vật ở gần người nói.",
            },
            {
              label: "2) それ (cái đó)",
              text: "Dùng để chỉ một vật ở gần người nghe.",
            },
            {
              label: "3) あれ (cái kia)",
              text: "Dùng để chỉ một vật ở xa cả người nói và người nghe.",
            },
          ],
          examples: [
            {
              jp: "① それは 辞書ですか。",
              vi: "Đó có phải là quyển từ điển không?",
            },
            {
              jp: "② これは だれの 傘ですか。",
              vi: "Đây là cái ô của ai?",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "2. この Danh từ ／ その Danh từ ／ あの Danh từ",
          explanation:
            "この, その, あの là những từ chỉ định (tính từ chỉ định), luôn đi trước để bổ nghĩa cho danh từ đứng sau.",
          subPoints: [
            {
              label: "1) この Danh từ",
              text: "~ này (vật hoặc người ở gần người nói)",
            },
            {
              label: "2) その Danh từ",
              text: "~ đó (vật hoặc người ở gần người nghe)",
            },
            {
              label: "3) あの Danh từ",
              text: "~ kia (vật hoặc người ở xa cả người nói và người nghe)",
            },
          ],
          examples: [
            {
              jp: "③ この 本は わたしのです。",
              vi: "Quyển sách này là của tôi.",
            },
            {
              jp: "④ あの 方は どなたですか。",
              vi: "Vị kia là ai?",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "3. そうです （Khẳng định / Phủ định trong câu danh từ）",
          explanation:
            "Trong câu danh từ, để trả lời khẳng định cho câu hỏi nghi vấn đúng hay sai, ta dùng そう (như はい、そうです). Trường hợp trả lời phủ định, việc dùng そう không thông dụng, mà thay vào đó người ta thường dùng ちがいます (sai/không phải) hoặc đưa ra câu trả lời đúng.",
          examples: [
            {
              jp: "⑤ それは 辞書ですか。\n……はい、そうです。",
              vi: "Đó có phải là quyển từ điển không?\n…Vâng, phải.",
            },
            {
              jp: "⑥ それは ミラーさんのですか。\n……いいえ、ちがいます。",
              vi: "Cái đó có phải là của anh Miller không?\n…Không, không phải.",
            },
            {
              jp: "⑦ それは シャープペンシルですか。\n……いいえ、ボールペンです。",
              vi: "Đó có phải là bút chì kim không?\n…Không, là bút bi.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "4. Danh từ₁ か、Danh từ₂ か （Mẫu câu hỏi lựa chọn）",
          explanation:
            "Đây là mẫu câu nghi vấn sắp xếp từ 2 (hoặc nhiều) câu nghi vấn trở lên với nhau để bắt người nghe lựa chọn nội dung đúng. Khi trả lời KHÔNG dùng はい hay いいえ mà trả lời trực tiếp nội dung được chọn.",
          examples: [
            {
              jp: "⑧ これは 「９」ですか、「７」ですか。\n……「９」です。",
              vi: "Đây là “9” hay “7”?\n…Là “9”.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "5. Danh từ₁ の Danh từ₂",
          explanation:
            "Ở Bài 1 chúng ta đã học trợ từ の dùng để nối hai danh từ. Ở bài này chúng ta học thêm 2 cách sử dụng khác của の:",
          subPoints: [
            {
              label: "1) Giải thích nội dung",
              text: "Danh từ₁ giải thích nội dung Danh từ₂ là nói về chủ đề gì (vd: コンピューターの 本 = sách về máy vi tính).",
            },
            {
              label: "2) Biểu thị sở hữu",
              text: "Danh từ₁ biểu thị chủ sở hữu của Danh từ₂ (vd: わたしの 本 = sách của tôi).",
            },
          ],
          examples: [
            {
              jp: "⑨ これは コンピューターの 本です。",
              vi: "Đây là quyển sách về máy vi tính.",
            },
            {
              jp: "⑩ これは わたしの 本です。",
              vi: "Đây là quyển sách của tôi.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "6. の với vai trò thay thế cho danh từ",
          explanation:
            "Trợ từ の có thể đóng vai trò thay thế cho danh từ đã được nhắc đến ở trước đó (như かばん trong 佐藤さんの かばん → 佐藤さんの). Lưu ý quan trọng: の CHỈ được dùng thay thế cho danh từ chỉ vật, KHÔNG dùng thay thế cho danh từ chỉ người.",
          notes: [
            "Đúng: ミラーさんは IMCの 社員です。 → はい、IMCの 社員です。",
            "Sai: × はい、IMCの です。 (Không dùng の thay thế cho danh từ chỉ người 社員/人)",
          ],
          examples: [
            {
              jp: "⑪ あれは だれの かばんですか。\n……佐藤さんのです。",
              vi: "Kia là cái cặp sách của ai?\n…Của anh/chị Sato.",
            },
            {
              jp: "⑫ この かばんは あなたのですか。\n……いいえ、わたしのじゃ ありません。",
              vi: "Cái cặp sách này có phải là của anh/chị không?\n…Không, không phải là của tôi.",
            },
            {
              jp: "⑬ ミラーさんは IMCの 社員ですか。\n……はい、IMCの 社員です。",
              vi: "Anh Miller có phải là nhân viên công ty IMC không?\n…Vâng, anh ấy là nhân viên công ty IMC.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "7. Tiền tố お～",
          explanation:
            "Tiền tố お～ được đặt trước một số danh từ để biểu thị thái độ lịch sự và kính trọng của người nói (vd: ［お］みやげ, ［お］さけ).",
        },
        {
          type: "grammar-pattern",
          pattern: "8. そうですか",
          explanation:
            "Khi người nói nhận được thông tin mới nào đó và muốn biểu thị là đã hiểu thì dùng cấu trúc này. Phát âm hạ giọng ở cuối câu (pitch accent drop).",
          examples: [
            {
              jp: "⑭ この 傘は あなたのですか。\n……いいえ、ちがいます。シュミットさんのです。\n……そうですか。",
              vi: "Cái ô này có phải là của anh không?\n…Không, không phải. Của anh Schmidt.\n…Thế à.",
            },
          ],
        },
      ],
    },
  ],
};
