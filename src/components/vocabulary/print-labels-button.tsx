"use client";

import { Printer, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function PrintLabelsButton() {
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="gap-2 shrink-0 font-semibold border-primary/30 hover:border-primary hover:bg-primary/10 text-foreground"
      title={t("vocab_print_btn")}
    >
      <Printer className="size-4 text-primary" />
      <Scissors className="size-3.5 -ml-1 text-primary" />
      <span>{t("vocab_print_btn")}</span>
    </Button>
  );
}
