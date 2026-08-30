"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { getSubtopicName, subtopicWordCount, type Subtopic } from "@/lib/vocabulary";

export function SubtopicCard({ domainId, subtopic }: { domainId: string; subtopic: Subtopic }) {
  const { t, language } = useLanguage();
  const router = useRouter();

  const levels = Array.from(new Set(subtopic.words.map((w) => w.jlptLevel))).sort();
  const types = Array.from(new Set(subtopic.words.map((w) => w.wordType)));

  return (
    <Card
      className="group cursor-pointer shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      onClick={() => router.push(`/vocabulary/${domainId}/${subtopic.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-sm font-semibold transition-colors group-hover:text-primary">
          {getSubtopicName(subtopic, language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {levels.map((lvl) => (
            <Badge key={lvl} variant="outline" className="text-[10px]">
              {lvl}
            </Badge>
          ))}
          {types.map((wt) => (
            <Badge key={wt} variant="secondary" className="text-[10px] capitalize">
              {t(wt === "kanji" ? "vocab_type_kanji" : wt === "hiragana" ? "vocab_type_hiragana" : "vocab_type_katakana")}
            </Badge>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">
          {subtopicWordCount(subtopic)} {t("vocab_words_count")}
        </span>
      </CardContent>
    </Card>
  );
}
