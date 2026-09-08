"use client";

import { useRouter } from "next/navigation";
import { PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { useVocabProgress } from "@/lib/vocab-progress-context";

export function ContinueLearningButton() {
  const { t } = useLanguage();
  const router = useRouter();
  const { getNextIncompleteSubtopic } = useVocabProgress();
  const next = getNextIncompleteSubtopic();

  if (!next) {
    return (
      <Button variant="secondary" disabled className="gap-2 font-semibold shrink-0">
        <PartyPopper className="size-4" />
        {t("vocab_all_caught_up")}
      </Button>
    );
  }

  return (
    <Button
      onClick={() => router.push(`/vocabulary/${next.domainId}/${next.subtopicId}`)}
      className="gap-2 font-semibold shrink-0"
    >
      <Sparkles className="size-4" />
      {t("vocab_continue_learning")}
    </Button>
  );
}
