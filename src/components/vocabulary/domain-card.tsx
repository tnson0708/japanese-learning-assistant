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
  ArrowRight,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { domainWordCount, getDomainName, getSubtopicName, type Domain } from "@/lib/vocabulary";
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

export const DOMAIN_META: Record<
  string,
  {
    kanji: string;
    sampleWords: string;
  }
> = {
  "daily-life": {
    kanji: "日常生活",
    sampleWords: "朝 (Sáng) • 掃除 (Dọn dẹp) • 部屋 (Phòng)",
  },
  "family-relationships": {
    kanji: "家族・人間関係",
    sampleWords: "家族 (Gia đình) • 両親 (Bố mẹ) • 先輩 (Tiền bối)",
  },
  "food-drink": {
    kanji: "飲食・料理",
    sampleWords: "ご飯 (Cơm) • 寿司 (Sushi) • 居酒屋 (Quán nhậu)",
  },
  health: {
    kanji: "健康・医療",
    sampleWords: "病院 (Bệnh viện) • 薬 (Thuốc) • 体調 (Thể trạng)",
  },
  shopping: {
    kanji: "買い物",
    sampleWords: "値段 (Giá cả) • 割引 (Giảm giá) • 財布 (Ví tiền)",
  },
  "travel-transportation": {
    kanji: "旅行・交通",
    sampleWords: "切符 (Vé) • 新幹線 (Tàu cao tốc) • 空港 (Sân bay)",
  },
  "work-technology": {
    kanji: "仕事・IT",
    sampleWords: "会社 (Công ty) • パソコン (Máy tính) • 残業 (Làm thêm)",
  },
  "weather-nature": {
    kanji: "天気・自然",
    sampleWords: "桜 (Hoa anh đào) • 季節 (Mùa) • 晴れ (Nắng)",
  },
  "emotions-personality": {
    kanji: "感情・性格",
    sampleWords: "嬉しい (Vui sướng) • 優しい (Hiền hậu) • 安心 (Yên tâm)",
  },
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
  const { language } = useLanguage();
  const Icon = DOMAIN_ICON_MAP[domain.icon] ?? Layers;
  const meta = DOMAIN_META[domain.id] ?? { kanji: "", sampleWords: "" };
  const totalWords = domainWordCount(domain);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!matchesFilters}
      className={cn(
        "group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 text-left shadow-2xs transition-all duration-200 gap-4 min-h-[220px]",
        matchesFilters
          ? "hover:-translate-y-1 hover:border-red-500/40 hover:shadow-md hover:bg-card cursor-pointer"
          : "opacity-40 cursor-not-allowed"
      )}
    >
      {/* Top Header: Icon + Badges */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <Icon className="size-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-muted/80 px-2 py-0.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {domain.subtopics.length} CHỦ ĐỀ CON
          </span>
          <span className="rounded-md bg-red-50 dark:bg-red-950/60 px-2 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            {totalWords} TỪ
          </span>
        </div>
      </div>

      {/* Main Title & Kanji Subtitle */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-base font-extrabold text-foreground group-hover:text-red-600 transition-colors">
            {getDomainName(domain, language)}
          </h3>
          {meta.kanji && (
            <span className="text-xs font-semibold text-muted-foreground/80">
              {meta.kanji}
            </span>
          )}
        </div>

        {/* Subtopic Pill Tags (Concise without heavy text) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {domain.subtopics.slice(0, 4).map((subtopic) => (
            <span
              key={subtopic.id}
              className="rounded-md bg-muted/40 border border-border/50 px-2 py-0.5 text-[11px] font-medium text-foreground/80"
            >
              {getSubtopicName(subtopic, language)}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Row: Sample Words + Hover Arrow */}
      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span className="truncate font-medium text-[11px] text-muted-foreground/90">
          {meta.sampleWords}
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-600" />
      </div>
    </button>
  );
}
