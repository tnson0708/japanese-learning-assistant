import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { VisitCounter } from "@/components/visit-counter";
import { Providers } from "@/app/providers";
import { MaintenanceGuard } from "@/components/maintenance-guard";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Kana Dojo — Japanese Handwriting & Vocabulary",
  description:
    "Learn Hiragana and Katakana, practice handwriting with Apple Pencil, and study categorized Japanese vocabulary words.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kana Dojo",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      className={`${sansFont.variable} ${geistMono.variable} h-full antialiased font-sans`}
    >

      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <MaintenanceGuard>
            <Nav />
            <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t px-4 py-4 pb-24 md:pb-4 text-xs text-muted-foreground max-w-6xl mx-auto w-full">
              <div>
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
              </div>
              <VisitCounter variant="footer" />
            </footer>
          </MaintenanceGuard>
        </Providers>
      </body>
    </html>
  );
}

