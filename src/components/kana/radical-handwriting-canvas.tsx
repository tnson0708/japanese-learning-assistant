"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { KanjiRadical } from "@/lib/kanji-radicals";
import { useLanguage } from "@/lib/language-context";

interface RadicalHandwritingCanvasProps {
  radical: KanjiRadical;
  className?: string;
}

export function RadicalHandwritingCanvas({
  radical,
  className,
}: RadicalHandwritingCanvasProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const strokesHistory = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const currentStroke = useRef<Array<{ x: number; y: number }>>([]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw user drawn strokes
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokesHistory.current.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [radical.id]);

  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    currentStroke.current = [{ x, y }];
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    currentStroke.current.push({ x, y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stroke = currentStroke.current;
    if (stroke.length >= 2) {
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(stroke[stroke.length - 2].x, stroke[stroke.length - 2].y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.current.length > 0) {
      strokesHistory.current.push([...currentStroke.current]);
      setHasInk(true);
    }
    currentStroke.current = [];
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const clear = () => {
    strokesHistory.current = [];
    setHasInk(false);
    redrawCanvas();
  };

  const undo = () => {
    strokesHistory.current.pop();
    setHasInk(strokesHistory.current.length > 0);
    redrawCanvas();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${className}`}>
        {/* Background Guide Character Overlay (Light Faded) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <g fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className="text-foreground font-serif">
              {radical.strokePaths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </svg>
        </div>

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={220}
          height={220}
          onMouseDown={(e) => {
            const { x, y } = getCanvasCoords(e);
            startDrawing(x, y);
          }}
          onMouseMove={(e) => {
            const { x, y } = getCanvasCoords(e);
            draw(x, y);
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            const { x, y } = getCanvasCoords(e);
            startDrawing(x, y);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const { x, y } = getCanvasCoords(e);
            draw(x, y);
          }}
          onTouchEnd={stopDrawing}
          className="h-full w-full cursor-crosshair touch-none"
        />
      </div>

      {/* Control Buttons: Undo & Clear */}
      <div className="flex flex-wrap items-center justify-center gap-2 shrink-0 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={!hasInk}
          className="gap-1 text-xs cursor-pointer"
        >
          <Undo2 className="size-3.5" />
          <span>{isVi ? "Hoàn tác" : "Undo"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={clear}
          disabled={!hasInk}
          className="gap-1 text-xs cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>{isVi ? "Xóa nét" : "Clear"}</span>
        </Button>
      </div>
    </div>
  );
}
