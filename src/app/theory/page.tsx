import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { lessonList } from "@/lib/theory";

export default function TheoryListPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Lý thuyết theo bài
        </h1>
        <p className="text-sm text-muted-foreground">
          Từ vựng, thông tin tham khảo và giải thích ngữ pháp theo từng bài
          trong giáo trình.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {lessonList.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/theory/${lesson.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-4 shadow-2xs transition-colors hover:bg-accent/40"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {lesson.id}
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {lesson.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lesson.sections
                    .map((s) => s.title.replace(/^[IVX]+\.\s*/, ""))
                    .join(" · ")}
                </span>
              </div>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
