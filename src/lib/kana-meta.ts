/**
 * Metadata definitions for Kana characters: Origin Kanji, Stroke order tips,
 * Sample vocabulary words, and Memory tips (Mẹo ghi nhớ).
 */

export interface KanaMeta {
  originKanji?: string;
  originName?: string;
  memoryTip?: string;
  strokeSteps?: string[];
  sampleWords?: { jp: string; romaji: string; vi: string }[];
}

export const KANA_META: Record<string, KanaMeta> = {
  あ: {
    originKanji: "安",
    originName: "Nguyên âm hàng A",
    memoryTip:
      "Hãy liên kết các nét uốn lượn của Hiragana với các hình ảnh đời sống. Chữ あ (a) giống như một quả táo có cuống và vòng thân tròn.",
    strokeSteps: ["Nét 1: Ngang nhẹ", "Nét 2: Dọc hạ tâm", "Nét 3: Vòng xoắn"],
    sampleWords: [
      { jp: "ありがとう", romaji: "Arigatou", vi: "Cảm ơn" },
      { jp: "あめ", romaji: "Ame", vi: "Cơn mưa / Kẹo" },
    ],
  },
  い: {
    originKanji: "以",
    originName: "Nguyên âm hàng I",
    memoryTip:
      "Chữ い (i) giống hai đường chéo song song hai chiếc đũa dựng cạnh nhau.",
    strokeSteps: ["Nét 1: Nét phẩy cong dài", "Nét 2: Nét móc ngắn bên phải"],
    sampleWords: [
      { jp: "いいえ", romaji: "Iie", vi: "Không, Không có chi" },
      { jp: "いぬ", romaji: "Inu", vi: "Con chó" },
    ],
  },
  う: {
    originKanji: "宇",
    originName: "Nguyên âm hàng U",
    memoryTip:
      "Chữ う (u) giống như hình một người đang cúi gập lưng tập thể dục.",
    strokeSteps: ["Nét 1: Nét chấm nghiêng", "Nét 2: Nét cong uốn xuống"],
    sampleWords: [
      { jp: "うみ", romaji: "Umi", vi: "Biển" },
      { jp: "うた", romaji: "Uta", vi: "Bài hát" },
    ],
  },
  え: {
    originKanji: "衣",
    originName: "Nguyên âm hàng E",
    memoryTip:
      "Chữ え (e) giống như hình một người đang chạy tập thể dục qua đường.",
    strokeSteps: ["Nét 1: Nét chấm nghiêng", "Nét 2: Nét gập uốn ziczac"],
    sampleWords: [
      { jp: "えき", romaji: "Eki", vi: "Nhà ga" },
      { jp: "えん", romaji: "En", vi: "Đồng Yên Nhật" },
    ],
  },
  お: {
    originKanji: "於",
    originName: "Nguyên âm hàng O",
    memoryTip:
      "Chữ お (o) giống như một cầu thủ bóng đá đang tung chân sút quả bóng vào lưới.",
    strokeSteps: ["Nét 1: Nét ngang ngắn", "Nét 2: Dọc móc uốn tròn", "Nét 3: Nét chấm phẩy"],
    sampleWords: [
      { jp: "おはよう", romaji: "Ohayou", vi: "Xin chào buổi sáng" },
      { jp: "お茶", romaji: "Ocha", vi: "Trà xanh" },
    ],
  },
  か: {
    originKanji: "加",
    originName: "Hàng Ka (か-行)",
    memoryTip:
      "Chữ か (ka) giống hình cái đao chém dũng mãnh, bên cạnh có dấu chấm nhỏ.",
    strokeSteps: ["Nét 1: Nét cong móc", "Nét 2: Nét phẩy dọc", "Nét 3: Nét chấm phải"],
    sampleWords: [
      { jp: "かさ", romaji: "Kasa", vi: "Cây ô, chiếc dù" },
      { jp: "かわ", romaji: "Kawa", vi: "Dòng sông" },
    ],
  },
  き: {
    originKanji: "幾",
    originName: "Hàng Ka (か-行)",
    memoryTip: "Chữ き (ki) giống như hình chiếc chìa khóa (Key) có hai nấc ngang.",
    strokeSteps: ["Nét 1: Ngang trên", "Nét 2: Ngang dưới", "Nét 3: Dọc nghiêng", "Nét 4: Cong đáy"],
    sampleWords: [
      { jp: "きのう", romaji: "Kinou", vi: "Hôm qua" },
      { jp: "きょう", romaji: "Kyou", vi: "Hôm nay" },
    ],
  },
  く: {
    originKanji: "久",
    originName: "Hàng Ka (か-行)",
    memoryTip: "Chữ く (ku) giống như mỏ con chim Cú đang há ra hót.",
    strokeSteps: ["Nét 1: Nét gập góc nhọn 75 độ"],
    sampleWords: [
      { jp: "くるま", romaji: "Kuruma", vi: "Xe hơi, ô tô" },
      { jp: "くつ", romaji: "Kutsu", vi: "Đôi giày" },
    ],
  },
  け: {
    originKanji: "計",
    originName: "Hàng Ka (か-行)",
    memoryTip: "Chữ け (ke) giống hình cái búp Kệ cắm cạnh hàng rào gỗ.",
    strokeSteps: ["Nét 1: Dọc móc bên trái", "Nét 2: Ngang ngắn", "Nét 3: Dọc thẳng bên phải"],
    sampleWords: [
      { jp: "けさ", romaji: "Kesa", vi: "Sáng nay" },
      { jp: "けいさつ", romaji: "Keisatsu", vi: "Cảnh sát" },
    ],
  },
  こ: {
    originKanji: "己",
    originName: "Hàng Ka (か-行)",
    memoryTip: "Chữ こ (ko) giống hai khoanh giò cá nằm ngang song song.",
    strokeSteps: ["Nét 1: Ngang móc nhẹ trên", "Nét 2: Ngang uốn dưới"],
    sampleWords: [
      { jp: "こども", romaji: "Kodomo", vi: "Trẻ em" },
      { jp: "ここ", romaji: "Koko", vi: "Ở đây" },
    ],
  },
};

export function getKanaMeta(char: string): KanaMeta {
  if (KANA_META[char]) return KANA_META[char];

  // Default fallback meta for any character not explicitly listed
  return {
    originName: `Ký tự ${char}`,
    memoryTip: `Liên kết chữ ${char} với hình ảnh trực quan giúp bộ nhớ dài hạn ghi nhớ nét chữ lâu hơn.`,
    strokeSteps: ["Nét 1: Khởi nét chuẩn xác", "Nét 2: Uốn lượn tự nhiên"],
    sampleWords: [
      { jp: `${char}言葉`, romaji: `${char}kotoba`, vi: `Từ vựng chứa chữ ${char}` },
    ],
  };
}
