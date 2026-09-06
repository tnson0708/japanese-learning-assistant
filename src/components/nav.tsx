"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutGrid,
  MessageSquare,
  PenTool,
  Presentation,
  Shield,
  Search,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { VoiceToggle } from "@/components/voice-toggle";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { GlobalSearchModal } from "@/components/global-search-modal";

export function Nav() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const isVi = language === "vi";
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    { href: "/", label: t("nav_home"), shortLabel: isVi ? "Trang chủ" : "Home", icon: Home },
    { href: "/kana", label: t("nav_learn"), shortLabel: isVi ? "Học Kana" : "Learn", icon: BookOpen },
    { href: "/vocabulary", label: t("nav_vocabulary"), shortLabel: isVi ? "Từ vựng" : "Vocab", icon: LayoutGrid },
    { href: "/theory", label: t("nav_theory"), shortLabel: isVi ? "Lý thuyết" : "Theory", icon: GraduationCap },
    { href: "/phrases", label: t("nav_phrases"), shortLabel: isVi ? "Mẫu câu" : "Phrases", icon: MessageSquare },
    { href: "/practice", label: t("nav_practice"), shortLabel: isVi ? "Luyện tập" : "Practice", icon: PenTool },
    { href: "/slides", label: t("nav_slides"), shortLabel: isVi ? "Slide" : "Slides", icon: Presentation },
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

          {/* Header Right Controls (Search Trigger, Voice & Language Toggles & Admin Link) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Spotlight Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-input bg-background/80 px-2.5 sm:px-3 text-xs text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-2xs"
              title="Tìm kiếm toàn hệ thống (⌘K / Ctrl+K)"
            >
              <Search className="size-4 text-primary shrink-0" />
              <span className="hidden sm:inline-block font-medium">{isVi ? "Tìm kiếm..." : "Search..."}</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                <span>⌘</span>K
              </kbd>
            </button>

            <Link
              href="/admin"
              className={cn(
                "flex size-9 items-center justify-center rounded-lg border transition-colors cursor-pointer",
                pathname.startsWith("/admin")
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              )}
              title="Trang quản trị (Admin Panel)"
            >
              <Shield className="size-4" />
            </Link>
            <VoiceToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Floating Mobile Bottom Navigation Dock (App-like Bottom Tab Bar elevated for iPhone & mobile devices) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-3 inset-x-3 z-50 md:hidden mx-auto max-w-md rounded-2xl border bg-background/95 backdrop-blur-xl shadow-xl ring-1 ring-border/50 p-1.5 mb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-center justify-around overflow-x-auto scrollbar-none px-1 py-1 gap-1">
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
                  "group relative flex flex-1 min-w-[52px] flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 text-center select-none active:scale-95",
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

                <span className="mt-0.5 text-[10px] leading-tight font-medium tracking-tight whitespace-nowrap truncate max-w-[60px]">
                  {link.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
