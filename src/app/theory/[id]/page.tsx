"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, FileText, GraduationCap, Languages, Sparkles, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlockRenderer } from "@/components/theory/blocks";
import { getAdjacentLessons, getLessonById } from "@/lib/theory";
import { useLanguage } from "@/lib/language-context";

const sectionIcons: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen,
  translation: Languages,
  reference: FileText,
  grammar: GraduationCap,
  exercises: Sparkles,
};

const shortTitles: Record<string, string> = {
  vocabulary: "Từ vựng",
  translation: "Bản dịch",
  reference: "Tham khảo",
  grammar: "Ngữ pháp",
  exercises: "Bài tập",
};

export default function TheoryLessonPage() {
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const lessonId = Number(params.id);
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-muted-foreground">Không tìm thấy bài học này.</p>
        <Button render={<Link href="/theory" />} nativeButton={false} variant="outline">
          Về danh sách bài học
        </Button>
      </div>
    );
  }

  const { prev, next } = getAdjacentLessons(lessonId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 print:p-0 print:gap-4">

      <Link
        href="/theory"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" /> Danh sách bài học
      </Link>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl print:hidden">
        {lesson.title}
      </h1>

      <Tabs defaultValue={lesson.sections[0]?.id} className="gap-4">
        <TabsList className="grid w-full grid-cols-5 gap-1 rounded-xl bg-muted p-1 sm:flex sm:w-fit sm:justify-center print:hidden">
          {lesson.sections.map((section) => {
            const Icon = sectionIcons[section.id] || BookOpen;
            const shortLabel = shortTitles[section.id] || section.title;

            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 sm:px-3 text-center transition-all"
              >
                <Icon className="size-3.5 sm:size-4 shrink-0" />
                <span className="sm:hidden text-[10px] font-bold leading-tight truncate">
                  {shortLabel}
                </span>
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                  {section.title}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {lesson.sections.map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className="flex flex-col gap-4"
          >
            {/* If section is 'exercises', add a Print Button header bar */}
            {section.id === "exercises" && (
              <div className="flex items-center justify-between rounded-xl border bg-card p-3 shadow-2xs print:hidden">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Luyện tập trực tiếp trên web hoặc in ra giấy A4
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-2 shrink-0 font-semibold cursor-pointer border-primary/30 hover:border-primary hover:bg-primary/10 text-foreground"
                  title="In phiếu bài tập ra giấy A4"
                >
                  <Printer className="size-4 text-primary" />
                  <span>{t("theory_print_btn")}</span>
                </Button>
              </div>
            )}

            {section.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-center justify-between border-t pt-4 print:hidden">
        {prev ? (
          <Button
            render={<Link href={`/theory/${prev.id}`} />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="size-4" /> {prev.title}
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button
            render={<Link href={`/theory/${next.id}`} />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            {next.title} <ChevronRight className="size-4" />
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
