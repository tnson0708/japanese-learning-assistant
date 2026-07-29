"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  History,
  Home,
  Menu,
  MessageSquare,
  PenTool,
  Table,
  X,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { VoiceToggle } from "@/components/voice-toggle";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: t("nav_home"), icon: Home },
    { href: "/kana", label: t("nav_learn"), icon: BookOpen },
    { href: "/vocabulary", label: t("nav_vocabulary"), icon: Table },
    { href: "/theory", label: t("nav_theory"), icon: GraduationCap },
    { href: "/phrases", label: t("nav_phrases"), icon: MessageSquare },
    { href: "/practice", label: t("nav_practice"), icon: PenTool },
    { href: "/quiz", label: t("nav_quiz"), icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight shrink-0 text-foreground text-base sm:text-lg"
        >
          <span>仮名道場</span>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Header Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <VoiceToggle />
          <LanguageToggle />

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex md:hidden items-center justify-center rounded-lg border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel / Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background/98 p-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1">
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
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-80" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
