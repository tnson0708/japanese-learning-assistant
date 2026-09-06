import { BASIC_KANJI_WORDS } from "@/lib/basic-kanji";
import { KANJI_RADICALS } from "@/lib/kanji-radicals";
import { DOMAINS } from "@/data/vocabulary";
import { type VocabWord } from "@/lib/vocabulary";
import { PHRASE_LIST, type Phrase } from "@/lib/phrases";
import { lessonList, type Lesson, type ContentBlock } from "@/lib/theory";
import { kanaList, type Kana } from "@/lib/kana";
import jlptWordsRaw from "@/data/jlpt-words.json";

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
  href: string;
}

export function searchGlobal(rawQuery: string): SearchResultItem[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // 1. KANJI & RADICALS (Basic Kanji + Radicals)
  BASIC_KANJI_WORDS.forEach((k) => {
    if (
      k.char.includes(q) ||
      k.hanViet.toLowerCase().includes(q) ||
      k.hiragana.toLowerCase().includes(q) ||
      k.meaningVi.toLowerCase().includes(q) ||
      k.meaningEn.toLowerCase().includes(q)
    ) {
      const primaryReading = k.hiragana.split("/")[0].trim();
      results.push({
        id: `kanji-${k.id}`,
        category: "kanji",
        categoryLabelVi: "Kanji cơ bản",
        categoryLabelEn: "Basic Kanji",
        title: k.char,
        subtitle: `${k.hanViet} (${k.hiragana})`,
        description: k.meaningVi,
        badge: `${k.strokes} nét`,
        audioText: primaryReading || k.char,
        href: `/kana?tab=kanji`,
      });
    }
  });

  KANJI_RADICALS.forEach((rad) => {
    if (
      rad.char.includes(q) ||
      rad.hanViet.toLowerCase().includes(q) ||
      rad.meaningVi.toLowerCase().includes(q) ||
      rad.meaningEn.toLowerCase().includes(q) ||
      rad.exampleKanji.some((ex) => ex.char.includes(q) || ex.hanViet.toLowerCase().includes(q))
    ) {
      results.push({
        id: `rad-${rad.id}`,
        category: "kanji",
        categoryLabelVi: "Bộ thủ Kanji",
        categoryLabelEn: "Kanji Radical",
        title: rad.char,
        subtitle: `${rad.hanViet}`,
        description: rad.meaningVi,
        badge: `Bộ thủ (${rad.strokes} nét)`,
        audioText: rad.char,
        href: `/kana?tab=radicals`,
      });
    }
  });

  // 2. VOCABULARY (Structured Domain Vocab + JLPT Words)
  DOMAINS.forEach((domain) => {
    domain.subtopics.forEach((subtopic) => {
      subtopic.words.forEach((w: VocabWord) => {
        if (
          w.word.toLowerCase().includes(q) ||
          w.reading.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          (w.hanVietHint && w.hanVietHint.toLowerCase().includes(q)) ||
          (w.englishSource && w.englishSource.toLowerCase().includes(q))
        ) {
          results.push({
            id: `vocab-${w.id}`,
            category: "vocabulary",
            categoryLabelVi: "Từ vựng theo chủ đề",
            categoryLabelEn: "Topic Vocab",
            title: w.word,
            subtitle: w.reading !== w.word ? `${w.reading} ${w.hanVietHint ? `[${w.hanVietHint}]` : ""}` : w.hanVietHint ? `[${w.hanVietHint}]` : undefined,
            description: w.meaning,
            badge: w.jlptLevel || domain.nameVi || domain.name,
            audioText: w.reading || w.word,
            href: `/vocabulary/${domain.id}/${subtopic.id}`,
          });
        }
      });
    });
  });

  // JLPT flat words database
  (jlptWordsRaw as Array<any>).forEach((w, idx) => {
    if (results.length > 80) return; // Prevent performance degradation
    const wordText = w.word || w.kanji || "";
    const reading = w.reading || w.romaji || "";
    const meaning = w.meaning || "";

    if (
      wordText.toLowerCase().includes(q) ||
      reading.toLowerCase().includes(q) ||
      meaning.toLowerCase().includes(q)
    ) {
      // Check for duplicates with domain vocab
      const exists = results.some((r) => r.title === wordText || (r.subtitle && r.subtitle.includes(reading)));
      if (!exists) {
        results.push({
          id: `jlpt-${idx}-${w.id || wordText}`,
          category: "vocabulary",
          categoryLabelVi: "Từ vựng JLPT",
          categoryLabelEn: "JLPT Word",
          title: wordText,
          subtitle: reading !== wordText ? reading : undefined,
          description: meaning,
          badge: w.level ? String(w.level).toUpperCase() : "JLPT",
          audioText: reading || wordText,
          href: `/practice`,
        });
      }
    }
  });

  // 3. SITUATIONAL PHRASES
  PHRASE_LIST.forEach((p: Phrase) => {
    if (
      p.japanese.toLowerCase().includes(q) ||
      p.hiragana.toLowerCase().includes(q) ||
      p.romaji.toLowerCase().includes(q) ||
      p.vietnamese.toLowerCase().includes(q) ||
      p.english.toLowerCase().includes(q)
    ) {
      results.push({
        id: `phrase-${p.id}`,
        category: "phrases",
        categoryLabelVi: "Mẫu câu giao tiếp",
        categoryLabelEn: "Situational Phrase",
        title: p.japanese,
        subtitle: p.hiragana,
        description: p.vietnamese,
        badge: p.formality === "polite" ? "Lịch sự" : p.formality === "formal" ? "Trang trọng" : "Thân mật",
        audioText: p.hiragana || p.japanese,
        href: `/phrases`,
      });
    }
  });

  // 4. GRAMMAR THEORY (Lessons & Grammar Patterns)
  lessonList.forEach((lesson: Lesson) => {
    const lessonTitle = lesson.title || `Bài ${lesson.id}`;
    if (lessonTitle.toLowerCase().includes(q)) {
      results.push({
        id: `theory-lesson-${lesson.id}`,
        category: "theory",
        categoryLabelVi: "Bài học Ngữ pháp",
        categoryLabelEn: "Grammar Lesson",
        title: lessonTitle,
        subtitle: `Bài ${lesson.id}`,
        description: "Lý thuyết Minna no Nihongo",
        badge: `Bài ${lesson.id}`,
        audioText: lessonTitle,
        href: `/theory/${lesson.id}`,
      });
    }

    // Inspect blocks inside lesson sections
    lesson.sections?.forEach((section) => {
      section.blocks?.forEach((block: ContentBlock, bIdx: number) => {
        if (block.type === "grammar-pattern") {
          const pattern = block.pattern || "";
          const explanation = block.explanation || "";
          if (
            pattern.toLowerCase().includes(q) ||
            explanation.toLowerCase().includes(q) ||
            block.examples?.some((ex) => ex.jp.toLowerCase().includes(q) || ex.vi.toLowerCase().includes(q))
          ) {
            results.push({
              id: `theory-gp-${lesson.id}-${bIdx}`,
              category: "theory",
              categoryLabelVi: "Điểm ngữ pháp",
              categoryLabelEn: "Grammar Point",
              title: pattern,
              subtitle: `Bài ${lesson.id} - Cấu trúc`,
              description: explanation || "Mẫu cấu trúc ngữ pháp",
              badge: `Bài ${lesson.id}`,
              audioText: pattern,
              href: `/theory/${lesson.id}`,
            });
          }
        }
      });
    });
  });

  // 5. KANA (Hiragana & Katakana)
  kanaList.forEach((kana: Kana) => {
    if (
      kana.char.includes(q) ||
      kana.romaji.toLowerCase().includes(q)
    ) {
      results.push({
        id: `kana-${kana.id}`,
        category: "kana",
        categoryLabelVi: "Bảng chữ cái Kana",
        categoryLabelEn: "Kana Character",
        title: kana.char,
        subtitle: `Romaji: /${kana.romaji}/`,
        description: kana.script === "hiragana" ? "Chữ Hiragana cơ bản" : "Chữ Katakana cơ bản",
        badge: kana.script.toUpperCase(),
        audioText: kana.char,
        href: `/kana`,
      });
    }
  });

  return results;
}
