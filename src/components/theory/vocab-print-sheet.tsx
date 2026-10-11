import type { ContentBlock, Lesson, VocabItem } from "@/lib/theory";

type PrintBlock =
  | { kind: "vocab"; heading: string; items: VocabItem[]; startIndex: number }
  | { kind: "table"; title?: string; columns: string[]; rows: string[][] };

/** Vocabulary tables (vocab-list / vocab-group) and reference tables of one lesson section. */
function collectBlocks(blocks: ContentBlock[], fallbackHeading: string): PrintBlock[] {
  const out: PrintBlock[] = [];
  let startIndex = 1; // word numbering runs on across the groups of a section
  for (const block of blocks) {
    if (block.type === "vocab-list" || block.type === "vocab-group") {
      const heading = (block.type === "vocab-group" && block.heading) || fallbackHeading;
      out.push({ kind: "vocab", heading, items: block.items, startIndex });
      startIndex += block.items.length;
    } else if (block.type === "table") {
      out.push({ kind: "table", title: block.title, columns: block.columns, rows: block.rows });
    }
  }
  return out;
}

function VocabTable({ heading, items, startIndex }: { heading: string; items: VocabItem[]; startIndex: number }) {
  return (
    <table className="vocab-print-table">
      <caption>{heading}</caption>
      <thead>
        <tr>
          <th className="w-[6%]">#</th>
          <th className="w-[28%]">Tiếng Nhật</th>
          <th className="w-[20%]">Hán tự</th>
          <th>Nghĩa tiếng Việt</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td className="text-center text-neutral-500">{startIndex + i}</td>
            <td className="font-semibold">{item.jp}</td>
            <td>{item.kanji ?? ""}</td>
            <td>
              {item.meaning}
              {item.note && <div className="text-[9pt] italic text-neutral-600">{item.note}</div>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SectionBlocks({ blocks }: { blocks: PrintBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "vocab") {
          return <VocabTable key={i} heading={block.heading} items={block.items} startIndex={block.startIndex} />;
        }
        return (
          <table key={i} className="vocab-print-table">
            {block.title && <caption>{block.title}</caption>}
            <thead>
              <tr>
                {block.columns.map((col, c) => (
                  <th key={c}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
    </>
  );
}

/**
 * Print-only A4 vocabulary sheet of a lesson: the main vocabulary tab plus the
 * words/tables from the reference tab. Rendered outside the tabs so it prints
 * regardless of which tab is active (inactive tab panels are not in the DOM).
 */
export function VocabPrintSheet({ lesson }: { lesson: Lesson }) {
  const vocab = lesson.sections.find((s) => s.id === "vocabulary");
  const reference = lesson.sections.find((s) => s.id === "reference");
  const vocabBlocks = vocab ? collectBlocks(vocab.blocks, "Từ vựng") : [];
  const referenceBlocks = reference ? collectBlocks(reference.blocks, "Tham khảo") : [];

  return (
    <div className="vocab-print-sheet hidden print:block text-black">
      <h1 className="mb-1 text-[16pt] font-bold">{lesson.title}</h1>
      <p className="mb-4 text-[9pt] text-neutral-600">
        Họ tên: ................................................ Ngày: ......../......../............
      </p>

      {vocabBlocks.length > 0 && (
        <section>
          <h2 className="vocab-print-section">{vocab?.title ?? "Từ vựng"}</h2>
          <SectionBlocks blocks={vocabBlocks} />
        </section>
      )}

      {referenceBlocks.length > 0 && (
        <section>
          <h2 className="vocab-print-section">{reference?.title ?? "Từ và thông tin tham khảo"}</h2>
          <SectionBlocks blocks={referenceBlocks} />
        </section>
      )}
    </div>
  );
}
