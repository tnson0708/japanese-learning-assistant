"use client";

import { useMemo, useState } from "react";
import { Volume2, VolumeX, PenTool, FileText, Sparkles, Headphones, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/option-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeSession } from "@/components/practice/practice-session";
import {
  PaperPracticeSession,
  type PaperDirection,
  type PaperItem,
} from "@/components/practice/paper-practice-session";
import { speakJapanese } from "@/lib/speech";
import {
  ListeningPracticeSession,
  type ListeningItem,
} from "@/components/practice/listening-practice-session";
import {
  filterKana,
  randomKana,
  type KanaSection,
  type Script,
} from "@/lib/kana";
import {
  getAllWords,
  getWordsByDifficulty,
  randomWordByDifficulty,
  WORD_DIFFICULTIES,
  WORD_DIFFICULTY_LABELS_BILINGUAL,
  DIFFICULTY_JLPT_MAP,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getSubCategory,
  SUB_CATEGORY_LABELS,
  JLPT_LEVELS,
  JLPT_LEVEL_LABELS,
  type WordDifficulty,
  type WordCategory,
  type JlptLevel,
} from "@/lib/words";
import {
  PHRASE_LIST,
  PHRASE_THEMES,
  PHRASE_TOPICS,
  type PhraseTheme,
  type PhraseTopic,
} from "@/lib/phrases";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type Scope = Script | "both";
type ContentType = "character" | "word";

function pickNextKana(scope: Scope, section: KanaSection, excludeId: string): PaperItem {
  let candidate = randomKana(scope, section);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomKana(scope, section);
  }
  return candidate;
}

function pickNextWord(
  difficulty: WordDifficulty,
  scope: Scope,
  excludeId: string
): PaperItem {
  let candidate = randomWordByDifficulty(difficulty, scope);
  for (let i = 0; i < 5 && candidate.id === excludeId; i++) {
    candidate = randomWordByDifficulty(difficulty, scope);
  }
  return {
    id: candidate.id,
    char: candidate.word,
    romaji: candidate.romaji,
    meaning: candidate.meaning,
  };
}

export default function PracticePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("paper");
  const [isSessionActive, setIsSessionActive] = useState(false);

  return (
    <div className={cn("mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:py-8", !isSessionActive && "gap-6")}>
      {/* Header (hidden during active practice session for clean full-screen focus) */}
      {!isSessionActive && (
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {t("practice_title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("practice_subtitle")}
          </p>
        </div>
      )}

      {/* Practice Mode Selector */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={cn("grid w-full grid-cols-1 sm:grid-cols-3 max-w-3xl h-auto p-1.5 gap-1.5 bg-muted/70 rounded-xl", isSessionActive && "hidden")}>
          <TabsTrigger
            value="paper"
            className="flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-card data-[state=active]:shadow-xs text-foreground/80 data-[state=active]:text-foreground whitespace-nowrap"
          >
            <FileText className="size-4 shrink-0 text-primary" />
            <span>{t("practice_tab_paper")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="handwriting"
            className="flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-card data-[state=active]:shadow-xs text-foreground/80 data-[state=active]:text-foreground whitespace-nowrap"
          >
            <PenTool className="size-4 shrink-0 text-primary" />
            <span>{t("practice_tab_handwriting")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="listening"
            className="flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-card data-[state=active]:shadow-xs text-foreground/80 data-[state=active]:text-foreground whitespace-nowrap"
          >
            <Headphones className="size-4 shrink-0 text-primary" />
            <span>{t("practice_tab_listening")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paper" className={cn(!isSessionActive && "mt-6")}>
          <PaperPanel onSessionStateChange={setIsSessionActive} />
        </TabsContent>
        <TabsContent value="handwriting" className={cn(!isSessionActive && "mt-6")}>
          <HandwritingPanel onSessionStateChange={setIsSessionActive} />
        </TabsContent>
        <TabsContent value="listening" className={cn(!isSessionActive && "mt-6")}>
          <ListeningPanel onSessionStateChange={setIsSessionActive} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ListeningPanel({ onSessionStateChange }: { onSessionStateChange?: (active: boolean) => void }) {
  const { t, language } = useLanguage();
  const [started, setStarted] = useState(false);
  const [contentType, setContentType] = useState<"word" | "sentence">("word");
  const [wordDifficulty, setWordDifficulty] = useState<WordDifficulty | "all">("all");
  const [wordCategory, setWordCategory] = useState<WordCategory | "all">("all");
  const [wordSubgroup, setWordSubgroup] = useState<string>("all");
  const [phraseTheme, setPhraseTheme] = useState<PhraseTheme>("all");
  const [phraseTopic, setPhraseTopic] = useState<PhraseTopic>("all");
  const [breakSeconds, setBreakSeconds] = useState(5);
  const [speedRate, setSpeedRate] = useState<number>(0.9);
  const [autoReveal, setAutoReveal] = useState<boolean>(false);
  const [sessionKey, setSessionKey] = useState(0);

  const typeOptions = [
    { value: "word", label: t("listening_type_words") },
    { value: "sentence", label: t("listening_type_sentences") },
  ];

  const wordBreakOptions = [3, 5, 8, 10, 15].map((s) => ({
    value: s,
    label: `${s}s`,
  }));

  const sentenceBreakOptions = [5, 8, 10, 15, 20, 30].map((s) => ({
    value: s,
    label: `${s}s`,
  }));

  const speedOptions = [
    { value: 0.9, label: t("listening_speed_normal") },
    { value: 0.7, label: t("listening_speed_slow") },
  ];

  const difficultyOptions: { value: WordDifficulty | "all"; label: string }[] = [
    { value: "all", label: language === "vi" ? "Tất cả độ khó" : "All Difficulties" },
    ...WORD_DIFFICULTIES.map((d) => ({
      value: d,
      label: WORD_DIFFICULTY_LABELS_BILINGUAL[language][d],
    })),
  ];

  const wordCategoryOptions = [
    { value: "all", label: "All Categories" },
    ...CATEGORY_ORDER.map((cat) => ({
      value: cat,
      label: CATEGORY_LABELS[cat],
    })),
  ];

  // Compute available subgroups based on difficulty & category
  const availableSubgroups = useMemo(() => {
    const allWords = getAllWords();
    const targetLevels = wordDifficulty !== "all" ? DIFFICULTY_JLPT_MAP[wordDifficulty] : null;
    const filtered = allWords.filter((w) => {
      if (targetLevels && !targetLevels.includes(w.level)) return false;
      if (wordCategory !== "all" && w.category !== wordCategory) return false;
      return true;
    });

    const set = new Set<string>();
    for (const w of filtered) {
      set.add(getSubCategory(w));
    }
    return Array.from(set).sort();
  }, [wordDifficulty, wordCategory]);

  const subgroupOptions = useMemo(() => {
    return [
      { value: "all", label: t("listening_all_subgroups") },
      ...availableSubgroups.map((sg) => ({
        value: sg,
        label: SUB_CATEGORY_LABELS[sg]?.[language] || sg,
      })),
    ];
  }, [availableSubgroups, language, t]);

  const phraseThemeOptions = PHRASE_THEMES.map((theme) => ({
    value: theme.id,
    label: language === "vi" ? theme.labelVi : theme.labelEn,
  }));

  const availablePhraseTopics = useMemo(() => {
    if (phraseTheme === "all") return PHRASE_TOPICS;
    return PHRASE_TOPICS.filter((tp) => tp.theme === phraseTheme);
  }, [phraseTheme]);

  const phraseTopicOptions = [
    { value: "all", label: t("phrases_all_topics") },
    ...availablePhraseTopics.map((tp) => ({
      value: tp.id,
      label: language === "vi" ? tp.labelVi : tp.labelEn,
    })),
  ];

  // Filter Pool Items
  const listeningPool: ListeningItem[] = useMemo(() => {
    if (contentType === "word") {
      const allWords = getAllWords();
      const targetLevels = wordDifficulty !== "all" ? DIFFICULTY_JLPT_MAP[wordDifficulty] : null;
      const filtered = allWords.filter((w) => {
        if (targetLevels && !targetLevels.includes(w.level)) return false;
        if (wordCategory !== "all" && w.category !== wordCategory) return false;
        if (wordSubgroup !== "all" && getSubCategory(w) !== wordSubgroup) return false;
        return true;
      });
      return filtered.map((w) => {
        const sub = getSubCategory(w);
        const subName = SUB_CATEGORY_LABELS[sub]?.[language] || sub;
        return {
          id: w.id,
          japanese: w.kanji || w.word,
          hiragana: w.word,
          romaji: w.romaji,
          meaning: w.meaning,
          type: "word",
          subLabel: `${CATEGORY_LABELS[w.category]} • ${subName}`,
        };
      });
    } else {
      const filtered = PHRASE_LIST.filter((p) => {
        if (phraseTheme !== "all" && p.theme !== phraseTheme) return false;
        if (phraseTopic !== "all" && p.topic !== phraseTopic) return false;
        return true;
      });
      return filtered.map((p) => ({
        id: p.id,
        japanese: p.japanese,
        hiragana: p.hiragana,
        romaji: p.romaji,
        meaning: language === "vi" ? p.vietnamese : p.english,
        type: "sentence",
        subLabel: p.topic,
      }));
    }
  }, [contentType, wordDifficulty, wordCategory, wordSubgroup, phraseTheme, phraseTopic, language]);

  // Shuffle items for practice session
  const shuffledPool = useMemo(() => {
    const arr = [...listeningPool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [listeningPool, sessionKey]);

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("listening_mode_title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("listening_mode_desc")}
          </p>
        </div>

        {/* Content Type (Words vs Sentences) */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("listening_content_type")}
          </span>
          <OptionGroup
            options={typeOptions}
            value={contentType}
            onChange={(val) => {
              setContentType(val as "word" | "sentence");
              setBreakSeconds(val === "word" ? 5 : 10);
            }}
            size="sm"
          />
        </div>

        {/* Word Filters */}
        {contentType === "word" && (
          <>
            <div className="flex flex-col gap-2 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("practice_difficulty")}
              </span>
              <OptionGroup
                options={difficultyOptions}
                value={wordDifficulty}
                onChange={(val) => {
                  setWordDifficulty(val as WordDifficulty | "all");
                  setWordSubgroup("all");
                }}
                size="sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("listening_category_filter")}
              </span>
              <select
                value={wordCategory}
                onChange={(e) => {
                  setWordCategory(e.target.value as WordCategory | "all");
                  setWordSubgroup("all");
                }}
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {wordCategoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("listening_subgroup_filter")}
              </span>
              <select
                value={wordSubgroup}
                onChange={(e) => setWordSubgroup(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {subgroupOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Sentence Filters */}
        {contentType === "sentence" && (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("listening_theme_filter")}
              </span>
              <select
                value={phraseTheme}
                onChange={(e) => {
                  setPhraseTheme(e.target.value as PhraseTheme);
                  setPhraseTopic("all");
                }}
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {phraseThemeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("phrases_topic")}
              </span>
              <select
                value={phraseTopic}
                onChange={(e) => setPhraseTopic(e.target.value as PhraseTopic)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {phraseTopicOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Break Time Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("listening_break_time")}
          </span>
          <OptionGroup
            options={contentType === "word" ? wordBreakOptions : sentenceBreakOptions}
            value={breakSeconds}
            onChange={(val) => setBreakSeconds(Number(val))}
            size="sm"
          />
        </div>

        {/* Audio Speed */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("listening_speech_speed")}
          </span>
          <OptionGroup
            options={speedOptions}
            value={speedRate}
            onChange={(val) => setSpeedRate(Number(val))}
            size="sm"
          />
        </div>

        {/* Answer Auto-reveal Setting */}
        <div className="flex items-center justify-between lg:col-span-2 pt-2 border-t">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-foreground">
              {t("listening_auto_reveal")}
            </span>
            <span className="text-xs text-muted-foreground">
              Automatically reveal Kanji/meaning during practice
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAutoReveal((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              autoReveal ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block size-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
                autoReveal ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {/* Pool Count Badge */}
        <div className="flex items-center justify-between lg:col-span-2 rounded-lg bg-secondary/50 p-3">
          <span className="text-xs font-medium text-muted-foreground">
            Items matching selected filters:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            {listeningPool.length}{" "}
            {contentType === "word" ? t("practice_word_pool_count") : t("listening_phrase_pool_count")}
          </span>
        </div>

        <Button
          size="lg"
          disabled={listeningPool.length === 0}
          onClick={() => {
            setSessionKey((k) => k + 1);
            setStarted(true);
            onSessionStateChange?.(true);
          }}
          className="mt-2 w-full text-base font-semibold lg:col-span-2"
        >
          {t("listening_btn_start")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col lg:max-w-lg">
      <ListeningPracticeSession
        key={sessionKey}
        items={shuffledPool}
        breakSeconds={breakSeconds}
        rate={speedRate}
        autoRevealDefault={autoReveal}
        onEnd={() => {
          setStarted(false);
          onSessionStateChange?.(false);
        }}
      />
    </div>
  );
}


function HandwritingPanel({ onSessionStateChange }: { onSessionStateChange?: (active: boolean) => void }) {
  const { t } = useLanguage();
  const [started, setStarted] = useState(false);
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [sessionKey, setSessionKey] = useState(0);

  const scopeOptions: { value: Scope; label: string }[] = [
    { value: "hiragana", label: "Hiragana" },
    { value: "katakana", label: "Katakana" },
    { value: "both", label: "Both" },
  ];

  const sectionOptions: { value: KanaSection; label: string }[] = [
    { value: "all", label: t("practice_sec_all") },
    { value: "main", label: t("practice_sec_main") },
    { value: "dakuten", label: t("practice_sec_dakuten") },
    { value: "youon", label: t("practice_sec_youon") },
  ];

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  const [startKana, setStartKana] = useState(() => randomKana(scope, section));

  if (!started) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">{t("mod_practice_title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("mod_practice_desc")}
          </p>
        </div>

        {/* Script Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("practice_script")}
          </span>
          <OptionGroup options={scopeOptions} value={scope} onChange={setScope} size="sm" />
        </div>

        {/* Section Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("practice_section")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              {poolCount} {t("practice_pool_count")}
            </span>
          </div>
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <OptionGroup
              options={sectionOptions}
              value={section}
              onChange={setSection}
              size="sm"
              className="flex-nowrap"
            />
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setStartKana(randomKana(scope, section));
            setSessionKey((k) => k + 1);
            setStarted(true);
            onSessionStateChange?.(true);
          }}
          className="mt-2 w-full text-base font-semibold"
        >
          {t("practice_btn_start_digital")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col lg:max-w-lg">
      <PracticeSession
        key={sessionKey}
        initialKana={startKana}
        scope={scope}
        section={section}
        onEnd={() => {
          setStarted(false);
          onSessionStateChange?.(false);
        }}
      />
    </div>
  );
}

function PaperPanel({ onSessionStateChange }: { onSessionStateChange?: (active: boolean) => void }) {
  const { t, language } = useLanguage();
  const [started, setStarted] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("character");
  const [scope, setScope] = useState<Scope>("hiragana");
  const [section, setSection] = useState<KanaSection>("all");
  const [difficulty, setDifficulty] = useState<WordDifficulty>("easy");
  const [direction, setDirection] = useState<PaperDirection>("write");
  const [promptSeconds, setPromptSeconds] = useState(5);
  const [revealSeconds, setRevealSeconds] = useState(3);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [sessionKey, setSessionKey] = useState(0);

  const scopeOptions: { value: Scope; label: string }[] = [
    { value: "hiragana", label: "Hiragana" },
    { value: "katakana", label: "Katakana" },
    { value: "both", label: "Both" },
  ];

  const sectionOptions: { value: KanaSection; label: string }[] = [
    { value: "all", label: t("practice_sec_all") },
    { value: "main", label: t("practice_sec_main") },
    { value: "dakuten", label: t("practice_sec_dakuten") },
    { value: "youon", label: t("practice_sec_youon") },
  ];

  const contentOptions: { value: ContentType; label: string }[] = [
    { value: "character", label: t("practice_content_kana") },
    { value: "word", label: t("practice_content_words") },
  ];

  const difficultyOptions: { value: WordDifficulty; label: string }[] =
    WORD_DIFFICULTIES.map((d) => ({
      value: d,
      label: WORD_DIFFICULTY_LABELS_BILINGUAL[language][d],
    }));

  const directionOptions: { value: PaperDirection; label: string }[] = [
    { value: "write", label: `${t("practice_title")} (romaji → kana)` },
    { value: "read", label: `${t("nav_learn")} (kana → romaji)` },
  ];

  const poolCount = useMemo(
    () => filterKana(scope, section).length,
    [scope, section]
  );

  const wordPoolCount = useMemo(
    () => getWordsByDifficulty(difficulty, scope).length,
    [difficulty, scope]
  );

  if (!started) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border bg-card p-5 sm:p-7 shadow-2xs lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("practice_tab_paper")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("paper_ready_desc")}
          </p>
        </div>

        {/* Content Type */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("practice_content")}
          </span>
          <OptionGroup
            options={contentOptions}
            value={contentType}
            onChange={setContentType}
            size="sm"
          />
        </div>

        {/* Script Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("practice_script")}
          </span>
          <OptionGroup options={scopeOptions} value={scope} onChange={setScope} size="sm" />
        </div>

        {/* Kana Section */}
        {contentType === "character" && (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("practice_section")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                {poolCount} {t("practice_pool_count")}
              </span>
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <OptionGroup
                options={sectionOptions}
                value={section}
                onChange={setSection}
                size="sm"
                className="flex-nowrap"
              />
            </div>
          </div>
        )}

        {/* Word Level */}
        {contentType === "word" && (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("practice_difficulty")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                {wordPoolCount} {t("practice_word_pool_count")}
              </span>
            </div>
            <OptionGroup options={difficultyOptions} value={difficulty} onChange={setDifficulty} size="sm" />
          </div>
        )}

        {/* Direction */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("quiz_direction")}
          </span>
          <OptionGroup
            options={directionOptions}
            value={direction}
            onChange={setDirection}
            size="sm"
          />
        </div>

        {/* Drill Speed Selection */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" />
            {t("practice_speed")}
          </span>
          <select
            value={`${promptSeconds}-${revealSeconds}`}
            onChange={(e) => {
              const [p, r] = e.target.value.split("-").map(Number);
              setPromptSeconds(p);
              setRevealSeconds(r);
            }}
            className="w-full rounded-lg border bg-background px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="3-2">{t("paper_speed_option_fast")}</option>
            <option value="5-3">{t("paper_speed_option_standard")}</option>
            <option value="8-5">{t("paper_speed_option_relaxed")}</option>
            <option value="12-8">{t("paper_speed_option_slow")}</option>
            <option value="0-0">{t("paper_speed_option_manual")}</option>
          </select>
        </div>

        {/* Audio Option */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <button
            type="button"
            onClick={() => setAutoPlayAudio((v) => !v)}
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              autoPlayAudio
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            )}
          >
            {autoPlayAudio ? (
              <Volume2 className="size-3.5" />
            ) : (
              <VolumeX className="size-3.5" />
            )}
            Auto-play pronunciation
          </button>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setSessionKey((k) => k + 1);
            setStarted(true);
            onSessionStateChange?.(true);
          }}
          className="mt-2 w-full text-base font-semibold lg:col-span-2"
        >
          {t("practice_btn_start_paper")}
        </Button>
      </div>
    );
  }

  const pickNext = (excludeId: string) =>
    contentType === "character"
      ? pickNextKana(scope, section, excludeId)
      : pickNextWord(difficulty, scope, excludeId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col lg:max-w-lg">
      <PaperPracticeSession
        key={sessionKey}
        direction={direction}
        promptSeconds={promptSeconds}
        revealSeconds={revealSeconds}
        autoPlayAudio={autoPlayAudio}
        pickNext={pickNext}
        onEnd={() => {
          setStarted(false);
          onSessionStateChange?.(false);
        }}
      />
    </div>
  );
}
