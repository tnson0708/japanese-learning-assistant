"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Shield, Clock, Lock, Sparkles, RefreshCw, Repeat } from "lucide-react";
import { useMaintenance, parseVietnamDateTime, getVietnamTimeParts } from "@/lib/maintenance-context";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";

const DAY_NAMES_VI: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  0: "Chủ Nhật",
};

const DAY_NAMES_EN: Record<number, string> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  0: "Sun",
};

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMaintenanceActive, config, activeReason, isAdminLoggedIn } = useMaintenance();
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [timeLeft, setTimeLeft] = useState<string>("");

  // Allow admin routes or logged-in admins to bypass
  const isAdminRoute = pathname?.startsWith("/admin");
  const shouldBlock = isMaintenanceActive && !isAdminRoute && !isAdminLoggedIn;

  // Calculate target reopening time in Vietnam Time (UTC+7)
  useEffect(() => {
    let targetTime: number | null = null;

    if (config.scheduleType === "one_time" && config.autoOnDateTime) {
      targetTime = parseVietnamDateTime(config.autoOnDateTime);
    } else if (config.scheduleType === "recurring" && config.recurringEndTime) {
      const vnNow = getVietnamTimeParts(new Date());
      const endStr = `${vnNow.dateString}T${config.recurringEndTime}`;
      let targetMs = parseVietnamDateTime(endStr);

      // If end time in Vietnam has already passed today, target tomorrow's end time
      if (targetMs <= Date.now()) {
        targetMs += 24 * 60 * 60 * 1000;
      }
      targetTime = targetMs;
    }

    if (!targetTime) {
      setTimeLeft("");
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = (targetTime as number) - now;

      if (diff <= 0) {
        setTimeLeft(isVi ? "Sắp mở lại..." : "Reopening soon...");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (hours > 0) parts.push(`${hours} ${isVi ? "giờ" : "h"}`);
      if (minutes > 0 || hours > 0) parts.push(`${minutes} ${isVi ? "phút" : "m"}`);
      parts.push(`${seconds} ${isVi ? "giây" : "s"}`);

      setTimeLeft(parts.join(" "));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config, isVi]);

  if (shouldBlock) {
    const formattedDays = config.recurringDays
      ? config.recurringDays
          .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
          .map((d) => (isVi ? DAY_NAMES_VI[d] : DAY_NAMES_EN[d]))
          .join(", ")
      : "";

    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 text-center animate-in fade-in duration-300">
        {/* Decorative Glow */}
        <div className="absolute top-1/3 size-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex max-w-md flex-col items-center gap-6 rounded-3xl border bg-card/90 p-8 shadow-2xl backdrop-blur-md">
          {/* Maintenance Icon Badge */}
          <div className="relative flex size-20 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Lock className="size-10 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex size-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-4 bg-amber-500"></span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {activeReason === "scheduled"
                ? config.scheduleType === "recurring"
                  ? isVi
                    ? "Bảo trì lặp lại định kỳ"
                    : "Recurring Scheduled Maintenance"
                  : isVi
                  ? "Bảo trì tự động theo lịch"
                  : "Scheduled Automatic Maintenance"
                : isVi
                ? "Tạm dừng hoạt động"
                : "Maintenance Mode"}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {isVi ? "Website Đang Bảo Trì" : "Site Under Maintenance"}
            </h1>
          </div>

          {/* Custom Admin Notice Message */}
          <div className="w-full rounded-2xl border bg-muted/40 p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {config.customMessage ||
              (isVi
                ? "Hệ thống đang tạm ngưng để nâng cấp dữ liệu. Xin vui lòng quay lại sau ít phút!"
                : "The system is temporarily offline for maintenance. Please check back soon!")}
          </div>

          {/* Time Schedule Info */}
          {config.scheduleType === "recurring" ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 w-full">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <Repeat className="size-4 shrink-0" />
                <span>{isVi ? "Khung giờ bảo trì định kỳ:" : "Recurring Window:"}</span>
              </div>
              <span className="text-sm font-extrabold text-foreground">
                {formattedDays} ({config.recurringStartTime} - {config.recurringEndTime})
                <span className="ml-1 text-xs font-normal text-muted-foreground">(Giờ VN UTC+7)</span>
              </span>

              {timeLeft && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                  <Sparkles className="size-3.5" />
                  <span>
                    {isVi ? "Còn lại:" : "Time left:"} {timeLeft}
                  </span>
                </div>
              )}
            </div>
          ) : (
            config.autoOnDateTime && (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 w-full">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                  <Clock className="size-4 shrink-0" />
                  <span>{isVi ? "Dự kiến mở lại lúc:" : "Estimated reopening:"}</span>
                </div>
                <span className="text-sm font-extrabold text-foreground">
                  {new Date(parseVietnamDateTime(config.autoOnDateTime)).toLocaleString(isVi ? "vi-VN" : "en-US", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    dateStyle: "full",
                    timeStyle: "short",
                  })}{" "}
                  <span className="text-xs font-normal text-muted-foreground">(Giờ VN UTC+7)</span>
                </span>

                {timeLeft && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                    <Sparkles className="size-3.5" />
                    <span>
                      {isVi ? "Còn lại:" : "Time left:"} {timeLeft}
                    </span>
                  </div>
                )}
              </div>
            )
          )}

          {/* Reload & Admin Login Link */}
          <div className="flex flex-col items-center gap-3 w-full pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2 w-full font-semibold cursor-pointer border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
            >
              <RefreshCw className="size-3.5" />
              <span>{isVi ? "Tải lại trang" : "Reload Page"}</span>
            </Button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-2"
            >
              <Shield className="size-3.5" />
              <span>{isVi ? "Đăng nhập Quản trị viên (Admin Login)" : "Admin Control Panel"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
