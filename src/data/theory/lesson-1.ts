import type { Lesson } from "@/lib/theory";

export const lesson1: Lesson = {
  id: 1,
  title: "Bài 1: わたしは マイク・ミラーです — Giới thiệu bản thân, tên, quốc tịch & nghề nghiệp",
  sections: [
    {
      id: "vocabulary",
      title: "I. Từ vựng",
      blocks: [
        {
          type: "vocab-list",
          items: [
            { jp: "わたし", meaning: "tôi" },
            {
              jp: "あなた",
              meaning: "anh/chị, ông/bà, bạn (ngôi thứ II số ít)",
            },
            {
              jp: "あのひと",
              kanji: "あの人",
              meaning: "người kia, người đó, anh kia, chị kia",
              note: "あのかた (あの方) là cách nói lịch sự của あのひと",
            },
            {
              jp: "～さん",
              meaning:
                "anh, chị, ông, bà (hậu tố thêm vào sau tên người khác khi gọi, thể hiện tính lịch sự)",
            },
            {
              jp: "～ちゃん",
              meaning: "hậu tố thêm vào sau tên trẻ em, thay cho ～さん",
            },
            {
              jp: "～じん",
              kanji: "～人",
              meaning: "hậu tố mang nghĩa \"người ~\"",
              note: "vd: アメリカじん = người Mỹ",
            },
            {
              jp: "せんせい",
              kanji: "先生",
              meaning: "thầy/cô",
              note: "không dùng khi giới thiệu về nghề giáo viên của chính mình",
            },
            { jp: "きょうし", kanji: "教師", meaning: "giáo viên" },
            { jp: "がくせい", kanji: "学生", meaning: "học sinh, sinh viên" },
            {
              jp: "かいしゃいん",
              kanji: "会社員",
              meaning: "nhân viên công ty",
            },
            {
              jp: "しゃいん",
              kanji: "社員",
              meaning: "nhân viên Công ty ~",
              note: "dùng kèm theo tên công ty, vd: IMCの しゃいん",
            },
            {
              jp: "ぎんこういん",
              kanji: "銀行員",
              meaning: "nhân viên ngân hàng",
            },
            { jp: "いしゃ", kanji: "医者", meaning: "bác sĩ" },
            {
              jp: "けんきゅうしゃ",
              kanji: "研究者",
              meaning: "nhà nghiên cứu",
            },
            {
              jp: "だいがく",
              kanji: "大学",
              meaning: "đại học, trường đại học",
            },
            { jp: "びょういん", kanji: "病院", meaning: "bệnh viện" },
            {
              jp: "だれ",
              meaning: "ai",
              note: "どなた là cách nói lịch sự của だれ, vị nào",
            },
            { jp: "～さい", kanji: "～歳", meaning: "~ tuổi" },
            {
              jp: "いっさい",
              kanji: "1歳",
              meaning: "1 tuổi",
              note: "quy tắc biến âm (1 + さい → いっさい)",
            },
            {
              jp: "はっさい",
              kanji: "8歳",
              meaning: "8 tuổi",
              note: "quy tắc biến âm (8 + さい → はっさい)",
            },
            {
              jp: "じゅっさい",
              kanji: "10歳",
              meaning: "10 tuổi",
              note: "cũng có thể đọc là じっさい",
            },
            {
              jp: "はたち",
              kanji: "20歳",
              meaning: "20 tuổi (tuổi trưởng thành)",
              note: "cách đọc đặc biệt nguy hiểm (không dùng từ さい)",
            },
            {
              jp: "なんさい",
              kanji: "何歳",
              meaning: "mấy tuổi, bao nhiêu tuổi",
              note: "cách hỏi tuổi thông thường",
            },
            {
              jp: "おいくつ",
              meaning: "bao nhiêu tuổi",
              note: "dạng kính ngữ lịch sự của なんさい (dùng cho cấp trên/người lớn tuổi)",
            },
            { jp: "はい", meaning: "vâng, dạ" },
            { jp: "いいえ", meaning: "không" },
          ],
        },
        {
          type: "vocab-group",
          heading: "練習C — Mẫu câu chào hỏi & làm quen",
          items: [
            {
              jp: "はじめまして。",
              meaning: "Rất hân hạnh được gặp anh/chị.",
              note: "Lời chào với người lần đầu gặp — câu nói đầu tiên khi giới thiệu về mình",
            },
            { jp: "～から きました。", meaning: "Tôi đến từ ~." },
            {
              jp: "［どうぞ］よろしく［おねがいします］。",
              meaning: "Rất vui được làm quen với anh/chị.",
              note: "Rất mong được sự giúp đỡ của anh/chị — luôn dùng làm câu kết thúc sau khi giới thiệu về mình",
            },
            {
              jp: "しつれいですが",
              meaning: "Xin lỗi...",
              note: "dùng khi hỏi ai đó về thông tin cá nhân như tên hoặc địa chỉ",
            },
            { jp: "おなまえは？", kanji: "お名前は？", meaning: "Tên anh/chị là gì?" },
            { jp: "こちらは～さんです。", meaning: "Đây là anh/chị/ông/bà ~." },
          ],
        },
        {
          type: "vocab-group",
          heading: "Tên quốc gia (国)",
          items: [
            { jp: "アメリカ", meaning: "Mỹ" },
            { jp: "イギリス", meaning: "Anh" },
            { jp: "インド", meaning: "Ấn Độ" },
            { jp: "インドネシア", meaning: "In-đô-nê-xi-a" },
            { jp: "かんこく", kanji: "韓国", meaning: "Hàn Quốc" },
            { jp: "タイ", meaning: "Thái Lan" },
            { jp: "ちゅうごく", kanji: "中国", meaning: "Trung Quốc" },
            { jp: "ドイツ", meaning: "Đức" },
            { jp: "にほん", kanji: "日本", meaning: "Nhật Bản" },
            { jp: "ブラジル", meaning: "Braxin" },
          ],
        },
        {
          type: "note",
          text: "Tên riêng giả định dùng trong sách: IMC / パワー電気 / ブラジルエアー (tên công ty), AKC (tên tổ chức), 神戸病院 (tên bệnh viện), さくら大学 / 富士大学 (tên đại học).",
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
          instruction: "Đọc câu tiếng Việt và tự suy nghĩ/dịch sang tiếng Nhật. Bấm 'Xem đáp án' để kiểm tra câu tiếng Nhật chuẩn xác và nghe phát âm.",
          sentences: [
            {
              id: "l1-t-s1",
              num: 1,
              vi: "Tôi là Mike Miller.",
              jp: "わたしは マイク・ミラーです。",
            },
            {
              id: "l1-t-s2",
              num: 2,
              vi: "Anh Santos không phải là sinh viên.",
              jp: "サントスさんは 学生じゃ ありません。",
            },
            {
              id: "l1-t-s3",
              num: 3,
              vi: "Anh Miller có phải là nhân viên công ty không?",
              jp: "ミラーさんは 会社員ですか。",
            },
            {
              id: "l1-t-s4",
              num: 4,
              vi: "Anh Santos cũng là nhân viên công ty.",
              jp: "サントスさんも 会社員です。",
            },
          ],
          examples: [
            {
              id: "l1-t-e1",
              num: 1,
              vi: "Anh có phải là anh Mike Miller không?\n…Vâng, tôi là Mike Miller.",
              jp: "あなたは マイク・ミラーさんですか。\n……はい、［マイク・ミラー］です。",
            },
            {
              id: "l1-t-e2",
              num: 2,
              vi: "Anh Miller, anh có phải là sinh viên không?\n…Không, tôi không phải là sinh viên.",
              jp: "ミラーさんは 学生ですか。\n……いいえ、学生じゃ ありません。",
            },
            {
              id: "l1-t-e3",
              num: 3,
              vi: "Ông Wang có phải là nhân viên ngân hàng không?\n…Không, ông Wang không phải là nhân viên ngân hàng. Ông ấy là bác sĩ.",
              jp: "ワンさんは 銀行員ですか。\n……いいえ、［ワンさんは］ 銀行員じゃ ありません。医者です。",
            },
            {
              id: "l1-t-e4",
              num: 4,
              vi: "Vị kia là ai?\n…Đó là ông Watt. Ông ấy là giảng viên của Trường Đại học Sakura.",
              jp: "あの方は だれですか。（あの方は どなたですか。）\n……ワットさんです。さくら大学の 先生です。",
            },
            {
              id: "l1-t-e5",
              num: 5,
              vi: "Anh Guputa có phải là nhân viên công ty không?\n…Vâng, (anh ấy) là nhân viên công ty.\nChị Karina cũng là nhân viên công ty à?\n…Không. (Chị Karina) là sinh viên.",
              jp: "グプタさんは 会社員ですか。\n……はい、会社員です。\nカリナさんも 会社員ですか。\n……いいえ、［カリナさんは］ 学生です。",
            },
            {
              id: "l1-t-e6",
              num: 6,
              vi: "Em Teresa mấy tuổi?\n…(Em ấy) 9 tuổi.",
              jp: "テれサちゃんは 何歳ですか。（おいくつですか。）\n……9歳です。",
            },
          ],
          dialogueTitle: "Rất vui được làm quen với chị (初めまして)",
          dialogueAudioUrl: "/audio/lessons/lesson-1/第1課-Conversation.mp3",
          dialogueLines: [
            {
              speakerVi: "Sato",
              speakerJp: "佐藤",
              vi: "Chào anh!",
              jp: "おはよう ございます。",
            },
            {
              speakerVi: "Yamada",
              speakerJp: "山田",
              vi: "Chào chị! Chị Sato, đây là anh Mike Miller.",
              jp: "おはよう ございます。 佐藤さん、こちらは マイク・ミラーさんです。",
            },
            {
              speakerVi: "Miller",
              speakerJp: "ミラー",
              vi: "Rất vui được làm quen với chị. Tôi là Mike Miller. Tôi đến từ Mỹ. Rất mong sẽ nhận được sự giúp đỡ của chị.",
              jp: "初めまして。 マイク・ミラーです。 アメリカから 来ました。 どうぞ よろしく お願いします。",
            },
            {
              speakerVi: "Sato",
              speakerJp: "佐藤",
              vi: "Tôi là Keiko Sato. Rất vui được làm quen với anh.",
              jp: "佐藤恵子です。 こちらこそ よろしく お願いします。",
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
          title: "国・人・ことば — Nước, Người & Ngôn ngữ",
          columns: ["Nước (国)", "Người (人)", "Ngôn ngữ (ことば)"],
          speakableColumns: [0, 1, 2],
          rows: [
            ["アメリカ (Mỹ)", "アメリカ人", "英語 (tiếng Anh)"],
            ["イギリス (Anh)", "イギリス人", "英語 (tiếng Anh)"],
            ["イタリア (Ý)", "イタリア人", "イタリア語 (tiếng Ý)"],
            ["イラン (Iran)", "イラン人", "ペルシア語 (tiếng Ba Tư)"],
            ["インド (Ấn Độ)", "インド人", "ヒンディー語 (tiếng Hin-đi)"],
            [
              "インドネシア (In-đô-nê-xi-a)",
              "インドネシア人",
              "インドネシア語 (tiếng In-đô-nê-xi-a)",
            ],
            ["エジプト (Ai Cập)", "エジプト人", "アラビア語 (tiếng Ả-rập)"],
            ["オーストラリア (Úc)", "オーストラリア人", "英語 (tiếng Anh)"],
            [
              "カナダ (Canada)",
              "カナダ人",
              "英語 (tiếng Anh) / フランス語 (tiếng Pháp)",
            ],
            ["韓国 (Hàn Quốc)", "韓国人", "韓国語 (tiếng Hàn Quốc)"],
            [
              "サウジアラビア (Ả-rập Xê-út)",
              "サウジアラビア人",
              "アラビア語 (tiếng Ả-rập)",
            ],
            ["シンガポール (Singapore)", "シンガポール人", "英語 (tiếng Anh)"],
            [
              "スペイン (Tây Ban Nha)",
              "スペイン人",
              "スペイン語 (tiếng Tây Ban Nha)",
            ],
            ["タイ (Thái Lan)", "タイ人", "タイ語 (tiếng Thái)"],
            ["中国 (Trung Quốc)", "中国人", "中国語 (tiếng Trung Quốc)"],
            ["ドイツ (Đức)", "ドイツ人", "ドイツ語 (tiếng Đức)"],
            ["日本 (Nhật Bản)", "日本人", "日本語 (tiếng Nhật)"],
            ["フランス (Pháp)", "フランス人", "フランス語 (tiếng Pháp)"],
            [
              "フィリピン (Philippine)",
              "フィリピン人",
              "フィリピノ語 (tiếng Philippine)",
            ],
            [
              "ブラジル (Braxin)",
              "ブラジル人",
              "ポルトガル語 (tiếng Bồ Đào Nha)",
            ],
            ["ベトナム (Việt Nam)", "ベトナム人", "ベトナム語 (tiếng Việt)"],
            [
              "マレーシア (Malaysia)",
              "マレーシア人",
              "マレーシア語 (tiếng Mã Lai)",
            ],
            [
              "メキシコ (Mexico)",
              "メキシコ人",
              "スペイン語 (tiếng Tây Ban Nha)",
            ],
            ["ロシア (Nga)", "ロシア人", "ロシア語 (tiếng Nga)"],
          ],
        },
        {
          type: "table",
          title: "年齢の数え方 — Bảng cách đếm và đọc số tuổi trong tiếng Nhật (～歳)",
          columns: [
            "Số tuổi (年齢)",
            "Cách đọc (Cách viết Kanji / Hiragana)",
            "Romaji",
            "Ghi chú & Quy tắc biến âm",
          ],
          speakableColumns: [1],
          rows: [
            ["1 tuổi", "1歳 (いっさい)", "issai", "Biến âm xúc âm (1 + さい → いっさい)"],
            ["2 tuổi", "2歳 (にさい)", "nisai", "Đọc bình thường"],
            ["3 tuổi", "3歳 (さんさい)", "sansai", "Đọc bình thường"],
            ["4 tuổi", "4歳 (よんさい)", "yonsai", "Đọc よん (không đọc し)"],
            ["5 tuổi", "5歳 (ごさい)", "gosai", "Đọc bình thường"],
            ["6 tuổi", "6歳 (ろくさい)", "rokusai", "Đọc bình thường"],
            ["7 tuổi", "7歳 (ななさい)", "nanasai", "Đọc なな (không đọc しち)"],
            ["8 tuổi", "8歳 (はっさい)", "hassai", "Biến âm xúc âm (8 + さい → はっさい)"],
            ["9 tuổi", "9歳 (きゅうさい)", "kyūsai", "Đọc きゅう (không đọc く)"],
            ["10 tuổi", "10歳 (じゅっさい / じっさい)", "jussai / jissai", "Biến âm xúc âm (10 + さい → じゅっさい)"],
            ["11 tuổi", "11歳 (じゅういっさい)", "jūissai", "10 (じゅう) + 1 tuổi (いっさい)"],
            ["18 tuổi", "18歳 (じゅうはっさい)", "jūhassai", "10 (じゅう) + 8 tuổi (はっさい)"],
            ["20 tuổi", "20歳 (はたち)", "hatachi", "⚠️ Cách đọc ĐẶC BIỆT (không có さい)"],
            ["21 tuổi", "21歳 (にじゅういっさい)", "nijūissai", "20 (にじゅう) + 1 tuổi (いっさい)"],
            ["30 tuổi", "30歳 (さんじゅっさい)", "sanjussai", "30 (さんじゅう) + さい → さんじゅっさい"],
            ["40 tuổi", "40歳 (よんじゅっさい)", "yonjussai", "40 (よんじゅう) + さい → よんじゅっさい"],
            ["50 tuổi", "50歳 (ごじゅっさい)", "gojussai", "50 (ごじゅう) + さい → ごじゅっさい"],
            ["60 tuổi", "60歳 (ろくじゅっさい)", "rokujussai", "60 (ろくじゅう) + さい → ろくじゅっさい"],
            ["70 tuổi", "70歳 (ななじゅっさい)", "nanajussai", "70 (ななじゅう) + さい → ななじゅっさい"],
            ["80 tuổi", "80歳 (はちじゅっさい)", "hachijussai", "80 (はちじゅう) + さい → はちじゅっさい"],
            ["90 tuổi", "90歳 (きゅうじゅっさい)", "kyūjussai", "90 (きゅうじゅう) + さい → きゅうじゅっさい"],
            ["100 tuổi", "100歳 (ひゃくさい)", "hyakusai", "Đọc ひゃくさい (tròn 100 tuổi)"],
            ["Mấy tuổi?", "何歳 (なんさい)", "nansai", "Từ hỏi tuổi thông thường"],
            ["Bao nhiêu tuổi?", "おいくつ", "oikutsu", "Từ hỏi tuổi LỊCH SỰ (dùng cho cấp trên, người lớn tuổi)"],
          ],
        },
        {
          type: "note",
          text: "📌 [Tóm tắt quy tắc đếm tuổi]:\n1. Các số tuổi kết thúc bằng 1, 8, 10 (ví dụ: 1歳, 8歳, 10歳, 11歳, 18歳, 30歳...) đều có âm biến xúc âm nhỏ [っ] thành: いっさい (1 tuổi), はっさい (8 tuổi), じゅっさい (10 tuổi).\n2. Riêng 20 tuổi (20歳) đọc là はたち (không có từ さい). Từ 21 tuổi trở đi đọc lại bình thường: にじゅういっさい.\n3. Khi hỏi tuổi: Dùng 何歳 (なんさい) với bạn bè/người nhỏ tuổi hơn; dùng おいくつ khi hỏi người lớn tuổi, thầy cô hoặc cấp trên để thể hiện sự kính trọng.",
        },
      ],
    },
    {
      id: "grammar",
      title: "IV. Giải thích ngữ pháp",
      blocks: [
        {
          type: "grammar-pattern",
          pattern: "Danh từ₁ は Danh từ₂ です",
          subPoints: [
            {
              label: "1) Trợ từ は",
              text: "Biểu thị rằng danh từ đứng trước nó là chủ đề của câu văn (chủ ngữ). Người nói đặt は sau chủ đề mà mình muốn nói đến và xây dựng câu bằng cách thêm vào phía sau は những thông tin trần thuật vị ngữ.",
            },
            {
              label: "2) です",
              text: "Danh từ đi cùng です để tạo thành vị ngữ. です vừa biểu thị ý nghĩa phán đoán khẳng định, vừa biểu thị thái độ lịch sự đối với người nghe. です biến đổi hình thức trong câu phủ định và trong câu biểu thị thì quá khứ (xem Bài 12).",
            },
          ],
          notes: ["Trợ từ は trong câu này phát âm là わ (wa), không phát âm là は (ha)."],
          examples: [
            { jp: "① わたしはマイク・ミラーです。", vi: "Tôi là Mike Miller." },
            { jp: "② わたしは会社員です。", vi: "Tôi là nhân viên công ty." },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "Danh từ₁ は Danh từ₂ じゃ(では)ありません",
          explanation:
            "じゃ(では)ありません là thể phủ định của です. じゃありません thường dùng trong hội thoại hàng ngày, còn ではありません dùng trong các bài phát biểu trang trọng hay trong văn viết.",
          notes: ["Trợ từ は trong では cũng đọc là わ (wa)."],
          examples: [
            {
              jp: "③ サントスさんは学生じゃありません。(では)",
              vi: "Anh Santos không phải là sinh viên.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "Danh từ₁ は Danh từ₂ ですか （câu nghi vấn）",
          subPoints: [
            {
              label: "1) Trợ từ か",
              text: "Dùng để biểu thị sự không chắc chắn, sự nghi vấn của người nói. Câu nghi vấn được tạo thành bằng cách thêm か vào cuối câu; trong câu nghi vấn, phần cuối câu được đọc với giọng cao hơn.",
            },
            {
              label: "2) Câu nghi vấn xác nhận đúng/sai",
              text: "Tạo thành câu nghi vấn bằng cách dùng trợ từ か ở cuối câu mà không thay đổi trật tự từ trong câu. Câu nghi vấn loại này xác nhận xem nội dung của câu văn là đúng hay sai — trường hợp đúng thì trả lời là はい, không đúng thì trả lời là いいえ.",
            },
            {
              label: "3) Câu nghi vấn có từ nghi vấn",
              text: "Thay nghi vấn từ vào vị trí của nội dung mà bạn muốn hỏi, thêm trợ từ か vào cuối câu. Trật tự từ không thay đổi.",
            },
          ],
          examples: [
            {
              jp: "④ ミラーさんはアメリカ人ですか。",
              vi: "Anh Miller có phải là người Mỹ không?",
            },
            { jp: "……はい、アメリカ人です。", vi: "…Vâng, anh ấy là người Mỹ." },
            { jp: "⑤ ミラーさんは先生ですか。", vi: "Anh Miller có phải là giáo viên không?" },
            {
              jp: "……いいえ、先生じゃありません。",
              vi: "…Không, anh ấy không phải là giáo viên.",
            },
            { jp: "⑥ あの方はどなたですか。", vi: "Người kia là ai?" },
            { jp: "……［あの方は］ミラーさんです。", vi: "…Người đó là anh Miller." },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "Danh từ も",
          explanation:
            "Trợ từ も được dùng khi trình bày một nội dung tương tự như ở câu văn trước.",
          examples: [
            {
              jp: "⑦ ミラーさんは会社員です。グプタさんも会社員です。",
              vi: "Anh Miller là nhân viên công ty. Anh Gupta cũng là nhân viên công ty.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "Danh từ₁ の Danh từ₂",
          explanation:
            "Trong trường hợp Danh từ₁ ở trước bổ nghĩa cho Danh từ₂ ở sau thì hai danh từ đó được nối với nhau bằng trợ từ の. Ở bài 1, Danh từ₁ biểu thị nơi sở thuộc của Danh từ₂.",
          examples: [
            { jp: "⑧ ミラーさんはIMCの社員です。", vi: "Anh Miller là nhân viên công ty IMC." },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "～さん",
          explanation:
            "Trong tiếng Nhật, từ さん được dùng sau họ hoặc tên của người nghe hoặc người ở ngôi thứ 3. Vì sử dụng さん để thể hiện tính lịch sự nên không dùng sau họ hoặc tên của chính người nói. Đối với trẻ em thì từ ちゃん với sắc thái thân mật sẽ được dùng thay cho さん.",
          notes: [
            "Khi gọi, nếu trường hợp đã biết họ hoặc tên của người nghe thì không dùng あなた mà thêm さん vào sau họ hoặc tên người đó để gọi.",
            "あなた được sử dụng trong những quan hệ cực kỳ thân mật như vợ chồng, người yêu, v.v. Do đó cần thiết phải chú ý khi sử dụng ngoài những trường hợp trên vì có thể sẽ gây cho đối phương ấn tượng không tốt.",
          ],
          examples: [
            { jp: "⑨ あの方はミラーさんです。", vi: "Người kia là anh Miller." },
            {
              jp: "⑩ 鈴木：ミラーさんは学生ですか。",
              vi: "Suzuki: Anh Miller có phải là sinh viên không?",
            },
            { jp: "ミラー：いいえ、会社員です。", vi: "Miller: Không, tôi là nhân viên công ty." },
          ],
        },
      ],
    },
    {
      id: "exercises",
      title: "V. Bài tập & Luyện tập",
      blocks: [
        {
          type: "exercise-listening-dictation",
          title: "問題 1: Nghe và trả lời phủ định theo mẫu",
          instruction: "Nghe câu hỏi rồi viết câu trả lời phủ định theo đúng mẫu ví dụ, sau đó bấm 'Xem đáp án' để tự đối chiếu.",
          audioUrl: "/audio/lessons/lesson-1/第1課-問題-1-Mondai-１.mp3",
          exampleJp: "いいえ、［わたしは］ 先生じゃ ありません。",
          exampleVi: "Không, [tôi] không phải là giáo viên.",
          items: [
            { id: "l1-mondai1-1", num: 1 },
            { id: "l1-mondai1-2", num: 2 },
            { id: "l1-mondai1-3", num: 3 },
            { id: "l1-mondai1-4", num: 4 },
            { id: "l1-mondai1-5", num: 5 },
          ],
        },
        {
          type: "exercise-listening-picture-choice",
          title: "問題 2: Nghe và chọn hình đúng",
          instruction:
            "Nghe đoạn hội thoại/câu chào rồi chọn hình phù hợp nhất. Hình minh họa trong app là hình vẽ đơn giản thay thế cho hình gốc trong sách.",
          audioUrl: "/audio/lessons/lesson-1/第1課-問題-2-Mondai-2.mp3",
          groups: [
            {
              id: "l1-mondai2-example",
              num: "例",
              options: [
                { id: "l1-m2-ex-1", label: "Buổi tối", icon: "greeting-night" },
                { id: "l1-m2-ex-2", label: "Sáng sớm", icon: "greeting-dawn" },
                { id: "l1-m2-ex-3", label: "Ban ngày", icon: "greeting-day" },
              ],
            },
            {
              id: "l1-mondai2-1",
              num: "1)",
              options: [
                { id: "l1-m2-1-1", label: "Chào đám đông", icon: "greet-crowd" },
                { id: "l1-m2-1-2", label: "Bắt tay", icon: "greet-handshake" },
                { id: "l1-m2-1-3", label: "Chào từ xa", icon: "greet-distant" },
              ],
            },
            {
              id: "l1-mondai2-2",
              num: "2)",
              options: [
                { id: "l1-m2-2-1", label: "", icon: "name-badge", badgeName: "ワン", badgeNumber: "21" },
                { id: "l1-m2-2-2", label: "", icon: "name-badge", badgeName: "アン", badgeNumber: "28" },
                { id: "l1-m2-2-3", label: "", icon: "name-badge", badgeName: "ワン", badgeNumber: "29" },
              ],
            },
          ],
        },
        {
          type: "exercise-listening-truefalse",
          title: "問題 3: Nghe và đánh dấu Đúng (○) / Sai (×)",
          instruction: "Nghe nội dung rồi chọn ○ nếu đúng, × nếu sai.",
          audioUrl: "/audio/lessons/lesson-1/第1課-問題-3-Mondai-3.mp3",
          items: [
            { id: "l1-mondai3-ex1", num: "例1", isExample: true, exampleAnswer: false },
            { id: "l1-mondai3-ex2", num: "例2", isExample: true, exampleAnswer: true },
            { id: "l1-mondai3-1", num: "1)" },
            { id: "l1-mondai3-2", num: "2)" },
            { id: "l1-mondai3-3", num: "3)" },
          ],
        },
        {
          type: "exercise-fill-in-blank",
          title: "Bài tập 4: Hoàn thành câu hỏi (danh từ / từ để hỏi)",
          instruction:
            "Dựa vào câu trả lời cho sẵn, chọn từ thích hợp điền vào chỗ trống trong câu hỏi.",
          questions: [
            {
              id: "l1-p4-q1",
              promptPre: "あなたは ",
              promptPost: "ですか。 - はい、ミラーです。",
              options: ["ミラーさん", "がくせい", "せんせい", "アメリカ人"],
              correctAnswer: "ミラーさん",
              explanation: "Câu hỏi xác nhận tên người đối diện: あなたは ～さんですか。",
              fullSentenceJp: "あなたは ミラーさんですか。 - はい、ミラーです。",
              fullSentenceVi: "Anh có phải là anh Miller không? - Vâng, tôi là Miller.",
            },
            {
              id: "l1-p4-q2",
              promptPre: "ミラーさんは ",
              promptPost: "ですか。 - はい、アメリカ人です。",
              options: ["アメリカ人", "イギリス人", "がくせい", "せんせい"],
              correctAnswer: "アメリカ人",
              explanation: "Câu hỏi xác nhận quốc tịch: ～は ［quốc gia］人ですか。",
              fullSentenceJp: "ミラーさんは アメリカ人ですか。 - はい、アメリカ人です。",
              fullSentenceVi: "Anh Miller có phải là người Mỹ không? - Vâng, [anh ấy] là người Mỹ.",
            },
            {
              id: "l1-p4-q3",
              promptPre: "ワットさんも ",
              promptPost: "ですか。 - いいえ、アメリカ人じゃ ありません。イギリス人です。",
              options: ["アメリカ人", "イギリス人", "がくせい", "せんせい"],
              correctAnswer: "アメリカ人",
              explanation: "も dùng để hỏi lại cùng một nội dung (quốc tịch) cho một người khác.",
              fullSentenceJp:
                "ワットさんも アメリカ人ですか。 - いいえ、アメリカ人じゃ ありません。イギリス人です。",
              fullSentenceVi:
                "Ông Watt cũng là người Mỹ à? - Không, ông ấy không phải là người Mỹ. Ông ấy là người Anh.",
            },
            {
              id: "l1-p4-q4",
              promptPre: "あの 方は ",
              promptPost: "ですか。 - サントスさんです。",
              options: ["だれ", "どなた", "なに", "どちら"],
              correctAnswer: "どなた",
              explanation:
                "どなた là cách hỏi 'ai' lịch sự hơn だれ, thường dùng khi hỏi về người ở xa/người khác một cách trang trọng (あの方 - vị kia).",
              fullSentenceJp: "あの 方は どなたですか。 - サントスさんです。",
              fullSentenceVi: "Vị kia là ai vậy? - Đó là anh Santos.",
            },
            {
              id: "l1-p4-q5",
              promptPre: "テレーザちゃんは ",
              promptPost: "ですか。 - 9歳です。",
              options: ["何歳", "おいくつ", "何人", "いつ"],
              correctAnswer: "何歳",
              explanation:
                "何歳 dùng để hỏi tuổi thông thường (với trẻ em/bạn bè); おいくつ là cách hỏi lịch sự hơn, dùng cho người lớn tuổi/cấp trên.",
              fullSentenceJp: "テレーザちゃんは 何歳ですか。 - 9歳です。",
              fullSentenceVi: "Bé Teresa mấy tuổi? - 9 tuổi.",
            },
          ],
        },
        {
          type: "exercise-fill-in-blank",
          title: "Bài tập 5: Điền trợ từ thích hợp (は, も, の, か)",
          instruction: "Điền trợ từ đúng vào chỗ trống để hoàn thành câu.",
          questions: [
            {
              id: "l1-p5-q1",
              promptPre: "ワンさん",
              promptPost: "医者です。",
              options: ["は", "も", "の", "か"],
              correctAnswer: "は",
              explanation: "は là trợ từ đánh dấu chủ đề của câu (Anh Wang — là bác sĩ).",
              fullSentenceJp: "ワンさんは 医者です。",
              fullSentenceVi: "Anh Wang là bác sĩ.",
            },
            {
              id: "l1-p5-q2a",
              promptPre: "カリナさん",
              promptPost: "先生です",
              options: ["は", "も", "の", "か"],
              correctAnswer: "は",
              explanation: "は đánh dấu chủ đề của câu.",
              fullSentenceJp: "カリナさんは 先生ですか。 - いいえ、先生じゃ ありません。",
              fullSentenceVi: "Chị Karina có phải là giáo viên không? - Không, chị ấy không phải là giáo viên.",
            },
            {
              id: "l1-p5-q2b",
              promptPre: "カリナさんは 先生です",
              promptPost: "。 - いいえ、先生じゃ ありません。",
              options: ["か", "よ", "ね", "の"],
              correctAnswer: "か",
              explanation: "か là trợ từ nghi vấn đặt ở cuối câu để tạo thành câu hỏi.",
              fullSentenceJp: "カリナさんは 先生ですか。 - いいえ、先生じゃ ありません。",
              fullSentenceVi: "Chị Karina có phải là giáo viên không? - Không, chị ấy không phải là giáo viên.",
            },
            {
              id: "l1-p5-q3",
              promptPre: "ミラーさんは IMC",
              promptPost: "社員です。",
              options: ["の", "は", "も", "を"],
              correctAnswer: "の",
              explanation: "の nối hai danh từ, thể hiện quan hệ sở hữu/trực thuộc (nhân viên của công ty IMC).",
              fullSentenceJp: "ミラーさんは IMCの 社員です。",
              fullSentenceVi: "Anh Miller là nhân viên của công ty IMC.",
            },
            {
              id: "l1-p5-q4",
              promptPre: "ミラーさんは 会社員です。 サントスさん",
              promptPost: "会社員です。",
              options: ["も", "は", "の", "か"],
              correctAnswer: "も",
              explanation: "も dùng khi nêu thêm một đối tượng có cùng tính chất/thông tin với đối tượng đã nhắc trước đó (cũng là).",
              fullSentenceJp: "ミラーさんは 会社員です。 サントスさんも 会社員です。",
              fullSentenceVi: "Anh Miller là nhân viên công ty. Anh Santos cũng là nhân viên công ty.",
            },
          ],
        },
        {
          type: "exercise-self-intro",
          title: "Bài tập 6: Tự giới thiệu về bản thân",
          instruction: "Điền thông tin của chính bạn vào chỗ trống để hoàn thành đoạn tự giới thiệu.",
          introText: "初めまして。",
          lines: [
            { before: "わたしは", after: "です。", placeholder: "tên của bạn" },
            { before: "", after: "から 来ました。", placeholder: "quốc gia của bạn" },
          ],
          closingText: "どうぞ よろしく。",
          sampleAnswerJp: "初めまして。 わたしは グエン・ヴァン・アンです。 ベトナムから 来ました。 どうぞ よろしく。",
          sampleAnswerVi:
            "Rất vui được làm quen. Tôi là Nguyễn Văn An. Tôi đến từ Việt Nam. Rất mong được giúp đỡ.",
        },
      ],
    },
  ],
};
