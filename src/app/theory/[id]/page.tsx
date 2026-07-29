"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlockRenderer } from "@/components/theory/blocks";
import { getAdjacentLessons, getLessonById } from "@/lib/theory";

export default function TheoryLessonPage() {
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
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <Link
        href="/theory"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Danh sách bài học
      </Link>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {lesson.title}
      </h1>

      <Tabs defaultValue={lesson.sections[0]?.id} className="gap-4">
        <TabsList className="w-full sm:w-fit">
          {lesson.sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {lesson.sections.map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className="flex flex-col gap-4"
          >
            {section.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-center justify-between border-t pt-4">
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
