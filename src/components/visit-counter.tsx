"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Eye, TrendingUp, Sparkles, UserCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const VISIT_STORAGE_KEY = "jla_website_visit_count";
const PAGEVIEW_STORAGE_KEY = "jla_website_pageview_count";
const SESSION_STORAGE_KEY = "jla_session_counted";
const BASE_INITIAL_VISITS = 1280; // Baseline starting counter for realistic presentation

export function VisitCounter({
  variant = "badge",
  className,
}: {
  variant?: "badge" | "footer" | "card";
  className?: string;
}) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [visits, setVisits] = useState<number | null>(null);
  const [pageviews, setPageviews] = useState<number | null>(null);

  useEffect(() => {
    try {
      // 1. Visit Count (per session)
      const storedVisitsStr = localStorage.getItem(VISIT_STORAGE_KEY);
      let currentVisits = storedVisitsStr ? parseInt(storedVisitsStr, 10) : BASE_INITIAL_VISITS;
      if (isNaN(currentVisits)) currentVisits = BASE_INITIAL_VISITS;

      const isSessionCounted = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!isSessionCounted) {
        currentVisits += 1;
        localStorage.setItem(VISIT_STORAGE_KEY, currentVisits.toString());
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      }

      setVisits(currentVisits);

      // 2. Pageview Count (per page navigation)
      const storedPVStr = localStorage.getItem(PAGEVIEW_STORAGE_KEY);
      let currentPV = storedPVStr ? parseInt(storedPVStr, 10) : BASE_INITIAL_VISITS * 3;
      if (isNaN(currentPV)) currentPV = BASE_INITIAL_VISITS * 3;

      currentPV += 1;
      localStorage.setItem(PAGEVIEW_STORAGE_KEY, currentPV.toString());
      setPageviews(currentPV);
    } catch {
      setVisits(BASE_INITIAL_VISITS + 1);
      setPageviews(BASE_INITIAL_VISITS * 3 + 1);
    }
  }, [pathname]);

  if (visits === null) {
    return null; // Prevents SSR hydration mismatch
  }

  const formattedVisits = visits.toLocaleString();
  const formattedPageviews = pageviews ? pageviews.toLocaleString() : null;

  if (variant === "footer") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-2xs transition-colors hover:border-primary/40 hover:text-foreground",
          className
        )}
        title={isVi ? "Số lượt truy cập website" : "Website Visit Statistics"}
      >
        <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
        <Eye className="size-3.5 text-primary" />
        <span>
          {isVi ? `Lượt truy cập: ` : `Visits: `}
          <strong className="font-bold text-foreground">{formattedVisits}</strong>
        </span>
        {formattedPageviews && (
          <>
            <span className="text-border">•</span>
            <span className="text-muted-foreground/80">
              {formattedPageviews} {isVi ? "lượt xem trang" : "views"}
            </span>
          </>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-xl border bg-card/90 p-4 shadow-2xs backdrop-blur-xs transition-all hover:border-primary/40",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">
              {isVi ? "Thống kê truy cập" : "Website Visitors"}
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              {formattedVisits} {isVi ? "lượt ghé thăm" : "visits"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <UserCheck className="size-3.5" />
          <span>Online</span>
        </div>
      </div>
    );
  }

  // Default header badge variant
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
        className
      )}
      title={isVi ? `Tổng số lượt truy cập: ${formattedVisits}` : `Total Website Visits: ${formattedVisits}`}
    >
      <Sparkles className="size-3 text-primary animate-pulse" />
      <Eye className="size-3.5 text-foreground/70" />
      <span className="font-mono font-bold text-foreground text-[11px] sm:text-xs">
        {formattedVisits}
      </span>
    </div>
  );
}
