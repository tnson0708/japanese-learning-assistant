"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { Kana } from "@/lib/kana";
import type { Point } from "@/lib/geometry";

export interface HandwritingCanvasHandle {
  getStrokes: () => Point[][];
  clear: () => void;
  undo: () => void;
  hasInk: () => boolean;
}

interface HandwritingCanvasProps {
  kana?: Kana;
  showGuide?: boolean;
  className?: string;
  onStrokesChange?: (strokeCount: number) => void;
}

const INK_COLOR = "#1d4ed8";
const GUIDE_COLOR = "#94a3b8";

export const HandwritingCanvas = forwardRef<
  HandwritingCanvasHandle,
  HandwritingCanvasProps
>(function HandwritingCanvas(
  { kana, showGuide = true, className, onStrokesChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const inkCanvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef(0);

  const strokesRef = useRef<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const drawingRef = useRef(false);

  const drawGuide = useCallback(() => {
    const canvas = guideCanvasRef.current;
    const size = sizeRef.current;
    if (!canvas || !size) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    if (!kana || !showGuide) return;

    ctx.save();
    ctx.strokeStyle = GUIDE_COLOR;
    ctx.globalAlpha = 0.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.scale(size / 109, size / 109);
    // Widths/dashes are specified in the pre-scale 0-109 path coordinate
    // space so they stay a constant *relative* size regardless of canvas size.
    ctx.lineWidth = 2.2;
    ctx.setLineDash([3, 4]);
    for (const stroke of kana.strokes) {
      ctx.stroke(new Path2D(stroke.d));
    }
    ctx.restore();
  }, [kana, showGuide]);

  const setupCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const guide = guideCanvasRef.current;
    const ink = inkCanvasRef.current;
    if (!container || !guide || !ink) return;

    const cssSize = container.clientWidth;
    sizeRef.current = cssSize;
    const dpr = window.devicePixelRatio || 1;

    for (const canvas of [guide, ink]) {
      canvas.width = cssSize * dpr;
      canvas.height = cssSize * dpr;
      canvas.style.width = `${cssSize}px`;
      canvas.style.height = `${cssSize}px`;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    drawGuide();
    redrawInk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawGuide]);

  const redrawInk = useCallback(() => {
    const canvas = inkCanvasRef.current;
    const size = sizeRef.current;
    if (!canvas || !size) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = INK_COLOR;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const p of stroke.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    setupCanvasSize();
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => setupCanvasSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [setupCanvasSize]);

  useEffect(() => {
    drawGuide();
  }, [drawGuide]);

  const pointFromEvent = useCallback((e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      drawingRef.current = true;
      const p = pointFromEvent(e);
      currentStrokeRef.current = [p];

      const ctx = inkCanvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = INK_COLOR;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2 + (e.pressure || 0.5) * 4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      }
    },
    [pointFromEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const p = pointFromEvent(e);
      currentStrokeRef.current.push(p);

      const ctx = inkCanvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2 + (e.pressure || 0.5) * 4;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    },
    [pointFromEvent]
  );

  const endStroke = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (currentStrokeRef.current.length > 1) {
      strokesRef.current.push(currentStrokeRef.current);
      onStrokesChange?.(strokesRef.current.length);
    }
    currentStrokeRef.current = [];
  }, [onStrokesChange]);

  useImperativeHandle(
    ref,
    () => ({
      getStrokes: () => strokesRef.current,
      hasInk: () => strokesRef.current.length > 0,
      clear: () => {
        strokesRef.current = [];
        currentStrokeRef.current = [];
        redrawInk();
        onStrokesChange?.(0);
      },
      undo: () => {
        strokesRef.current.pop();
        redrawInk();
        onStrokesChange?.(strokesRef.current.length);
      },
    }),
    [redrawInk, onStrokesChange]
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none" }}
    >
      <div className="relative aspect-square w-full">
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0 rounded-xl border bg-white dark:bg-neutral-900"
        />
        <canvas
          ref={inkCanvasRef}
          className="absolute inset-0 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
        />
      </div>
    </div>
  );
});
