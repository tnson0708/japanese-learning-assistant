"use client";

import { ExternalLink, Maximize2, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const SLIDE_ID = "1TwhygwDZOs-8lI-nSzYdnzX_KrRqXV9iZjz2C4THsrI";
const EMBED_URL = `https://docs.google.com/presentation/d/${SLIDE_ID}/embed?start=false&loop=false&delayms=3000`;
const EXTERNAL_URL = `https://docs.google.com/presentation/d/${SLIDE_ID}/edit`;

export default function SlidesPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(EXTERNAL_URL, "_blank")}
            className="gap-2 font-medium"
          >
            <ExternalLink className="size-4" />
            {isVi ? "Mở trong Google Slides ↗" : "Open in Google Slides ↗"}
          </Button>
        </div>
      </div>

      {/* Main Google Slides Embed Frame */}
      <Card className="overflow-hidden border-primary/20 shadow-md">
        <CardContent className="p-0">
          <div className="relative w-full pt-[56.25%] bg-black/90">
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
              ? "Mẹo: Bạn có thể bấm biểu tượng Toàn màn hình (Full screen) ở góc dưới thanh công cụ slide để trình chiếu tràn màn hình."
              : "Tip: Click the full screen icon inside the slide toolbar for full presentation view."}
          </span>
        </div>
      </div>
    </div>
  );
}
