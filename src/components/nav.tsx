"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  Home,
  MessageSquare,
  PenTool,
  Table,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { VoiceToggle } from "@/components/voice-toggle";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const isVi = language === "vi";
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);

  const links = [
    { href: "/", label: t("nav_home"), shortLabel: isVi ? "Trang chủ" : "Home", icon: Home },
    { href: "/kana", label: t("nav_learn"), shortLabel: isVi ? "Học Kana" : "Learn", icon: BookOpen },
    { href: "/vocabulary", label: t("nav_vocabulary"), shortLabel: isVi ? "Từ vựng" : "Vocab", icon: Table },
    { href: "/theory", label: t("nav_theory"), shortLabel: isVi ? "Lý thuyết" : "Theory", icon: GraduationCap },
    { href: "/phrases", label: t("nav_phrases"), shortLabel: isVi ? "Mẫu câu" : "Phrases", icon: MessageSquare },
    { href: "/practice", label: t("nav_practice"), shortLabel: isVi ? "Luyện tập" : "Practice", icon: PenTool },
    { href: "/quiz", label: t("nav_quiz"), shortLabel: isVi ? "Trắc nghiệm" : "Quiz", icon: HelpCircle },
  ];

  // Auto-scroll active mobile bottom tab into view on route change
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [pathname]);

  return (
    <>
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight shrink-0 text-foreground text-base sm:text-lg"
          >
            <span>仮名道場</span>
          </Link>

          {/* Desktop Navigation Links (hidden on mobile, visible on md+) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Right Controls (Voice & Language Toggles) */}
          <div className="flex items-center gap-2 shrink-0">
            <VoiceToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (App-like Bottom Tab Bar for mobile devices) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t bg-background/95 backdrop-blur-md shadow-lg pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-center justify-around overflow-x-auto scrollbar-none px-1 py-1.5 gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                ref={active ? activeTabRef : null}
                className={cn(
                  "group relative flex flex-1 min-w-[56px] flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 text-center select-none active:scale-95",
                  active
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active Indicator Background Pill */}
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-primary/10 -z-10 animate-in fade-in zoom-in-95 duration-150" />
                )}

                <Icon
                  className={cn(
                    "size-5 transition-transform duration-200 group-active:scale-90",
                    active && "stroke-[2.5px] scale-105"
                  )}
                />

                <span className="mt-0.5 text-[10px] leading-tight font-medium tracking-tight whitespace-nowrap truncate max-w-[64px]">
                  {link.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
