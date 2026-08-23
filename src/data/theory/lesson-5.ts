import type { Lesson } from "@/lib/theory";

export const lesson5: Lesson = {
  id: 5,
  title: "Bài 5: 行きます・来ます・帰ります — Di chuyển, Phương tiện, Ngày tháng & Trợ từ へ / で / と",
  sections: [
    {
      id: "vocabulary",
      title: "I. Từ vựng",
      blocks: [
        {
          type: "vocab-group",
          heading: "Động từ di chuyển (移動の動詞)",
          items: [
            {
              jp: "いきます",
              kanji: "行きます",
              meaning: "đi",
            },
            {
              jp: "きます",
              kanji: "来ます",
              meaning: "đến",
            },
            {
              jp: "かえります",
              kanji: "帰ります",
              meaning: "về, trở về",
            },
          ],
        },
        {
          type: "vocab-group",
          heading: "Địa điểm & Nơi chốn (場所・ facility)",
          items: [
            { jp: "がっこう", kanji: "学校", meaning: "trường học" },
            { jp: "スーパー", meaning: "siêu thị" },
            { jp: "えき", kanji: "駅", meaning: "ga, nhà ga" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Phương tiện giao thông (交通手段)",
          items: [
            { jp: "ひこうき", kanji: "飛行機", meaning: "máy bay" },
            { jp: "ふね", kanji: "船", meaning: "thuyền, tàu thủy" },
            { jp: "でんしゃ", kanji: "電車", meaning: "tàu điện" },
            { jp: "ちかてつ", kanji: "地下鉄", meaning: "tàu điện ngầm" },
            {
              jp: "しんかんせん",
              kanji: "新幹線",
              meaning: "tàu Shinkansen (tàu điện cao tốc của Nhật)",
            },
            { jp: "バス", meaning: "xe buýt" },
            { jp: "タクシー", meaning: "tác-xi" },
            { jp: "じてんしゃ", kanji: "自転車", meaning: "xe đạp" },
            { jp: "あるいて", kanji: "歩いて", meaning: "đi bộ" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Con người & Bạn bè (人と一緒)",
          items: [
            { jp: "ひと", kanji: "人", meaning: "người" },
            { jp: "ともだち", kanji: "友達", meaning: "bạn, bạn bè" },
            { jp: "かれ", kanji: "彼", meaning: "anh ấy, bạn trai" },
            { jp: "かのじょ", kanji: "彼女", meaning: "chị ấy, bạn gái" },
            { jp: "かぞく", kanji: "家族", meaning: "gia đình" },
            { jp: "ひとりで", kanji: "一人で", meaning: "một mình" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Thời gian - Tuần, Tháng, Năm (週・月・年)",
          items: [
            { jp: "せんしゅう", kanji: "先週", meaning: "tuần trước" },
            { jp: "こんしゅう", kanji: "今週", meaning: "tuần này" },
            { jp: "らいしゅう", kanji: "来週", meaning: "tuần sau" },
            { jp: "せんげつ", kanji: "先月", meaning: "tháng trước" },
            { jp: "こんげつ", kanji: "今月", meaning: "tháng này" },
            { jp: "らいげつ", kanji: "来月", meaning: "tháng sau" },
            { jp: "きょねん", kanji: "去年", meaning: "năm ngoái" },
            { jp: "ことし", meaning: "năm nay" },
            { jp: "らいねん", kanji: "来年", meaning: "sang năm, năm sau" },
            { jp: "―ねん", kanji: "―年", meaning: "― năm" },
            { jp: "なんねん", kanji: "何年", meaning: "mấy năm" },
            { jp: "―がつ", kanji: "―月", meaning: "tháng ―" },
            { jp: "なんがつ", kanji: "何月", meaning: "tháng mấy" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Ngày trong tháng (日付の言い方)",
          items: [
            { jp: "ついたち", kanji: "1日", meaning: "ngày mồng 1" },
            { jp: "ふつか", kanji: "2日", meaning: "ngày mồng 2, 2 ngày" },
            { jp: "みっか", kanji: "3日", meaning: "ngày mồng 3, 3 ngày" },
            { jp: "よっか", kanji: "4日", meaning: "ngày mồng 4, 4 ngày" },
            { jp: "いつか", kanji: "5日", meaning: "ngày mồng 5, 5 ngày" },
            { jp: "むいか", kanji: "6日", meaning: "ngày mồng 6, 6 ngày" },
            { jp: "なのか", kanji: "7日", meaning: "ngày mồng 7, 7 ngày" },
            { jp: "ようか", kanji: "8日", meaning: "ngày mồng 8, 8 ngày" },
            { jp: "ここのか", kanji: "9日", meaning: "ngày mồng 9, 9 ngày" },
            { jp: "とおか", kanji: "10日", meaning: "ngày mồng 10, 10 ngày" },
            { jp: "じゅうよっか", kanji: "14日", meaning: "ngày 14, 14 ngày" },
            { jp: "はつか", kanji: "20日", meaning: "ngày 20, 20 ngày" },
            { jp: "にじゅうよっか", kanji: "24日", meaning: "ngày 24, 24 ngày" },
            { jp: "―にち", kanji: "―日", meaning: "ngày ―, ― ngày" },
            { jp: "なんにち", kanji: "何日", meaning: "ngày mấy, mấy ngày" },
            { jp: "いつ", meaning: "bao giờ, khi nào" },
            { jp: "たんじょうび", kanji: "誕生日", meaning: "sinh nhật" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Giao tiếp & Từ liên quan (会話表現・その他)",
          items: [
            { jp: "そうですね。", meaning: "Ứ, nhỉ." },
            {
              jp: "［どうも］ありがとう ございました。",
              meaning: "Xin cảm ơn anh/chị rất nhiều.",
            },
            {
              jp: "どういたしまして。",
              meaning: "Không có gì đâu (anh/chị đừng bận tâm).",
            },
            { jp: "―ばんせん", kanji: "―番線", meaning: "sân ga số ―" },
            { jp: "つぎの", kanji: "次の", meaning: "tiếp theo" },
            { jp: "ふつう", kanji: "普通", meaning: "tàu thường (dừng cả ở các ga lẻ)" },
            { jp: "きゅうこう", kanji: "急行", meaning: "tàu tốc hành" },
            { jp: "とっきゅう", kanji: "特急", meaning: "tàu tốc hành đặc biệt" },
          ],
        },
        {
          type: "vocab-group",
          heading: "Tên địa danh & Tên riêng (固有名詞)",
          items: [
            { jp: "こうしえん", kanji: "甲子園", meaning: "tên một khu phố ở gần Osaka" },
            {
              jp: "おおさかじょう",
              kanji: "大阪城",
              meaning: "Lâu đài Osaka, một lâu đài nổi tiếng ở Osaka",
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
              id: "l5-t-s1",
              num: 1,
              vi: "Tôi (sẽ) đi Kyoto.",
              jp: "わたしは 京都へ 行きます。",
            },
            {
              id: "l5-t-s2",
              num: 2,
              vi: "Tôi (sẽ) về nhà bằng tác-xi.",
              jp: "わたしは タクシーで うちへ 帰ります。",
            },
            {
              id: "l5-t-s3",
              num: 3,
              vi: "Tôi (đã) đến Nhật cùng với gia đình.",
              jp: "わたしは 家族と 日本へ 来ました。",
            },
          ],
          examples: [
            {
              id: "l5-t-e1",
              num: 1,
              vi: "Ngày mai anh/chị sẽ đi đâu?\n…Tôi sẽ đi Nara.",
              jp: "どこへ 行きますか。\n……奈良へ 行きます。",
            },
            {
              id: "l5-t-e2",
              num: 2,
              vi: "Chủ nhật anh/chị đã đi đâu?\n…Tôi không đi đâu cả.",
              jp: "日曜日 どこへ 行きましたか。\n……どこ［へ］も 行きませんでした。",
            },
            {
              id: "l5-t-e3",
              num: 3,
              vi: "Anh/Chị đi Tokyo bằng phương tiện gì?\n…Tôi đi bằng Shinkansen.",
              jp: "何で 東京へ 行きますか。\n……新幹線で 行きます。",
            },
            {
              id: "l5-t-e4",
              num: 4,
              vi: "Anh/Chị đi Tokyo cùng với ai?\n…Tôi đi cùng với anh Yamada.",
              jp: "だれと 東京へ 行きますか。\n……山田さんと 行きます。",
            },
            {
              id: "l5-t-e5",
              num: 5,
              vi: "Anh/Chị (đã) đến Nhật bao giờ?\n…Tôi (đã) đến vào ngày 25 tháng 3.",
              jp: "いつ 日本へ 来ましたか。\n……3月25日に 来ました。",
            },
            {
              id: "l5-t-e6",
              num: 6,
              vi: "Sinh nhật của anh/chị là khi nào?\n…Là ngày 13 tháng 6.",
              jp: "誕生日 は いつですか。\n……6月13日です。",
            },
          ],
          dialogueTitle: "Tàu này có đi Koshien không? (この 電車は 甲子園へ 行きますか)",
          dialogueLines: [
            {
              speakerVi: "Santos",
              speakerJp: "サントス",
              vi: "Xin lỗi. Vé đến Koshien là bao nhiêu ạ?",
              jp: "すみません。甲子園まで いくらですか。",
            },
            {
              speakerVi: "Người phụ nữ",
              speakerJp: "女の人",
              vi: "Là 350 yên.",
              jp: "350円です。",
            },
            {
              speakerVi: "Santos",
              speakerJp: "サントス",
              vi: "350 yên ạ. Cảm ơn chị.",
              jp: "350円ですね。ありがとう ございました。",
            },
            {
              speakerVi: "Người phụ nữ",
              speakerJp: "女の人",
              vi: "Không có gì.",
              jp: "どういたしまして。",
            },
            {
              speakerVi: "Santos",
              speakerJp: "サントス",
              vi: "Xin lỗi, tàu đi Koshien là sân ga số mấy ạ?",
              jp: "すみません。甲子園行きは 何番線ですか。",
            },
            {
              speakerVi: "Nhân viên nhà ga",
              speakerJp: "駅員",
              vi: "Sân ga số 5 ạ.",
              jp: "5番線です。",
            },
            {
              speakerVi: "Santos",
              speakerJp: "サントス",
              vi: "Xin cảm ơn.",
              jp: "どうも。",
            },
            {
              speakerVi: "Santos",
              speakerJp: "サントス",
              vi: "Anh ơi, tàu này có đi Koshien không ạ?",
              jp: "あのう、この 電車は 甲子園へ 行きますか。",
            },
            {
              speakerVi: "Người đàn ông",
              speakerJp: "男の人",
              vi: "Không, chuyển tàu thường tiếp theo mới đi cơ.",
              jp: "いいえ。次の「普通」ですよ。",
            },
            {
              speakerVi: "Santos",
              speakerJp: "サントス",
              vi: "Ồ thế à. Cảm ơn anh.",
              jp: "そうですか。どうも。",
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
          title: "祝祭日 (しゅくさいじつ) — Các ngày nghỉ lễ Quốc gia tại Nhật Bản",
          columns: ["Thời gian (Ngày / Thứ)", "Tên ngày lễ (Kanji / Hiragana)", "Ý nghĩa tiếng Việt", "Ghi chú"],
          speakableColumns: [1],
          rows: [
            ["1月1日", "元日 (がんじつ)", "Ngày mồng 1 Tết (Tết Dương lịch)", "Nghỉ đón năm mới"],
            ["1月第2月曜日 **", "成人の日 (せいじんの ひ)", "Ngày Trưởng thành (Lễ thành nhân)", "Thứ hai của tuần thứ 2 tháng 1"],
            ["2月11日", "建国記念の日 (けんこく きねんの ひ)", "Ngày Quốc khánh (Kỷ niệm kiến quốc)", "Ngày thành lập nước Nhật"],
            ["3月20日頃 *", "春分の日 (しゅんぶんの ひ)", "Ngày Xuân phân", "Thay đổi ngày theo từng năm"],
            ["4月29日", "昭和の日 (しょうわの ひ)", "Ngày Kỷ niệm Thiên hoàng Showa", "Bắt đầu chuỗi Tuần lễ vàng"],
            ["5月3日", "憲法記念日 (けんぽう きねんび)", "Ngày Kỷ niệm Hiến pháp", "Kỷ niệm ban hành Hiến pháp Nhật"],
            ["5月4日", "みどりの日 (みどりの ひ)", "Ngày Màu xanh (Cây xanh / Tự nhiên)", "Thuộc chuỗi Tuần lễ vàng"],
            ["5月5日", "こどもの日 (こどもの ひ)", "Ngày Trẻ em", "Tết thiếu nhi / Cờ cá chép Koinobori"],
            ["7月第3月曜日 ***", "海の日 (うみの ひ)", "Ngày Biển", "Thứ hai của tuần thứ 3 tháng 7"],
            ["8月11日", "山の日 (やまの ひ)", "Ngày Núi", "Cảm tạ sự ưu đãi của núi rừng"],
            ["9月第3月曜日 ***", "敬老の日 (けいろうの ひ)", "Ngày Kính lão", "Thứ hai của tuần thứ 3 tháng 9"],
            ["9月23日頃 *", "秋分の日 (しゅうぶんの ひ)", "Ngày Thu phân", "Thay đổi ngày theo từng năm"],
            ["10月第2月曜日 **", "体育の日 / スポーツの日 (たいいくの ひ)", "Ngày Thể thao", "Thứ hai của tuần thứ 2 tháng 10"],
            ["11月3日", "文化の日 (ぶんかの ひ)", "Ngày Văn hóa", "Yêu tự do, hòa bình và văn hóa"],
            ["11月23日", "勤労感謝の日 (きんろう かんしゃの ひ)", "Ngày Cảm tạ lao động", "Tôn vinh người lao động"],
            ["12月23日", "天皇誕生日 (てんのう たんじょうび)", "Sinh nhật của Thiên hoàng", "Sinh nhật Nhật hoàng Akihito"],
          ],
        },
        {
          type: "note",
          text: "Chú thích quy tắc nghỉ lễ & Golden Week:\n• (*) Thay đổi theo năm (như Ngày Xuân phân & Ngày Thu phân).\n• (**) Thứ hai của tuần thứ hai trong tháng.\n• (***) Thứ hai của tuần thứ ba trong tháng.\n\n💡 Văn hóa Nhật Bản: Nếu một ngày nghỉ quốc gia rơi vào Chủ nhật thì ngày Thứ hai liền sau sẽ được nghỉ bù (振替休日 - Furikae Kyūjitsu).\n💡 Tuần lễ vàng (ゴールデンウィーク - Golden Week): Chuỗi ngày nghỉ liền kề từ 29/4 đến 5/5. Nhiều công ty Nhật Bản cho nhân viên nghỉ trọn vẹn cả tuần để du lịch & nghỉ dưỡng.",
        },
      ],
    },
    {
      id: "grammar",
      title: "IV. Giải thích ngữ pháp",
      blocks: [
        {
          type: "grammar-pattern",
          pattern: "1. Danh từ (địa điểm) へ 行きます ／ 来ます ／ 帰ります",
          explanation:
            "Khi sử dụng các động từ chỉ sự di chuyển (行きます, 来ます, 帰ります), dùng trợ từ へ để chỉ phương hướng di chuyển.",
          subPoints: [
            {
              label: "Lưu ý phát âm",
              text: "Trợ từ へ khi đóng vai trò trợ từ chỉ phương hướng thì phát âm là え (e).",
            },
          ],
          examples: [
            {
              jp: "① 京都へ 行きます。",
              vi: "Tôi đi Kyoto.",
            },
            {
              jp: "② 日本へ 来ました。",
              vi: "Tôi (đã) đến Nhật Bản.",
            },
            {
              jp: "③ うちへ 帰ります。",
              vi: "Tôi về nhà.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "2. どこ［へ］も 行きません ／ 行きませんでした",
          explanation:
            "Khi muốn phủ định hoàn toàn đối tượng trong phạm vi được hỏi bởi nghi vấn từ, thêm trợ từ も vào sau nghi vấn từ và chuyển động từ sang dạng phủ định (ません / ませんでした).",
          examples: [
            {
              jp: "④ どこ［へ］も 行きません。",
              vi: "Tôi không đi đâu cả.",
            },
            {
              jp: "⑤ 何も 食べません。",
              vi: "Tôi không ăn gì cả. (Bài 6)",
            },
            {
              jp: "⑥ だれも 来ませんでした。",
              vi: "Không có ai đến cả.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "3. Danh từ (phương tiện) で 行きます ／ 来ます ／ 帰ります",
          explanation:
            "Trợ từ で biểu thị phương tiện hay cách thức tiến hành hành động. Khi đứng sau danh từ chỉ phương tiện giao thông, で có nghĩa là 'bằng...'.",
          subPoints: [
            {
              label: "Lưu ý trường hợp đi bộ",
              text: "Khi đi bộ thì dùng cụm 歩いて (あるいて) mà KHÔNG kèm theo trợ từ で.",
            },
          ],
          examples: [
            {
              jp: "⑦ 電車で 行きます。",
              vi: "Tôi đi bằng tàu điện.",
            },
            {
              jp: "⑧ タクシーで 来ました。",
              vi: "Tôi (đã) đến bằng tác-xi.",
            },
            {
              jp: "⑨ 駅から 歩いて 帰りました。",
              vi: "Tôi (đã) đi bộ từ ga về nhà. (Dùng 歩いて, không dùng で)",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "4. Danh từ (người / động vật) と Động từ",
          explanation:
            "Trợ từ と dùng để biểu thị đối tượng (người hoặc động vật) cùng thực hiện hành động, có nghĩa là 'cùng với...'.",
          subPoints: [
            {
              label: "Lưu ý hành động một mình",
              text: "Khi thực hiện hành động một mình thì dùng 一人で (ひとり で) và KHÔNG dùng trợ từ と.",
            },
          ],
          examples: [
            {
              jp: "⑩ 家族と 日本へ 来ました。",
              vi: "Tôi (đã) đến Nhật Bản cùng với gia đình.",
            },
            {
              jp: "⑪ 一人で 東京へ 行きます。",
              vi: "Tôi đi Tokyo một mình.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "5. Nghi vấn từ いつ (Khi nào / Bao giờ)",
          explanation:
            "Khi muốn hỏi về thời gian thì ngoài cách dùng nghi vấn từ 何 (何時, 何月, 何日...), ta có thể dùng nghi vấn từ いつ. Đối với いつ thì KHÔNG dùng trợ từ に ở sau.",
          examples: [
            {
              jp: "⑫ いつ 日本へ 来ましたか。 ……3月25日に 来ました。",
              vi: "Khi nào anh/chị đến Nhật? …Tôi đến vào ngày 25 tháng 3.",
            },
            {
              jp: "⑬ いつ 広島へ 行きますか。 ……来週 行きます。",
              vi: "Khi nào anh/chị sẽ đi Hiroshima? …Tuần sau tôi sẽ đi.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "6. Trợ từ ～よ (Nhấn mạnh thông tin mới / Nhắc nhở)",
          explanation:
            "Trợ từ よ được đặt ở cuối câu để nhấn mạnh thông tin mới mà người nghe chưa biết, hoặc truyền đạt sự phán đoán/ý kiến của người nói.",
          examples: [
            {
              jp: "⑭ この 電車は 甲子園へ 行きますか。 ……いいえ、行きません。次の「普通」ですよ。",
              vi: "Tàu điện này có đi Koshien không? …Không, không đi. Chuyến tàu thường tiếp theo mới đi cơ.",
            },
            {
              jp: "⑮ 北海道に 馬が たくさん いますよ。",
              vi: "Ở Hokkaido có nhiều ngựa lắm đấy.",
            },
            {
              jp: "⑯ マリアさん、この アイスクリーム、おいしいですよ。",
              vi: "Chị Maria ơi, kem này ngon lắm đấy.",
            },
          ],
        },
        {
          type: "grammar-pattern",
          pattern: "7. Cụm từ そうですね (Ứ, nhỉ / Đúng vậy nhỉ)",
          explanation:
            "そうですね là biểu hiện thể hiện sự đồng ý, đồng cảm với điều đối phương vừa nói. Khác với そうですか (tiếp nhận thông tin mới chưa biết), そうですね dùng khi cả hai cùng biết hoặc cùng có chung suy nghĩ.",
          examples: [
            {
              jp: "⑰ あしたは 日曜日ですね。 ……あ、そうですね。",
              vi: "Ngày mai là chủ nhật nhỉ? …A, ừ nhỉ.",
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
          title: "Bài tập 1: Điền trợ từ (へ, で, と, も, に, いつ, 何)",
          instruction: "Chọn trợ từ hoặc nghi vấn từ thích hợp nhất để hoàn thành các câu bên dưới.",
          questions: [
            {
              id: "l5-q1",
              promptPre: "わたしは 京都",
              promptPost: " 行きます。",
              options: ["へ", "で", "と", "に"],
              correctAnswer: "へ",
              explanation: "Trợ từ へ (đọc là e) chỉ phương hướng di chuyển với động từ 行きます.",
              fullSentenceJp: "わたしは 京都へ 行きます。",
              fullSentenceVi: "Tôi đi Kyoto.",
            },
            {
              id: "l5-q2",
              promptPre: "タクシー",
              promptPost: " うちへ 帰ります。",
              options: ["で", "へ", "と", "も"],
              correctAnswer: "で",
              explanation: "Trợ từ で chỉ phương tiện giao thông (đi bằng tác-xi).",
              fullSentenceJp: "タクシーで うちへ 帰ります。",
              fullSentenceVi: "Tôi về nhà bằng tác-xi.",
            },
            {
              id: "l5-q3",
              promptPre: "家族",
              promptPost: " 日本へ 来ました。",
              options: ["と", "で", "へ", "に"],
              correctAnswer: "と",
              explanation: "Trợ từ と chỉ người/động vật cùng thực hiện hành động (cùng với gia đình).",
              fullSentenceJp: "家族と 日本へ 来ました。",
              fullSentenceVi: "Tôi đã đến Nhật Bản cùng với gia đình.",
            },
            {
              id: "l5-q4",
              promptPre: "日曜日 どこへ 行きましたか。 - どこへ",
              promptPost: " 行きませんでした。",
              options: ["も", "へ", "で", "と"],
              correctAnswer: "も",
              explanation: "Phủ định hoàn toàn: Nghi vấn từ + も + Phủ định (どこへも 行きませんでした).",
              fullSentenceJp: "日曜日 どこへ 行きましたか。 - どこへも 行きませんでした。",
              fullSentenceVi: "Chủ nhật anh/chị đã đi đâu? - Tôi không đi đâu cả.",
            },
            {
              id: "l5-q5",
              promptPre: "駅から 歩い",
              promptPost: " 帰りました。",
              options: ["て", "で", "へ", "と"],
              correctAnswer: "て",
              explanation: "Đi bộ dùng cụm 歩いて (không dùng trợ từ で).",
              fullSentenceJp: "駅から 歩いて 帰りました。",
              fullSentenceVi: "Tôi đã đi bộ từ ga về nhà.",
            },
            {
              id: "l5-q6",
              promptPre: "一人",
              promptPost: " 東京へ 行きます。",
              options: ["で", "と", "へ", "に"],
              correctAnswer: "で",
              explanation: "Đi một mình dùng cụm 一人で (一人で 行きます).",
              fullSentenceJp: "一人で 東京へ 行きます。",
              fullSentenceVi: "Tôi đi Tokyo một mình.",
            },
            {
              id: "l5-q7",
              promptPre: "",
              promptPost: " 日本へ 来ましたか。 - 3月25日に 来ました。",
              options: ["いつ", "なんじ", "どこ", "だれ"],
              correctAnswer: "いつ",
              explanation: "Hỏi bao giờ/khi nào không dùng số đếm thì dùng nghi vấn từ いつ.",
              fullSentenceJp: "いつ 日本へ 来ましたか。 - 3月25日に 来ました。",
              fullSentenceVi: "Khi nào anh/chị đến Nhật? - Tôi đã đến vào ngày 25 tháng 3.",
            },
            {
              id: "l5-q8",
              promptPre: "この 電車は 甲子園へ 行きますか。 - いいえ、次の「普通」です",
              promptPost: "。",
              options: ["よ", "ね", "か", "の"],
              correctAnswer: "よ",
              explanation: "Trợ từ よ ở cuối câu dùng để cung cấp thông tin mới cho người nghe.",
              fullSentenceJp: "この 電車は 甲子園へ 行きますか。 - いいえ、次の「普通」ですよ。",
              fullSentenceVi: "Tàu điện này có đi Koshien không? - Không, chuyến tàu thường tiếp theo mới đi cơ.",
            },
          ],
        },
        {
          type: "exercise-multiple-choice",
          title: "Bài tập 2: Trắc nghiệm Từ vựng & Ngữ pháp Bài 5",
          instruction: "Chọn phương án trả lời đúng nhất.",
          questions: [
            {
              id: "l5-mc1",
              question: "Cách đọc các ngày đặc biệt 1日, 4日, 8日, 14日, 20日 lần lượt là gì?",
              options: [
                "ついたち, よっか, ようか, じゅうよっか, はつか",
                "いちにち, よんちに, はちちに, じゅうよんちに, にじゅうにち",
                "ついたち, よんか, はちか, じゅうよんか, にじゅうか",
                "ふつか, みっか, むいか, とおか, はつか",
              ],
              correctAnswerIndex: 0,
              explanation: "1日 (ついたち), 4日 (よっか), 8日 (ようか), 14日 (じゅうよっか), 20日 (はつか).",
            },
            {
              id: "l5-mc2",
              question: "Để chỉ phương hướng di chuyển 'đi đến địa điểm X', ta dùng trợ từ nào?",
              options: ["へ", "で", "と", "を"],
              correctAnswerIndex: 0,
              explanation: "Trợ từ へ (đọc là e) đi với động từ di chuyển chỉ hướng đi.",
            },
            {
              id: "l5-mc3",
              question: "Mẫu câu 'Tôi đi bộ từ nhà đến trường' trong tiếng Nhật nói như thế nào?",
              options: [
                "うちから 学校まで 歩いて 行きます。",
                "うちから 学校まで 歩いてで 行きます。",
                "うちから 学校まで 歩くと 行きます。",
                "うちから 学校まで 歩いてへ 行きます。",
              ],
              correctAnswerIndex: 0,
              explanation: "Đi bộ dùng cụm 歩いて (không dùng trợ từ で).",
            },
            {
              id: "l5-mc4",
              question: "Nghi vấn từ thời gian nào sau đây KHÔNG đi với trợ từ 'に'?",
              options: ["いつ", "何時", "何日", "何月"],
              correctAnswerIndex: 0,
              explanation: "Nghi vấn từ いつ KHÔNG dùng trợ từ に ở phía sau.",
            },
            {
              id: "l5-mc5",
              question: "Cụm từ 'どういたしまして' có nghĩa là gì?",
              options: [
                "Không có gì đâu (anh/chị đừng bận tâm)",
                "Cảm ơn rất nhiều",
                "Xin chào quý khách",
                "Hẹn gặp lại",
              ],
              correctAnswerIndex: 0,
              explanation: "どういたしまして là câu đáp lại lời cảm ơn (Không có gì đâu).",
            },
          ],
        },
        {
          type: "exercise-sentence-practice",
          title: "Bài tập 3: Luyện tập mẫu câu & Hội thoại Bài 5",
          instruction: "Tự nói câu tiếng Nhật dựa trên gợi ý tiếng Việt, sau đó bấm 'Xem đáp án' để kiểm tra phát âm.",
          items: [
            {
              id: "l5-sp1",
              vi: "Ngày mai anh/chị sẽ đi đâu? - Tôi sẽ đi Nara.",
              jp: "どこへ 行きますか。 - 奈良へ 行きます。",
              hint: "Dùng どこへ 行きますか.",
              breakdown: "どこ (đâu) + へ (chỉ hướng) + 行きますか. 奈良 (Nara) + へ + 行きます.",
            },
            {
              id: "l5-sp2",
              vi: "Anh/Chị đi Tokyo bằng phương tiện gì? - Tôi đi bằng Shinkansen.",
              jp: "何で 東京へ 行きますか。 - 新幹線で 行きます。",
              hint: "Dùng 何で và 新幹線で.",
              breakdown: "何で (bằng gì) + 東京へ (đến Tokyo) + 行きますか. 新幹線で (bằng Shinkansen) + 行きます.",
            },
            {
              id: "l5-sp3",
              vi: "Anh/Chị đi Tokyo cùng với ai? - Tôi đi cùng với anh Yamada.",
              jp: "だれと 東京へ 行きますか。 - 山田さんと 行きます。",
              hint: "Dùng だれと và 山田さんと.",
              breakdown: "だれ (ai) + と (cùng với) + 東京へ 行きますか. 山田さん + と + 行きます.",
            },
            {
              id: "l5-sp4",
              vi: "Chủ nhật anh/chị đã đi đâu? - Tôi không đi đâu cả.",
              jp: "日曜日 どこへ 行きましたか。 - どこ［へ］も 行きませんでした。",
              hint: "Dùng どこへも 行きませんでした.",
              breakdown: "日曜日 (Chủ nhật) + どこへ 行きましたか. どこへも (không đi đâu cả) + 行きませんでした.",
            },
          ],
        },
        {
          type: "exercise-reorder-sentence",
          title: "Bài tập 4: Sắp xếp từ thành câu hoàn chỉnh (Luyện tập cấu trúc Bài 5)",
          instruction: "Bấm vào các từ gợi ý theo đúng thứ tự ngữ pháp để ghép thành câu tiếng Nhật hoàn chỉnh.",
          questions: [
            {
              id: "l5-ro1",
              words: ["行きます", "へ", "わたし は", "京都"],
              correctOrder: ["わたし は", "京都", "へ", "行きます"],
              fullSentenceJp: "わたし は 京都 へ 行きます。",
              fullSentenceVi: "Tôi đi Kyoto.",
              explanation: "Chủ ngữ (わたしは) + Địa điểm (京都) + へ + 行きます.",
            },
            {
              id: "l5-ro2",
              words: ["かえります", "で", "タクシー", "うち へ"],
              correctOrder: ["タクシー", "で", "うち へ", "かえります"],
              fullSentenceJp: "タクシー で うち へ かえります。",
              fullSentenceVi: "Tôi về nhà bằng tác-xi.",
              explanation: "Phương tiện (タクシーで) + Địa điểm hướng đi (うちへ) + かえります.",
            },
            {
              id: "l5-ro3",
              words: ["きました", "と", "家族", "日本 へ"],
              correctOrder: ["家族", "と", "日本 へ", "きました"],
              fullSentenceJp: "家族 と 日本 へ きました。",
              fullSentenceVi: "Tôi đã đến Nhật Bản cùng với gia đình.",
              explanation: "Đối tượng đi cùng (家族と) + Địa điểm hướng đi (日本へ) + きました.",
            },
            {
              id: "l5-ro4",
              words: ["いきませんでした", "も", "どこ へ"],
              correctOrder: ["どこ へ", "も", "いきませんでした"],
              fullSentenceJp: "どこ へ も いきませんでした。",
              fullSentenceVi: "Tôi không đi đâu cả.",
              explanation: "Nghi vấn từ (どこへ) + も + Phủ định quá khứ (いきませんでした).",
            },
          ],
        },
      ],
    },
  ],
};
