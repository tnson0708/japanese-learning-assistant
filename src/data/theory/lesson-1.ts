import type { Lesson } from "@/lib/theory";

export const lesson1: Lesson = {
  id: 1,
  title: "Bài 1",
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
              jp: "なんさい",
              kanji: "何歳",
              meaning: "mấy tuổi, bao nhiêu tuổi",
              note: "おいくつ là cách nói lịch sự của なんさい",
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
      id: "reference",
      title: "II. Từ và thông tin tham khảo",
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
      ],
    },
    {
      id: "grammar",
      title: "III. Giải thích ngữ pháp",
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
  ],
};
