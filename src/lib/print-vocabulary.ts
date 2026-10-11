/**
 * Prints only the lesson's vocabulary sheet (<VocabPrintSheet>, see the `data-print-vocab`
 * rules in globals.css). The flag is cleared on `afterprint` because window.print() does not
 * block on every browser (e.g. iOS Safari).
 */
export function printVocabulary() {
  document.body.setAttribute("data-print-vocab", "");
  window.addEventListener("afterprint", () => document.body.removeAttribute("data-print-vocab"), {
    once: true,
  });
  window.print();
}
