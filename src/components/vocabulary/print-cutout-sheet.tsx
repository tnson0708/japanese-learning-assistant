import { useLanguage } from "@/lib/language-context";
import type { VocabWord } from "@/lib/vocabulary";

export interface PrintCutoutGroup {
  heading?: string;
  words: VocabWord[];
}

/** Hidden-except-when-printing sheet of dashed-border word tags, meant to be cut apart and taped onto real objects. */
export function PrintCutoutSheet({ title, groups }: { title: string; groups: PrintCutoutGroup[] }) {
  const { t } = useLanguage();

  return (
    <div className="hidden print:block font-sans text-black">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-400">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black">{title}</h1>
          <p className="text-xs text-gray-600">{t("vocab_print_instructions")}</p>
        </div>
        <span className="text-xs font-bold text-gray-700">仮名道場 • Kana Dojo</span>
      </div>

      {groups.map((group, gi) => (
        <div key={gi} className="mb-4 break-inside-avoid">
          {group.heading && <h2 className="text-sm font-bold text-black mb-2 mt-1">{group.heading}</h2>}
          <div className="grid grid-cols-3 gap-3">
            {group.words.map((word) => (
              <div
                key={word.id}
                className="flex min-h-[110px] flex-col justify-between rounded-lg border-2 border-dashed border-gray-400 bg-white p-3 shadow-none print:break-inside-avoid"
              >
                <div className="flex flex-col gap-0.5 pt-1">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-black">{word.word}</span>
                    {word.wordType === "kanji" && (
                      <span className="text-xs font-semibold text-gray-600">({word.reading})</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-0.5 border-t border-dashed border-gray-300 pt-1.5">
                  <span className="text-xs font-bold leading-tight text-black">{word.meaning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
