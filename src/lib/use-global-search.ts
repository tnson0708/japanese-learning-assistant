import { BASIC_KANJI_WORDS } from "@/lib/basic-kanji";
import { EXTRA_KANJI_WORDS } from "@/lib/extra-kanji";
import { KANJI_RADICALS } from "@/lib/kanji-radicals";
import { DOMAINS } from "@/data/vocabulary";
import { PHRASE_LIST } from "@/lib/phrases";
import { lessonList } from "@/lib/theory";
import { kanaList } from "@/lib/kana";
import { kanaToRomaji } from "@/lib/romaji";
import { normalizeRomaji, normalizeSearch } from "@/lib/search-text";

export type SearchResultCategory =
  | "kanji"
  | "vocabulary"
  | "phrases"
  | "theory"
  | "kana";

export interface SearchResultItem {
  id: string;
  category: SearchResultCategory;
  categoryLabelVi: string;
  categoryLabelEn: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  audioText?: string;
  /** Page that shows this exact item (with tab / highlight params where needed). */
  href: string;
}

/** Raw fields of one searchable entry, grouped by how they should be compared. */
interface SearchFields {
  /** Japanese forms (kana / kanji), compared as-is. */
  jp?: (string | undefined)[];
  /** Romaji (or kana to convert), compared ignoring long-vowel spelling. */
  romaji?: (string | undefined)[];
  /** Vietnamese / English text, compared without diacritics. */
  text?: (string | undefined)[];
}

/**
 * One entry of the prebuilt index: every field is already normalized, so a keystroke
 * only does plain string comparisons (no kana → romaji, no diacritic stripping).
 */
interface IndexEntry {
  item: SearchResultItem;
  jp: string[];
  romaji: string[];
  text: string[];
  /** Comma-separated parts of `text` ("đi, đến" → "đi", "đến"), scored slightly lower. */
  parts: string[];
  /** Added to the score (e.g. -10 for example words, so the headword ranks first). */
  offset: number;
  /** Ignore matches scoring below this (kana only count on exact / prefix hits). */
  minScore: number;
}

interface Query {
  raw: string;
  text: string;
  romaji: string;
  isLatin: boolean;
}

const MAX_RESULTS = 80;
const MAX_PER_CATEGORY = 30;

/** Bracketed hints and tildes are not part of the word: "やすみます［かいしゃを～］" → "やすみます". */
function stripAnnotations(text: string) {
  return text.replace(/[［\[（(][^］\]）)]*[］\]）)]/g, "").replace(/[～~]/g, "").trim();
}

const MACRON: Record<string, string> = { a: "ā", i: "ī", u: "ū", e: "ē", o: "ō" };

/** Display romaji: kanaToRomaji writes the long-vowel mark ー as "-" (ko-hi-) → kōhī. */
function displayRomaji(kana: string) {
  return kanaToRomaji(kana).replace(/([aiueo])-/g, (_, v: string) => MACRON[v]).replace(/-/g, "");
}

function theoryHref(lessonId: number, tab: string, targets: (string | undefined)[]) {
  const params = new URLSearchParams({ tab });
  const [word, kana] = targets.map((t) => (t ? stripAnnotations(t) : undefined));
  if (word) params.set("w", word);
  if (kana && kana !== word) params.set("k", kana);
  return `/theory/${lessonId}?${params.toString()}`;
}

// ---- index ------------------------------------------------------------------

function present(values: (string | undefined)[] | undefined): string[] {
  return (values ?? []).filter((v): v is string => Boolean(v));
}

function makeEntry(
  item: SearchResultItem,
  fields: SearchFields,
  { offset = 0, minScore = 1 }: { offset?: number; minScore?: number } = {}
): IndexEntry {
  const jp = new Set<string>();
  for (const value of present(fields.jp)) {
    const lower = value.toLowerCase();
    jp.add(lower);
    jp.add(stripAnnotations(lower));
  }
  const text = present(fields.text).map(normalizeSearch);
  return {
    item,
    jp: [...jp].filter(Boolean),
    romaji: present(fields.romaji).map((r) => normalizeRomaji(stripAnnotations(r))).filter(Boolean),
    text,
    parts: text.flatMap((t) => t.split(/[,;/]/).map((p) => p.trim())).filter(Boolean),
    offset,
    minScore,
  };
}

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  // 1. LESSON VOCABULARY (Từ vựng + Tham khảo tabs of every theory lesson)
  for (const lesson of lessonList) {
    for (const section of lesson.sections) {
      if (section.id !== "vocabulary" && section.id !== "reference") continue;
      const isReference = section.id === "reference";

      section.blocks.forEach((block, bIdx) => {
        if (block.type === "vocab-list" || block.type === "vocab-group") {
          block.items.forEach((v, vIdx) => {
            const kana = stripAnnotations(v.jp);
            const word = v.kanji && !/^[［\[]/.test(v.kanji) ? v.kanji : undefined;
            entries.push(
              makeEntry(
                {
                  id: `lesson-vocab-${lesson.id}-${section.id}-${bIdx}-${vIdx}`,
                  category: "vocabulary",
                  categoryLabelVi: isReference ? `Tham khảo · Bài ${lesson.id}` : `Từ vựng · Bài ${lesson.id}`,
                  categoryLabelEn: isReference ? `Reference · Lesson ${lesson.id}` : `Vocabulary · Lesson ${lesson.id}`,
                  title: word ?? v.jp,
                  subtitle: `${word ? `${v.jp} · ` : ""}${displayRomaji(kana)}`,
                  description: v.meaning,
                  badge: `Bài ${lesson.id}`,
                  audioText: kana,
                  href: theoryHref(lesson.id, section.id, [word, v.jp]),
                },
                { jp: [v.jp, v.kanji], romaji: [kanaToRomaji(kana)], text: [v.meaning, v.note] }
              )
            );
          });
        } else if (block.type === "table") {
          const jpColumns = block.speakableColumns ?? [];
          block.rows.forEach((row, rIdx) => {
            const jpCells = jpColumns.map((c) => row[c]).filter(Boolean);
            const otherCells = row.filter((_, c) => !jpColumns.includes(c));
            const base = {
              id: `lesson-table-${lesson.id}-${section.id}-${bIdx}-${rIdx}`,
              category: "vocabulary" as const,
              categoryLabelVi: `Bảng tham khảo · Bài ${lesson.id}`,
              categoryLabelEn: `Reference table · Lesson ${lesson.id}`,
              subtitle: block.title,
              description: otherCells.join(" · "),
              badge: `Bài ${lesson.id}`,
            };
            // One variant per Japanese cell, so the result shows (and links to) the cell that
            // matched; variants share an id and only the best-scoring one is kept.
            const titles = jpCells.length > 0 ? jpCells : [row[0]];
            titles.forEach((cell, i) => {
              entries.push(
                makeEntry(
                  { ...base, title: cell, audioText: cell, href: theoryHref(lesson.id, section.id, [cell]) },
                  { jp: [cell], romaji: [kanaToRomaji(cell)], text: i === 0 ? otherCells : [] }
                )
              );
            });
          });
        }
      });
    }
  }

  // 2. TOPIC VOCABULARY (/vocabulary/{domain}/{subtopic})
  for (const domain of DOMAINS) {
    for (const subtopic of domain.subtopics) {
      for (const w of subtopic.words) {
        const params = new URLSearchParams({ w: w.word });
        if (w.reading !== w.word) params.set("k", w.reading);
        entries.push(
          makeEntry(
            {
              id: `vocab-${w.id}`,
              category: "vocabulary",
              categoryLabelVi: `Từ vựng chủ đề · ${subtopic.nameVi ?? subtopic.name}`,
              categoryLabelEn: `Topic vocab · ${subtopic.name}`,
              title: w.word,
              subtitle:
                w.reading !== w.word
                  ? `${w.reading}${w.hanVietHint ? ` [${w.hanVietHint}]` : ""}`
                  : w.hanVietHint
                    ? `[${w.hanVietHint}]`
                    : undefined,
              description: w.meaning,
              badge: w.jlptLevel || domain.nameVi || domain.name,
              audioText: w.reading || w.word,
              href: `/vocabulary/${domain.id}/${subtopic.id}?${params.toString()}`,
            },
            { jp: [w.word, w.reading], romaji: [kanaToRomaji(w.reading)], text: [w.meaning, w.hanVietHint, w.englishSource] }
          )
        );
      }
    }
  }

  // 3. KANJI & RADICALS
  for (const [list, labelVi, labelEn, subtab, idPrefix] of [
    [BASIC_KANJI_WORDS, "Kanji cơ bản", "Basic Kanji", "kanji-100", "kanji"],
    [EXTRA_KANJI_WORDS, "Kanji mở rộng", "Extra Kanji", "kanji-extra", "kanji-extra"],
  ] as const) {
    for (const k of list) {
      const readings = k.hiragana.split("/").map((r) => r.trim());
      const base = {
        id: `${idPrefix}-${k.id}`,
        category: "kanji" as const,
        categoryLabelVi: labelVi,
        categoryLabelEn: labelEn,
        title: k.char,
        badge: `${k.strokes} nét`,
        href: `/kana?tab=kanji&subtab=${subtab}&q=${encodeURIComponent(k.char)}`,
      };
      entries.push(
        makeEntry(
          { ...base, subtitle: `${k.hanViet} (${k.hiragana})`, description: k.meaningVi, audioText: readings[0] || k.char },
          { jp: [k.char, ...readings], romaji: readings.map((r) => kanaToRomaji(r)), text: [k.hanViet, k.meaningVi, k.meaningEn] }
        )
      );
      // Example words: same result (same id), shown with the matched example, ranked a bit lower
      for (const ex of k.exampleWords) {
        entries.push(
          makeEntry(
            { ...base, subtitle: `${ex.word} (${ex.reading})`, description: ex.meaning, audioText: ex.reading },
            { jp: [ex.word, ex.reading], romaji: [kanaToRomaji(ex.reading)], text: [ex.meaning] },
            { offset: -10 }
          )
        );
      }
    }
  }

  for (const rad of KANJI_RADICALS) {
    entries.push(
      makeEntry(
        {
          id: `rad-${rad.id}`,
          category: "kanji",
          categoryLabelVi: "Bộ thủ Kanji",
          categoryLabelEn: "Kanji Radical",
          title: rad.char,
          subtitle: rad.hanViet,
          description: rad.meaningVi,
          badge: `Bộ thủ (${rad.strokes} nét)`,
          audioText: rad.char,
          href: `/kana?tab=kanji&subtab=radicals&q=${encodeURIComponent(rad.char)}`,
        },
        {
          jp: [rad.char, ...rad.exampleKanji.map((ex) => ex.char)],
          text: [rad.hanViet, rad.meaningVi, rad.meaningEn, ...rad.exampleKanji.map((ex) => ex.hanViet)],
        }
      )
    );
  }

  // 4. SITUATIONAL PHRASES (/phrases, pre-filtered to the phrase)
  for (const p of PHRASE_LIST) {
    entries.push(
      makeEntry(
        {
          id: `phrase-${p.id}`,
          category: "phrases",
          categoryLabelVi: "Mẫu câu giao tiếp",
          categoryLabelEn: "Situational Phrase",
          title: p.japanese,
          subtitle: p.hiragana,
          description: p.vietnamese,
          badge: p.formality === "polite" ? "Lịch sự" : p.formality === "formal" ? "Trang trọng" : "Thân mật",
          audioText: p.hiragana || p.japanese,
          href: `/phrases?q=${encodeURIComponent(p.japanese)}`,
        },
        { jp: [p.japanese, p.hiragana], romaji: [p.romaji], text: [p.vietnamese, p.english] }
      )
    );
  }

  // 5. GRAMMAR (lesson titles + grammar points → the lesson's Ngữ pháp tab)
  for (const lesson of lessonList) {
    const lessonTitle = lesson.title || `Bài ${lesson.id}`;
    entries.push(
      makeEntry(
        {
          id: `theory-lesson-${lesson.id}`,
          category: "theory",
          categoryLabelVi: "Bài học",
          categoryLabelEn: "Lesson",
          title: lessonTitle,
          subtitle: `Bài ${lesson.id}`,
          description: "Lý thuyết Minna no Nihongo",
          badge: `Bài ${lesson.id}`,
          audioText: lessonTitle,
          href: `/theory/${lesson.id}`,
        },
        { jp: [lessonTitle], text: [lessonTitle, `bai ${lesson.id}`] }
      )
    );

    for (const section of lesson.sections) {
      section.blocks.forEach((block, bIdx) => {
        if (block.type !== "grammar-pattern") return;
        entries.push(
          makeEntry(
            {
              id: `theory-gp-${lesson.id}-${bIdx}`,
              category: "theory",
              categoryLabelVi: "Điểm ngữ pháp",
              categoryLabelEn: "Grammar Point",
              title: block.pattern,
              subtitle: `Bài ${lesson.id} · Ngữ pháp`,
              description: block.explanation || "Mẫu cấu trúc ngữ pháp",
              badge: `Bài ${lesson.id}`,
              audioText: block.pattern,
              href: theoryHref(lesson.id, section.id, [block.pattern]),
            },
            {
              jp: [block.pattern, ...(block.examples?.map((ex) => ex.jp) ?? [])],
              text: [block.pattern, block.explanation, ...(block.examples?.map((ex) => ex.vi) ?? [])],
            },
            { offset: -10 }
          )
        );
      });
    }
  }

  // 6. KANA (Hiragana & Katakana chart, pre-filtered to the character)
  for (const kana of kanaList) {
    entries.push(
      makeEntry(
        {
          id: `kana-${kana.id}`,
          category: "kana",
          categoryLabelVi: "Bảng chữ cái Kana",
          categoryLabelEn: "Kana Character",
          title: kana.char,
          subtitle: `Romaji: /${kana.romaji}/`,
          description: kana.script === "hiragana" ? "Chữ Hiragana" : "Chữ Katakana",
          badge: kana.script.toUpperCase(),
          audioText: kana.char,
          href: `/kana?tab=${kana.script}&q=${encodeURIComponent(kana.char)}`,
        },
        { jp: [kana.char], romaji: [kana.romaji] },
        // Only exact / prefix hits, otherwise "a" lists half the chart
        { offset: -15, minScore: 70 }
      )
    );
  }

  return entries;
}

let cachedIndex: IndexEntry[] | null = null;

function getIndex(): IndexEntry[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

/** Builds the search index once (a few thousand entries) so the first keystroke is fast. */
export function prepareSearchIndex() {
  getIndex();
}

// ---- scoring ----------------------------------------------------------------

const WORD_BOUNDARY = /[\s,;/()・、]/;

/** `q` appears in `value` as a whole word ("ký túc xá" in "ký túc xá, nhà tập thể"). */
function containsWord(value: string, q: string) {
  let i = value.indexOf(q);
  while (i !== -1) {
    const before = i === 0 || WORD_BOUNDARY.test(value[i - 1]);
    const end = i + q.length;
    const after = end === value.length || WORD_BOUNDARY.test(value[end]);
    if (before && after) return true;
    i = value.indexOf(q, i + 1);
  }
  return false;
}

function scoreString(value: string, q: string): number {
  if (value === q) return 100;
  if (value.startsWith(q)) return 70;
  if (!value.includes(q)) return 0;
  return containsWord(value, q) ? 55 : 30;
}

function scoreEntry(entry: IndexEntry, query: Query): number {
  let best = 0;
  for (const value of entry.jp) best = Math.max(best, scoreString(value, query.raw));
  if (query.isLatin && query.romaji) {
    for (const value of entry.romaji) {
      const s = scoreString(value, query.romaji);
      // Short romaji fragments ("a", "ka") only count as whole / prefix matches
      best = Math.max(best, s >= 70 || query.romaji.length >= 3 ? s : 0);
    }
  }
  for (const value of entry.text) best = Math.max(best, scoreString(value, query.text));
  for (const value of entry.parts) best = Math.max(best, scoreString(value, query.text) - 5);
  if (best < entry.minScore) return 0;
  return best > 0 ? best + entry.offset : 0;
}

export function searchGlobal(rawQuery: string): SearchResultItem[] {
  const raw = rawQuery.trim().toLowerCase();
  if (!raw) return [];

  const text = normalizeSearch(raw);
  const query: Query = { raw, text, romaji: normalizeRomaji(raw), isLatin: /^[a-z\s'-]+$/.test(text) };

  const scored: { item: SearchResultItem; score: number }[] = [];
  for (const entry of getIndex()) {
    const score = scoreEntry(entry, query);
    if (score > 0) scored.push({ item: entry.item, score });
  }

  // Best matches first, capped per category so one big source cannot crowd out the rest
  scored.sort((a, b) => b.score - a.score);
  const perCategory: Record<string, number> = {};
  const results: SearchResultItem[] = [];
  const seenIds = new Set<string>();
  const seenWords = new Set<string>();
  for (const { item } of scored) {
    if (results.length >= MAX_RESULTS) break;
    // Variants of one result (kanji example words, table cells) share an id → keep the best
    if (seenIds.has(item.id)) continue;
    // Same word listed twice on one page (e.g. vocab list + reference) → keep the best one
    const wordKey = `${item.category}|${item.title}|${item.href.split("?")[0]}`;
    if (seenWords.has(wordKey)) continue;
    const count = perCategory[item.category] ?? 0;
    if (count >= MAX_PER_CATEGORY) continue;
    seenIds.add(item.id);
    seenWords.add(wordKey);
    perCategory[item.category] = count + 1;
    results.push(item);
  }
  return results;
}
