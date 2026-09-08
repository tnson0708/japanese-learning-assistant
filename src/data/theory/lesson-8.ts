import type { Lesson } from "@/lib/theory";

export const lesson8: Lesson = {
  id: 8,
  title: "Bài 8: 桜は きれいです — Tính từ đuôi な & い, Phó từ とても / あまり, Nghi vấn từ どう / どんな",
  sections: [
    {
      id: "vocabulary",
      title: "I. Từ vựng",
      blocks: [
        {
          type: "vocab-group",
          heading: "Tính từ đuôi な (な形容詞)",
          items: [
            { jp: "ハンサム［な］", meaning: "đẹp trai" },
            { jp: "きれい［な］", meaning: "đẹp, sạch" },
            { jp: "しずか［な］", kanji: "静か［な］", meaning: "yên tĩnh" },
            { jp: "にぎやか［な］", meaning: "náo nhiệt" },
            { jp: "ゆうめい［な］", kanji: "有名［な］", meaning: "nổi tiếng" },
            {
              jp: "しんせつ［な］",
              kanji: "親切［な］",
              meaning: "tốt bụng, thân thiện (không dùng khi nói về người gia đình mình)",
            },
            { jp: "げんき［な］", kanji: "元気［な］", meaning: "khỏe, khỏe khoắn" },
            { jp: "ひま［な］", kanji: "暇［な］", meaning: "rảnh rỗi" },
            { jp: "べんり［な］", kanji: "便利［な］", meaning: "tiện lợi" },
            { jp: "すてき［な］", meaning: "đẹp, hay" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Tính từ đuôi い (い形容詞)",
          items: [
            { jp: "おおきい", kanji: "大きい", meaning: "to, lớn" },
            { jp: "ちいさい", kanji: "小さい", meaning: "nhỏ, bé" },
            { jp: "あたらしい", kanji: "新しい", meaning: "mới" },
            {
              jp: "ふるい",
              kanji: "古い",
              meaning: "cũ (không dùng khi nói về tuổi tác con người)",
            },
            { jp: "いい（よい）", meaning: "tốt" },
            { jp: "わるい", kanji: "悪い", meaning: "xấu" },
            { jp: "あつい", kanji: "暑い、熱い", meaning: "nóng" },
            {
              jp: "さむい",
              kanji: "寒い",
              meaning: "lạnh, rét (dùng cho thời tiết)",
            },
            {
              jp: "つめたい",
              kanji: "冷たい",
              meaning: "lạnh, buốt (dùng cho cảm giác chạm/đồ uống)",
            },
            { jp: "むずかしい", kanji: "難しい", meaning: "khó" },
            { jp: "やさしい", kanji: "易しい", meaning: "dễ" },
            { jp: "たかい", kanji: "高い", meaning: "đắt, cao" },
            { jp: "やすい", kanji: "安い", meaning: "rẻ" },
            { jp: "ひくい", kanji: "低い", meaning: "thấp" },
            { jp: "おもしろい", meaning: "thú vị, hay" },
            { jp: "おいしい", meaning: "ngon" },
            { jp: "いそがしい", kanji: "忙しい", meaning: "bận" },
            { jp: "たのしい", kanji: "楽しい", meaning: "vui" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Màu sắc (色)",
          items: [
            { jp: "しろい", kanji: "白い", meaning: "trắng" },
            { jp: "くろい", kanji: "黒い", meaning: "đen" },
            { jp: "あかい", kanji: "赤い", meaning: "đỏ" },
            { jp: "あおい", kanji: "青い", meaning: "xanh da trời" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Danh từ & Địa điểm (名詞・場所)",
          items: [
            { jp: "さくら", kanji: "桜", meaning: "anh đào (hoa, cây)" },
            { jp: "やま", kanji: "山", meaning: "núi" },
            { jp: "まち", kanji: "町", meaning: "thị trấn, thị xã, thành phố" },
            { jp: "たべもの", kanji: "食べ物", meaning: "đồ ăn" },
            { jp: "ところ", kanji: "所", meaning: "nơi, chỗ" },
            { jp: "りょう", kanji: "寮", meaning: "ký túc xá" },
            { jp: "レストラン", meaning: "nhà hàng" },
            { jp: "せいかつ", kanji: "生活", meaning: "cuộc sống, sinh hoạt" },
            {
              jp: "［お］しごと",
              kanji: "［お］仕事",
              meaning: "việc, công việc (～を します: làm việc)",
            },
          ],
        },
        {
          type: "vocab-group",
          heading: "Phó từ & Từ nối (副詞・接続詞)",
          items: [
            { jp: "どう", meaning: "thế nào" },
            { jp: "どんな ～", meaning: "～ như thế nào" },
            { jp: "とても", meaning: "rất, lắm" },
            {
              jp: "あまり",
              meaning: "không ～ lắm (dùng với thể phủ định)",
            },
            { jp: "そして", meaning: "và, thêm nữa (dùng để nối hai câu)" },
            { jp: "～が、～", meaning: "～, nhưng ～" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Giao tiếp & Mẫu thoại (会話表現)",
          items: [
            {
              jp: "お元気ですか。",
              kanji: "おげんきですか",
              meaning: "Anh/Chị có khỏe không?",
            },
            {
              jp: "そうですね。",
              meaning: "Thế à./Để tôi xem. (suy nghĩ câu trả lời)",
            },
            {
              jp: "［～、］もう 一杯 いかがですか。",
              meaning: "Anh/Chị dùng thêm một chén/ly［～］ nữa nhé?",
            },
            {
              jp: "［いいえ、］けっこうです。",
              meaning: "Không, tôi đủ rồi ạ.",
            },
            { jp: "もう ～ですね。", meaning: "Đã ～ rồi nhỉ./Đã ～ rồi, đúng không?" },
            {
              jp: "そろそろ 失礼します。",
              kanji: "そろそろ しつれいします",
              meaning: "Sắp đến lúc tôi phải xin phép rồi./Tôi phải về.",
            },
            { jp: "いいえ。", meaning: "Không có gì./Không sao cả." },
            {
              jp: "また いらっしゃって ください。",
              meaning: "Lần sau anh/chị lại đến chơi nhé.",
            },
          ],
        },
        {
          type: "vocab-group",
          heading: "Tên riêng & Địa danh (固有名詞)",
          items: [
            { jp: "シャンハイ", kanji: "上海", meaning: "Thượng Hải" },
            {
              jp: "きんかくじ",
              kanji: "金閣寺",
              meaning: "Chùa Kinkaku-ji (Chùa Vàng)",
            },
            {
              jp: "ならこうえん",
              kanji: "奈良公園",
              meaning: "Công viên Nara",
            },
            {
              jp: "ふじさん",
              kanji: "富士山",
              meaning: "Núi Phú Sĩ (ngọn núi cao nhất Nhật Bản)",
            },
            {
              jp: "「七人の侍」",
              meaning: "“7 chàng võ sĩ Samurai” (phim kinh điển đạo diễn Kurosawa)",
            },
          ],
        },
      ],
    },
    {
      id: "translation",
      title: "II. Bản dịch",
      blocks: [
        {
          type: "translation-section",
          title: "II. Phần dịch tiếng Việt → tiếng Nhật (Mẫu câu, Ví dụ & Hội thoại)",
          instruction:
            "Đọc câu tiếng Việt và tự suy nghĩ/dịch sang tiếng Nhật. Bấm 'Xem đáp án' để kiểm tra câu tiếng Nhật chuẩn xác và nghe phát âm.",
          sentences: [
            {
              id: "l8-t-s1",
              num: 1,
              vi: "Hoa anh đào đẹp.",
              jp: "桜は きれいです。",
            },
            {
              id: "l8-t-s2",
              num: 2,
              vi: "Núi Phú Sĩ cao.",
              jp: "富士山は 高いです。",
            },
            {
              id: "l8-t-s3",
              num: 3,
              vi: "Hoa anh đào là loài hoa đẹp.",
              jp: "桜は きれいな 花です。",
            },
            {
              id: "l8-t-s4",
              num: 4,
              vi: "Núi Phú Sĩ là núi cao.",
              jp: "富士山は 高い 山です。",
            },
          ],
          examples: [
            {
              id: "l8-t-e1",
              num: 1,
              vi: "Osaka có sầm uất không?\n…Có, sầm uất lắm.",
              jp: "大阪は にぎやかですか。\n……はい、にぎやかです。",
            },
            {
              id: "l8-t-e2",
              num: 2,
              vi: "Trường đại học Sakura có nổi tiếng không?\n…Không, không nổi tiếng.",
              jp: "さくら大学は 有名ですか。\n……いいえ、有名じゃ ありません。",
            },
            {
              id: "l8-t-e3",
              num: 3,
              vi: "Bắc Kinh bây giờ có lạnh không?\n…Có, rất lạnh.\nThượng Hải cũng lạnh phải không?\n…Không, không lạnh lắm.",
              jp: "ペキンは 今 寒いですか。\n……はい、とても 寒いです。\nシャンハイも 寒いですか。\n……いいえ、あまり 寒くないです。",
            },
            {
              id: "l8-t-e4",
              num: 4,
              vi: "Ký túc xá của trường đại học thế nào?\n…Cũ nhưng mà tiện lợi.",
              jp: "大学の 寮は どうですか。\n……古いですが、便利です。",
            },
            {
              id: "l8-t-e5",
              num: 5,
              vi: "Hôm qua tôi đã đến nhà anh Matsumoto.\n…Nhà anh ấy thế nào?\nNhà đẹp. Và lớn nữa.",
              jp: "きのう 松本さんの うちへ 行きました。\n……どんな うちですか。\nきれいな うちです。そして、大きいです。",
            },
            {
              id: "l8-t-e6",
              num: 6,
              vi: "Hôm qua tôi đã xem một cuốn phim hay.\n…Anh/Chị đã xem phim gì?\nPhim “7 chàng võ sĩ Samurai”.",
              jp: "きのう おもしろい 映画を 見ました。\n……どんな 映画ですか。\n「七人の侍」です。",
            },
          ],
          dialogueTitle: "Đã đến lúc tôi phải về (そろそろ 失礼します)",
          dialogueLines: [
            {
              speakerVi: "Yamada Ichiro",
              speakerJp: "山田一郎",
              vi: "Chị Maria này, cuộc sống của chị ở Nhật thế nào?",
              jp: "マリアさん、日本の 生活は どうですか。",
            },
            {
              speakerVi: "Maria Santos",
              speakerJp: "マリア",
              vi: "Hàng ngày tôi thấy rất vui.",
              jp: "毎日 とても 楽しいです。",
            },
            {
              speakerVi: "Yamada Ichiro",
              speakerJp: "山田一郎",
              vi: "Thế à. Thế anh Santos, công việc của anh thế nào?",
              jp: "そうですか。サントスさん、お仕事は どうですか。",
            },
            {
              speakerVi: "Jose Santos",
              speakerJp: "サントス",
              vi: "Vâng, bận rộn nhưng thú vị.",
              jp: "そうですね。忙しいですが、おもしろいです。",
            },
            {
              speakerVi: "Yamada Tomoko",
              speakerJp: "山田友子",
              vi: "Chị dùng thêm một ly cà-phê nữa nhé?",
              jp: "コーヒーを もう 一杯 いかがですか。",
            },
            {
              speakerVi: "Maria Santos",
              speakerJp: "マリア",
              vi: "Không, tôi đủ rồi ạ.",
              jp: "いいえ、けっこうです。",
            },
            {
              speakerVi: "Jose Santos",
              speakerJp: "サントス",
              vi: "Ồ, đã 6 giờ rồi nhỉ. Đã đến lúc tôi phải về.",
              jp: "あ、もう 6時ですね。そろそろ 失礼します。",
            },
            {
              speakerVi: "Yamada Ichiro",
              speakerJp: "山田一郎",
              vi: "Thế à.",
              jp: "そうですか。",
            },
            {
              speakerVi: "Maria Santos",
              speakerJp: "マリア",
              vi: "Hôm nay rất cảm ơn anh chị.",
              jp: "きょうは どうも ありがとうございました。",
            },
            {
              speakerVi: "Yamada Tomoko",
              speakerJp: "山田友子",
              vi: "Không có gì đâu. Anh chị lại đến chơi nữa nhé.",
              jp: "いいえ。また いらっしゃって ください。",
            },
          ],
        },
      ],
    },
    {
      id: "reference",
      title: "III. Từ và thông tin tham khảo",
      blocks: [
        {
          type: "table",
          title: "色 (いろ) — Bảng phân biệt Màu sắc (Danh từ & Tính từ đuôi い)",
          columns: ["Danh từ (名詞)", "Tính từ đuôi い (い形容詞)", "Ý nghĩa tiếng Việt"],
          speakableColumns: [0, 1],
          rows: [
            ["白 (しろ)", "白い (しろい)", "Trắng"],
            ["黒 (くろ)", "黒い (くろい)", "Đen"],
            ["赤 (あか)", "赤い (あかい)", "Đỏ"],
            ["青 (あお)", "青い (あおい)", "Xanh da trời"],
            ["緑 (みどり)", "― (dùng 緑の)", "Xanh lá cây"],
            ["紫 (むらさき)", "― (dùng 紫の)", "Tím"],
            ["黄色 (きいろ)", "黄色い (きいろい)", "Vàng"],
            ["茶色 (ちゃいろ)", "茶色い (ちゃいろい)", "Nâu"],
            ["ピンク", "―", "Hồng (Katakana)"],
            ["オレンジ", "―", "Da cam (Katakana)"],
            ["グレー", "―", "Xám (Katakana)"],
            ["ベージュ", "―", "(Màu) be (Katakana)"],
          ],
        },
        {
          type: "table",
          title: "味 (あじ) — Bảng từ vựng Hương vị (味覚)",
          columns: ["Từ vựng (Kanji / Hiragana)", "Loại từ", "Ý nghĩa tiếng Việt"],
          speakableColumns: [0],
          rows: [
            ["甘い (あまい)", "Tính từ đuôi い", "Ngọt"],
            ["辛い (からい)", "Tính từ đuôi い", "Cay"],
            ["苦い (にがい)", "Tính từ đuôi い", "Đắng"],
            ["塩辛い (しおからい)", "Tính từ đuôi い", "Mặn"],
            ["酸っぱい (すっぱい)", "Tính từ đuôi い", "Chua"],
            ["濃い (こい)", "Tính từ đuôi い", "Đậm (đậm đà, đặc)"],
            ["薄い (うすい)", "Tính từ đuôi い", "Nhạt (loãng, nhạt)"],
          ],
        },
        {
          type: "table",
          title: "春・夏・秋・冬 — Bốn mùa tại Nhật Bản (日本の四季)",
          columns: ["Mùa", "Thời gian trong năm", "Đặc điểm nhiệt độ", "Mô tả tiếng Việt"],
          speakableColumns: [0],
          rows: [
            ["春 (はる)", "Tháng 3, 4, 5", "Mùa xuân ấm (春は 暖かいです)", "Mùa xuân ấm áp, hoa anh đào nở"],
            ["夏 (なつ)", "Tháng 6, 7, 8", "Mùa hè nóng (夏は 暑いです)", "Mùa hè nóng (nóng nhất là tháng 8)"],
            ["秋 (あき)", "Tháng 9, 10, 11", "Mùa thu mát (秋は 涼しいです)", "Mùa thu mát mẻ, lá đỏ Momiji"],
            ["冬 (ふゆ)", "Tháng 12, 1, 2", "Mùa đông lạnh (冬は 寒いです)", "Mùa đông lạnh (lạnh nhất là tháng 1, 2)"],
          ],
        },
        {
          type: "note",
          text: "💡 Văn hóa & Khí hậu bốn mùa tại Nhật Bản:\nỞ Nhật Bản có 4 mùa rõ rệt là Mùa xuân (tháng 3, 4, 5), Mùa hè (tháng 6, 7, 8), Mùa thu (tháng 9, 10, 11) và Mùa đông (tháng 12, 1, 2).\nNhiệt độ trung bình tuy có khác nhau tùy địa điểm (ví dụ: Hokkaido ở phía Bắc rất lạnh, Okinawa ở phía Nam ấm áp), nhưng sự biến đổi nhiệt độ qua các mùa tương đối giống nhau: Nóng nhất là tháng 8 và lạnh nhất là tháng 1, 2.",
        },
      ],
    },
    {
      id: "grammar",
      title: "IV. Giải thích ngữ pháp",
      blocks: [
        {
          type: "grammar-pattern",
          pattern: "1. Tính từ trong tiếng Nhật (形容詞)",
          explanation:
            "Tính từ dùng làm vị ngữ để diễn đạt trạng thái của danh từ hoặc làm bổ ngữ bổ nghĩa cho danh từ. Tiếng Nhật chia thành 2 loại: Tính từ đuôi な (な形容詞) và Tính từ đuôi い (い形容詞).",
        },
        {
          type: "grammar-pattern",
          pattern: "2. Danh từ は Tính từ đuôi な［な］です ／ Tính từ đuôi い（～い）です",
          explanation:
            "Ở thể khẳng định phi quá khứ lịch sự, câu tính từ kết thúc bằng です. Tính từ đuôi な BỎ な khi đi với です, tính từ đuôi い GIỮ NGUYÊN い.",
          subPoints: [
            {
              label: "1) Phủ định tính từ đuôi な",
              text: "Bỏ な và thêm じゃ（では）ありません (例: 静かじゃ ありません).",
            },
            {
              label: "2) Phủ định tính từ đuôi い",
              text: "Bỏ い và thay bằng くないです (例: おもしろくないです). Chú ý: Phủ định của いいです là よく ないです.",
            },
            {
              label: "3) Tổng hợp biến đổi",
              text: "• 親切［な］ → 親切です ／ 親切じゃ ありません\n• 高い［い］ → 高いです ／ 高くないです",
            },
          ],
          examples: [
            {
              jp: "① ワット先生は 親切です。",
              vi: "Thầy Watt tốt bụng.",
            },
            {
              jp: "② 富士山は 高いです。",
              vi: "Núi Phú Sĩ cao.",
            },
            {
              jp: "③ あそこは 静かじゃ ありません。",
              vi: "Chỗ kia không yên tĩnh.",
            },
            {
              jp: "④ この 本は おもしろくないです。",
              vi: "Quyển sách này không hay.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "3. Tính từ đuôi な［な］ Danh từ ／ Tính từ đuôi い（～い） Danh từ",
          explanation:
            "Khi đứng trước bổ nghĩa cho danh từ, tính từ đuôi な GIỮ NGUYÊN な, tính từ đuôi い GIỮ NGUYÊN い.",
          examples: [
            {
              jp: "⑦ ワット先生は 親切な 先生です。",
              vi: "Thầy Watt là thầy giáo tốt bụng.",
            },
            {
              jp: "⑧ 富士山は 高い 山です。",
              vi: "Núi Phú Sĩ là núi cao.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "4. Mệnh đề 1 ～が、 Mệnh đề 2 (Mối quan hệ ngược nghĩa 'nhưng')",
          explanation:
            "Trợ từ が dùng để nối hai mệnh đề có ý nghĩa đối lập/ngược nhau.",
          examples: [
            {
              jp: "⑨ 日本の 食べ物は おいしいですが、高いです。",
              vi: "Món ăn Nhật ngon nhưng mà đắt.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "5. Phó từ chỉ mức độ: とても (rất) ／ あまり (không ... lắm)",
          explanation:
            "Đứng trước tính từ để bổ nghĩa mức độ:\n• とても (rất): Dùng trong câu khẳng định.\n• あまり (không ... lắm): Dùng trong câu phủ định.",
          examples: [
            {
              jp: "⑩ ペキンは とても 寒いです。",
              vi: "Bắc Kinh rất lạnh.",
            },
            {
              jp: "⑫ シャンハイは あまり 寒くないです。",
              vi: "Thượng Hải không lạnh lắm.",
            },
            {
              jp: "⑬ さくら大学は あまり 有名な 大学じゃ ありません。",
              vi: "Trường Đại học Sakura không phải là trường đại học nổi tiếng lắm.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "6. Danh từ は どうですか (Cái gì ... thế nào?)",
          explanation:
            "Mẫu câu dùng để hỏi về ấn tượng, ý kiến hoặc cảm tưởng của người nghe về trải nghiệm/người/địa điểm.",
          examples: [
            {
              jp: "⑭ 日本の 生活は どうですか。 ……楽しいです。",
              vi: "Cuộc sống của anh/chị ở Nhật thế nào? …Vui ạ.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "7. Danh từ 1 は どんな Danh từ 2 ですか (Danh từ 1 là Danh từ 2 như thế nào?)",
          explanation:
            "どんな là nghi vấn từ đứng trước danh từ để hỏi về tính chất, đặc điểm của đối tượng.",
          examples: [
            {
              jp: "⑮ 奈良は どんな 町ですか。 ……古い 町です。",
              vi: "Nara là thành phố như thế nào? …Là thành phố cổ kính.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "8. Cụm từ そうですね (À, ừ... ngập ngừng suy nghĩ)",
          explanation:
            "Khác với thể hiện đồng cảm ở Bài 5, そうですね ở bài này thể hiện sự ngập ngừng trong lúc suy nghĩ câu trả lời.",
          examples: [
            {
              jp: "⑯ お仕事は どうですか。 ……そうですね。忙しいですが、おもしろいです。",
              vi: "Công việc của anh/chị thế nào? …À, vâng. Bận rộn nhưng mà thú vị.",
            },
          ],
        },
      ],
    },
    {
      id: "exercises",
      title: "V. Bài tập & Luyện tập",
      blocks: [
        {
          type: "exercise-fill-in-blank",
          title: "Bài tập 1: Điền tính từ / phó từ / trợ từ (な, い, くない, とても, あまり, が, どう)",
          instruction: "Chọn từ hoặc đuôi tính từ thích hợp để hoàn thành câu.",
          questions: [
            {
              id: "l8-q1",
              promptPre: "桜は きれい",
              promptPost: " 花です。",
              options: ["な", "い", "の", "で"],
              correctAnswer: "な",
              explanation: "Tính từ đuôi な khi đứng trước bổ nghĩa cho danh từ (花) phải giữ đuôi な.",
              fullSentenceJp: "桜は きれいな 花です。",
              fullSentenceVi: "Hoa anh đào là loài hoa đẹp.",
            },
            {
              id: "l8-q2",
              promptPre: "ペキンは 今 ",
              promptPost: " 寒いです。",
              options: ["とても", "あまり", "どんな", "どう"],
              correctAnswer: "とても",
              explanation: "Câu khẳng định dùng phó từ とても (rất lạnh).",
              fullSentenceJp: "ペキンは 今 とても 寒いです。",
              fullSentenceVi: "Bắc Kinh bây giờ rất lạnh.",
            },
            {
              id: "l8-q3",
              promptPre: "シャンハイは あまり 寒",
              promptPost: "です。",
              options: ["くない", "じゃありません", "ない", "い"],
              correctAnswer: "くない",
              explanation: "Phủ định của tính từ đuôi い (寒い): Bỏ い thay bằng くない (寒くないです). đi với あまり.",
              fullSentenceJp: "シャンハイは あまり 寒くないです。",
              fullSentenceVi: "Thượng Hải không lạnh lắm.",
            },
            {
              id: "l8-q4",
              promptPre: "日本の 食べ物は おいしいです",
              promptPost: "、高いです。",
              options: ["が", "そして", "と", "も"],
              correctAnswer: "が",
              explanation: "Nối 2 mệnh đề tính từ ngược nghĩa (ngon nhưng đắt) dùng trợ từ が.",
              fullSentenceJp: "日本の 食べ物は おいしいですが、高いです。",
              fullSentenceVi: "Món ăn Nhật ngon nhưng mà đắt.",
            },
          ],
        },
        {
          type: "exercise-multiple-choice",
          title: "Bài tập 2: Trắc nghiệm Từ vựng & Ngữ pháp Bài 8",
          instruction: "Chọn phương án trả lời đúng nhất.",
          questions: [
            {
              id: "l8-mc1",
              question: "Dạng phủ định của tính từ đuôi い 'いいです' (tốt) là gì?",
              options: ["よく ないです", "いいくないです", "いいじゃ ありません", "よくじゃ ありません"],
              correctAnswerIndex: 0,
              explanation: "Đặc biệt: Phủ định của いいです là よく ないです.",
            },
            {
              id: "l8-mc2",
              question: "Để hỏi 'Nara là thành phố như thế nào?', câu tiếng Nhật chuẩn là gì?",
              options: [
                "奈良は どんな 町ですか。",
                "奈良は どう 町ですか。",
                "奈良は どんなの 町ですか。",
                "奈良は 何の 町ですか。",
              ],
              correctAnswerIndex: 0,
              explanation: "Hỏi tính chất đi với danh từ dùng nghi vấn từ どんな (どんな 町).",
            },
          ],
        },
        {
          type: "exercise-sentence-practice",
          title: "Bài tập 3: Luyện tập mẫu câu & Hội thoại Bài 8",
          instruction: "Tự nói câu tiếng Nhật dựa trên gợi ý tiếng Việt, sau đó bấm 'Xem đáp án' để kiểm tra phát âm.",
          items: [
            {
              id: "l8-sp1",
              vi: "Thầy Watt là thầy giáo tốt bụng.",
              jp: "ワット先生は 親切な 先生です。",
              hint: "Dùng 親切な 先生です.",
              breakdown: "ワット先生は (Thầy Watt) + 親切な (tốt bụng) + 先生です (là thầy giáo).",
            },
            {
              id: "l8-sp2",
              vi: "Cuộc sống của anh/chị ở Nhật thế nào? - Hàng ngày tôi thấy rất vui.",
              jp: "日本の 生活は どうですか。 - 毎日 とても 楽しいです。",
              hint: "Dùng どうですか và とても 楽しいです.",
              breakdown: "日本の 生活は どうですか (Cuộc sống ở Nhật thế nào). 毎日 とても 楽しいです (Rất vui).",
            },
          ],
        },
        {
          type: "exercise-reorder-sentence",
          title: "Bài tập 4: Sắp xếp từ thành câu hoàn chỉnh (Luyện tập cấu trúc Bài 8)",
          instruction: "Bấm vào các từ gợi ý theo đúng thứ tự ngữ pháp để ghép thành câu tiếng Nhật hoàn chỉnh.",
          questions: [
            {
              id: "l8-ro1",
              words: ["山 です", "高い", "富士山 は"],
              correctOrder: ["富士山 は", "高い", "山 です"],
              fullSentenceJp: "富士山 は 高い 山 です。",
              fullSentenceVi: "Núi Phú Sĩ là núi cao.",
              explanation: "Chủ ngữ (富士山は) + Tính từ đuôi い (高い) + Danh từ (山です).",
            },
            {
              id: "l8-ro2",
              words: ["寒くないです", "は", "あまり", "シャンハイ"],
              correctOrder: ["シャンハイ", "は", "あまり", "寒くないです"],
              fullSentenceJp: "シャンハイ は あまり 寒くないです。",
              fullSentenceVi: "Thượng Hải không lạnh lắm.",
              explanation: "Chủ ngữ (シャンハイは) + Phó từ (あまり) + Phủ định tính từ い (寒くないです).",
            },
          ],
        },
      ],
    },
  ],
};
