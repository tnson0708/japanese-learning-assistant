"use client";

import {
  Home,
  Users,
  Utensils,
  HeartPulse,
  ShoppingBag,
  Plane,
  Briefcase,
  CloudSun,
  Smile,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { domainWordCount, type Domain } from "@/lib/vocabulary";
import { cn } from "@/lib/utils";

export const DOMAIN_ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  utensils: Utensils,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  plane: Plane,
  briefcase: Briefcase,
  "cloud-sun": CloudSun,
  smile: Smile,
};

export function DomainCard({
  domain,
  matchesFilters,
  onClick,
}: {
  domain: Domain;
  matchesFilters: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const Icon = DOMAIN_ICON_MAP[domain.icon] ?? Layers;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!matchesFilters}
      className={cn(
        "group flex flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-2xs transition-all duration-200",
        matchesFilters
          ? "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-accent/50 hover:shadow-sm active:translate-y-0 cursor-pointer"
          : "opacity-40 cursor-not-allowed"
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {domain.subtopics.length} {t("vocab_subtopics_count")}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {domain.name}
        </h3>
        <span className="text-xs text-muted-foreground">
          {domainWordCount(domain)} {t("vocab_words_count")}
        </span>
      </div>

      {!matchesFilters && (
        <p className="text-[11px] text-muted-foreground italic">{t("vocab_no_matching_domain")}</p>
      )}
    </button>
  );
}
