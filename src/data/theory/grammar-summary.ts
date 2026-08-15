/**
 * Condensed grammar-pattern cheat sheet for Bài 1–25 (みんなの日本語).
 * This is a standalone quick-reference dataset, independent from the
 * per-lesson `Lesson`/`ContentBlock` model in `@/lib/theory` — it only
 * powers the /theory/summary overview page and does not require a lesson
 * to have full vocab/translation/exercise data.
 *
 * Any `{{...}}` inside a line is an inline Vietnamese gloss/annotation and
 * is rendered in a distinct (italic, muted) style by the summary view.
 */

export type ExampleLineKind = "jp" | "response" | "note";

export interface SummaryExampleLine {
  kind: ExampleLineKind;
  text: string;
}

export interface SummaryExampleItem {
  lines: SummaryExampleLine[];
}

export interface SummaryKanaTable {
  kind: "kana";
  rows: (string | null)[][];
}

export interface SummaryNoteTable {
  kind: "note";
  text: string;
}

export type SummaryTable = SummaryKanaTable | SummaryNoteTable;

export type SummaryCardBlock =
  | { type: "notes"; lines: string[] }
  | { type: "pattern"; lines: string[] }
  | { type: "table"; table: SummaryTable }
  | { type: "examples"; label?: string; items: SummaryExampleItem[] };

export interface SummaryCard {
  blocks: SummaryCardBlock[];
}

export interface SummaryLesson {
  id: number;
  badge: string;
  heading: string;
  cards: SummaryCard[];
}

// ---- small builders to keep the data below readable ----------------------

function notes(...lines: string[]): SummaryCardBlock {
  return { type: "notes", lines };
}
function pattern(...lines: string[]): SummaryCardBlock {
  return { type: "pattern", lines };
}
function kana(rows: (string | null)[][]): SummaryCardBlock {
  return { type: "table", table: { kind: "kana", rows } };
}
function noteTable(text: string): SummaryCardBlock {
  return { type: "table", table: { kind: "note", text } };
}
function examplesBlock(items: SummaryExampleItem[], label = "Ví dụ"): SummaryCardBlock {
  return { type: "examples", label, items };
}
function J(text: string): SummaryExampleLine {
  return { kind: "jp", text };
}
function R(text: string): SummaryExampleLine {
  return { kind: "response", text };
}
function N(text: string): SummaryExampleLine {
  return { kind: "note", text };
}
function itm(...lines: SummaryExampleLine[]): SummaryExampleItem {
  return { lines };
}
function card(...blocks: SummaryCardBlock[]): SummaryCard {
  return { blocks };
}

// ---- data ------------------------------------------------------------

export const grammarSummaryLessons: SummaryLesson[] = [
  {
    id: 1,
    badge: "Bài 1",
    heading: "第1課 · だい1か",
    cards: [
      card(
        notes("Trọc âm", "が　Tenten", "ぴ　maru"),
        kana([
          ["K", "g", "が", "ぎ", "ぐ", "げ", "ご"],
          ["S", "z", "ざ", "じ", "ず", "ぜ", "ぞ"],
          ["T", "đ", "だ", "ぢ", "づ", "で", "ど"],
          ["H", "b", "ば", "び", "ぶ", "べ", "ぼ"],
          ["H", "p", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
        ])
      ),
      card(
        notes(
          "Ghép い",
          "ghép được với 3 cột あうお{{bao gồm luôn bảng trọc âm}}",
          "ngoại trừ を、ん"
        ),
        kana([
          [null, "あい", "い", "う", "え", "お"],
          [null, "か", "き", "く", "け", "こ"],
          [null, "さ", "し", "すい", "せ", "そ"],
          [null, "たい", "ち", "つ", "て", "と"],
          [null, "ない", "に", "ぬ", "ね", "の"],
          [null, "は", "ひ", "ふ", "へ", "ほ"],
          [null, "まい", "み", "むい", "め", "もい"],
          [null, "や", null, "ゆ", null, "よ"],
          [null, "ら", "り", "る", "れ", "ろ"],
        ]),
        pattern("わ　　　　を", "ん")
      ),
      card(
        notes(
          "Ghép ん",
          "ん ghép được với tất cả những chữ trong bảng chữ{{bao gồm bảng trọc âm}}　ngoại trừ を　và chính nó．",
          "Đa số đọc là n",
          "Đọc là m khi đứng trước 15 âm môi"
        ),
        pattern("ま　み　む　め　も", "ば　び　ぶ　べ　ぼ", "ぱ　ぴ　ぷ　ぺ　ぽ"),
        examplesBlock([itm(J("にほん")), itm(J("こんばん"))])
      ),
      card(
        notes("Xúc âm つ (促音)"),
        examplesBlock([
          itm(J("きって"), N("kit　te")),
          itm(J("ざっし"), N("zas　shi")),
        ])
      ),
      card(
        notes(
          "Trường âm",
          "5 nguyên âm chính あいうえお làm trường âm cho nó và cột của chính nó ngoại trừ を、ん",
          "い còn làm trường âm cho cột え",
          "う   ……………　お"
        ),
        examplesBlock([itm(J("おかあさん")), itm(J("おとうさん"))]),
        kana([
          [null, "ああ", "い", "う", "ええ/い", "お", null],
          [null, "かあ", "き", "く", "け", null, "こ"],
          [null, "さ", "し", "す", "せい", null, "そ"],
          [null, "た", "ち", "つ", "て", null, "と"],
          [null, "な", "に", "ぬ", "ね", null, "の"],
          [null, "はあ", "ひ", "ふ", "へ", null, "ほ"],
          [null, "ま", "み", "む", "め", null, "も"],
          [null, "や", null, "ゆ", null, null, "よ"],
          [null, "ら", "り", "る", "れ", null, "ろ"],
        ]),
        pattern("わ　　　　を", "ん")
      ),
      card(
        pattern("N1は　N2です。"),
        notes("N1 là N2", "N : danh từ", "は　là trợ từ, đọc biến âm là わ"),
        examplesBlock([itm(J("わたしは　せんせいです。"))])
      ),
      card(
        pattern("N1は　N2　では　ありません。{{văn viết}}", "じゃ　ありません。{{văn nói}}"),
        notes("N1 không phải là N2", "N : danh từ", "は　là trợ từ, đọc biến âm là わ"),
        examplesBlock([
          itm(J("わたしは　いしゃでは　ありません。")),
          itm(J("わたしは　いしゃじゃ　ありません。")),
        ])
      ),
      card(
        notes("1．Câu hỏi xác nhận thông tin."),
        pattern(
          "N1は　N2　ですか。{{N1 có phải là N2 không?}}",
          "はい、…です。{{Vâng,…}}",
          "はい、そうです。{{Vâng, đúng vậy}}",
          "いいえ、…では{{じゃ}}ありません。{{không,…}}",
          "いいえ、そうでは{{じゃ}}ありません。{{không, không phải vậy}}",
          "いいえ、ちがいます。{{không, sai rồi}}"
        ),
        examplesBlock([
          itm(
            J("１．さくらさんは　がくせいですか。"),
            R("…はい、{{さくらさんは}}　がくせいです。"),
            R("…いいえ、{{さくらさんは}}　がくせいでは　ありません。")
          ),
        ])
      ),
      card(
        notes("2．Câu hỏi có nghi vấn từ:"),
        examplesBlock([
          itm(J("あのひとは　だれですか。"), R("…{{あのひとは}}　イーさんです。")),
          itm(
            N("3．Câu hỏi lựa chọn: {{hay là/ hoặc là}}"),
            J("N1 ですか、N2 ですか。"),
            R("…N1/ N2です。")
          ),
          itm(J("ボールペンですか、シャープペンシルですか。"), R("…シャープペンシルです。")),
        ])
      ),
      card(
        notes("も：cũng {{trợ từ}}"),
        examplesBlock([
          itm(J("わたしは　ぎんこういんです。"), J("あなたも　ぎんこういんですか。")),
          itm(
            N("N1のN2"),
            N("の là trợ từ dùng để nối 2 danh từ, danh từ 2 là danh từ chính.")
          ),
          itm(J("さくらだいがくのきょうしです。")),
        ])
      ),
    ],
  },
  {
    id: 2,
    badge: "Bài 2",
    heading: "第2課 · だい2か",
    cards: [
      card(
        kana([["これ", "は　N{{đồ vật}}です。", "cái này 　là N{{đồ vật}}"]]),
        notes("それ 　　　　cái đó", "あれ 　　　　cái kia"),
        kana([[null, null, "なん", null, "か。", null, null, "Cái gì?"]]),
        notes(
          "N{{đồ vật}}は  これです。		N{{đồ vật}} là 　cái này",
          "それ 　　cái đó",
          "あれ 　　cái kia",
          "どれ　　か。 　　Cái nào?"
        ),
        examplesBlock([
          itm(J("これは　かぎです。")),
          itm(J("かぎは　これです。")),
        ])
      ),
      card(
        notes(
          "N1のN2",
          "Trực thuộc: さくらだいがくのがくせいです。Sinh viên trường đại học Sakura.",
          "Bổ nghĩa: にほんごのほんです。　　Sách Tiếng Nhật",
          "なん　か。 Sách gì?"
        ),
        kana([
          ["Sở hữu:", "わたしのほんです。", "Sách của tôi.", null, null, null, null],
          [null, null, "だれ", null, null, "か。", "Sách của ai？"],
        ]),
        pattern(
          "このほんは　わたしのほんです。",
          "このほんは　わたしのです。",
          "このほんは　だれのですか。",
          "…　わたしのです。"
        )
      ),
    ],
  },
  {
    id: 3,
    badge: "Bài 3",
    heading: "第3課 · だい3か",
    cards: [
      card(
        pattern(
          "ここ／そこ／あそこは　N{{địa điểm}} です。",
          "N{{địa điểm}}は　ここ／そこ／あそこです。",
          "どこ　か。"
        ),
        notes(
          "Chỗ này/chỗ đó/chỗ kia là N{{địa điểm}}",
          "N{{địa điểm}} là{{ở}} chỗ này/chỗ đó/chỗ kia",
          "chỗ nào?"
        ),
        examplesBlock([
          itm(J("1．ここは　きょうしつです。")),
          itm(J("2．きょうしつは　ここです。")),
        ])
      ),
      card(
        notes("N1{{ vật/ người/ địa điểm}} は　N2{{địa điểm}} です。"),
        pattern("どこ　か。"),
        notes("N1 {{ vật/ người/ địa điểm}} ở  N2 {{địa điểm}}", "chỗ nào?"),
        examplesBlock([
          itm(J("1．くるまの　かぎは　へやです。")),
          itm(J("2．Aさんは　うけつけです。")),
          itm(J("3．トイレは　いっかいです。")),
        ])
      ),
      card(
        notes("N1{{Tên nước/ công ty}}の　N2{{sản phẩm}}"),
        pattern("どこ　か。"),
        notes("Sản phẩm được sản xuất ở 1 nước / công ty nào đó．"),
        examplesBlock([
          itm(J("にほんのとけいです。")),
          itm(J("ドイツの　じどうしゃです。")),
        ])
      ),
      card(
        pattern(
          "おくには　どちらですか。",
          "…{{くには}}　にほんです。",
          "かいしゃ{{がっこう}}は　どちらですか。",
          "…{{かいしゃは}}　IMCです。"
        )
      ),
    ],
  },
  {
    id: 4,
    badge: "Bài 4",
    heading: "第4課 · だい4か",
    cards: [
      card(
        notes(
          "Ｖ　ます。Hiện tại, tương lai khẳng định",
          "ません。Hiện tại, tương lai phủ định",
          "ました。Quá khứ khẳng định"
        ),
        pattern("ませんでした。Quá khứ phủ định"),
        examplesBlock([
          itm(
            N("はたらきます。{{làm việc, sẽ làm việc}}"),
            N("はたらきません。{{không làm việc, sẽ không làm việc}}"),
            J("はたらきました。{{đã làm việc}}"),
            J("はたらきませんでした。{{đã không làm việc}}")
          ),
        ])
      ),
      card(
        notes(
          "Danh từ chỉ thời gian xác định に",
          "Danh từ chỉ thời gian không xác định 　X",
          "{{ bảng trang 173}}",
          "Từ …đến…:　…から　…まで"
        )
      ),
      card(
        pattern(
          "ぎんこうは　なんじから　なんじまで　ですか。",
          "…７じから　４じはんまで　です。",
          "ぎんこうは　なんじから　ですか。",
          "…７じから　です。",
          "ぎんこうは　なんじまで　ですか。",
          "… ４じはんまで　です。",
          "なんじから　なんじまで　はたらきますか。",
          "…８じから　５じまで　はたらきます。",
          "けさ　なんじに　おきましたか。",
          "…けさ　５じに　おきました。"
        )
      ),
    ],
  },
  {
    id: 5,
    badge: "Bài 5",
    heading: "第5課 · だい5か",
    cards: [
      card(
        notes(
          "Sは　N xác định　に　người/vậtと　phương tiệnで　địa điểmへ　いきます。",
          "N ko xác định X　　　　　　きます。"
        ),
        pattern("…から…まで　　かえります。"),
        kana([[null, null, null, "ひとりで", "と　　あるいてで", "どこ（へ）も　いきません。"]]),
        pattern("いきませんでした。"),
        kana([[null, "いつ", null, "だれと", null, "なんで", null, "どこへ", "か。"]]),
        pattern("（なんじ、", "なんがつ、", "なんにち、"),
        notes("…）"),
        examplesBlock([
          itm(
            J("わたしは　らいねん　ともだちと　ひこうきで　にほんへ　いきます。"),
            J("らいねん　わたしは　ともだちと　ひこうきで　にほんへ　いきます。")
          ),
        ])
      ),
    ],
  },
  {
    id: 6,
    badge: "Bài 6",
    heading: "第6課 · だい6か",
    cards: [
      card(
        notes("1.	N を　V{{ Tha động từ/ ngoại động từ}}"),
        examplesBlock([
          itm(J("やさいを　たべます。{{ăn rau}}"), N("なに　か。{{ăn cái gì?}}"), J("なにも　たべません。{{không ăn gì cả}}")),
          itm(J("ひとに　あいます。{{gặp…}}"), N("だれ　か。{{gặp ai?}}"), J("だれにも　あいません。{{không gặp ai cả}}")),
          itm(N("2.	Nを　します。{{làm/chơi…}}")),
          itm(J("しゅくだいを　します。{{làm bài tập}}"), N("なに　か。{{làm cái gì?}}"), J("なにも　しません。{{không làm gì cả}}")),
        ])
      ),
      card(
        notes("3. Ｎ{{địa điểm}} で　V{{hành động}}"),
        examplesBlock([
          itm(J("うちで　べんきょうします。"), J("どこ　か。")),
          itm(J("4．Vます　ませんか。Rủ rê"), J("ましょう。")),
          itm(
            J("いっしょに　えいがを　みませんか。"),
            J("はい{{ええ}}、みましょう。"),
            J("はい{{ええ}}、いいですね。"),
            J("はい{{ええ}}、いいですよ。"),
            J("すみません。ちょっと…")
          ),
        ])
      ),
      card(
        pattern("なんと", "なんの", "なんで　{{なにで}}", "なんさい"),
        notes("Còn lại là なに")
      ),
      card(
        notes(
          "Sは　N xác định　に　người/vậtと　phương tiệnで　địa điểmへ　いきます。",
          "N ko xác định X　　　　　　きます。"
        ),
        pattern("…から…まで　　かえります。"),
        kana([[null, null, null, "ひとりで", "と　　あるいてで", "どこ（へ）も　いきません。"]]),
        pattern("いきませんでした。"),
        kana([[null, "いつ", null, "だれと", null, "なんで", null, "どこへ", "か。"]]),
        pattern("（なんじ、　なにで", "なんがつ、", "なんにち、"),
        notes("…）"),
        examplesBlock([
          itm(J("わたしは　らいねん　ともだちと　ひこうきで　にほんへ　いきます。")),
        ])
      ),
    ],
  },
  {
    id: 7,
    badge: "Bài 7",
    heading: "第7課 · だい7か",
    cards: [
      card(
        examplesBlock([
          itm(J("1．はしで　たべます。")),
          itm(J("2．にほんごで　レポートを　かきます。")),
        ]),
        noteTable("N {{ công cụ, dung cụ}}で　V なんで　. Bằng")
      ),
      card(
        noteTable(
          "「Từ/ Câu」 は…ごで　なんですか。 …です。 「Từ/ Câu」 tiếng… nói thế nào? nói là… Hỏi 1 từ/ 1 câu được diễn tả như thế nào bằng ngôn ngữ khác."
        ),
        examplesBlock([
          itm(J("1．「ありがとう」　は　ベトナムごで　なんですか。"), R("…　cảm ơn です。")),
          itm(J("2．「Chào buổi sáng」は　にほんごで　なんですか。"), R("…   おはようございます　です。")),
        ])
      ),
      card(
        pattern("S は　ひとに　もの{{ ĐỒ VẬT}} を　あげます。", "わたし"),
        notes(
          "。Mình tặng/ cho/ biếu người khác 1 đồ vật.",
          "。Người khác tặng/ cho/ biếu người khác 1 đồ vật."
        ),
        examplesBlock([
          itm(J("1．わたしは　たなかさんに　にほんごのほんを　あげます。")),
          itm(J("2．やまださんは　きむらさんに　はなを　あげました。")),
          itm(
            J("ひとに　ものを　かします。{{cho ai mượn cái gì}}"),
            N("おしえます。{{dạy cái gì cho ai}}"),
            N("かきます。{{viết cái gì cho ai}}"),
            N("おくります。{{gửi cái gì cho ai}}"),
            J("ひとに　でんわを　かけます。{{gọi điện thoại cho ai}}"),
            J("でんわします。")
          ),
        ])
      ),
      card(
        pattern("S は　人に/から　もの{{ ĐỒ VẬT}} を　もらいます。", "わたし"),
        notes(
          "。Mình nhận từ người khác 1 đồ vật.",
          "。Người khác nhận từ  người khác 1 đồ vật."
        ),
        examplesBlock([
          itm(J("1．わたしは　ちちに　とけいを　もらいました。")),
          itm(J("2．きむらさんは　やまださんに　はなを　もらいました。")),
          itm(N("Tổ chức")),
          itm(
            J("人に/から　ものを　かります。{{mượn cái gì từ ai}}"),
            N("ならいます。{{học cái gì từ ai}}")
          ),
          itm(N("Tổ chức")),
        ])
      ),
      card(
        noteTable(
          "S 　は　{{わたしに}}　もの{{ ĐỒ VẬT}} を　くれます。 わたし だれが 。người khác tặng/ cho/ biếu mình/người thân trong gia đình mình 1 đồ vật."
        ),
        examplesBlock([
          itm(J("1．さとうさんは  わたしに　シャツを　くれました。")),
          itm(J("2．きむらさんは　ちちに　ワインを　くれました。")),
        ])
      ),
      card(
        pattern(
          "もう、…ましたか。{{Đã… chưa?}}",
          "はい、もう　…ました。",
          "いいえ、まだです。",
          "はい、もう　たべました。",
          "いいえ、まだです。"
        )
      ),
    ],
  },
  {
    id: 8,
    badge: "Bài 8",
    heading: "第8課 · だい8か",
    cards: [
      card(pattern("Ｖ　ます。", "ません。", "ました。", "ませんでした。")),
      card(
        pattern("Aイ　です。", "Aイ　くないです。", "Aイ　かったです。", "Aイ　くなかったです。"),
        examplesBlock([
          itm(
            J("ひろいです。{{RỘNG}}"),
            J("ひろいくないです。"),
            J("ひろいかったです。"),
            J("ひろいくなかったです。")
          ),
          itm(J("いいです / よいです。"), J("よくないです"), J("よかったです。"), J("よくなかったです。")),
        ])
      ),
      card(
        pattern(
          "Aナ / N 　です。",
          "Aナ / N  　では{{じゃ}}ありません。",
          "Aナ / N 　でした。",
          "Aナ / N 　では{{じゃ}}ありませんでした。"
        ),
        examplesBlock([
          itm(
            J("ひま　です。"),
            J("ひま　では{{じゃ}}ありません。"),
            J("ひま　でした。"),
            J("ひま　では{{じゃ}}ありませんでした。"),
            J("がくせい　です。"),
            J("がくせい　では{{じゃ}}ありません。"),
            J("がくせい　でした。"),
            J("がくせい　では{{じゃ}}ありませんでした。")
          ),
        ])
      ),
      card(
        pattern("S は　　　A", "どうですか。", "どうでしたか。"),
        examplesBlock([
          itm(J("1．ワットせんせいは　しんせつです。")),
          itm(J("2．わたしの　へやは　ひろくないです。")),
          itm(
            J("3．A さんの　くには　あついですか。"),
            J("はい、あついです。"),
            J("いいえ、あつくないです/さむいです。")
          ),
        ])
      ),
      card(
        pattern("Aイ　　　　Ｎ", "Aナ　な", "どんな"),
        examplesBlock([
          itm(J("1．ワットせんせいは　しんせつなひとです。")),
          itm(J("2．ふじさんは　たかいやまです。")),
          itm(J("3. コーヒーは　おいしいです。"), J("おいしいコーヒーです。")),
        ])
      ),
      card(
        notes(
          "とても…　A{{KHẲNG ĐỊNH}}  : Rất",
          "あまり…   A{{PHỦ ĐỊNH}}       : Không…lắm",
          "Phó từ biểu thị mức độ, khi bổ nghĩa cho A thì đứng trước A"
        ),
        examplesBlock([
          itm(J("1．にほんは　とても　さむいです。")),
          itm(J("2．ベトナムは　あまり　さむくないです。")),
        ])
      ),
      card(
        pattern("。そして、…　{{và}}"),
        notes("…が、… 　{{nhưng}}"),
        pattern("。でも、", "。しかし、…"),
        notes("liên từ nối tiếp câu"),
        examplesBlock([
          itm(J("1．にほんのたべものは　おいしいです。そして、きれいです。")),
          itm(J("2．にほんのたべものは　おいしいですが、たかいです。")),
        ])
      ),
      card(
        pattern("これ", "それ", "あれ", "どれ", "この　　N", "その", "あの", "どの")
      ),
    ],
  },
  {
    id: 9,
    badge: "Bài 9",
    heading: "第9課 · だい9か",
    cards: [
      card(
        pattern(
          "N が	すきです。{{ Thích}}",
          "きらいです。{{ ghét }}",
          "じょうずです。{{ giỏi, khéo}}",
          "へたです。{{ kém, dở}}"
        ),
        examplesBlock([
          itm(J("わたしは　タイりょうりが　すきです。")),
          itm(J("だいすきです　＝　とても　すきです"), J("だいきらいです　＝　とても　きらいです")),
          itm(J("おとうと{{ em trai}}は　さかなが　だいきらいです。")),
          itm(J("どんなのみものが　すきですか。"), R("…ジュースが　すきです。")),
        ])
      ),
      card(
        kana([[null, null, null, "N が", "あります。", "(có, sở hữu)"]]),
        notes("わかります。{{hiểu, nắm được}}"),
        examplesBlock([
          itm(J("1. おかねが　あります。")),
          itm(J("2. にほんごが　わかります。")),
          itm(N("Phó từ đặt trước V để bổ nghĩa cho V")),
        ]),
        noteTable(
          "Chỉ mức độ (KĐ): よく／だいたい／すこし　わかります · (PĐ): あまり／ぜんぜん　わかりません　・　Chỉ số lượng (KĐ): たくさん／すこし　あります · (PĐ): あまり／ぜんぜん　ありません"
        ),
        notes("すこし、あまり、ぜんぜん　có thể dùng bổ nghĩa cho tính từ"),
        examplesBlock([
          itm(J("1. おかねが　ぜんぜん　ありません。")),
          itm(J("2. このえいがは　ぜんぜん　おもしろくないです。")),
        ])
      ),
      card(
        notes("6．Câu から"),
        pattern("どうして/ なぜ/　なんで"),
        examplesBlock([
          itm(
            J("じかんが　ありませんから、あさごはんを　たべません。"),
            J("あさごはんを　たべません。じかんが　ありませんから。")
          ),
          itm(J("どうして　あさごはんを　たべませんか。"), R("…じかんが　ありませんから。")),
          itm(J("A: 	きょう　はやく　かえります。"), J("B: 	どうしてですか。"), J("A: 	ようじが　ありますから。")),
        ])
      ),
    ],
  },
  {
    id: 10,
    badge: "Bài 10",
    heading: "第10課 · だい10か",
    cards: [
      card(
        notes(
          "N1{{ vật/ người/ địa điểm}} の　N2{{ vị trí}}",
          "N1{{ v/ n/ đđ}} とN2 {{ v/ n/ đđ}}の　あいだ"
        ),
        examplesBlock([
          itm(J("1．つくえのした")),
          itm(J("2．ぎんこうのちかく")),
          itm(J("3．Aさんと　Ｂさんの　あいだ")),
        ])
      ),
      card(
        pattern(
          "N{{ Địa điểm}}に　Ｎが　あります。",
          "なに",
          "だれ・　どんなどうぶつ　　　います。"
        ),
        examplesBlock([
          itm(J("1．じむしょ{{のなか}}に　ファクスが　あります。"), J("なに　か。")),
          itm(J("2．おくじょうに　イーさんが　います。"), J("だれ　か。")),
          itm(
            J("3．にわに　にわとりが　います。"),
            J("どんなどうぶつ　か。"),
            J("なにも　ありません"),
            J("だれも　いません"),
            J("どんなどうぶつも　いません")
          ),
        ])
      ),
      card(
        kana([["N( Địa điểm)に", "Ｎが", "あります。"]]),
        pattern("います。"),
        kana([
          ["Ｎは", null, "N( Địa điểm)に", "あります。", null, null],
          [null, null, null, "どこ", "に", "います。"],
        ]),
        examplesBlock([
          itm(
            J("1．じむしょに　ファクスが　あります。"),
            J("ファクスは　じむしょに　あります。"),
            J("どこ　に　か。")
          ),
        ])
      ),
      card(
        notes(
          "Nと　N　{{ liệt kê tất cả }}",
          "Nや　N{{など}}　(liệt kê đối tượng tiêu biểu",
          "từ 2 trở lên)"
        ),
        examplesBlock([
          itm(J("1．つくえのうえに　おさらや　ナイフが　あります。")),
          itm(J("2．つくえのうえに　おさらや　ナイフなどが　あります。")),
          itm(J("3．つくえのうえに　はしや　おさらや　ナイフなどが　あります。")),
        ])
      ),
    ],
  },
  {
    id: 11,
    badge: "Bài 11",
    heading: "第11課 · だい11か",
    cards: [
      card(
        notes(
          "1. Số lượng từ {{ gồm số từ + trợ số từ}}",
          "Từ chỉ đơn vị",
          "tùy thuộc vào đối tượng mà trợ số từ sẽ khác nhau"
        ),
        examplesBlock([
          itm(J("1．りんごを　４つ　かいました。"), J("いくつ　か。")),
          itm(J("2．４かげつ　にほんごを　べんきょうします。"), J("なんかげつ　か。")),
        ])
      ),
      card(
        pattern("1．どのくらい  : bao lâu"),
        examplesBlock([
          itm(J("どのくらい　にほんごを　べんきょうしますか。"), R("…４かげつ　べんきょうします。")),
          itm(
            N("2．かかります　: mất/ tốn về thời gian hay tiền bạc"),
            J("どのくらい　かかりますか  :  mất/tốn bao lâu")
          ),
          itm(J("がっこうから　うちへ　バスで　どのくらい　かかりますか。"), R("… 30ぷん　かかります")),
          itm(N("3．Số lượng từ + ぐらい　:{{khoảng}}")),
          itm(J("きょうしつに　がくせいが　４０にんぐらい　います。")),
        ])
      ),
      card(
        notes("Số lượng từ {{thời gian}} に　số lần   V {{tần suất}}"),
        pattern("なんかい"),
        examplesBlock([
          itm(J("１かげつに　２かい　テニスを　します。"), J("なんかい　か。")),
          itm(N("N　だけ　:　chỉ"), N("Số lượng từ")),
          itm(J("1．かいしゃに　がいこくじんの　かいしゃいんが　２人だけ　います。")),
          itm(J("2．やすみは　にちようびだけ　です。")),
        ])
      ),
    ],
  },
  {
    id: 12,
    badge: "Bài 12",
    heading: "第12課 · だい12か",
    cards: [
      card(
        notes(
          "N1は  N2より　A{{ khẳng định}}",
          "So sánh hơn",
          "Lấy N2 Làm chuẩn để nói trạng thái, tính chất của N1"
        ),
        examplesBlock([itm(J("1．くろいかばんは　しろいかばんより　たかいです。"))])
      ),
      card(
        notes("N1は  N2ほど　A{{ phủ định}}", "So sánh không bằng"),
        examplesBlock([itm(J("1．ぎゅうにくは　とりにくほど　やすくないです。"))])
      ),
      card(
        pattern("N1と  N2と　どちらが　A　ですか。", "…N1 / N2のほうが　 Aです。"),
        notes("Lựa chọn 1 trong 2"),
        examplesBlock([
          itm(
            J("1．サッカーと　やきゅうと　どちらが　おもしろいですか。"),
            R("…やきゅうの　ほうが　おもしろいです。"),
            R("…どちらも　おもしろいです。{{chọn cả 2}}"),
            R("…どちらも　おもしろくないです。{{ko chọn cả 2}}")
          ),
        ])
      ),
      card(
        pattern("N1{{のなか}}で　N2が　いちばん　A　です。"),
        kana([[null, null, null, "だれ", null, null, null, null, "か。"]]),
        pattern("いつ", "なに", "どこ", "N1と　N2と　N3のなかで  N1 /N2 /N3が いちばん　A　です。"),
        notes("So sánh nhất"),
        examplesBlock([
          itm(J("1.かぞくで　ちちが　いちばん　せが　たかいです。")),
          itm(J("2. みかんと　りんごと　オレンジのなかで　みかんが　いちばん　すきです。")),
        ])
      ),
      card(
        notes("の{{ vai trò thay thế cho danh từ}}"),
        examplesBlock([itm(J("1．C さんの　くつは　どれですか。"), J("くろいのです。"))])
      ),
    ],
  },
  {
    id: 13,
    badge: "Bài 13",
    heading: "第13課 · だい13か",
    cards: [
      card(
        pattern("Nが　ほしいです。", "Aイ", "なに"),
        notes(
          "{{Muốn, muốn có}}",
          "Biểu hiện ham muốn sở hữu vật/ người của người nói",
          "Dùng để hỏi ham muốn của người nghe"
        ),
        examplesBlock([
          itm(J("1．	わたしは　車{{くるま}}が　ほしいです。"), J("？　なに　か。")),
          itm(N("2 …………… "), J("なにも　ほしくないです。")),
        ])
      ),
      card(
        pattern("Vます  たいです。"),
        notes(
          "{{Muốn làm}}",
          "Biểu hiện ý muốn của người nói、để hỏi ý muốn của người nghe",
          "V 	đi kèm với を thì có thể thay thế bằng が",
          "đi kèm với những trợ từ còn lại{{で、に、と、…}} thì giữ nguyên."
        ),
        examplesBlock([
          itm(J("ラーメンを{{が}}　たべたいです。"), J("？　なに　か。")),
          itm(J("2．日本{{にほん}}へ　いきたいです。")),
          itm(J("なにを　したいですか。"), J("なにも　したくないです。")),
        ])
      ),
      card(
        notes("Người ta không dùng たい、ほしい  khi đưa ra lời mời."),
        pattern("あした　テニスを　しませんか。", "おちゃは　いかがですか。")
      ),
      card(
        kana([["N(địa điểm)へ", "Vます　に", "いきます"]]),
        pattern("N		きます", "かえります", "なにをしに　か。"),
        notes(
          "Đi/ đến/ quay về đâu để làm gì.",
          "Ｎ　là lễ hội, buổi hòa nhạc… thì mục đích là xem lễ hội hay là nghe nhạc…"
        ),
        examplesBlock([
          itm(J("ともだちのうちへ　あそびに　いきました。")),
          itm(J("2．にほんへ　かいものに　きました。")),
          itm(J("3．かぞくと　きょうとへ　おまつりに　いきます。")),
        ])
      ),
      card(
        pattern("日本へ　けいざいのべんきょうに　きました。"),
        notes("N"),
        pattern("日本へ　けいざいをべんきょうしに　きました。"),
        notes("V")
      ),
      card(
        notes("どこか:  đâu đó, chỗ nào đó."),
        examplesBlock([
          itm(J("あした　どこか{{へ}}　いきますか。")),
          itm(N("なにか:  cái gì đó.")),
          itm(J("おなかが　すきましたから、なにか{{を}}　たべましょう。")),
          itm(J("ごちゅうもんは／　おすし　：　thể hiện sự kính trọng")),
        ])
      ),
    ],
  },
  {
    id: 14,
    badge: "Bài 14",
    heading: "第14課 · だい14か",
    cards: [
      card(
        notes(
          "Phân biệt nhóm của động từ {{3 nhóm }}",
          "Nhóm 1: trước ます là những chữ thuộc cột い　れい： いきます",
          "Nhóm 2: trước ます là những chữ thuộc cột え　れい：  たべます",
          "Ngoại lệ:"
        ),
        pattern("おきます{{起きます}}{{thức dậy}}"),
        notes("みます      {{xem, nhìn}}"),
        pattern("おります   {{xuống}}", "あびます  {{tắm}}", "きます {{ 着ます  }}   {{mặc đồ}}", "Nhóm 3: します"),
        notes("Nします{{danh động từ}}"),
        pattern("きます{{来ます}}"),
        examplesBlock([
          itm(J("べんきょうします")),
          itm(
            J("にます      {{nấu ăn}}"),
            N("できます   {{hoàn thành, có thể}}"),
            J("おちます   {{rơi, rớt}}"),
            J("かります    {{mượn}}"),
            J("たります     {{đầy đủ}}"),
            J("います         {{có}}")
          ),
          itm(N("はなします　NÓI, NÓI CHUYỆN")),
        ])
      ),
      card(pattern("置きます{{I}} TRÍ", "起きます{{II}} KHỞI")),
      card(notes("着ます{{II}} TRƯỚC", "来ます{{III}} LAI")),
      card(
        notes("Cách chia thể て, た", "Nhóm 1:"),
        kana([["い", null, null, "れい：　かいます", "かって、かった"]]),
        pattern("ち	って、った", "り"),
        kana([["び", null, null, "れい：　よみます", "よんで、よんだ"]]),
        pattern("み	んで、んだ", "に"),
        kana([
          ["き", "いて、いた", "れい：　かきます", "かいて、かいた"],
          ["ぎ", "いで、いだ", "れい：　およぎます", "およいで、およいだ"],
          ["し", "して、した", "れい：　はなします", "はなして、はなした"],
        ]),
        pattern("いきます　	いって、いった")
      ),
      card(
        notes("Nhóm 2：	bỏ ます＋て、た"),
        examplesBlock([itm(J("たべます　たべて、たべた"), J("おきます　おきて、おきた"))]),
        kana([["Nhóm 3:", "します", "して、した"]])
      ),
      card(
        pattern("Ｎします　　Ｎして、Ｎした", "きます	きて、きた"),
        examplesBlock([itm(J("べんきょうします	べんきょうして、べんきょうした"))])
      ),
      card(
        pattern("Vて　ください"),
        notes("Hãy, xin hãy…", "Người nói sai khiến, khuyên nhủ, nhờ vả người nghe làm 1 việc gì đó."),
        examplesBlock([
          itm(J("1．ボールペンで　なまえを　かいてください。")),
          itm(J("2．どうぞ　たくさん　たべてください。")),
          itm(J("3．すみませんが、みちを　おしえてください。")),
        ])
      ),
      card(
        pattern("Vて　います"),
        notes("Đang", "Hành động đang diễn ra"),
        examplesBlock([itm(J("1．かんじを　かいています。"))])
      ),
      card(
        pattern("Vます　ましょうか"),
        notes("…nhé, …cho nhé", "Người nói đề nghị làm 1 việc gì đó cho người nghe"),
        examplesBlock([
          itm(
            J("1．にもつを　もちましょうか。"),
            J("はい{{ええ}}、もってください。"),
            J("すみません{{ええ}}、おねがいします。")
          ),
          itm(J("いいえ、けっこうです。")),
        ])
      ),
    ],
  },
  {
    id: 15,
    badge: "Bài 15",
    heading: "第15課 · だい15か",
    cards: [
      card(
        pattern("Vては　いけません。", "だめです。"),
        notes("Biểu thị ý nghĩa cấm/ không được làm 1 việc gì {{cấm/ không được }}"),
        examplesBlock([itm(J("1．このビルで　しゃしんをとっては　いけません。")), itm(N("2 …………… "))])
      ),
      card(
        pattern("Vても　いいです。"),
        notes("Biểu thị sự được phép làm 1 việc gì　{{ được…}}", "Vても　いいですか。{{Xin phép: …có được không?}}"),
        pattern("ええ{{はい}}、いいですよ。どうぞ。", "すみません。ちょっと…", "いいえ、{{Ｖては}}　いけません。"),
        examplesBlock([
          itm(J("1．このへやで　でんわを　つかっても　いいです。")),
          itm(J("2．たばこを　すっても　いいですか。")),
          itm(N("3 …………… ")),
        ])
      ),
      card(
        pattern("Vて　います"),
        notes(
          "Hành động đang diễn ra {{Đang}}",
          "Trạng thái {{ là kết quả của 1 hành động}} vẫn còn lại, vẫn tiếp diễn ở hiện tại."
        ),
        pattern("けっこんしています。", "すんでいます。"),
        notes("もっています。{{đang cầm, có(sở hữu)}}"),
        pattern("しっています。　　　　しりません。"),
        notes("Tập quán, thói quen {{hành vi lặp đi lặp lại}}"),
        examplesBlock([
          itm(J("1．にほんごを　べんきょうしています。")),
          itm(J("2．ひとりで　ベトナムに　すんでいます。")),
          itm(J("3．さくらだいがくで　えいごを　おしえています。")),
          itm(N("4 …………… ")),
        ])
      ),
    ],
  },
  {
    id: 16,
    badge: "Bài 16",
    heading: "第16課 · だい16か",
    cards: [
      card(
        notes("V1て　V2て　V3て…. V", "Nối V, liệt kê hành động theo trình tự thời gian {{ rồi}}"),
        examplesBlock([itm(J("1．にほんへきて、おすしを　たべて、おはなみを　しました。"))])
      ),
      card(
        pattern("V1てから　V2"),
        notes("V2 được thực hiện sau khi V1 kết thúc  {{sau khi}}"),
        examplesBlock([itm(J("1．くにへ　かえってから、にほんのかいしゃで　はたらきます。"))])
      ),
      card(
        pattern("Aイくて", "Aナ / N で"),
        notes(
          "Nối Aイ, Aナ, N.",
          "dùng với câu 1 chủ đề, nhiều chủ đề.",
          "Không dùng nối những bộ phận có ý nghĩa trái ngược nhau."
        ),
        examplesBlock([
          itm(J("1．ミラーさんは　わかくて、あたまが　よくて、おもしろいです。")),
          itm(J("2．カリナさんは　がくせいで、マリアさんは　いしゃです。")),
          itm(J("3．このへやは　せまくて、きれいです。x"), J("せまいですが、きれいです。")),
        ])
      ),
      card(
        notes("N1は N2が　A。", "は trợ từ mệnh đề chính", "が …………… phụ"),
        examplesBlock([itm(J("1．かんじは　よみかたが　むずかしいです。"))])
      ),
      card(
        pattern("どうやって"),
        notes("Hỏi trình tự, hoặc cách làm 1 việc nào đó {{bằng cách nào}}"),
        examplesBlock([
          itm(J("1．どうやって　にほんごを　べんきょうしますか。"), J("えいがを　みて、しんぶんを　よんで、おんがくを　ききます。")),
        ])
      ),
    ],
  },
  {
    id: 17,
    badge: "Bài 17",
    heading: "第17課 · だい17か",
    cards: [
      card(
        notes("Cách chia thể ない", "Nhóm 1:　cột い　	cột あ + ない"),
        pattern("い　	わ + ない"),
        examplesBlock([
          itm(J("よみます	よまない"), J("かいます	かわない"), J("あります	　ない"), J("Nhóm 2:　bỏ ます+ ない")),
          itm(J("おしえます	　　おしえない"), J("おきます	　　おきない")),
        ]),
        kana([["Nhóm 3:", "します", null, "しない"]]),
        pattern("Ｎします　　	Ｎしない", "来ます		こない"),
        examplesBlock([itm(J("べんきょうします	べんきょうしない"))])
      ),
      card(
        pattern("Vない　でください"),
        notes("Xin đừng, đừng", "Yêu cầu người khác đừng làm 1 việc gì"),
        examplesBlock([itm(J("1．ここで　しゃしんを　とらないでください。")), itm(N("2 …………… "))])
      ),
      card(
        pattern("Vない　なくても　いいです。"),
        notes("Không phải…", "Không phải làm 1 việc gì đó"),
        examplesBlock([itm(J("1．くつを　ぬがなくても　いいです。")), itm(N("2 …………… "))])
      ),
      card(
        notes("N{{ thời gian}} までに  V　：trước", "…まで 　:Đến"),
        examplesBlock([
          itm(J("1.きんようびまでに　レポートを　ださなければ　なりません。")),
          itm(J("2.こんしゅうは　きんようびまで　はたらきます。")),
          itm(
            J("あした　レポートを　かきます。"),
            J("レポートは　あした　かきます。"),
            J("あしたは　レポートを　かきます"),
            J("レストランでは　ごはんを　たべます。")
          ),
        ])
      ),
    ],
  },
  {
    id: 18,
    badge: "Bài 18",
    heading: "第18課 · だい18か",
    cards: [
      card(
        notes("Cách chia thể từ điển", "Nhóm 1:　cột い　	cột う"),
        examplesBlock([
          itm(J("よみます	よむ")),
          itm(N("Nhóm 2:　bỏ ます+ る")),
          itm(J("おしえます	　　おしえる"), J("起きます	　　おきる")),
        ]),
        kana([["Nhóm 3:", "します", null, "する"]]),
        pattern("Ｎします　　	Ｎする", "来ます		くる"),
        examplesBlock([itm(J("べんきょうします	べんきょうする"))])
      ),
      card(
        pattern("N	ができます。", "Vる　こと"),
        notes("Có thể", "Ｎ chỉ động tác, hành vi{{うんてん、ダンス}}, danh từ ám chỉ động tác hoặc hành vi{{にほんご、ピアノ}}"),
        examplesBlock([itm(J("1．にほんごが　できます。")), itm(J("2．およぐことが　できます。")), itm(N("3 …………… "))])
      ),
      card(
        pattern("しゅみは　N　　　　です。", "Vること"),
        notes("Sở thích là…"),
        examplesBlock([
          itm(J("1．私{{わたし}}のしゅみは　えいがです。")),
          itm(J("2．私{{わたし}}のしゅみは　えいがを　みることです。")),
          itm(N("3 …………… ")),
        ])
      ),
      card(
        pattern("V１る", "N の		　まえに、Ｖ２"),
        notes(
          "Lượng từ{{khoảng thời gian}}",
          "Trước khi, Trước… {{V2 xảy ra trước V1, N biểu thị hoặc ám chỉ hành động}}"
        ),
        examplesBlock([
          itm(J("1．ねるまえに、ほんを　よみます。")),
          itm(J("2．しょくじのまえに、　手を　あらいます。")),
          itm(J("3．５ねんまえに、にほんへ　きました。")),
          itm(N("4 …………… ")),
        ])
      ),
      card(
        notes("なかなか +　phủ định　：mãi mà không"),
        examplesBlock([
          itm(J("なかなか　にほんへ　いくことができません。")),
          itm(N("ぜひ　: nhất định"), J("ぜひ　にほんへ　いきたいです。"), J("ぜひ　あそびに　きてください。")),
        ])
      ),
    ],
  },
  {
    id: 19,
    badge: "Bài 19",
    heading: "第19課 · だい19か",
    cards: [
      card(
        pattern("Vた　こと   があります。"),
        notes("Đã từng…", "Biểu thị đã từng làm 1 việc gì đó trong quá khứ như là 1 kinh nghiệm."),
        examplesBlock([
          itm(J("1．すもうを　みたことが　あります。")),
          itm(J("2．ふじさんに　のぼったことが　ありません。")),
          itm(N("3 …………… ")),
        ])
      ),
      card(
        pattern("Vたり、 Vたり　します。"),
        notes("Làm…làm…", "Liệt kê hành động mang tính chất tiêu biểu."),
        examplesBlock([
          itm(J("1．やすみのひは　テニスを　したり、さんぽに　いったり　します。")),
          itm(J("2．そうじ　したり、せんたく　したり　しなければ　なりません。")),
          itm(N("3 …………… ")),
        ])
      ),
      card(
        pattern("Aイ　く　　　　　　なります。", "Aナ	 / N に"),
        notes("Trở nên, trở thành, lên…　{{diễn tả sự thay đổi trạng thái}}"),
        examplesBlock([
          itm(J("1．あつく　なります。")),
          itm(J("2．べんりに　なります。")),
          itm(J("3．いもうとは　いしゃに　なります。")),
          itm(N("4 …………… ")),
        ])
      ),
      card(
        notes(
          "そうですか　：　biểu hiện sự cảm thán, tiếp nhận của người nói với thông tin mới nhận được",
          "そうですね :     biểu thị người nghe đồng ý, thông cảm khi đối phương nói ra điều mình biết, hoặc cũng nghĩ thế"
        )
      ),
    ],
  },
  {
    id: 20,
    badge: "Bài 20",
    heading: "第20課 · だい20か",
    cards: [
      card(
        pattern(
          "Vます　 			V る",
          "Vません　 		V ない",
          "Vました　 		V た",
          "Vませんでした　		Vないなかった",
          "Aイ　です",
          "Aイ　くないです 		        bỏです",
          "Aイ　かったです",
          "Aイ　くなかったです"
        )
      ),
      card(
        pattern(
          "Aナ/N　です				Aナ/N　だ",
          "Aナ/N　では{{じゃ}}ありません　 		Aナ/N　では{{じゃ}}ない",
          "Aナ/N　でした　 			 Aナ/N　だった",
          "Aナ/N　では{{じゃ}}ありませんでした		 Aナ/N　では{{じゃ}}なかった",
          "Vています　	　　　Vて{{い}}る",
          "Vてくだいさい	　　　　Vて"
        )
      ),
      card(
        pattern(
          "おちゃを　のむ？{{　}}",
          "…うん、のむ。{{　}}",
          "…ううん、のまない。",
          "あした　ひま{{だ}}",
          "…うん、ひま/  ひまだ/  ひまだよ。{{nam}}",
          "…うん、ひま/  ひまよ。{{nữ}}",
          "…ううん、ひま　じゃない。"
        ),
        notes("Trợ từ: を、へ、が、は　có thể lược bỏ", "で、に、から、まで、と　không thể lược bỏ")
      ),
    ],
  },
  {
    id: 21,
    badge: "Bài 21",
    heading: "第21課 · だい21か",
    cards: [
      card(
        notes("Thể thông thường/ thể ngắn と　おもいます。"),
        pattern("Nについて　どう　おもいますか。", "わたしも　そう　おもいます。", "わたしは　そう{{は}}　おもいません。"),
        notes("Nêu phán đoán, ý kiến{{ Tôi nghĩ…}}", "Hỏi ý kiến ai về 1 cái gì đó{{ Nghĩ như thế nào về N}}"),
        examplesBlock([itm(J("1.あした　あめが　ふると　おもいます。"))])
      ),
      card(
        pattern("「Câu」		と　いいます。"),
        notes("Thể ngắn"),
        pattern("なん"),
        notes("Trích dẫn câu trực tiếp hoặc gián tiếp {{ Nói…}}"),
        examplesBlock([
          itm(J("1.しゅしょうは　らいげつ　アメリカに　いくと　いいました。")),
          itm(J("2．しゅしょうは「らいげつ　アメリカに　いきます」"), J("と　いいました。")),
          itm(N(".")),
        ])
      ),
      card(
        pattern("Ｔhể ngắn 	でしょう。"),
        notes("{{Aナ/N だ}}", "Xác nhận sự đồng ý của người nghe, có kì vọng người nghe sẽ đồng ý {{phải không?}}"),
        examplesBlock([itm(J("1.あした　パーティーに　いくでしょう。"))])
      ),
      card(
        pattern(
          "とうきょうで　日本と　ブラジルのサッカーのしあいが　あります。",
          "かいぎで　なにか　いけんを　いいましたか。",
          "ちょっと　ビールでも　のみませんか。"
        )
      ),
    ],
  },
  {
    id: 22,
    badge: "Bài 22",
    heading: "第22課 · だい22か",
    cards: [
      card(
        pattern("N の  	 N", "Aイ", "Aナ な"),
        notes("V thể ngắn"),
        examplesBlock([
          itm(J("1．これは　これから　つかうほんです。")),
          itm(J("2．私{{わたし}}が　生{{う}}まれた　ところは　よこはまです。")),
        ])
      ),
    ],
  },
  {
    id: 23,
    badge: "Bài 23",
    heading: "第23課 · だい23か",
    cards: [
      card(
        pattern("Vる		とき、", "vない", "Aイ", "Aナ な", "N の"),
        notes("Khi", "Biểu thị thời điểm mà trạng thái, động tác, hiện tượng ở mệnh đề sau diễn ra"),
        examplesBlock([itm(J("1．みちを　わたるとき、くるまに　きをつけます。"))])
      ),
      card(
        pattern("Vる とき＝Vる まえに{{ trước khi}}", "Vた とき＝Vて から    {{sau khi}}"),
        examplesBlock([
          itm(J("1．うちへ　かえるとき、　ケーキをかいます。")),
          itm(J("2．うちへ　かえったとき、「ただいま」と　いいます。")),
        ])
      ),
      card(
        pattern("Vる　　と、"),
        notes("Là/ thì", "Nối 2 mệnh đề của câu, biểu thị 1 kết quả tất yếu của 1 hành động"),
        examplesBlock([
          itm(J("1．このボータンを　おすと、　おつりが　出ます。")),
          itm(
            J("2. じかんが　あると、　　　えいがを　見に　いきます。　{{ý chí}}"),
            J("えいがを　見に　いきたいです。{{nguyện vọng}}"),
            J("えいがを　見に　いきませんか。{{lời mời}}"),
            J("ちょっと　てつだってくだいさい。{{yêu cầu}}")
          ),
        ])
      ),
    ],
  },
  {
    id: 24,
    badge: "Bài 24",
    heading: "第24課 · だい24か",
    cards: [
      card(
        noteTable(
          "S は　人に/を/と　　Vてあげます。 わたし 。Mình làm 1 việc gì đó tốt cho người khác. 。Người khác làm 1 việc gì đó tốt cho người khác"
        ),
        examplesBlock([
          itm(J("1．わたしは　きむらさんに　ほんを　貸してあげました。")),
          itm(J("2．やまださんは　たなかさんを　えきで"), J("むかえてあげました。")),
          itm(N("3 …………… ")),
        ])
      ),
      card(
        examplesBlock([
          itm(J("1．わたしは　ちちに　とけいを　かってもらいました。")),
          itm(J("2．きむらさんは　やまださんに　びょういんのでんわば"), J("んごうを　おしえてもらいました。")),
          itm(N("3 …………… ")),
        ]),
        noteTable(
          "S は　人に　　Vてもらいます。 わたし 。Mình nhận từ người khác hành động tốt 。Người khác nhận từ người khác hành động tốt"
        )
      ),
      card(
        noteTable(
          "S 　は/が　{{わたしに/を/と}}　　Vてくれます。 わたし 。người khác làm cho mình/người thân trong gia đình mình hành động tốt"
        ),
        examplesBlock([
          itm(J("1．かれは　セーターを　おくってくれました。")),
          itm(J("2．みせの人は　ははに　おふろのはいりかたを"), J("せいつめしてくれました。")),
          itm(N("3 …………… ")),
        ])
      ),
    ],
  },
  {
    id: 25,
    badge: "Bài 25",
    heading: "第25課 · だい25か",
    cards: [
      card(
        kana([["（もし）　  Vたら", null, null, "Vない", null, null, "かったら"]]),
        pattern("Aイかったら		Aイくない", "Aナ/ Nだったら		Aナ/ N　ではない", "じゃない"),
        notes("Nếu…thì…/ Nếu không…thì…", "Điều kiện giả định"),
        examplesBlock([
          itm(J("1．あめがふったら、でかけません。")),
          itm(J("2．やすかったら、あのみせで　かいます。")),
          itm(
            J("3．ひまだったら、あそびに　いきます。"),
            J("じかんがなかったら、えいがを　見ません。"),
            J("Vたら"),
            N("Sau khi")
          ),
          itm(J("家へかえったら、すぐ　シャワーをあびます。")),
        ])
      ),
      card(
        pattern("（いくら）　Vても", "Aイくても", "Aナ/ Nでも"),
        notes(
          "Dù …cũng…",
          "Hành động đáng ra phải làm nhưng không làm, 1 việc đáng ra phải xảy ra nhưng không xảy ra, 1 kết quả trái với quan niệm thông thường"
        ),
        examplesBlock([itm(J("1．（いくら）あめがふっても、でかけます"))])
      ),
    ],
  },
];

