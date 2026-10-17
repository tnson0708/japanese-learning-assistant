/**
 * Condensed grammar handbook for Bài 1–25 (みんなの日本語 I & II).
 * A standalone quick-reference dataset, independent from the per-lesson
 * `Lesson`/`ContentBlock` model in `@/lib/theory` — it only powers the
 * /theory/summary page (screen + A4 print).
 *
 * Every grammar point has the same shape (pattern → meaning → notes →
 * optional table → examples) so the page and the printout line up as one
 * consistent two-column grid. Japanese is written in kana with spaces
 * between phrases, as in the early Minna lessons, so it reads without furigana.
 */

export interface GrammarExample {
  jp: string;
  vi: string;
}

export interface GrammarTable {
  columns: string[];
  rows: string[][];
}

export interface GrammarPoint {
  /** The pattern itself, e.g. "N1 は N2 です". */
  pattern: string;
  /** One-line Vietnamese meaning, e.g. "N1 là N2". */
  meaning: string;
  notes?: string[];
  table?: GrammarTable;
  examples: GrammarExample[];
}

export interface SummaryLesson {
  id: number;
  /** Short Vietnamese topic of the lesson. */
  topic: string;
  points: GrammarPoint[];
}

function ex(jp: string, vi: string): GrammarExample {
  return { jp, vi };
}

export const grammarSummaryLessons: SummaryLesson[] = [
  {
    id: 1,
    topic: "Giới thiệu bản thân · Câu danh từ",
    points: [
      {
        pattern: "Nhắc lại phát âm",
        meaning: "Các quy tắc đọc cần nhớ trước khi học câu",
        table: {
          columns: ["Quy tắc", "Cách đọc", "Ví dụ"],
          rows: [
            ["Âm đục ゛ / bán đục ゜", "か→が, さ→ざ, た→だ, は→ば / ぱ", "がくせい, ぱん"],
            ["Âm ghép ゃ ゅ ょ", "Cột い + ゃゅょ viết nhỏ, đọc liền 1 âm", "きょう, しゃいん"],
            ["Âm ngắt っ", "っ nhỏ: ngừng 1 nhịp trước âm sau", "きって, ざっし"],
            ["Trường âm", "Kéo dài nguyên âm (ああ, いい, うう, えい, おう)", "おかあさん, せんせい"],
            ["ん", "Đọc \"m\" trước ま・ば・ぱ, còn lại đọc \"n\"", "しんぶん, こんばん"],
          ],
        },
        examples: [],
      },
      {
        pattern: "N1 は N2 です",
        meaning: "N1 là N2",
        notes: ["は là trợ từ chủ đề, đọc là \"wa\".", "です làm câu lịch sự, đứng cuối câu danh từ."],
        examples: [
          ex("わたしは マイク・ミラーです。", "Tôi là Mike Miller."),
          ex("わたしは かいしゃいんです。", "Tôi là nhân viên công ty."),
        ],
      },
      {
        pattern: "N1 は N2 じゃ（では）ありません",
        meaning: "N1 không phải là N2",
        notes: ["じゃ ありません dùng khi nói, では ありません dùng khi viết hoặc trang trọng."],
        examples: [
          ex("サントスさんは がくせいじゃ ありません。", "Anh Santos không phải là sinh viên."),
          ex("わたしは せんせいでは ありません。", "Tôi không phải là giáo viên."),
        ],
      },
      {
        pattern: "N1 は N2 ですか",
        meaning: "N1 có phải là N2 không?",
        notes: [
          "Thêm か vào cuối câu để hỏi, đọc lên giọng.",
          "Trả lời: はい、そうです。/ いいえ、ちがいます。/ いいえ、N2 じゃ ありません。",
          "Câu hỏi có nghi vấn từ (だれ、なんさい…) thì không trả lời はい／いいえ.",
        ],
        examples: [
          ex("ミラーさんは アメリカじんですか。…はい、アメリカじんです。", "Anh Miller là người Mỹ phải không? …Vâng, là người Mỹ."),
          ex("あの ひとは だれですか。…ワットさんです。", "Người kia là ai? …Là anh Watt."),
          ex("テレーザちゃんは なんさいですか。…9さいです。", "Bé Teresa mấy tuổi? …9 tuổi."),
        ],
      },
      {
        pattern: "N も",
        meaning: "N cũng…",
        notes: ["も thay cho は khi nội dung giống với câu trước."],
        examples: [
          ex("ミラーさんは かいしゃいんです。グプタさんも かいしゃいんです。", "Anh Miller là nhân viên công ty. Anh Gupta cũng là nhân viên công ty."),
        ],
      },
      {
        pattern: "N1 の N2",
        meaning: "N2 của / thuộc N1",
        notes: ["の nối 2 danh từ, N1 bổ nghĩa cho N2 (N2 là danh từ chính)."],
        examples: [
          ex("ミラーさんは IMCの しゃいんです。", "Anh Miller là nhân viên của công ty IMC."),
          ex("わたしは さくらだいがくの がくせいです。", "Tôi là sinh viên trường đại học Sakura."),
        ],
      },
      {
        pattern: "～さん",
        meaning: "Anh / chị / ông / bà…",
        notes: [
          "Đặt sau tên người khác để tỏ sự lịch sự. Không dùng cho chính mình.",
          "Với trẻ em: ～ちゃん (bé gái), ～くん (bé trai).",
        ],
        examples: [ex("あの かたは きむらさんです。", "Vị kia là chị Kimura.")],
      },
    ],
  },
  {
    id: 2,
    topic: "Đồ vật · これ／それ／あれ",
    points: [
      {
        pattern: "これ／それ／あれ は N です",
        meaning: "Cái này / cái đó / cái kia là N",
        notes: [
          "これ: vật gần người nói. それ: vật gần người nghe. あれ: vật xa cả hai.",
          "Hỏi: なんですか (là cái gì?) / どれですか (cái nào?).",
        ],
        table: {
          columns: ["", "こ (gần mình)", "そ (gần người nghe)", "あ (xa cả hai)", "ど (hỏi)"],
          rows: [
            ["Đồ vật", "これ", "それ", "あれ", "どれ"],
            ["+ N", "この N", "その N", "あの N", "どの N"],
          ],
        },
        examples: [
          ex("これは じしょです。", "Đây là quyển từ điển."),
          ex("それは なんですか。…ボールペンです。", "Đó là cái gì? …Là bút bi."),
        ],
      },
      {
        pattern: "この／その／あの N",
        meaning: "N này / N đó / N kia",
        notes: ["Phải có danh từ đi kèm phía sau, không đứng một mình như これ／それ／あれ."],
        examples: [
          ex("この ほんは わたしのです。", "Quyển sách này là của tôi."),
          ex("あの かたは どなたですか。", "Vị kia là ai ạ?"),
        ],
      },
      {
        pattern: "そうです／そうじゃ ありません",
        meaning: "Đúng vậy / Không phải vậy",
        notes: ["Dùng để trả lời câu hỏi danh từ ～ですか thay vì lặp lại danh từ."],
        examples: [
          ex("それは テレホンカードですか。…はい、そうです。", "Đó là thẻ điện thoại phải không? …Vâng, đúng vậy."),
          ex("…いいえ、そうじゃ ありません。", "…Không, không phải vậy."),
        ],
      },
      {
        pattern: "N1 ですか、N2 ですか",
        meaning: "Là N1 hay là N2? (câu hỏi lựa chọn)",
        notes: ["Trả lời bằng đáp án đã chọn, không dùng はい／いいえ."],
        examples: [ex("これは「9」ですか、「7」ですか。…「9」です。", "Đây là số 9 hay số 7? …Là số 9.")],
      },
      {
        pattern: "N1 の N2 (nội dung · sở hữu)",
        meaning: "N2 về N1 / N2 của N1",
        notes: [
          "Nội dung: コンピューターの ほん (sách về máy tính). Hỏi: なんの N.",
          "Sở hữu: わたしの ほん (sách của tôi). Hỏi: だれの N.",
        ],
        examples: [
          ex("これは なんの ざっしですか。…くるまの ざっしです。", "Đây là tạp chí gì? …Là tạp chí về xe hơi."),
          ex("これは だれの かばんですか。…さとうさんの かばんです。", "Đây là cặp của ai? …Là cặp của chị Sato."),
        ],
      },
      {
        pattern: "の (thay cho danh từ)",
        meaning: "Cái của…",
        notes: ["Khi danh từ đã rõ, N1 の N2 có thể bỏ N2. Không dùng với người: ×さとうさんの (để chỉ người)."],
        examples: [
          ex("この かさは わたしのです。", "Cái ô này là của tôi."),
          ex("あの かばんは だれのですか。…ミラーさんのです。", "Cái cặp kia là của ai? …Của anh Miller."),
        ],
      },
    ],
  },
  {
    id: 3,
    topic: "Địa điểm · ここ／そこ／あそこ",
    points: [
      {
        pattern: "ここ／そこ／あそこ は N (địa điểm) です",
        meaning: "Chỗ này / chỗ đó / chỗ kia là N",
        notes: ["こちら／そちら／あちら／どちら là cách nói lịch sự (chỉ phương hướng hoặc địa điểm)."],
        table: {
          columns: ["", "こ", "そ", "あ", "ど"],
          rows: [
            ["Địa điểm", "ここ", "そこ", "あそこ", "どこ"],
            ["Lịch sự / hướng", "こちら", "そちら", "あちら", "どちら"],
          ],
        },
        examples: [
          ex("ここは しょくどうです。", "Đây là nhà ăn."),
          ex("あそこは じむしょです。", "Chỗ kia là văn phòng."),
        ],
      },
      {
        pattern: "N は địa điểm です",
        meaning: "N ở (địa điểm)",
        notes: ["Hỏi vị trí: N は どこですか / どちらですか (lịch sự)."],
        examples: [
          ex("トイレは あそこです。", "Nhà vệ sinh ở đằng kia."),
          ex("でんわは 2かいです。", "Điện thoại ở tầng 2."),
          ex("エレベーターは どちらですか。…あちらです。", "Thang máy ở đâu ạ? …Ở phía kia ạ."),
        ],
      },
      {
        pattern: "どこ／どちら (hỏi nước · trường · công ty)",
        meaning: "Ở đâu? / Nơi nào?",
        notes: ["Dùng どちら khi hỏi tên nước, trường, công ty một cách lịch sự."],
        examples: [
          ex("おくには どちらですか。…アメリカです。", "Anh là người nước nào? …Mỹ."),
          ex("かいしゃは どちらですか。…IMCです。", "Anh làm ở công ty nào? …Công ty IMC."),
        ],
      },
      {
        pattern: "N1 の N2 (xuất xứ)",
        meaning: "N2 sản xuất ở / của hãng N1",
        notes: ["Hỏi xuất xứ: どこの N ですか."],
        examples: [ex("これは どこの くるまですか。…にほんの くるまです。", "Đây là xe của nước nào? …Xe Nhật.")],
      },
      {
        pattern: "N は いくらですか",
        meaning: "N giá bao nhiêu?",
        examples: [ex("この ネクタイは いくらですか。…1,500えんです。", "Cái cà vạt này giá bao nhiêu? …1.500 yên.")],
      },
    ],
  },
  {
    id: 4,
    topic: "Thời gian · Động từ ます",
    points: [
      {
        pattern: "いま ～じ ～ふん です",
        meaning: "Bây giờ là … giờ … phút",
        notes: ["ふん đọc thành ぷん sau 1, 3, 4, 6, 8, 10: いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん.", "Rưỡi: ～じはん."],
        examples: [
          ex("いま なんじですか。…7じ10ぷんです。", "Bây giờ là mấy giờ? …7 giờ 10 phút."),
          ex("ニューヨークは いま なんじですか。…ごぜん 4じです。", "Ở New York bây giờ là mấy giờ? …4 giờ sáng."),
        ],
      },
      {
        pattern: "V ます／ません／ました／ませんでした",
        meaning: "4 dạng lịch sự của động từ",
        table: {
          columns: ["", "Khẳng định", "Phủ định"],
          rows: [
            ["Hiện tại / tương lai", "おきます (thức dậy)", "おきません"],
            ["Quá khứ", "おきました", "おきませんでした"],
          ],
        },
        examples: [
          ex("まいあさ 6じに おきます。", "Mỗi sáng tôi dậy lúc 6 giờ."),
          ex("きのう べんきょうしませんでした。", "Hôm qua tôi đã không học."),
        ],
      },
      {
        pattern: "N (thời gian) に V",
        meaning: "Làm V vào lúc N",
        notes: [
          "Dùng に với thời điểm có con số: ～じ, ～がつ～にち, ～ねん. Thứ trong tuần: có thể có hoặc không.",
          "Không dùng に với: きょう, あした, きのう, まいにち, けさ, こんばん, いつ…",
        ],
        examples: [
          ex("6じはんに おきます。", "Tôi dậy lúc 6 giờ rưỡi."),
          ex("にちようび［に］ならへ いきます。", "Chủ nhật tôi đi Nara."),
          ex("きのう べんきょうしました。", "Hôm qua tôi đã học."),
        ],
      },
      {
        pattern: "N1 から N2 まで",
        meaning: "Từ N1 đến N2 (thời gian, địa điểm)",
        notes: ["Có thể dùng riêng から hoặc まで, và đặt です ngay sau."],
        examples: [
          ex("9じから 5じまで はたらきます。", "Tôi làm việc từ 9 giờ đến 5 giờ."),
          ex("ぎんこうは 9じから 3じまでです。", "Ngân hàng mở cửa từ 9 giờ đến 3 giờ."),
        ],
      },
      {
        pattern: "N1 と N2",
        meaning: "N1 và N2",
        notes: ["Chỉ dùng để nối danh từ, không nối câu."],
        examples: [ex("ぎんこうの やすみは どようびと にちようびです。", "Ngân hàng nghỉ thứ Bảy và Chủ nhật.")],
      },
      {
        pattern: "～ね",
        meaning: "…nhỉ / …nhé (mong đồng tình, xác nhận)",
        examples: [ex("まいにち 10じまで べんきょうします。…たいへんですね。", "Ngày nào tôi cũng học đến 10 giờ. …Vất vả nhỉ.")],
      },
    ],
  },
  {
    id: 5,
    topic: "Di chuyển · へ／で／と",
    points: [
      {
        pattern: "N (địa điểm) へ いきます／きます／かえります",
        meaning: "Đi / đến / về N",
        notes: ["へ chỉ hướng di chuyển, đọc là \"e\"."],
        examples: [
          ex("きょうとへ いきます。", "Tôi đi Kyoto."),
          ex("にほんへ きました。", "Tôi đã đến Nhật."),
          ex("うちへ かえります。", "Tôi về nhà."),
        ],
      },
      {
        pattern: "どこ［へ］も いきません",
        meaning: "Không đi đâu cả",
        notes: ["Nghi vấn từ + も + phủ định = phủ định hoàn toàn: なにも, だれも, どこも."],
        examples: [
          ex("どこ［へ］も いきません。", "Tôi không đi đâu cả."),
          ex("なにも たべません。", "Tôi không ăn gì cả."),
        ],
      },
      {
        pattern: "N (phương tiện) で いきます",
        meaning: "Đi bằng N",
        notes: ["Đi bộ: あるいて (không có で)."],
        examples: [
          ex("でんしゃで いきます。", "Tôi đi bằng tàu điện."),
          ex("えきから あるいて かえりました。", "Tôi đã đi bộ từ ga về."),
          ex("なんで きましたか。…タクシーで きました。", "Bạn đến bằng gì? …Bằng taxi."),
        ],
      },
      {
        pattern: "N (người · động vật) と V",
        meaning: "Làm V cùng với N",
        notes: ["Làm một mình: ひとりで (không dùng と)."],
        examples: [
          ex("かぞくと にほんへ きました。", "Tôi đã đến Nhật cùng gia đình."),
          ex("ひとりで とうきょうへ いきます。", "Tôi đi Tokyo một mình."),
        ],
      },
      {
        pattern: "いつ",
        meaning: "Khi nào?",
        notes: ["Không dùng に sau いつ."],
        examples: [ex("いつ にほんへ きましたか。…3がつ 25にちに きました。", "Bạn đến Nhật khi nào? …Ngày 25 tháng 3.")],
      },
      {
        pattern: "～よ",
        meaning: "…đấy (báo thông tin người nghe chưa biết)",
        examples: [
          ex("この でんしゃは こうしえんへ いきますか。…いいえ、いきません。つぎの「ふつう」ですよ。", "Tàu này có đi Koshien không? …Không. Chuyến tàu thường kế tiếp cơ."),
        ],
      },
    ],
  },
  {
    id: 6,
    topic: "Hành động · を／で · Mời rủ",
    points: [
      {
        pattern: "N を V (ngoại động từ)",
        meaning: "Làm V cái N",
        notes: ["を chỉ đối tượng của hành động, đọc là \"o\".", "Hỏi: なにを V ますか."],
        examples: [
          ex("ジュースを のみます。", "Tôi uống nước hoa quả."),
          ex("にちようび なにを しますか。…テニスを します。", "Chủ nhật bạn làm gì? …Tôi chơi tennis."),
        ],
      },
      {
        pattern: "N を します",
        meaning: "Làm / chơi N",
        notes: ["します đi với nhiều danh từ: サッカー (chơi bóng), しゅくだい (làm bài tập), パーティー (tổ chức tiệc)."],
        examples: [
          ex("しゅくだいを します。", "Tôi làm bài tập."),
          ex("ともだちと サッカーを しました。", "Tôi đã chơi bóng đá với bạn."),
        ],
      },
      {
        pattern: "なん／なに",
        meaning: "Cái gì? — cách chọn なん hay なに",
        notes: [
          "なん: trước âm hàng た・だ・な (なんですか, なんで, なんの), hoặc trước từ đếm (なんさい, なんじ).",
          "Các trường hợp còn lại dùng なに: なにを, なにが.",
        ],
        examples: [
          ex("それは なんですか。", "Đó là cái gì?"),
          ex("なにを かいましたか。", "Bạn đã mua gì?"),
        ],
      },
      {
        pattern: "N (địa điểm) で V",
        meaning: "Làm V ở N",
        notes: ["で chỉ nơi diễn ra hành động (khác へ chỉ hướng đi)."],
        examples: [
          ex("えきで しんぶんを かいます。", "Tôi mua báo ở nhà ga."),
          ex("どこで その かばんを かいましたか。…デパートで かいました。", "Bạn mua cái cặp đó ở đâu? …Ở cửa hàng bách hóa."),
        ],
      },
      {
        pattern: "V ませんか",
        meaning: "…cùng (với tôi) không? (mời rủ)",
        notes: ["Đồng ý: ええ、いいですね。/ Từ chối khéo: すみません、ちょっと…。"],
        examples: [ex("いっしょに きょうとへ いきませんか。…ええ、いいですね。", "Cùng đi Kyoto với tôi không? …Ừ, hay đấy.")],
      },
      {
        pattern: "V ましょう",
        meaning: "Chúng ta cùng … đi",
        notes: ["Dùng khi rủ rê tích cực hoặc khi đáp lại lời mời."],
        examples: [ex("ちょっと やすみましょう。", "Chúng ta nghỉ một chút đi.")],
      },
    ],
  },
  {
    id: 7,
    topic: "Công cụ · Cho và nhận",
    points: [
      {
        pattern: "N (công cụ · phương tiện) で V",
        meaning: "Làm V bằng N",
        examples: [
          ex("はしで たべます。", "Tôi ăn bằng đũa."),
          ex("にほんごで レポートを かきます。", "Tôi viết báo cáo bằng tiếng Nhật."),
        ],
      },
      {
        pattern: "「từ / câu」は ～ごで なんですか",
        meaning: "\"…\" tiếng … nói là gì?",
        examples: [
          ex("「ありがとう」は えいごで なんですか。…「Thank you」です。", "\"Arigatou\" tiếng Anh nói là gì? …Là \"Thank you\"."),
        ],
      },
      {
        pattern: "N1 (người) に N2 を あげます",
        meaning: "Cho / tặng N1 cái N2",
        notes: ["Cùng cấu trúc: かします (cho mượn), おしえます (dạy), おくります (gửi), でんわを かけます (gọi điện)."],
        examples: [
          ex("わたしは きむらさんに はなを あげました。", "Tôi đã tặng hoa cho chị Kimura."),
          ex("イーさんに ほんを かしました。", "Tôi đã cho anh Lee mượn sách."),
        ],
      },
      {
        pattern: "N1 (người) に／から N2 を もらいます",
        meaning: "Nhận N2 từ N1",
        notes: [
          "Cùng cấu trúc: かります (mượn), ならいます (học).",
          "Khi N1 là tổ chức (công ty, trường…) thì dùng から.",
        ],
        examples: [
          ex("わたしは カリナさんに チョコレートを もらいました。", "Tôi đã nhận sô-cô-la từ chị Karina."),
          ex("ぎんこうから おかねを かりました。", "Tôi đã vay tiền từ ngân hàng."),
        ],
      },
      {
        pattern: "もう V ました",
        meaning: "Đã … rồi",
        notes: ["Trả lời phủ định: いいえ、まだです。(Chưa.) — không dùng ～ませんでした."],
        examples: [
          ex("もう にもつを おくりましたか。…はい、もう おくりました。", "Bạn đã gửi hành lý chưa? …Rồi, đã gửi rồi."),
          ex("…いいえ、まだです。", "…Chưa, vẫn chưa."),
        ],
      },
    ],
  },
  {
    id: 8,
    topic: "Tính từ",
    points: [
      {
        pattern: "Tính từ đuôi い／Tính từ đuôi な",
        meaning: "Hai loại tính từ, chia khác nhau",
        notes: ["きれい(な), ゆうめい(な) là tính từ な dù kết thúc bằng い."],
        table: {
          columns: ["", "Tính từ い (おおきい)", "Tính từ な (しずか)"],
          rows: [
            ["Khẳng định", "おおきいです", "しずかです"],
            ["Phủ định", "おおきくないです", "しずかじゃ ありません"],
            ["+ Danh từ", "おおきい まち", "しずかな まち"],
          ],
        },
        examples: [],
      },
      {
        pattern: "N は Aな です／Aい です",
        meaning: "N thì (tính từ)",
        notes: ["Phủ định: Aい bỏ い + くないです; Aな + じゃ ありません.", "Ngoại lệ: いいです → よくないです."],
        examples: [
          ex("ワット せんせいは しんせつです。", "Thầy Watt tốt bụng."),
          ex("ふじさんは たかいです。", "Núi Phú Sĩ cao."),
          ex("この ほんは おもしろくないです。", "Quyển sách này không hay."),
        ],
      },
      {
        pattern: "Aな な N／Aい N",
        meaning: "Tính từ bổ nghĩa cho danh từ",
        examples: [
          ex("ワット せんせいは しんせつな せんせいです。", "Thầy Watt là giáo viên tốt bụng."),
          ex("ふじさんは たかい やまです。", "Núi Phú Sĩ là ngọn núi cao."),
        ],
      },
      {
        pattern: "とても／あまり",
        meaning: "Rất / không … lắm",
        notes: ["とても + khẳng định. あまり + phủ định."],
        examples: [
          ex("ペキンは とても さむいです。", "Bắc Kinh rất lạnh."),
          ex("この えいがは あまり おもしろくないです。", "Bộ phim này không hay lắm."),
        ],
      },
      {
        pattern: "N は どうですか",
        meaning: "N thế nào?",
        examples: [ex("にほんの せいかつは どうですか。…たのしいです。", "Cuộc sống ở Nhật thế nào? …Vui lắm.")],
      },
      {
        pattern: "N1 は どんな N2 ですか",
        meaning: "N1 là N2 như thế nào?",
        examples: [ex("ならは どんな まちですか。…ふるい まちです。", "Nara là thành phố như thế nào? …Là thành phố cổ.")],
      },
      {
        pattern: "S1 が、S2",
        meaning: "S1 nhưng S2",
        examples: [ex("にほんの たべものは おいしいですが、たかいです。", "Đồ ăn Nhật ngon nhưng đắt.")],
      },
      {
        pattern: "どれ",
        meaning: "Cái nào? (chọn trong 3 vật trở lên)",
        examples: [ex("ミラーさんの かさは どれですか。…あの あおい かさです。", "Ô của anh Miller là cái nào? …Là cái ô màu xanh kia.")],
      },
    ],
  },
  {
    id: 9,
    topic: "Sở thích · Khả năng · Lý do",
    points: [
      {
        pattern: "N が すきです／きらいです／じょうずです／へたです",
        meaning: "Thích / ghét / giỏi / kém N",
        notes: ["Đối tượng của cảm xúc, khả năng dùng が (không dùng を)."],
        examples: [
          ex("わたしは イタリアりょうりが すきです。", "Tôi thích món Ý."),
          ex("わたしは えが へたです。", "Tôi vẽ kém."),
        ],
      },
      {
        pattern: "N が あります／わかります",
        meaning: "Có N / hiểu N",
        examples: [
          ex("わたしは くるまが あります。", "Tôi có xe hơi."),
          ex("わたしは にほんごが わかります。", "Tôi hiểu tiếng Nhật."),
        ],
      },
      {
        pattern: "どんな N",
        meaning: "N loại nào? / N như thế nào?",
        examples: [ex("どんな スポーツが すきですか。…サッカーが すきです。", "Bạn thích môn thể thao nào? …Tôi thích bóng đá.")],
      },
      {
        pattern: "Phó từ mức độ · số lượng",
        meaning: "よく, だいたい, たくさん, すこし, あまり, ぜんぜん",
        table: {
          columns: ["Đi với khẳng định", "Đi với phủ định"],
          rows: [
            ["よく (rõ, giỏi) · だいたい (đại khái)", "あまり (không … lắm)"],
            ["たくさん (nhiều) · すこし (một chút)", "ぜんぜん (hoàn toàn không)"],
          ],
        },
        examples: [
          ex("えいごが よく わかります。", "Tôi hiểu tiếng Anh rõ."),
          ex("かんじが ぜんぜん わかりません。", "Tôi hoàn toàn không hiểu chữ Hán."),
        ],
      },
      {
        pattern: "S1 から、S2",
        meaning: "Vì S1 nên S2",
        examples: [ex("じかんが ありませんから、しんぶんを よみません。", "Vì không có thời gian nên tôi không đọc báo.")],
      },
      {
        pattern: "どうして",
        meaning: "Tại sao?",
        notes: ["Trả lời bằng ～から。"],
        examples: [ex("どうして あさ しんぶんを よみませんか。…じかんが ありませんから。", "Tại sao buổi sáng bạn không đọc báo? …Vì không có thời gian.")],
      },
    ],
  },
  {
    id: 10,
    topic: "Tồn tại · あります／います · Vị trí",
    points: [
      {
        pattern: "N が あります／います",
        meaning: "Có N",
        notes: ["あります: đồ vật, cây cối (không tự chuyển động). います: người, động vật."],
        examples: [
          ex("コンピューターが あります。", "Có máy tính."),
          ex("おとこの ひとが います。", "Có người đàn ông."),
        ],
      },
      {
        pattern: "địa điểm に N が あります／います",
        meaning: "Ở (địa điểm) có N",
        notes: ["Hỏi: なにが ありますか / だれが いますか."],
        examples: [
          ex("わたしの へやに つくえが あります。", "Trong phòng tôi có cái bàn."),
          ex("じむしょに ミラーさんが います。", "Ở văn phòng có anh Miller."),
        ],
      },
      {
        pattern: "N は địa điểm に あります／います",
        meaning: "N ở (địa điểm)",
        notes: ["Hỏi: N は どこに ありますか / いますか. Có thể nói gọn: N は địa điểm です."],
        examples: [
          ex("ミラーさんは じむしょに います。", "Anh Miller ở văn phòng."),
          ex("とうきょうディズニーランドは ちばけんに あります。", "Tokyo Disneyland ở tỉnh Chiba."),
        ],
      },
      {
        pattern: "N1 の N2 (vị trí)",
        meaning: "Vị trí N2 của N1 (trên, dưới, trong…)",
        table: {
          columns: ["うえ", "した", "まえ", "うしろ", "みぎ", "ひだり"],
          rows: [
            ["trên", "dưới", "trước", "sau", "phải", "trái"],
            ["なか: trong", "そと: ngoài", "となり: bên cạnh", "ちかく: gần", "あいだ: giữa", ""],
          ],
        },
        examples: [
          ex("つくえの うえに しゃしんが あります。", "Trên bàn có tấm ảnh."),
          ex("ゆうびんきょくは ぎんこうの となりです。", "Bưu điện ở bên cạnh ngân hàng."),
        ],
      },
      {
        pattern: "N1 や N2［など］",
        meaning: "N1, N2… (liệt kê vài ví dụ tiêu biểu)",
        notes: ["と liệt kê đầy đủ, や chỉ nêu ví dụ. など: vân vân."],
        examples: [ex("はこの なかに てがみや しゃしん［など］が あります。", "Trong hộp có thư, ảnh…")],
      },
    ],
  },
  {
    id: 11,
    topic: "Số lượng · Đếm",
    points: [
      {
        pattern: "Cách đếm",
        meaning: "Từ đếm thường gặp",
        table: {
          columns: ["Từ đếm", "Dùng cho", "1", "2", "3", "Hỏi"],
          rows: [
            ["～つ", "đồ vật nói chung", "ひとつ", "ふたつ", "みっつ", "いくつ"],
            ["～にん", "người", "ひとり", "ふたり", "さんにん", "なんにん"],
            ["～だい", "máy móc, xe", "いちだい", "にだい", "さんだい", "なんだい"],
            ["～まい", "vật mỏng (giấy, áo)", "いちまい", "にまい", "さんまい", "なんまい"],
            ["～かい", "số lần", "いっかい", "にかい", "さんかい", "なんかい"],
          ],
        },
        examples: [],
      },
      {
        pattern: "N を／が  số lượng  V",
        meaning: "Vị trí của số lượng từ",
        notes: ["Số lượng từ đứng ngay trước động từ, sau trợ từ."],
        examples: [
          ex("りんごを 4つ かいました。", "Tôi đã mua 4 quả táo."),
          ex("がいこくじんの がくせいが ふたり います。", "Có 2 sinh viên nước ngoài."),
        ],
      },
      {
        pattern: "khoảng thời gian に ～かい V",
        meaning: "Làm V … lần trong (khoảng thời gian)",
        notes: ["Hỏi độ dài thời gian: どのくらい. Khoảng chừng: ～ぐらい."],
        examples: [
          ex("1かげつに 2かい えいがを みます。", "Tôi xem phim 2 lần một tháng."),
          ex("どのくらい にほんごを べんきょうしましたか。…3ねん べんきょうしました。", "Bạn đã học tiếng Nhật bao lâu? …3 năm."),
          ex("がっこうに せんせいが 30にんぐらい います。", "Ở trường có khoảng 30 giáo viên."),
        ],
      },
      {
        pattern: "số lượng／N だけ",
        meaning: "Chỉ …",
        examples: [
          ex("やすみは にちようびだけです。", "Ngày nghỉ chỉ có Chủ nhật."),
          ex("パワーでんきに がいこくじんの しゃいんが ひとりだけ います。", "Ở công ty Power chỉ có 1 nhân viên người nước ngoài."),
        ],
      },
    ],
  },
  {
    id: 12,
    topic: "Quá khứ · So sánh",
    points: [
      {
        pattern: "Quá khứ của câu danh từ / tính từ な",
        meaning: "でした／じゃ ありませんでした",
        table: {
          columns: ["", "Khẳng định", "Phủ định"],
          rows: [
            ["Hiện tại", "あめです / ひまです", "あめじゃ ありません"],
            ["Quá khứ", "あめでした / ひまでした", "あめじゃ ありませんでした"],
          ],
        },
        examples: [
          ex("きのうは あめでした。", "Hôm qua trời mưa."),
          ex("きのうの しけんは かんたんじゃ ありませんでした。", "Bài kiểm tra hôm qua không dễ."),
        ],
      },
      {
        pattern: "Quá khứ của câu tính từ い",
        meaning: "～かったです／～くなかったです",
        notes: ["Ngoại lệ: いい → よかったです / よくなかったです."],
        table: {
          columns: ["", "Khẳng định", "Phủ định"],
          rows: [
            ["Hiện tại", "あついです", "あつくないです"],
            ["Quá khứ", "あつかったです", "あつくなかったです"],
          ],
        },
        examples: [
          ex("きのうは あつかったです。", "Hôm qua trời nóng."),
          ex("パーティーは あまり たのしくなかったです。", "Bữa tiệc không vui lắm."),
        ],
      },
      {
        pattern: "N1 は N2 より A です",
        meaning: "N1 (tính từ) hơn N2",
        examples: [ex("この くるまは あの くるまより おおきいです。", "Chiếc xe này to hơn chiếc xe kia.")],
      },
      {
        pattern: "N1 と N2 と どちらが A ですか",
        meaning: "N1 và N2, cái nào (tính từ) hơn?",
        notes: ["Trả lời: N の ほうが A です. Bằng nhau: どちらも A です."],
        examples: [
          ex("サッカーと やきゅうと どちらが おもしろいですか。…サッカーの ほうが おもしろいです。", "Bóng đá và bóng chày, môn nào hay hơn? …Bóng đá hay hơn."),
        ],
      },
      {
        pattern: "N［の なか］で なに／どこ／だれ／いつ が いちばん A ですか",
        meaning: "Trong N, cái gì / ở đâu / ai / khi nào (tính từ) nhất?",
        examples: [
          ex("にほんりょうり［の なか］で なにが いちばん おいしいですか。…てんぷらが いちばん おいしいです。", "Trong các món Nhật, món nào ngon nhất? …Tempura ngon nhất."),
        ],
      },
    ],
  },
  {
    id: 13,
    topic: "Mong muốn · Mục đích",
    points: [
      {
        pattern: "N が ほしいです",
        meaning: "Muốn có N",
        notes: ["ほしい chia như tính từ い (ほしくないです).", "Chỉ nói về mong muốn của mình hoặc hỏi người nghe."],
        examples: [
          ex("わたしは ともだちが ほしいです。", "Tôi muốn có bạn."),
          ex("いま なにが いちばん ほしいですか。…くるまが ほしいです。", "Bây giờ bạn muốn có gì nhất? …Tôi muốn có xe hơi."),
        ],
      },
      {
        pattern: "V ます (bỏ ます) たいです",
        meaning: "Muốn làm V",
        notes: ["を có thể đổi thành が. Chia như tính từ い: ～たくないです, ～たかったです."],
        examples: [
          ex("わたしは おきなわへ いきたいです。", "Tôi muốn đi Okinawa."),
          ex("わたしは てんぷらが／を たべたいです。", "Tôi muốn ăn tempura."),
          ex("おなかが いたいですから、なにも たべたくないです。", "Vì đau bụng nên tôi không muốn ăn gì."),
        ],
      },
      {
        pattern: "N (địa điểm) へ V ます／N に いきます",
        meaning: "Đi đến … để làm V (mục đích)",
        notes: ["V bỏ ます + に. Với danh từ hành động: かいもの, しょくじ + に."],
        examples: [
          ex("こうべへ インドりょうりを たべに いきます。", "Tôi đi Kobe để ăn món Ấn Độ."),
          ex("こうべへ かいものに いきます。", "Tôi đi Kobe để mua sắm."),
        ],
      },
      {
        pattern: "どこか／なにか",
        meaning: "Đâu đó / cái gì đó",
        notes: ["へ và を sau どこか, なにか có thể lược bỏ."],
        examples: [
          ex("ふゆやすみは どこか［へ］いきましたか。…はい、いきました。", "Kỳ nghỉ đông bạn có đi đâu không? …Có, tôi có đi."),
          ex("のどが かわきましたから、なにか［を］のみたいです。", "Vì khát nên tôi muốn uống gì đó."),
        ],
      },
    ],
  },
  {
    id: 14,
    topic: "Nhóm động từ · Thể て",
    points: [
      {
        pattern: "3 nhóm động từ",
        meaning: "Cách nhận biết nhóm từ thể ます",
        table: {
          columns: ["Nhóm", "Nhận biết", "Ví dụ"],
          rows: [
            ["I", "Âm trước ます thuộc hàng い", "かきます, のみます, かえります"],
            ["II", "Âm trước ます thuộc hàng え (và một số hàng い)", "たべます, ねます / みます, おきます"],
            ["III", "します, きます, N + します", "します, きます, べんきょうします"],
          ],
        },
        examples: [],
      },
      {
        pattern: "Thể て",
        meaning: "Cách chia từ thể ます",
        table: {
          columns: ["Nhóm", "Đuôi ます", "→ Thể て", "Ví dụ"],
          rows: [
            ["I", "い・ち・り", "って", "かいます → かって"],
            ["I", "み・び・に", "んで", "のみます → のんで"],
            ["I", "き / ぎ", "いて / いで", "かきます → かいて, いそぎます → いそいで"],
            ["I", "し", "して", "かします → かして"],
            ["I", "Ngoại lệ", "いって", "いきます → いって"],
            ["II", "bỏ ます", "+ て", "たべます → たべて"],
            ["III", "", "して / きて", "します → して, きます → きて"],
          ],
        },
        examples: [],
      },
      {
        pattern: "V て ください",
        meaning: "Hãy làm V (nhờ vả, mời, chỉ dẫn)",
        notes: ["Thêm すみませんが ở đầu để nhờ lịch sự hơn."],
        examples: [
          ex("すみませんが、この かんじの よみかたを おしえて ください。", "Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này."),
          ex("どうぞ たくさん たべて ください。", "Xin mời ăn nhiều vào."),
        ],
      },
      {
        pattern: "V て います (đang làm)",
        meaning: "Đang làm V",
        examples: [
          ex("ミラーさんは いま でんわを かけて います。", "Anh Miller bây giờ đang gọi điện thoại."),
          ex("いま あめが ふって いますか。…はい、ふって います。", "Bây giờ trời có đang mưa không? …Có, đang mưa."),
        ],
      },
      {
        pattern: "V ます (bỏ ます) ましょうか",
        meaning: "Để tôi làm V nhé? (đề nghị giúp)",
        examples: [
          ex("タクシーを よびましょうか。…ええ、おねがいします。", "Để tôi gọi taxi nhé? …Vâng, nhờ anh."),
          ex("てつだいましょうか。…すみません。おねがいします。", "Để tôi giúp nhé? …Cảm ơn, nhờ anh."),
        ],
      },
    ],
  },
  {
    id: 15,
    topic: "Xin phép · Cấm đoán · Trạng thái",
    points: [
      {
        pattern: "V て も いいですか",
        meaning: "Tôi làm V có được không? (xin phép)",
        notes: ["Đồng ý: ええ、いいですよ。/ Từ chối: すみません、ちょっと…。"],
        examples: [
          ex("しゃしんを とっても いいですか。…ええ、いいですよ。", "Tôi chụp ảnh có được không? …Vâng, được ạ."),
          ex("この ほんを かりても いいですか。…すみません、ちょっと…。", "Tôi mượn quyển sách này được không? …Xin lỗi, hơi…"),
        ],
      },
      {
        pattern: "V て は いけません",
        meaning: "Không được làm V (cấm)",
        notes: ["Trả lời phủ định câu xin phép: いいえ、いけません。"],
        examples: [
          ex("ここで たばこを すっては いけません。", "Không được hút thuốc ở đây."),
          ex("せんせい、ここで あそんでも いいですか。…いいえ、いけません。", "Thưa thầy, em chơi ở đây được không? …Không, không được."),
        ],
      },
      {
        pattern: "V て います (trạng thái · nghề nghiệp)",
        meaning: "Trạng thái kết quả, thói quen, công việc",
        notes: ["しって います (biết) — phủ định là しりません (không phải しって いません)."],
        examples: [
          ex("わたしは けっこんして います。", "Tôi đã kết hôn."),
          ex("わたしは IMCで はたらいて います。", "Tôi đang làm việc ở IMC."),
          ex("たなかさんの でんわばんごうを しって いますか。…いいえ、しりません。", "Bạn có biết số điện thoại của anh Tanaka không? …Không, tôi không biết."),
        ],
      },
      {
        pattern: "N に V (はいります, すわります, のります, のぼります)",
        meaning: "Vào / ngồi lên / lên (xe) / leo lên N",
        notes: ["に chỉ nơi người hoặc vật có mặt sau khi hành động kết thúc."],
        examples: [
          ex("ここに はいっては いけません。", "Không được vào đây."),
          ex("ここに すわっても いいですか。", "Tôi ngồi đây được không?"),
          ex("きょうとえきから 16ばんの バスに のって ください。", "Hãy lên xe buýt số 16 từ ga Kyoto."),
        ],
      },
      {
        pattern: "N1 に N2 を V (おきます, かきます)",
        meaning: "Đặt / viết N2 vào N1",
        examples: [
          ex("ここに くるまを とめて ください。", "Hãy đỗ xe ở đây."),
          ex("ここに じゅうしょを かいて ください。", "Hãy viết địa chỉ vào đây."),
        ],
      },
    ],
  },
  {
    id: 16,
    topic: "Nối câu · Trình tự hành động",
    points: [
      {
        pattern: "V て、［V て、］～",
        meaning: "Làm V1, rồi V2, rồi… (theo thứ tự)",
        notes: ["Thì của cả câu do động từ cuối câu quyết định."],
        examples: [
          ex("あさ ジョギングを して、シャワーを あびて、かいしゃへ いきます。", "Buổi sáng tôi chạy bộ, tắm rồi đi làm."),
          ex("こうべへ いって、えいがを みて、おちゃを のみました。", "Tôi đã đi Kobe, xem phim rồi uống trà."),
        ],
      },
      {
        pattern: "Aい (～い → ～くて)／Aな・N + で、～",
        meaning: "Nối tính từ, danh từ: … và …",
        notes: ["Không nối hai tính từ trái chiều đánh giá (tốt + xấu) — khi đó dùng が."],
        examples: [
          ex("ミラーさんは わかくて、げんきです。", "Anh Miller trẻ và khỏe."),
          ex("ならは しずかで、きれいな まちです。", "Nara là thành phố yên tĩnh và đẹp."),
          ex("カリナさんは インドネシアじんで、きょうとだいがくの りゅうがくせいです。", "Chị Karina là người Indonesia, là du học sinh ở ĐH Kyoto."),
        ],
      },
      {
        pattern: "V1 て から、V2",
        meaning: "Sau khi làm V1 thì làm V2",
        examples: [
          ex("くにへ かえって から、ちちの かいしゃで はたらきます。", "Sau khi về nước, tôi sẽ làm việc ở công ty của bố."),
          ex("コンサートが おわって から、レストランで しょくじしました。", "Sau khi buổi hòa nhạc kết thúc, chúng tôi ăn ở nhà hàng."),
        ],
      },
      {
        pattern: "N1 は N2 が A",
        meaning: "N1 thì N2 (tính từ) — miêu tả đặc điểm",
        examples: [
          ex("おおさかは たべものが おいしいです。", "Osaka đồ ăn ngon."),
          ex("マリアさんは かみが ながいです。", "Chị Maria tóc dài."),
        ],
      },
      {
        pattern: "N を V (でます, おります)",
        meaning: "Rời khỏi / xuống khỏi N",
        notes: ["を chỉ điểm xuất phát, nơi rời đi."],
        examples: [
          ex("7じに うちを でます。", "Tôi ra khỏi nhà lúc 7 giờ."),
          ex("うめだで でんしゃを おりました。", "Tôi đã xuống tàu ở Umeda."),
        ],
      },
      {
        pattern: "どうやって",
        meaning: "Bằng cách nào?",
        examples: [
          ex("だいがくまで どうやって いきますか。…きょうとえきから 16ばんの バスに のって、だいがくまえで おります。", "Đến trường đại học đi như thế nào? …Từ ga Kyoto lên xe buýt số 16, xuống ở trạm Trước trường."),
        ],
      },
      {
        pattern: "どの N",
        meaning: "N nào? (chọn trong 3 cái trở lên)",
        examples: [ex("サントスさんは どの ひとですか。…あの せが たかくて、かみが くろい ひとです。", "Anh Santos là người nào? …Là người cao, tóc đen kia.")],
      },
    ],
  },
  {
    id: 17,
    topic: "Thể ない · Bắt buộc · Không cần",
    points: [
      {
        pattern: "Thể ない",
        meaning: "Cách chia từ thể ます",
        table: {
          columns: ["Nhóm", "Cách chia", "Ví dụ"],
          rows: [
            ["I", "Âm hàng い → hàng あ + ない (い → わ)", "かきます → かかない, かいます → かわない"],
            ["II", "bỏ ます + ない", "たべます → たべない"],
            ["III", "", "します → しない, きます → こない"],
          ],
        },
        examples: [],
      },
      {
        pattern: "V ない で ください",
        meaning: "Xin đừng làm V",
        examples: [
          ex("ここで しゃしんを とらないで ください。", "Xin đừng chụp ảnh ở đây."),
          ex("わたしは げんきですから、しんぱいしないで ください。", "Tôi khỏe nên xin đừng lo lắng."),
        ],
      },
      {
        pattern: "V ない (bỏ い) ければ なりません",
        meaning: "Phải làm V",
        examples: [
          ex("くすりを のまなければ なりません。", "Phải uống thuốc."),
          ex("あしたまでに レポートを ださなければ なりません。", "Phải nộp báo cáo trước ngày mai."),
        ],
      },
      {
        pattern: "V ない (bỏ い) くても いいです",
        meaning: "Không làm V cũng được (không cần)",
        examples: [ex("あした こなくても いいです。", "Ngày mai không đến cũng được.")],
      },
      {
        pattern: "N (tân ngữ) は V",
        meaning: "Đưa tân ngữ lên làm chủ đề",
        notes: ["を được thay bằng は để nhấn mạnh hoặc nêu chủ đề."],
        examples: [ex("にもつは ここに おかないで ください。", "Hành lý thì xin đừng để ở đây.")],
      },
      {
        pattern: "N (thời gian) までに V",
        meaning: "Làm V trước (hạn) N",
        notes: ["まで: hành động kéo dài liên tục đến N. までに: hạn chót, xong trước N."],
        examples: [
          ex("かいぎは 5じまでに おわります。", "Cuộc họp sẽ kết thúc trước 5 giờ."),
          ex("どようびまでに ほんを かえさなければ なりません。", "Phải trả sách trước thứ Bảy."),
        ],
      },
    ],
  },
  {
    id: 18,
    topic: "Thể từ điển · Khả năng · Sở thích",
    points: [
      {
        pattern: "Thể từ điển (thể る)",
        meaning: "Cách chia từ thể ます",
        table: {
          columns: ["Nhóm", "Cách chia", "Ví dụ"],
          rows: [
            ["I", "Âm hàng い → hàng う", "かきます → かく, のみます → のむ"],
            ["II", "bỏ ます + る", "たべます → たべる"],
            ["III", "", "します → する, きます → くる"],
          ],
        },
        examples: [],
      },
      {
        pattern: "N／V る こと が できます",
        meaning: "Có thể làm V / có thể N",
        examples: [
          ex("ミラーさんは かんじを よむ ことが できます。", "Anh Miller có thể đọc chữ Hán."),
          ex("カードで はらう ことが できます。", "Có thể trả bằng thẻ."),
          ex("わたしは ピアノが できます。", "Tôi biết chơi piano."),
        ],
      },
      {
        pattern: "わたしの しゅみは N／V る こと です",
        meaning: "Sở thích của tôi là …",
        examples: [
          ex("わたしの しゅみは おんがくです。", "Sở thích của tôi là âm nhạc."),
          ex("わたしの しゅみは おんがくを きく ことです。", "Sở thích của tôi là nghe nhạc."),
        ],
      },
      {
        pattern: "V1 る／N の／khoảng thời gian  まえに、V2",
        meaning: "Trước khi V1 / trước N / … trước, làm V2",
        notes: ["Động từ trước まえに luôn ở thể từ điển, kể cả khi câu ở quá khứ."],
        examples: [
          ex("ねる まえに、ほんを よみます。", "Trước khi ngủ tôi đọc sách."),
          ex("しょくじの まえに、てを あらいます。", "Trước bữa ăn tôi rửa tay."),
          ex("たなかさんは 1じかん まえに、でかけました。", "Anh Tanaka đã ra ngoài cách đây 1 tiếng."),
        ],
      },
      {
        pattern: "なかなか ～ません",
        meaning: "Mãi mà không… / khó mà…",
        examples: [ex("にほんでは なかなか うまを みる ことが できません。", "Ở Nhật khó mà thấy được ngựa.")],
      },
      {
        pattern: "ぜひ",
        meaning: "Nhất định, rất muốn",
        notes: ["Đi với ～たいです, ～て ください."],
        examples: [ex("ぜひ ほっかいどうへ いきたいです。", "Tôi rất muốn đi Hokkaido.")],
      },
    ],
  },
  {
    id: 19,
    topic: "Thể た · Kinh nghiệm · Thay đổi",
    points: [
      {
        pattern: "Thể た",
        meaning: "Chia giống thể て, đổi て → た, で → だ",
        table: {
          columns: ["Thể て", "→ Thể た"],
          rows: [
            ["かいて, かって, かして", "かいた, かった, かした"],
            ["のんで, いそいで", "のんだ, いそいだ"],
            ["たべて, して, きて", "たべた, した, きた"],
          ],
        },
        examples: [],
      },
      {
        pattern: "V た ことが あります",
        meaning: "Đã từng làm V",
        examples: [
          ex("うまに のった ことが あります。", "Tôi đã từng cưỡi ngựa."),
          ex("ほっかいどうへ いった ことが ありますか。…いいえ、いちども ありません。", "Bạn đã từng đi Hokkaido chưa? …Chưa, chưa lần nào."),
        ],
      },
      {
        pattern: "V1 た り、V2 た り します",
        meaning: "Lúc thì V1, lúc thì V2 / làm những việc như V1, V2",
        notes: ["Chỉ liệt kê vài hành động tiêu biểu, không theo thứ tự."],
        examples: [ex("にちようびは テニスを したり、えいがを みたり します。", "Chủ nhật tôi chơi tennis, xem phim…")],
      },
      {
        pattern: "Aい (～い → ～く)／Aな・N + に  なります",
        meaning: "Trở nên / trở thành …",
        examples: [
          ex("さむく なります。", "Trời trở nên lạnh."),
          ex("げんきに なりました。", "Tôi đã khỏe lại."),
          ex("らいねん 25さいに なります。", "Sang năm tôi 25 tuổi."),
        ],
      },
    ],
  },
  {
    id: 20,
    topic: "Thể thông thường",
    points: [
      {
        pattern: "Thể lịch sự ↔ thể thông thường",
        meaning: "Bảng đối chiếu",
        table: {
          columns: ["", "Hiện tại khẳng định", "Hiện tại phủ định", "Quá khứ khẳng định", "Quá khứ phủ định"],
          rows: [
            ["Động từ", "いく", "いかない", "いった", "いかなかった"],
            ["Tính từ い", "おおきい", "おおきくない", "おおきかった", "おおきくなかった"],
            ["Tính từ な", "きれいだ", "きれいじゃ ない", "きれいだった", "きれいじゃ なかった"],
            ["Danh từ", "あめだ", "あめじゃ ない", "あめだった", "あめじゃ なかった"],
          ],
        },
        examples: [],
      },
      {
        pattern: "Khi nào dùng thể thông thường",
        meaning: "Nói với người thân thiết, viết văn",
        notes: [
          "Lịch sự (です／ます): với người mới gặp, người trên, người không thân.",
          "Thông thường: với bạn bè, gia đình, đồng nghiệp thân; trong báo, nhật ký, luận văn.",
        ],
        examples: [],
      },
      {
        pattern: "Hội thoại thể thông thường",
        meaning: "Những điểm thay đổi khi nói chuyện thân mật",
        notes: [
          "Câu hỏi thường bỏ か, chỉ lên giọng cuối câu.",
          "Với danh từ, tính từ な: bỏ だ khi hỏi và trả lời (ひま？ — うん、ひま。).",
          "Trợ từ は, を, へ thường được lược bỏ.",
          "はい → うん, いいえ → ううん. が (nhưng) → けど.",
        ],
        examples: [
          ex("コーヒーを のむ？…うん、のむ。", "Uống cà phê không? …Ừ, uống."),
          ex("あした ひま？…うん、ひま。", "Mai rảnh không? …Ừ, rảnh."),
          ex("その カレー、おいしい？…うん、からいけど、おいしい。", "Món cà ri đó ngon không? …Ừ, cay nhưng ngon."),
        ],
      },
    ],
  },
  {
    id: 21,
    topic: "Ý kiến · Lời nói · Xác nhận",
    points: [
      {
        pattern: "Thể thông thường と おもいます",
        meaning: "Tôi nghĩ rằng …",
        notes: ["Hỏi ý kiến: N に ついて どう おもいますか.", "Phủ định: ～ないと おもいます."],
        examples: [
          ex("あした あめが ふると おもいます。", "Tôi nghĩ ngày mai trời sẽ mưa."),
          ex("テレーザちゃんは もう ねたと おもいます。", "Tôi nghĩ bé Teresa ngủ rồi."),
          ex("しんかんせんに ついて どう おもいますか。…はやくて、べんりだと おもいます。", "Bạn nghĩ gì về tàu Shinkansen? …Tôi nghĩ nó nhanh và tiện."),
        ],
      },
      {
        pattern: "「câu」／thể thông thường と いいます",
        meaning: "Nói rằng …",
        examples: [
          ex("ねる まえに、「おやすみなさい」と いいます。", "Trước khi ngủ người ta nói \"Oyasumi nasai\"."),
          ex("ミラーさんは らいしゅう とうきょうへ しゅっちょうすると いいました。", "Anh Miller nói rằng tuần sau sẽ đi công tác Tokyo."),
        ],
      },
      {
        pattern: "Thể thông thường でしょう？",
        meaning: "… phải không? (xác nhận, lên giọng)",
        notes: ["Với danh từ, tính từ な: bỏ だ (ひまでしょう？)."],
        examples: [
          ex("あした パーティーに いくでしょう？…ええ、いきます。", "Mai anh đi dự tiệc phải không? …Vâng, tôi đi."),
          ex("ほっかいどうは さむかったでしょう？…いいえ、そんなに さむくなかったです。", "Hokkaido lạnh lắm phải không? …Không, không lạnh lắm."),
        ],
      },
      {
        pattern: "N1 (địa điểm) で N2 が あります",
        meaning: "Ở N1 có / diễn ra N2 (sự kiện)",
        examples: [ex("とうきょうで にほんと ブラジルの サッカーの しあいが あります。", "Ở Tokyo có trận bóng đá giữa Nhật và Brazil.")],
      },
      {
        pattern: "N (tình huống) で",
        meaning: "Trong / tại (cuộc họp, bữa tiệc…)",
        examples: [ex("かいぎで なにか いけんを いいましたか。…いいえ、なにも いいませんでした。", "Trong cuộc họp bạn có nói ý kiến gì không? …Không, tôi không nói gì cả.")],
      },
      {
        pattern: "N でも V ませんか",
        meaning: "… hay gì đó nhé? (gợi ý nhẹ nhàng)",
        examples: [ex("ちょっと ビールでも のみませんか。", "Đi uống chút bia hay gì đó không?")],
      },
    ],
  },
  {
    id: 22,
    topic: "Mệnh đề bổ nghĩa cho danh từ",
    points: [
      {
        pattern: "Thể thông thường + N",
        meaning: "Mệnh đề đứng trước để bổ nghĩa cho danh từ",
        notes: [
          "Động từ, tính từ trong mệnh đề ở thể thông thường. Tính từ な giữ な, danh từ dùng の.",
          "Chủ ngữ trong mệnh đề dùng が (không dùng は).",
        ],
        table: {
          columns: ["Mệnh đề", "+ Danh từ", "Nghĩa"],
          rows: [
            ["きょうとへ いく", "ひと", "người (sẽ) đi Kyoto"],
            ["きょうとへ いかない", "ひと", "người không đi Kyoto"],
            ["きょうとへ いった", "ひと", "người đã đi Kyoto"],
            ["めがねを かけて いる", "ひと", "người đang đeo kính"],
          ],
        },
        examples: [
          ex("これは ミラーさんが すんで いた うちです。", "Đây là ngôi nhà anh Miller đã từng sống."),
          ex("あそこで しゃしんを とって いる ひとは だれですか。", "Người đang chụp ảnh ở đằng kia là ai?"),
          ex("わたしは カリナさんが かいた えが すきです。", "Tôi thích bức tranh chị Karina vẽ."),
        ],
      },
      {
        pattern: "V る  じかん／やくそく／ようじ",
        meaning: "Thời gian / cuộc hẹn / việc bận để làm V",
        examples: [
          ex("わたしは あさ ごはんを たべる じかんが ありません。", "Buổi sáng tôi không có thời gian ăn sáng."),
          ex("わたしは ともだちと えいがを みる やくそくが あります。", "Tôi có hẹn đi xem phim với bạn."),
          ex("きょうは しやくしょへ いく ようじが あります。", "Hôm nay tôi có việc phải đến văn phòng thành phố."),
        ],
      },
    ],
  },
  {
    id: 23,
    topic: "Khi · Hễ … thì",
    points: [
      {
        pattern: "V る／V ない／Aい／Aな な／N の  とき、～",
        meaning: "Khi …",
        examples: [
          ex("としょかんで ほんを かりる とき、カードが いります。", "Khi mượn sách ở thư viện thì cần thẻ."),
          ex("ひまな とき、うちで ビデオを みます。", "Lúc rảnh tôi xem video ở nhà."),
          ex("こどもの とき、よく かわで およぎました。", "Hồi nhỏ tôi hay bơi ở sông."),
        ],
      },
      {
        pattern: "V る とき／V た とき",
        meaning: "Khi (sắp) làm V / khi (đã) làm V xong",
        notes: [
          "V る とき: hành động ở mệnh đề chính xảy ra trước V.",
          "V た とき: hành động ở mệnh đề chính xảy ra sau khi V đã xong.",
        ],
        examples: [
          ex("くにへ かえる とき、かばんを かいます。", "Trước khi về nước tôi mua cặp (mua ở đây)."),
          ex("くにへ かえった とき、かばんを かいます。", "Khi đã về đến nước tôi mua cặp (mua ở quê)."),
        ],
      },
      {
        pattern: "V る と、～",
        meaning: "Hễ V thì … (kết quả tất yếu, chỉ đường)",
        notes: ["Mệnh đề sau không dùng ý chí, mong muốn, nhờ vả."],
        examples: [
          ex("この ボタンを おすと、おつりが でます。", "Hễ nhấn nút này thì tiền thừa sẽ ra."),
          ex("これを まわすと、おとが おおきく なります。", "Vặn cái này thì âm thanh sẽ to lên."),
          ex("みぎへ まがると、ゆうびんきょくが あります。", "Rẽ phải thì có bưu điện."),
        ],
      },
      {
        pattern: "N (địa điểm) を V (di chuyển)",
        meaning: "Đi qua / dạo quanh N",
        notes: ["Đi với さんぽします, わたります, まがります…"],
        examples: [
          ex("こうえんを さんぽします。", "Tôi đi dạo trong công viên."),
          ex("みちを わたります。", "Tôi băng qua đường."),
          ex("かどを みぎへ まがります。", "Rẽ phải ở góc đường."),
        ],
      },
    ],
  },
  {
    id: 24,
    topic: "Cho nhận hành động",
    points: [
      {
        pattern: "くれます",
        meaning: "(Người khác) cho tôi / người nhà tôi",
        notes: ["あげます: mình (hoặc người khác) cho người khác. くれます: người khác cho mình."],
        examples: [
          ex("さとうさんは わたしに クリスマスカードを くれました。", "Chị Sato đã tặng tôi thiệp Giáng sinh."),
          ex("ははは いもうとに おかしを くれました。", "Mẹ đã cho em gái tôi bánh kẹo."),
        ],
      },
      {
        pattern: "V て あげます／もらいます／くれます",
        meaning: "Làm V cho ai / được ai làm V cho / ai làm V cho mình",
        notes: [
          "V て あげます với người trên có thể gây cảm giác kẻ cả — nên dùng ～ましょうか.",
          "V て もらいます / くれます thể hiện lòng biết ơn.",
        ],
        examples: [
          ex("わたしは きむらさんに ほんを かして あげました。", "Tôi đã cho chị Kimura mượn sách."),
          ex("わたしは やまださんに としょかんの でんわばんごうを おしえて もらいました。", "Tôi đã được anh Yamada chỉ cho số điện thoại thư viện."),
          ex("ははは［わたしに］セーターを おくって くれました。", "Mẹ đã gửi áo len cho tôi."),
        ],
      },
      {
        pattern: "N1 は N2 が V",
        meaning: "N1 thì (chính) N2 đã làm V",
        notes: ["Nhấn mạnh người thực hiện hành động (N2 là chủ ngữ, dùng が)."],
        examples: [
          ex("すてきな ネクタイですね。…ええ、さとうさんが くれました。", "Cà vạt đẹp nhỉ. …Vâng, chị Sato tặng tôi đấy."),
          ex("おいしい ケーキですね。…この ケーキは ワンさんが つくりました。", "Bánh ngon nhỉ. …Bánh này là anh Wang làm đấy."),
        ],
      },
    ],
  },
  {
    id: 25,
    topic: "Điều kiện · Nhượng bộ",
    points: [
      {
        pattern: "Thể thông thường quá khứ + ら、～",
        meaning: "Nếu … thì … (giả định)",
        notes: ["Mệnh đề sau có thể dùng ý chí, mong muốn, nhờ vả, mời rủ."],
        examples: [
          ex("おかねが あったら、りょこうします。", "Nếu có tiền thì tôi sẽ đi du lịch."),
          ex("やすかったら、パソコンを かいたいです。", "Nếu rẻ thì tôi muốn mua máy tính."),
          ex("いい てんきだったら、さんぽしませんか。", "Nếu trời đẹp thì đi dạo không?"),
        ],
      },
      {
        pattern: "V たら、～",
        meaning: "Sau khi / khi V (việc chắc chắn sẽ xảy ra)",
        examples: [
          ex("10じに なったら、でかけましょう。", "Đến 10 giờ thì chúng ta đi nhé."),
          ex("うちへ かえったら、すぐ シャワーを あびます。", "Về đến nhà là tôi tắm ngay."),
        ],
      },
      {
        pattern: "V て／Aい (～くて)／Aな・N + で  も、～",
        meaning: "Dù … cũng …",
        examples: [
          ex("あめが ふっても、せんたくします。", "Dù trời mưa tôi cũng giặt đồ."),
          ex("やすくても、わたしは グループりょこうが きらいです。", "Dù rẻ tôi cũng không thích du lịch theo đoàn."),
          ex("にちようびでも、はたらきます。", "Dù là Chủ nhật tôi cũng làm việc."),
        ],
      },
      {
        pattern: "もし ～たら／いくら ～ても",
        meaning: "Nếu như … / Dù … bao nhiêu đi nữa",
        notes: ["もし nhấn mạnh giả định; いくら nhấn mạnh mức độ."],
        examples: [
          ex("もし 1おくえん あったら、いろいろな くにを りょこうしたいです。", "Nếu có 100 triệu yên, tôi muốn du lịch nhiều nước."),
          ex("いくら かんがえても、わかりません。", "Nghĩ mãi mà vẫn không hiểu."),
        ],
      },
      {
        pattern: "Chủ ngữ trong mệnh đề phụ dùng が",
        meaning: "～たら, ～ても, ～とき, ～と, ～まえに",
        examples: [ex("ともだちが きたら、いっしょに でかけます。", "Bạn đến thì chúng tôi cùng đi chơi.")],
      },
    ],
  },
];
