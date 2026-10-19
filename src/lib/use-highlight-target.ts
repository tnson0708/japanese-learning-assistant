"use client";

import { useEffect, type RefObject } from "react";

/** Visible text of an element, ignoring furigana (<rt>) so 休みます matches "休みます" not "休やすみます". */
function textWithoutRuby(el: Element): string {
  let out = "";
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest("rt, rp") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  while (walker.nextNode()) out += walker.currentNode.textContent ?? "";
  return out;
}

const CARD_SELECTOR = "tr, li, [data-search-card], .rounded-2xl, .rounded-xl, .rounded-lg";

/**
 * Scrolls to and briefly highlights the element inside `containerRef` that shows one of
 * `targets` (tried in order, e.g. kanji then kana). Used by the spotlight search so a
 * clicked result lands on the exact word, whichever view renders it.
 */
export function useHighlightTarget(
  containerRef: RefObject<HTMLElement | null>,
  targets: (string | null | undefined)[],
  deps: unknown[] = []
) {
  const key = targets.filter(Boolean).join("|");

  useEffect(() => {
    const candidates = key ? key.split("|") : [];
    if (candidates.length === 0) return;

    let highlighted: HTMLElement | null = null;
    let clearTimer: number | undefined;

    const tryHighlight = () => {
      const container = containerRef.current;
      if (!container) return false;
      const elements = Array.from(container.querySelectorAll<HTMLElement>("*")).filter(
        (el) => el.getClientRects().length > 0
      );
      for (const target of candidates) {
        // Deepest element whose own visible text contains the target.
        const matches = elements.filter((el) => textWithoutRuby(el).includes(target));
        const deepest = matches.find((el) => !matches.some((other) => other !== el && el.contains(other)));
        if (!deepest) continue;

        highlighted = (deepest.closest(CARD_SELECTOR) as HTMLElement | null) ?? deepest;
        // Instant, not smooth: a smooth scroll can be cancelled by the router's own
        // scroll-to-top right after navigation, leaving the word off-screen.
        highlighted.scrollIntoView({ behavior: "instant", block: "center" });
        highlighted.classList.add("search-highlight");
        clearTimer = window.setTimeout(() => highlighted?.classList.remove("search-highlight"), 3200);
        return true;
      }
      return false;
    };

    // The target view may still be loading (client data, tab switch) — retry for ~3s.
    let attempts = 0;
    const poll = window.setInterval(() => {
      if (tryHighlight() || ++attempts >= 20) window.clearInterval(poll);
    }, 150);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(clearTimer);
      highlighted?.classList.remove("search-highlight");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);
}
