import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kana Dojo — Japanese Handwriting Practice",
  description:
    "Learn Hiragana and Katakana, practice handwriting with Apple Pencil, and drill yourself with multiple-choice quizzes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
          Stroke order data from{" "}
          <a
            href="https://kanjivg.tagaini.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            KanjiVG
          </a>
          , licensed under CC BY-SA 3.0.
        </footer>
      </body>
    </html>
  );
}
