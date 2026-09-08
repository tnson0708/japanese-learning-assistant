"use client";

import { useState } from "react";
import { Maximize2, Presentation, Ratio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

const SLIDE_ID = "1TwhygwDZOs-8lI-nSzYdnzX_KrRqXV9iZjz2C4THsrI";
const EMBED_URL = `https://docs.google.com/presentation/d/${SLIDE_ID}/embed?start=false&loop=false&delayms=3000`;

export default function SlidesPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [aspectRatio, setAspectRatio] = useState<"4:3" | "16:9">("4:3");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Presentation className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isVi ? "Slide bài giảng Tiếng Nhật" : "Japanese Presentation Slides"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isVi
              ? "Bộ slide bài giảng Google Slides tương tác cho việc học và tra cứu bài học tiếng Nhật."
              : "Interactive Google Slides presentation deck for Japanese learning & lesson reference."}
          </p>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1 rounded-lg border bg-muted p-1 text-xs shrink-0 self-start sm:self-auto">
          <span className="px-2 text-muted-foreground font-medium flex items-center gap-1">
            <Ratio className="size-3.5" />
            {isVi ? "Tỉ lệ:" : "Ratio:"}
          </span>
          <Button
            variant={aspectRatio === "4:3" ? "default" : "ghost"}
            size="sm"
            onClick={() => setAspectRatio("4:3")}
            className="h-7 px-2.5 text-xs font-semibold"
          >
            4:3 (Chuẩn)
          </Button>
          <Button
            variant={aspectRatio === "16:9" ? "default" : "ghost"}
            size="sm"
            onClick={() => setAspectRatio("16:9")}
            className="h-7 px-2.5 text-xs font-semibold"
          >
            16:9 (Rộng)
          </Button>
        </div>
      </div>

      {/* Main Google Slides Embed Frame */}
      <Card className="overflow-hidden border-primary/20 shadow-md">
        <CardContent className="p-0">
          <div
            className={`relative w-full bg-black/90 transition-all ${
              aspectRatio === "4:3" ? "aspect-[4/3]" : "aspect-[16/9]"
            }`}
          >
            <iframe
              src={EMBED_URL}
              title={isVi ? "Slide bài giảng Tiếng Nhật" : "Japanese Presentation Slides"}
              className="absolute inset-0 size-full border-0"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>

      {/* Helper Tips Banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Maximize2 className="size-4 shrink-0 text-primary" />
          <span>
            {isVi
              ? "Mẹo: Khung hiển thị đã được điều chỉnh về tỉ lệ 4:3 khớp 100% với slide của bạn để loại bỏ 2 vệt đen 2 bên."
              : "Tip: Frame aspect ratio is set to 4:3 matching your slides to eliminate black side bars."}
          </span>
        </div>
      </div>
    </div>
  );
}
