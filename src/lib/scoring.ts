import type { Kana } from "./kana";
import {
  dtwDistance,
  normalizePointSets,
  resamplePolyline,
  type Point,
} from "./geometry";
import { samplePathAtEqualArcLength } from "./svg-path-sample";

const SAMPLE_POINTS = 32;
// Calibration constant: the mean normalized (0..1 space) per-point distance
// at which we consider a stroke a 0% match. Tuned by eye against a range of
// "close enough" vs "wrong shape" attempts; not a physical constant.
const DISTANCE_AT_ZERO_SIMILARITY = 0.32;

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function similarityFromDistance(meanDist: number): number {
  return clamp(1 - meanDist / DISTANCE_AT_ZERO_SIMILARITY, 0, 1);
}

export interface StrokeFeedback {
  referenceIndex: number;
  userIndex: number | null;
  similarity: number; // 0..1, 0 if the stroke is missing entirely
}

export interface ScoreResult {
  overall: number; // 0-100
  strokeCountExpected: number;
  strokeCountDrawn: number;
  strokeFeedback: StrokeFeedback[];
  message: string;
  /** Both sides normalized to their own unit-square bounding box, in stroke order — for overlay rendering. */
  referenceNorm: Point[][];
  userNorm: Point[][];
}

export function referenceStrokePoints(kana: Kana): Point[][] {
  return [...kana.strokes]
    .sort((a, b) => a.order - b.order)
    .map((s) => samplePathAtEqualArcLength(s.d, SAMPLE_POINTS));
}

function messageFor(score: number, countDiff: number): string {
  if (score >= 90) return "Excellent! That's a very close match.";
  if (score >= 75) return "Good job — close, with a bit of room to refine.";
  if (score >= 55)
    return "Getting there. Check the highlighted strokes below.";
  if (countDiff !== 0)
    return `Keep practicing. You drew ${countDiff > 0 ? "more" : "fewer"} strokes than expected.`;
  return "Keep practicing — compare your shape against the reference below.";
}

/**
 * Score a freehand attempt (raw canvas-pixel strokes) against a kana's
 * reference stroke data. Both sides are normalized independently to a unit
 * square before comparison, so absolute size/position on the canvas doesn't
 * matter — only shape does.
 */
export function scoreAttempt(
  userStrokesRaw: Point[][],
  kana: Kana
): ScoreResult {
  const referenceRaw = referenceStrokePoints(kana);
  const strokeCountExpected = referenceRaw.length;
  const strokeCountDrawn = userStrokesRaw.length;

  if (strokeCountDrawn === 0) {
    return {
      overall: 0,
      strokeCountExpected,
      strokeCountDrawn,
      strokeFeedback: referenceRaw.map((_, i) => ({
        referenceIndex: i,
        userIndex: null,
        similarity: 0,
      })),
      message: "Write the character on the canvas, then check your score.",
      referenceNorm: normalizePointSets(referenceRaw),
      userNorm: [],
    };
  }

  const userResampled = userStrokesRaw.map((s) =>
    resamplePolyline(s, SAMPLE_POINTS)
  );

  const referenceNorm = normalizePointSets(referenceRaw);
  const userNorm = normalizePointSets(userResampled);

  // Greedy nearest-neighbor stroke matching: repeatedly pick the closest
  // (reference, user) pair by DTW distance until one side is exhausted.
  // Good enough at this scale (kana have at most ~6 strokes).
  const distances: number[][] = referenceNorm.map((r) =>
    userNorm.map((u) => dtwDistance(r, u))
  );

  const matchedRef = new Set<number>();
  const matchedUser = new Set<number>();
  const pairs: { refIndex: number; userIndex: number; distance: number }[] =
    [];

  const totalPairs = Math.min(referenceNorm.length, userNorm.length);
  for (let k = 0; k < totalPairs; k++) {
    let best = { r: -1, u: -1, d: Infinity };
    for (let r = 0; r < referenceNorm.length; r++) {
      if (matchedRef.has(r)) continue;
      for (let u = 0; u < userNorm.length; u++) {
        if (matchedUser.has(u)) continue;
        if (distances[r][u] < best.d) best = { r, u, d: distances[r][u] };
      }
    }
    if (best.r === -1) break;
    matchedRef.add(best.r);
    matchedUser.add(best.u);
    pairs.push({ refIndex: best.r, userIndex: best.u, distance: best.d });
  }

  const strokeFeedback: StrokeFeedback[] = referenceNorm.map((_, i) => {
    const pair = pairs.find((p) => p.refIndex === i);
    if (!pair) return { referenceIndex: i, userIndex: null, similarity: 0 };
    return {
      referenceIndex: i,
      userIndex: pair.userIndex,
      similarity: similarityFromDistance(pair.distance),
    };
  });

  const avgSimilarity =
    strokeFeedback.reduce((sum, f) => sum + f.similarity, 0) /
    strokeFeedback.length;

  const countDiff = strokeCountDrawn - strokeCountExpected;
  const countTerm = clamp(
    1 - Math.abs(countDiff) / strokeCountExpected,
    0,
    1
  );

  const overall = Math.round(100 * (0.85 * avgSimilarity + 0.15 * countTerm));

  return {
    overall: clamp(overall, 0, 100),
    strokeCountExpected,
    strokeCountDrawn,
    strokeFeedback,
    message: messageFor(overall, countDiff),
    referenceNorm,
    userNorm,
  };
}
