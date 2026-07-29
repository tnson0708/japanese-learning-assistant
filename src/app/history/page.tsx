"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistorySection } from "@/components/home/history-section";
import { useLanguage } from "@/lib/language-context";

export default function HistoryPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        <span>{isVi ? "Trở về Trang chủ" : "Back to Home"}</span>
      </Link>

      {/* Main History Component */}
      <HistorySection />

      {/* Quick Navigation Footer Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-2xs mt-4">
        <div className="flex flex-col gap-0.5 text-center sm:text-left">
          <span className="font-bold text-sm text-foreground">
            {isVi ? "Sẵn sàng bắt đầu học tiếng Nhật?" : "Ready to Start Learning Japanese?"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isVi
              ? "Khám phá bảng chữ Kana, từ vựng hoặc lý thuyết các bài học."
              : "Explore Kana charts, vocabulary lists, or lesson theory."}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button render={<Link href="/kana" />} nativeButton={false} size="sm" className="gap-1.5">
            <BookOpen className="size-4" />
            <span>{isVi ? "Học Kana" : "Learn Kana"}</span>
          </Button>
          <Button render={<Link href="/vocabulary" />} nativeButton={false} variant="outline" size="sm" className="gap-1.5">
            <Table className="size-4" />
            <span>{isVi ? "Từ vựng" : "Vocabulary"}</span>
          </Button>
          <Button render={<Link href="/theory" />} nativeButton={false} variant="secondary" size="sm" className="gap-1.5">
            <GraduationCap className="size-4" />
            <span>{isVi ? "Lý thuyết" : "Theory"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
