# Kana Dojo

A personal Hiragana/Katakana learning app, built for handwriting practice with an iPad and Apple Pencil.

## Features

- **Learn** — full Hiragana/Katakana chart (including dakuten/handakuten) with animated, correct stroke order for every character, sourced from [KanjiVG](https://kanjivg.tagaini.net/).
- **Practice** — handwrite characters on canvas (mouse, touch, or Apple Pencil via Pointer Events) and get an instant percentage match against the correct stroke shapes, with a visual overlay showing exactly which strokes were off. Scoring runs entirely client-side using Dynamic Time Warping against KanjiVG's real stroke path data — no external API calls.
- **Quiz** — multiple-choice drills, kana → romaji and romaji → kana, for Hiragana, Katakana, or both.

Handwriting dictation (play a word, write it, get scored) is planned as a follow-up phase and will reuse the same stroke-scoring engine.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To regenerate the bundled kana stroke dataset (`src/data/kana-strokes.json`) from KanjiVG:

```bash
node scripts/generate-kana-data.mjs
```

## Deploy on Vercel

```bash
npx vercel
```

Or connect the repo at [vercel.com/new](https://vercel.com/new) — no environment variables are required, everything runs client-side against the bundled kana dataset.

## Attribution

Stroke order data is from [KanjiVG](https://kanjivg.tagaini.net/) by Ulrich Apel, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
