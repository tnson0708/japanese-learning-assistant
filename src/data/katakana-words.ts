/**
 * Common katakana loanwords for reading practice right after learning the
 * katakana chart (printed from the Katakana tab, ~2 A4 pages). Example
 * sentences only use kana and grammar from Minna no Nihongo Bài 1–25.
 */

export interface KatakanaWord {
  word: string;
  romaji: string;
  meaning: string;
  example: string;
  exampleVi: string;
}

export interface KatakanaWordGroup {
  topic: string;
  words: KatakanaWord[];
}

function w(word: string, romaji: string, meaning: string, example: string, exampleVi: string): KatakanaWord {
  return { word, romaji, meaning, example, exampleVi };
}

export const katakanaWordGroups: KatakanaWordGroup[] = [
  {
    topic: "Đồ ăn & thức uống",
    words: [
      w("コーヒー", "kōhī", "cà phê", "まいあさ コーヒーを のみます。", "Mỗi sáng tôi uống cà phê."),
      w("ジュース", "jūsu", "nước ép", "ジュースを ください。", "Cho tôi nước ép."),
      w("ビール", "bīru", "bia", "ばんに ビールを のみました。", "Buổi tối tôi đã uống bia."),
      w("パン", "pan", "bánh mì", "あさごはんに パンを たべます。", "Bữa sáng tôi ăn bánh mì."),
      w("ケーキ", "kēki", "bánh ngọt", "たんじょうびに ケーキを かいました。", "Tôi đã mua bánh vào ngày sinh nhật."),
      w("アイスクリーム", "aisukurīmu", "kem", "アイスクリームが すきです。", "Tôi thích kem."),
      w("カレー", "karē", "cà ri", "この カレーは からいです。", "Món cà ri này cay."),
      w("ラーメン", "rāmen", "mì ramen", "ひるごはんに ラーメンを たべましょう。", "Bữa trưa mình ăn ramen nhé."),
      w("チョコレート", "chokorēto", "sô-cô-la", "ともだちに チョコレートを あげました。", "Tôi đã tặng bạn sô-cô-la."),
    ],
  },
  {
    topic: "Đồ dùng & nhà cửa",
    words: [
      w("テレビ", "terebi", "tivi", "ばんごはんの あとで テレビを みます。", "Sau bữa tối tôi xem tivi."),
      w("カメラ", "kamera", "máy ảnh", "この カメラは たかいです。", "Cái máy ảnh này đắt."),
      w("ボールペン", "bōrupen", "bút bi", "ボールペンで なまえを かいて ください。", "Hãy viết tên bằng bút bi."),
      w("ノート", "nōto", "quyển vở", "ノートを わすれました。", "Tôi quên vở rồi."),
      w("テーブル", "tēburu", "cái bàn", "テーブルの うえに はなが あります。", "Trên bàn có hoa."),
      w("ベッド", "beddo", "giường", "へやに ベッドが あります。", "Trong phòng có giường."),
      w("エアコン", "eakon", "máy điều hòa", "あついですから、エアコンを つけましょうか。", "Nóng quá, để tôi bật điều hòa nhé?"),
      w("シャワー", "shawā", "vòi sen", "まいばん シャワーを あびます。", "Tối nào tôi cũng tắm vòi sen."),
      w("トイレ", "toire", "nhà vệ sinh", "トイレは どこですか。", "Nhà vệ sinh ở đâu?"),
    ],
  },
  {
    topic: "Quần áo",
    words: [
      w("シャツ", "shatsu", "áo sơ mi", "しろい シャツを かいました。", "Tôi đã mua áo sơ mi trắng."),
      w("ネクタイ", "nekutai", "cà vạt", "すてきな ネクタイですね。", "Cà vạt đẹp nhỉ."),
      w("スカート", "sukāto", "váy", "あかい スカートが ほしいです。", "Tôi muốn có chiếc váy đỏ."),
      w("コート", "kōto", "áo khoác", "さむいですから、コートを きます。", "Trời lạnh nên tôi mặc áo khoác."),
      w("バッグ", "baggu", "túi xách", "この バッグは だれのですか。", "Cái túi này của ai?"),
    ],
  },
  {
    topic: "Địa điểm",
    words: [
      w("デパート", "depāto", "cửa hàng bách hóa", "デパートで くつを かいました。", "Tôi đã mua giày ở bách hóa."),
      w("スーパー", "sūpā", "siêu thị", "スーパーへ かいものに いきます。", "Tôi đi siêu thị mua sắm."),
      w("コンビニ", "konbini", "cửa hàng tiện lợi", "えきの まえに コンビニが あります。", "Trước nhà ga có cửa hàng tiện lợi."),
      w("レストラン", "resutoran", "nhà hàng", "レストランで ばんごはんを たべました。", "Tôi đã ăn tối ở nhà hàng."),
      w("ホテル", "hoteru", "khách sạn", "この ホテルは えきから ちかいです。", "Khách sạn này gần ga."),
      w("エレベーター", "erebētā", "thang máy", "エレベーターで 5かいへ いきます。", "Tôi đi thang máy lên tầng 5."),
      w("プール", "pūru", "hồ bơi", "なつやすみに プールで およぎました。", "Kỳ nghỉ hè tôi đã bơi ở hồ bơi."),
    ],
  },
  {
    topic: "Giao thông & du lịch",
    words: [
      w("タクシー", "takushī", "taxi", "えきから タクシーで いきました。", "Từ ga tôi đã đi taxi."),
      w("バス", "basu", "xe buýt", "バスで がっこうへ いきます。", "Tôi đi học bằng xe buýt."),
      w("パスポート", "pasupōto", "hộ chiếu", "パスポートを みせて ください。", "Hãy cho xem hộ chiếu."),
      w("チケット", "chiketto", "vé", "コンサートの チケットを 2まい かいました。", "Tôi đã mua 2 vé buổi hòa nhạc."),
      w("スーツケース", "sūtsukēsu", "va li", "この スーツケースは おもいです。", "Cái va li này nặng."),
    ],
  },
  {
    topic: "Công nghệ & công việc",
    words: [
      w("パソコン", "pasokon", "máy tính cá nhân", "パソコンで メールを かきます。", "Tôi viết email bằng máy tính."),
      w("メール", "mēru", "email", "せんせいに メールを おくりました。", "Tôi đã gửi email cho thầy."),
      w("インターネット", "intānetto", "internet", "インターネットで ホテルを よやくしました。", "Tôi đã đặt khách sạn qua internet."),
      w("スマホ", "sumaho", "điện thoại thông minh", "スマホで しゃしんを とります。", "Tôi chụp ảnh bằng điện thoại."),
      w("コピー", "kopī", "bản sao, photo", "この しりょうを コピーして ください。", "Hãy photo tài liệu này."),
      w("ニュース", "nyūsu", "tin tức", "まいあさ テレビで ニュースを みます。", "Mỗi sáng tôi xem tin tức trên tivi."),
      w("アルバイト", "arubaito", "việc làm thêm", "しゅうまつ レストランで アルバイトを して います。", "Cuối tuần tôi làm thêm ở nhà hàng."),
    ],
  },
  {
    topic: "Thể thao & giải trí",
    words: [
      w("サッカー", "sakkā", "bóng đá", "にちようびに サッカーを します。", "Chủ nhật tôi chơi bóng đá."),
      w("テニス", "tenisu", "quần vợt", "テニスが じょうずですね。", "Bạn chơi quần vợt giỏi nhỉ."),
      w("ゲーム", "gēmu", "trò chơi điện tử", "おとうとは よく ゲームを します。", "Em trai tôi hay chơi game."),
      w("パーティー", "pātī", "bữa tiệc", "きのうの パーティーは たのしかったです。", "Bữa tiệc hôm qua vui."),
      w("ギター", "gitā", "đàn ghi-ta", "ギターを ひく ことが できます。", "Tôi biết chơi ghi-ta."),
      w("ピアノ", "piano", "đàn piano", "わたしの しゅみは ピアノです。", "Sở thích của tôi là piano."),
    ],
  },
  {
    topic: "Quốc gia",
    words: [
      w("ベトナム", "betonamu", "Việt Nam", "わたしは ベトナムから きました。", "Tôi đến từ Việt Nam."),
      w("アメリカ", "amerika", "Mỹ", "ミラーさんは アメリカじんです。", "Anh Miller là người Mỹ."),
      w("フランス", "furansu", "Pháp", "フランスの ワインは おいしいです。", "Rượu vang Pháp ngon."),
      w("イギリス", "igirisu", "Anh", "イギリスへ りょこうに いきたいです。", "Tôi muốn đi du lịch nước Anh."),
    ],
  },
];
