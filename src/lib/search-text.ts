/**
 * Text normalization shared by the spotlight search and the pages it links to.
 * Lowercases, strips Vietnamese / romaji diacritics (ký túc xá → ky tuc xa,
 * kōhī → kohi), maps đ → d and collapses whitespace, so a query matches
 * regardless of accents or how the learner typed it.
 */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/** Romaji without long-vowel spellings, so "kouhii", "koohii" and "kohi" all match. */
export function normalizeRomaji(text: string): string {
  return normalizeSearch(text)
    .replace(/[\s'-]/g, "")
    .replace(/([aeiou])\1+/g, "$1")
    .replace(/ou/g, "o")
    .replace(/ei/g, "e");
}
