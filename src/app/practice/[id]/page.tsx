"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PracticeSession } from "@/components/practice/practice-session";
import { getKanaById } from "@/lib/kana";

export default function PracticeCharacterPage() {
  const params = useParams<{ id: string }>();
  const kana = getKanaById(params.id);

  if (!kana) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-muted-foreground">Character not found.</p>
        <Button render={<Link href="/practice" />} nativeButton={false} variant="outline">
          Back to practice
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href={`/kana/${kana.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to {kana.char}
      </Link>
      <PracticeSession initialKana={kana} scope={kana.script} />
    </div>
  );
}
