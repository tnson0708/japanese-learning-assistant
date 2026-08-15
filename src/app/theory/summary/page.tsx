import Link from "next/link";
import { ArrowLeft, BookCheck } from "lucide-react";
import { GrammarSummaryView } from "@/components/theory/grammar-summary-view";

export const metadata = {
  title: "Tổng hợp ngữ pháp Bài 1–25 — Kana Dojo",
  description: "Sổ tay ôn tập nhanh tổng hợp toàn bộ các mẫu câu, cấu trúc ngữ pháp và ví dụ từ Bài 1 đến Bài 25 Minna no Nihongo.",
};

export default function GrammarSummaryPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:py-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/theory"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground w-fit"
        >
          <ArrowLeft className="size-3.5" /> Danh sách bài học
        </Link>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                <BookCheck className="size-3.5" /> Sổ tay Minna no Nihongo
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tổng hợp ngữ pháp · Bài 1–25
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tra cứu nhanh các mẫu câu, quy tắc chia động từ và ví dụ minh họa từ Bài 1 đến Bài 25.
            </p>
          </div>
        </div>
      </div>

      <GrammarSummaryView />
    </div>
  );
}
