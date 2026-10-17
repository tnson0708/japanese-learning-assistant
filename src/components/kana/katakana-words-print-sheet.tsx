import { katakanaWordGroups } from "@/data/katakana-words";

/**
 * Print-only katakana reading-practice list (Katakana tab → "In từ vựng Katakana").
 * Shares the `data-print-vocab` print mode and `.vocab-print-*` table styles with the
 * lesson vocabulary sheet, so only this sheet is printed. The Romaji column follows the
 * tab's "Ẩn / Hiện Romaji" toggle, so learners can print a kana-only reading test.
 */
export function KatakanaWordsPrintSheet({ showRomaji }: { showRomaji: boolean }) {
  let index = 0;
  const groups = katakanaWordGroups.map((group) => ({
    ...group,
    words: group.words.map((word) => ({ ...word, index: ++index })),
  }));

  return (
    <div className="vocab-print-sheet hidden print:block text-black">
      <h1 className="mb-0.5 text-[14pt] font-bold">Luyện đọc từ vựng Katakana</h1>
      <p className="mb-2 text-[9pt] text-neutral-600">
        {index} từ thông dụng · Mẹo: che cột {showRomaji ? "Romaji và Nghĩa" : "Nghĩa"} để tự kiểm tra khả năng đọc.
      </p>

      <table className="vocab-print-table vocab-print-compact">
        <thead>
          <tr>
            <th className="w-[5%]">#</th>
            <th className="w-[17%]">Katakana</th>
            {showRomaji && <th className="w-[14%]">Romaji</th>}
            <th className="w-[17%]">Nghĩa</th>
            <th>Câu ví dụ</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => [
            <tr key={group.topic}>
              <td colSpan={showRomaji ? 5 : 4} className="vocab-print-group">
                {group.topic}
              </td>
            </tr>,
            ...group.words.map((word) => (
              <tr key={word.word}>
                <td className="text-center text-neutral-500">{word.index}</td>
                <td className="text-[11pt] font-semibold">{word.word}</td>
                {showRomaji && <td>{word.romaji}</td>}
                <td>{word.meaning}</td>
                <td>
                  {word.example}
                  <div className="text-[8pt] text-neutral-600">{word.exampleVi}</div>
                </td>
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  );
}
