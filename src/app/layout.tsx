import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Yuji_Boku } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
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

// Bold ink-brush display face for kanji/kana glyphs (see .font-kanji-mincho in globals.css) —
// system Mincho fonts render too thin/delicate to match the intended brush-calligraphy look.
const kanjiFont = Yuji_Boku({
  weight: "400",
  variable: "--font-kanji",
  subsets: ["latin"],
  display: "swap",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Applies the saved theme before first paint (defaults to light mode).
// Must stay in sync with readInitialTheme() in lib/theme-context.tsx.
const themeInitScript = `(function(){try{var s=localStorage.getItem("kana_dojo_theme");var d=s==="dark";document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${geistMono.variable} ${kanjiFont.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <MaintenanceGuard>
            <Nav />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </MaintenanceGuard>
        </Providers>
      </body>
    </html>
  );
}

