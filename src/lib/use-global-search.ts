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

/** Ranked result; higher score = better match. */
interface Scored {
  item: SearchResultItem;
  score: number;
}

/** Fields of one searchable entry, grouped by how they should be compared. */
interface SearchFields {
  /** Japanese forms (kana / kanji), compared as-is. */
  jp?: (string | undefined)[];
  /** Romaji, compared ignoring long-vowel spelling. */
  romaji?: (string | undefined)[];
  /** Vietnamese / English text, compared without diacritics. */
  text?: (string | undefined)[];
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

function scoreString(value: string, q: string): number {
  if (!value || !q) return 0;
  if (value === q) return 100;
  if (value.startsWith(q)) return 70;
  // Whole-word hit inside a longer text ("ký túc xá" in "ký túc xá, nhà tập thể")
  if (new RegExp(`(^|[\\s,;/(・、])${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[\\s,;/)・、])`).test(value)) return 55;
  if (value.includes(q)) return 30;
  return 0;
}

function scoreFields(fields: SearchFields, query: Query): number {
  let best = 0;
  for (const value of fields.jp ?? []) {
    if (!value) continue;
    best = Math.max(best, scoreString(value, query.raw), scoreString(stripAnnotations(value), query.raw));
  }
  if (query.isLatin) {
    for (const value of fields.romaji ?? []) {
      if (!value) continue;
      const s = scoreString(normalizeRomaji(stripAnnotations(value)), query.romaji);
      // Short romaji fragments ("a", "ka") only count as whole/prefix matches
      best = Math.max(best, s >= 70 || query.romaji.length >= 3 ? s : 0);
    }
  }
  for (const value of fields.text ?? []) {
    if (!value) continue;
    // Meanings like "đi, đến" — also score each comma-separated part on its own
    const normalized = normalizeSearch(value);
    best = Math.max(best, scoreString(normalized, query.text));
    for (const part of normalized.split(/[,;/]/)) best = Math.max(best, scoreString(part.trim(), query.text) - 5);
  }
  return best;
}

function theoryHref(lessonId: number, tab: string, targets: (string | undefined)[]) {
  const params = new URLSearchParams({ tab });
  const [word, kana] = targets.map((t) => (t ? stripAnnotations(t) : undefined));
  if (word) params.set("w", word);
  if (kana && kana !== word) params.set("k", kana);
  return `/theory/${lessonId}?${params.toString()}`;
}

export function searchGlobal(rawQuery: string): SearchResultItem[] {
  const raw = rawQuery.trim().toLowerCase();
  if (!raw) return [];

  const query: Query = {
    raw,
    text: normalizeSearch(raw),
    romaji: normalizeRomaji(raw),
    isLatin: /^[a-z\s'-]+$/.test(normalizeSearch(raw)),
  };

  const scored: Scored[] = [];
  const add = (score: number, item: SearchResultItem) => {
    if (score > 0) scored.push({ item, score });
  };

  // 1. LESSON VOCABULARY (Từ vựng + Tham khảo tabs of every theory lesson)
  for (const lesson of lessonList) {
    for (const section of lesson.sections) {
      if (section.id !== "vocabulary" && section.id !== "reference") continue;
      const isReference = section.id === "reference";

      section.blocks.forEach((block, bIdx) => {
        if (block.type === "vocab-list" || block.type === "vocab-group") {
          block.items.forEach((v, vIdx) => {
            const score = scoreFields(
              { jp: [v.jp, v.kanji], romaji: [kanaToRomaji(stripAnnotations(v.jp))], text: [v.meaning, v.note] },
              query
            );
            const word = v.kanji && !/^[［\[]/.test(v.kanji) ? v.kanji : undefined;
            add(score, {
              id: `lesson-vocab-${lesson.id}-${section.id}-${bIdx}-${vIdx}`,
              category: "vocabulary",
              categoryLabelVi: isReference ? `Tham khảo · Bài ${lesson.id}` : `Từ vựng · Bài ${lesson.id}`,
              categoryLabelEn: isReference ? `Reference · Lesson ${lesson.id}` : `Vocabulary · Lesson ${lesson.id}`,
              title: word ?? v.jp,
              subtitle: `${word ? `${v.jp} · ` : ""}${displayRomaji(stripAnnotations(v.jp))}`,
              description: v.meaning,
              badge: `Bài ${lesson.id}`,
              audioText: stripAnnotations(v.jp),
              href: theoryHref(lesson.id, section.id, [word, v.jp]),
            });
          });
        } else if (block.type === "table") {
          const jpColumns = block.speakableColumns ?? [];
          block.rows.forEach((row, rIdx) => {
            const jpCells = jpColumns.map((c) => row[c]).filter(Boolean);
            const otherCells = row.filter((_, c) => !jpColumns.includes(c));
            const score = scoreFields(
              { jp: jpCells, romaji: jpCells.map((c) => kanaToRomaji(c)), text: otherCells },
              query
            );
            if (score === 0) return;
            const matchedJp = jpCells.find((c) => scoreFields({ jp: [c], romaji: [kanaToRomaji(c)] }, query) > 0);
            const title = matchedJp ?? jpCells[0] ?? row[0];
            add(score, {
              id: `lesson-table-${lesson.id}-${section.id}-${bIdx}-${rIdx}`,
              category: "vocabulary",
              categoryLabelVi: `Bảng tham khảo · Bài ${lesson.id}`,
              categoryLabelEn: `Reference table · Lesson ${lesson.id}`,
              title,
              subtitle: block.title,
              description: otherCells.join(" · "),
              badge: `Bài ${lesson.id}`,
              audioText: title,
              href: theoryHref(lesson.id, section.id, [title]),
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
        const score = scoreFields(
          {
            jp: [w.word, w.reading],
            romaji: [kanaToRomaji(w.reading)],
            text: [w.meaning, w.hanVietHint, w.englishSource],
          },
          query
        );
        const params = new URLSearchParams({ w: w.word });
        if (w.reading !== w.word) params.set("k", w.reading);
        add(score, {
          id: `vocab-${w.id}`,
          category: "vocabulary",
          categoryLabelVi: `Từ vựng chủ đề · ${subtopic.nameVi ?? subtopic.name}`,
          categoryLabelEn: `Topic vocab · ${subtopic.name}`,
          title: w.word,
          subtitle: w.reading !== w.word ? `${w.reading}${w.hanVietHint ? ` [${w.hanVietHint}]` : ""}` : w.hanVietHint ? `[${w.hanVietHint}]` : undefined,
          description: w.meaning,
          badge: w.jlptLevel || domain.nameVi || domain.name,
          audioText: w.reading || w.word,
          href: `/vocabulary/${domain.id}/${subtopic.id}?${params.toString()}`,
        });
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
      const ownScore = scoreFields(
        { jp: [k.char, ...readings], romaji: readings.map((r) => kanaToRomaji(r)), text: [k.hanViet, k.meaningVi, k.meaningEn] },
        query
      );
      // Example words count, slightly below the kanji itself
      let exampleScore = 0;
      let matchedExample: (typeof k.exampleWords)[number] | undefined;
      for (const ex of k.exampleWords) {
        const s = scoreFields({ jp: [ex.word, ex.reading], romaji: [kanaToRomaji(ex.reading)], text: [ex.meaning] }, query) - 10;
        if (s > exampleScore) {
          exampleScore = s;
          matchedExample = ex;
        }
      }
      const useExample = exampleScore > ownScore;
      add(Math.max(ownScore, exampleScore), {
        id: `${idPrefix}-${k.id}`,
        category: "kanji",
        categoryLabelVi: labelVi,
        categoryLabelEn: labelEn,
        title: k.char,
        subtitle: useExample && matchedExample ? `${matchedExample.word} (${matchedExample.reading})` : `${k.hanViet} (${k.hiragana})`,
        description: useExample && matchedExample ? matchedExample.meaning : k.meaningVi,
        badge: `${k.strokes} nét`,
        audioText: useExample && matchedExample ? matchedExample.reading : readings[0] || k.char,
        href: `/kana?tab=kanji&subtab=${subtab}&q=${encodeURIComponent(k.char)}`,
      });
    }
  }

  for (const rad of KANJI_RADICALS) {
    const score = scoreFields(
      {
        jp: [rad.char, ...rad.exampleKanji.map((ex) => ex.char)],
        text: [rad.hanViet, rad.meaningVi, rad.meaningEn, ...rad.exampleKanji.map((ex) => ex.hanViet)],
      },
      query
    );
    add(score, {
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
    });
  }

  // 4. SITUATIONAL PHRASES (/phrases, pre-filtered to the phrase)
  for (const p of PHRASE_LIST) {
    const score = scoreFields(
      { jp: [p.japanese, p.hiragana], romaji: [p.romaji], text: [p.vietnamese, p.english] },
      query
    );
    add(score, {
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
    });
  }

  // 5. GRAMMAR (lesson titles + grammar points → the lesson's Ngữ pháp tab)
  for (const lesson of lessonList) {
    const lessonTitle = lesson.title || `Bài ${lesson.id}`;
    add(scoreFields({ jp: [lessonTitle], text: [lessonTitle, `bai ${lesson.id}`] }, query), {
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
    });

    for (const section of lesson.sections) {
      section.blocks.forEach((block, bIdx) => {
        if (block.type !== "grammar-pattern") return;
        const score = scoreFields(
          {
            jp: [block.pattern, ...(block.examples?.map((ex) => ex.jp) ?? [])],
            text: [block.pattern, block.explanation, ...(block.examples?.map((ex) => ex.vi) ?? [])],
          },
          query
        );
        add(score - 10, {
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
        });
      });
    }
  }

  // 6. KANA (Hiragana & Katakana chart, pre-filtered to the character)
  for (const kana of kanaList) {
    const score = scoreFields({ jp: [kana.char], romaji: [kana.romaji] }, query);
    // Kana only on exact / prefix hits, otherwise "a" lists half the chart
    if (score < 70) continue;
    add(score - 15, {
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
    });
  }

  // Best matches first, capped per category so one big source cannot crowd out the rest
  scored.sort((a, b) => b.score - a.score);
  const perCategory: Record<string, number> = {};
  const results: SearchResultItem[] = [];
  const seen = new Set<string>();
  for (const { item } of scored) {
    if (results.length >= MAX_RESULTS) break;
    const count = perCategory[item.category] ?? 0;
    if (count >= MAX_PER_CATEGORY) continue;
    // Same word listed twice in one place (e.g. vocab list + reference) → keep the best one
    const dedupeKey = `${item.category}|${item.title}|${item.href.split("?")[0]}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    perCategory[item.category] = count + 1;
    results.push(item);
  }
  return results;
}
