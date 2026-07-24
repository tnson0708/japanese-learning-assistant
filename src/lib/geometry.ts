export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Resample a polyline to exactly `n` points, evenly spaced by arc length. */
export function resamplePolyline(points: Point[], n: number): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: n }, () => points[0]);

  const segmentLengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const d = dist(points[i - 1], points[i]);
    segmentLengths.push(d);
    total += d;
  }
  if (total === 0) return Array.from({ length: n }, () => points[0]);

  const step = total / (n - 1);
  const result: Point[] = [points[0]];
  let segIndex = 0;
  let segStart = 0;
  let target = step;

  for (let i = 1; i < n - 1; i++) {
    while (
      segIndex < segmentLengths.length &&
      segStart + segmentLengths[segIndex] < target
    ) {
      segStart += segmentLengths[segIndex];
      segIndex++;
    }
    const segLen = segmentLengths[segIndex] || 1e-9;
    const t = (target - segStart) / segLen;
    const p0 = points[segIndex];
    const p1 = points[segIndex + 1] ?? points[segIndex];
    result.push({ x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t });
    target += step;
  }

  result.push(points[points.length - 1]);
  return result;
}

export function boundingBoxOf(pointSets: Point[][]): BoundingBox {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const points of pointSets) {
    for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }
  if (!isFinite(minX)) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  return { minX, minY, maxX, maxY };
}

/**
 * Normalize point sets into a centered unit square [0,1]x[0,1], preserving
 * aspect ratio, based on their own combined bounding box. This lets us
 * compare a reference glyph and a freehand attempt regardless of where or
 * how large either was drawn.
 */
export function normalizePointSets(pointSets: Point[][]): Point[][] {
  const bbox = boundingBoxOf(pointSets);
  const width = bbox.maxX - bbox.minX;
  const height = bbox.maxY - bbox.minY;
  const scale = Math.max(width, height) || 1;
  const offsetX = (scale - width) / 2;
  const offsetY = (scale - height) / 2;

  return pointSets.map((points) =>
    points.map((p) => ({
      x: (p.x - bbox.minX + offsetX) / scale,
      y: (p.y - bbox.minY + offsetY) / scale,
    }))
  );
}

/**
 * Dynamic Time Warping distance between two equal-or-different-length point
 * sequences, returned as the mean per-step Euclidean cost along the optimal
 * alignment path (so it's comparable across sequences of different length).
 */
export function dtwDistance(a: Point[], b: Point[]): number {
  const n = a.length;
  const m = b.length;
  if (n === 0 || m === 0) return Infinity;

  const cost = new Float64Array((n + 1) * (m + 1)).fill(Infinity);
  const steps = new Int32Array((n + 1) * (m + 1)).fill(0);
  const idx = (i: number, j: number) => i * (m + 1) + j;
  cost[idx(0, 0)] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const d = dist(a[i - 1], b[j - 1]);
      const diag = cost[idx(i - 1, j - 1)];
      const up = cost[idx(i - 1, j)];
      const left = cost[idx(i, j - 1)];
      const best = Math.min(diag, up, left);
      cost[idx(i, j)] = d + best;
      steps[idx(i, j)] =
        1 + (best === diag ? steps[idx(i - 1, j - 1)] : best === up ? steps[idx(i - 1, j)] : steps[idx(i, j - 1)]);
    }
  }

  const totalSteps = steps[idx(n, m)] || 1;
  return cost[idx(n, m)] / totalSteps;
}
