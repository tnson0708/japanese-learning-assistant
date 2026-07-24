import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SECTIONS = [
  {
    href: "/kana",
    title: "Learn Kana",
    kicker: "あ ア → a",
    description:
      "Browse the Hiragana and Katakana charts with animated stroke order for every character.",
  },
  {
    href: "/practice",
    title: "Practice Writing",
    kicker: "手書き",
    description:
      "Write kana by hand with your Apple Pencil and get an instant percentage match against the correct shape.",
  },
  {
    href: "/quiz",
    title: "Quiz Yourself",
    kicker: "A / B / C / D",
    description:
      "Multiple-choice drills: kana → romaji and romaji → kana, for Hiragana, Katakana, or both.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Kana Dojo
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A focused practice loop for Hiragana and Katakana — learn the
          characters, drill them with quizzes, and train your handwriting
          with your iPad and Apple Pencil.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
              <CardHeader>
                <span className="text-2xl">{s.kicker}</span>
                <CardTitle className="mt-2">{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
