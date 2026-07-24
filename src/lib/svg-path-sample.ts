import type { Point } from "./geometry";

const SVG_NS = "http://www.w3.org/2000/svg";
let sharedPathEl: SVGPathElement | null = null;

function getSharedPathEl(): SVGPathElement {
  if (!sharedPathEl) {
    sharedPathEl = document.createElementNS(SVG_NS, "path");
  }
  return sharedPathEl;
}

/**
 * Sample `n` points at equal arc-length intervals along an SVG path `d`
 * string. Relies on the browser's native path geometry (getTotalLength /
 * getPointAtLength), so this only works client-side.
 */
export function samplePathAtEqualArcLength(d: string, n: number): Point[] {
  const path = getSharedPathEl();
  path.setAttribute("d", d);
  const length = path.getTotalLength();
  if (length === 0) {
    const p = path.getPointAtLength(0);
    return Array.from({ length: n }, () => ({ x: p.x, y: p.y }));
  }
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const at = (length * i) / (n - 1);
    const p = path.getPointAtLength(at);
    points.push({ x: p.x, y: p.y });
  }
  return points;
}
