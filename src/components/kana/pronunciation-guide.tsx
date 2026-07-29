"use client";

import React, { useState } from "react";
import {
  Volume2,
  BookOpen,
  Sparkles,
  Music,
  ArrowRight,
  TrendingUp,
  VolumeX,
  Layers,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type PronunciationTopicId =
  | "all"
  | "long-vowels"
  | "hatsuon"
  | "sokuon"
  | "youon"
  | "ga-row"
  | "devoicing"
  | "pitch-accent"
  | "intonation";

interface AudioBadgeProps {
  text: string;
  romaji?: string;
  meaning?: string;
  accentNote?: string;
  className?: string;
}

function AudioWordBadge({ text, romaji, meaning, accentNote, className }: AudioBadgeProps) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaying(true);
    speakJapanese(text);
    setTimeout(() => setPlaying(false), 1200);
  };

  return (
    <div
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handlePlay(e as unknown as React.MouseEvent)}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-xl border bg-card/80 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-accent/60 hover:shadow-sm cursor-pointer select-none",
        playing && "ring-2 ring-primary/60 bg-primary/5",
        className
      )}
    >
      <button
        type="button"
        className="absolute top-1.5 right-1.5 rounded-full p-1 text-muted-foreground/60 transition-colors group-hover:text-primary group-hover:bg-primary/10"
        title={`Listen to ${text}`}
      >
        <Volume2 className={cn("size-3.5", playing && "animate-pulse text-primary")} />
      </button>

      <span className="text-xl font-bold tracking-wide text-foreground group-hover:text-primary transition-colors">
        {text}
      </span>

      {romaji && (
        <span className="mt-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {romaji}
        </span>
      )}

      {meaning && (
        <span className="mt-1 text-[11px] font-medium text-foreground/80 leading-tight">
          {meaning}
        </span>
      )}

      {accentNote && (
        <span className="mt-1 rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          {accentNote}
        </span>
      )}
    </div>
  );
}

export function PronunciationGuide() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [activeTopic, setActiveTopic] = useState<PronunciationTopicId>("all");

  const topics = [
    { id: "all" as const, label: isVi ? "Tất cả chủ đề" : "All Topics", icon: BookOpen },
    { id: "long-vowels" as const, label: isVi ? "1. Nguyên âm dài (Trường âm)" : "1. Long Vowels (Chōon)", icon: Sparkles },
    { id: "hatsuon" as const, label: isVi ? "2. Âm ん (Hatsuon)" : "2. The 'n' Sound (ん)", icon: Music },
    { id: "sokuon" as const, label: isVi ? "3. Âm ngắt っ (Sokuon)" : "3. Small Tsu (っ)", icon: Layers },
    { id: "youon" as const, label: isVi ? "4. Âm ghép (Yōon)" : "4. Contracted Sounds (Yōon)", icon: Layers },
    { id: "ga-row" as const, label: isVi ? "5. Hàng が (Ga row)" : "5. The 'ga' Row", icon: Music },
    { id: "devoicing" as const, label: isVi ? "6. Vô thanh hóa nguyên âm" : "6. Vowel Devoicing", icon: VolumeX },
    { id: "pitch-accent" as const, label: isVi ? "7. Trọng âm (Pitch Accent)" : "7. Pitch Accent", icon: TrendingUp },
    { id: "intonation" as const, label: isVi ? "8. Ngữ điệu câu (Intonation)" : "8. Sentence Intonation", icon: MessageSquare },
  ];

  const shouldShow = (id: PronunciationTopicId) => activeTopic === "all" || activeTopic === id;

  return (
    <div className="flex flex-col gap-8">
      {/* Sub-Topic Navigation Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card/60 p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-4 text-primary" />
            <span>{isVi ? "Danh mục bài học phát âm" : "Pronunciation Guide Index"}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {isVi ? "8 quy tắc phát âm cốt lõi" : "8 Essential Phonetic Rules"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => {
            const Icon = t.icon;
            const active = activeTopic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTopic(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-secondary/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. LONG VOWELS (TRƯỜNG ÂM / 長音) */}
      {shouldShow("long-vowels") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Nguyên âm dài (Trường âm / 長音)" : "Long Vowels (Chōon / 長音)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Kéo dài thời lượng phát âm bằng 2 đơn vị âm (mora). Làm thay đổi nghĩa của từ."
                  : "Extending vowel duration to 2 beats (morae). Changes the word's meaning."}
              </p>
            </div>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed">
            {isVi ? (
              <p>
                Nguyên âm ngắn trong tiếng Nhật gồm 5 âm <strong>あ, い, う, え, お</strong> (chỉ có 1 đơn vị âm - mora). Khi phát âm kéo dài gấp đôi thì gọi là <strong>nguyên âm dài (trường âm)</strong>. Việc phát âm ngắn hay dài rất quan trọng vì nó sẽ làm thay đổi hoàn toàn nghĩa của từ.
              </p>
            ) : (
              <p>
                Japanese has 5 short vowels: <strong>あ, い, う, え, お</strong> (each counts as 1 mora). When held for twice the duration, it becomes a <strong>long vowel (chōon)</strong>. Distinguishing short and long vowels is crucial as it alters word meaning entirely.
              </p>
            )}
          </div>

          {/* Comparison Cards: Short vs Long Vowels */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isVi ? "Ví dụ so sánh từ âm ngắn và từ có trường âm:" : "Short vs. Long Vowel Pair Examples:"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Pair 1 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="おばさん"
                  romaji="obasan"
                  meaning={isVi ? "cô, bác gái" : "aunt"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="おばあさん"
                  romaji="obaasan"
                  meaning={isVi ? "bà" : "grandmother"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>

              {/* Pair 2 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="おじさん"
                  romaji="ojisan"
                  meaning={isVi ? "chú, bác trai" : "uncle"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="おじいさん"
                  romaji="ojiisan"
                  meaning={isVi ? "ông" : "grandfather"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>

              {/* Pair 3 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="ゆき"
                  romaji="yuki"
                  meaning={isVi ? "tuyết" : "snow"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="ゆうき"
                  romaji="yuuki"
                  meaning={isVi ? "dũng cảm" : "courage"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>

              {/* Pair 4 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="え"
                  romaji="e"
                  meaning={isVi ? "bức tranh" : "picture"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="ええ"
                  romaji="ee"
                  meaning={isVi ? "vâng" : "yes"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>

              {/* Pair 5 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="とる"
                  romaji="toru"
                  meaning={isVi ? "lấy" : "to take"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="とおる"
                  romaji="tooru"
                  meaning={isVi ? "đi qua" : "pass through"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>

              {/* Pair 6 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="ここ"
                  romaji="koko"
                  meaning={isVi ? "đây" : "here"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="こうこう"
                  romaji="koukou"
                  meaning={isVi ? "trường THPT" : "high school"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>

              {/* Pair 7 */}
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge
                  text="へや"
                  romaji="heya"
                  meaning={isVi ? "căn phòng" : "room"}
                  className="flex-1"
                />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge
                  text="へいや"
                  romaji="heiya"
                  meaning={isVi ? "đồng bằng" : "plain"}
                  className="flex-1 border-primary/40 bg-primary/5"
                />
              </div>
            </div>
          </div>

          {/* Rules Section: Writing Long Vowels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Hiragana Rule Box */}
            <div className="rounded-xl border bg-accent/30 p-4">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                <span className="rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Hiragana
                </span>
                {isVi ? "Quy tắc ghi trường âm bằng Hiragana" : "Long Vowel Writing Rules in Hiragana"}
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>
                  <strong>{isVi ? "Cột あ, い, う" : "あ, い, う columns"}</strong>: {isVi ? "Thêm あ, い, う tương ứng." : "Add あ, い, う respectively."}
                </li>
                <li>
                  <strong>{isVi ? "Cột え" : "え column"}</strong>: {isVi ? "Thêm い vào sau (vd: とけい → tokei)." : "Add い (e.g. とけい → tokei)."}
                  <br />
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {isVi ? "Ngoại lệ: ええ (vâng), ねえ (này), おねえさん (chị gái)" : "Exceptions: ええ (yes), ねえ (hey), おねえさん (older sister)"}
                  </span>
                </li>
                <li>
                  <strong>{isVi ? "Cột お" : "お column"}</strong>: {isVi ? "Thêm う vào sau (vd: こうこう → koukou)." : "Add う (e.g. こうこう → koukou)."}
                  <br />
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {isVi ? "Ngoại lệ: おおきい (to), おおい (nhiều), とおい (xa)" : "Exceptions: おおきい (big), おおい (many), とおい (far)"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Katakana Rule Box */}
            <div className="rounded-xl border bg-accent/30 p-4">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                <span className="rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Katakana
                </span>
                {isVi ? "Quy tắc ghi trường âm bằng Katakana" : "Long Vowel Writing Rules in Katakana"}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                {isVi
                  ? "Trong Katakana, tất cả các trường âm đều dùng dấu gạch ngang dài ー (Chōonpu)."
                  : "In Katakana, all long vowels are written using the horizontal bar ー (Chōonpu)."}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <AudioWordBadge text="カード" romaji="kādo" meaning={isVi ? "thẻ, card" : "card"} />
                <AudioWordBadge text="タクシー" romaji="takushī" meaning={isVi ? "tắc-xi" : "taxi"} />
                <AudioWordBadge text="スーパー" romaji="sūpā" meaning={isVi ? "siêu thị" : "supermarket"} />
                <AudioWordBadge text="エスカレーター" romaji="esukarētā" meaning={isVi ? "thang cuốn" : "escalator"} />
                <AudioWordBadge text="ノート" romaji="nōto" meaning={isVi ? "quyển vở" : "notebook"} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. THE 'N' SOUND (CÁCH PHÁT ÂM CỦA ん / 撥音) */}
      {shouldShow("hatsuon") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Cách phát âm của chữ ん (Hatsuon / 撥音)" : "Pronunciation of the 'n' Sound (ん / Hatsuon)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Âm ん kéo dài 1 mora và biến đổi thành /n/, /m/, /ŋ/ tùy theo âm đứng ngay sau nó."
                  : "The sound ん lasts 1 mora and changes to /n/, /m/, or /ŋ/ based on the following sound."}
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">
            {isVi
              ? "Âm ん có độ dài bằng 1 đơn vị âm (mora) và KHÔNG BAO GIỜ đứng ở đầu một từ. Âm ん sẽ tự động biến đổi cách phát âm thành /n/, /m/, hoặc /ŋ/ do ảnh hưởng của các chữ đứng sau nó:"
              : "The sound ん is 1 mora long and NEVER appears at the beginning of a word. Its pronunciation automatically adapts to /n/, /m/, or /ŋ/ depending on the following syllable:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rule 1: /n/ */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background/50 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                  ① /n/
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {isVi ? "Trước hàng た, だ, ら, な" : "Before た, だ, ら, な rows"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Khi chữ tiếp theo thuộc hàng た, だ, ら, な thì ん được phát âm là /n/."
                  : "Pronounced /n/ when followed by t, d, r, n sounds."}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <AudioWordBadge text="はんたい" romaji="hantai" meaning={isVi ? "phản đối" : "opposite"} />
                <AudioWordBadge text="うんどう" romaji="undou" meaning={isVi ? "vận động" : "exercise"} />
                <AudioWordBadge text="せんろ" romaji="senro" meaning={isVi ? "đường ray" : "railway"} />
                <AudioWordBadge text="みんな" romaji="minna" meaning={isVi ? "mọi người" : "everyone"} />
              </div>
            </div>

            {/* Rule 2: /m/ */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background/50 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                  ② /m/
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {isVi ? "Trước hàng ば, ぱ, ま" : "Before ば, ぱ, ま rows"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Khi chữ tiếp theo thuộc hàng ば, ぱ, ま thì ん được phát âm là /m/."
                  : "Pronounced /m/ when followed by b, p, m sounds."}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <AudioWordBadge text="しんぶん" romaji="shinbun" meaning={isVi ? "báo chí" : "newspaper"} />
                <AudioWordBadge text="えんぴつ" romaji="enpitsu" meaning={isVi ? "bút chì" : "pencil"} />
                <AudioWordBadge text="うんめい" romaji="unmei" meaning={isVi ? "vận mệnh" : "destiny"} />
              </div>
            </div>

            {/* Rule 3: /ŋ/ */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background/50 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                  ③ /ŋ/ (ng)
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {isVi ? "Trước hàng か, が" : "Before か, が rows"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Khi chữ tiếp theo thuộc hàng か hoặc が thì ん được phát âm là /ŋ/ (âm ngất mũi)."
                  : "Pronounced /ŋ/ (nasal ng) when followed by k or g sounds."}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <AudioWordBadge text="てんき" romaji="tenki" meaning={isVi ? "thời tiết" : "weather"} />
                <AudioWordBadge text="けんがく" romaji="kengaku" meaning={isVi ? "tham quan" : "study tour"} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. SMALL TSU / SOKUON (CÁCH PHÁT ÂM CỦA っ / 促音) */}
      {shouldShow("sokuon") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Âm ngắt っ (Sokuon / 促音)" : "Small Tsu / Geminate Consonant (っ / Sokuon)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Âm っ nhỏ tạo khoảng khựng ngắn (1 mora) và gấp đôi phụ âm đứng ngay sau nó."
                  : "Small っ creates a brief pause (1 mora) and doubles the following consonant."}
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">
            {isVi ? (
              <>
                Âm <strong>っ (tsu nhỏ)</strong> có độ dài bằng 1 đơn vị âm (mora). Nó đứng trước các âm thuộc hàng <strong>か, さ, た, ぱ</strong> (và các hàng ザ, ダ trong từ ngoại lai Katakana). Khi đọc, cần ngắt nhịp nhẹ như giữ hơi rồi bật âm kế tiếp.
              </>
            ) : (
              <>
                Small <strong>っ (sokuon)</strong> lasts 1 mora. It appears before <strong>か, さ, た, ぱ</strong> rows (and ザ, ダ in Katakana loanwords), creating a double consonant pause before releasing the next sound.
              </>
            )}
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isVi ? "So sánh từ thường và từ có âm ngắt っ:" : "Normal vs. Geminated Pair Examples:"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge text="ぶか" romaji="buka" meaning={isVi ? "cấp dưới" : "subordinate"} className="flex-1" />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge text="ぶっか" romaji="bukka" meaning={isVi ? "mức giá" : "prices"} className="flex-1 border-primary/40 bg-primary/5" />
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge text="かさい" romaji="kasai" meaning={isVi ? "hỏa hoạn" : "fire"} className="flex-1" />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge text="かっさい" romaji="kassai" meaning={isVi ? "vỗ tay tán thưởng" : "applause"} className="flex-1 border-primary/40 bg-primary/5" />
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge text="おと" romaji="oto" meaning={isVi ? "âm thanh" : "sound"} className="flex-1" />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge text="おっと" romaji="otto" meaning={isVi ? "chồng" : "husband"} className="flex-1 border-primary/40 bg-primary/5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isVi ? "Các từ có âm ngắt thông dụng khác:" : "Other Common Small Tsu Words:"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <AudioWordBadge text="にっき" romaji="nikki" meaning={isVi ? "nhật ký" : "diary"} />
              <AudioWordBadge text="ざっし" romaji="zasshi" meaning={isVi ? "tạp chí" : "magazine"} />
              <AudioWordBadge text="きって" romaji="kitte" meaning={isVi ? "con tem" : "stamp"} />
              <AudioWordBadge text="いっぱい" romaji="ippai" meaning={isVi ? "đầy" : "full"} />
              <AudioWordBadge text="コップ" romaji="koppu" meaning={isVi ? "cái cốc" : "cup"} />
              <AudioWordBadge text="ベッド" romaji="beddo" meaning={isVi ? "cái giường" : "bed"} />
            </div>
          </div>
        </section>
      )}

      {/* 4. CONTRACTED SOUNDS (ÂM GHÉP / 拗音 - YŌON) */}
      {shouldShow("youon") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Âm ghép (Yōon / 拗音)" : "Contracted Sounds (Yōon / 拗音)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Kết hợp chữ cột い với ゃ, ゅ, ょ nhỏ. Dù gồm 2 ký tự nhưng chỉ tính là 1 mora."
                  : "Combining an い-column character with small ゃ, ゅ, ょ. Pronounced as 1 mora."}
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">
            {isVi ? (
              <>
                Những âm ghép cùng với các chữ <strong>ゃ, ゅ, ょ nhỏ</strong> gọi là <strong>âm ghép (Yōon)</strong>. Dù được viết bằng hai ký tự nhưng phát âm chỉ liền trong 1 đơn vị âm (mora).
              </>
            ) : (
              <>
                Kana from the い-column paired with small <strong>ゃ, ゅ, ょ</strong> are called <strong>Yōon (contracted sounds)</strong>. Although written with two symbols, they are spoken as a single beat.
              </>
            )}
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isVi ? "So sánh âm đơn và âm ghép:" : "Single vs. Contracted Sound Examples:"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge text="ひやく" romaji="hiyaku" meaning={isVi ? "nhảy vọt" : "leap"} className="flex-1" />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge text="ひゃく" romaji="hyaku" meaning={isVi ? "một trăm" : "100"} className="flex-1 border-primary/40 bg-primary/5" />
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge text="じゆう" romaji="jiyuu" meaning={isVi ? "tự do" : "freedom"} className="flex-1" />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge text="じゅう" romaji="juu" meaning={isVi ? "mười (10)" : "ten (10)"} className="flex-1 border-primary/40 bg-primary/5" />
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-background/50 p-2.5">
                <AudioWordBadge text="びよういん" romaji="biyouin" meaning={isVi ? "thẩm mỹ viện" : "beauty salon"} className="flex-1" />
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <AudioWordBadge text="びょういん" romaji="byouin" meaning={isVi ? "bệnh viện" : "hospital"} className="flex-1 border-primary/40 bg-primary/5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isVi ? "Các ví dụ từ âm ghép khác:" : "More Yōon Word Examples:"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <AudioWordBadge text="シャツ" romaji="shatsu" meaning={isVi ? "áo sơ-mi" : "shirt"} />
              <AudioWordBadge text="おちゃ" romaji="ocha" meaning={isVi ? "trà" : "tea"} />
              <AudioWordBadge text="ぎゅうにゅう" romaji="gyuunyuu" meaning={isVi ? "sữa bò" : "milk"} />
              <AudioWordBadge text="きょう" romaji="kyou" meaning={isVi ? "hôm nay" : "today"} />
              <AudioWordBadge text="ぶちょう" romaji="buchou" meaning={isVi ? "trưởng phòng" : "manager"} />
              <AudioWordBadge text="りょこう" romaji="ryokou" meaning={isVi ? "du lịch" : "travel"} />
            </div>
          </div>
        </section>
      )}

      {/* 5. THE 'GA' ROW PRONUNCIATION (HÀNG が) */}
      {shouldShow("ga-row") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              5
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Phát âm các chữ thuộc hàng が (が・ぎ・ぐ・げ・ご)" : "Pronunciation of the 'ga' Row (が行音)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Phát âm /g/ ở đầu từ và /ŋ/ (âm mũi) khi ở giữa từ trong giọng chuẩn."
                  : "/g/ sound at the start of a word, nasal /ŋ/ sound inside a word."}
              </p>
            </div>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p>
              {isVi ? (
                <>
                  Phụ âm thuộc hàng <strong>が</strong> (が, ぎ, ぐ, げ, ご) khi <strong>đứng đầu một từ</strong> thì được đọc là <strong>/g/</strong>.
                  Khi đứng ở giữa hoặc cuối từ, trong phát âm tiếng Nhật chuẩn truyền thống (Tokyo) sẽ được đọc là âm mũi <strong>/ŋ/</strong> (tương tự âm 'ng' trong tiếng Việt).
                </>
              ) : (
                <>
                  Consonants of the <strong>が row</strong> (が, ぎ, ぐ, げ, ご) are pronounced as <strong>/g/</strong> when at the <strong>beginning of a word</strong>. Inside or at the end of a word, standard Japanese traditionally nasalizes it as <strong>/ŋ/</strong> (like 'ng' in 'sing').
                </>
              )}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              {isVi
                ? "💡 Ghi chú: Gần đây trong giao tiếp hiện đại, nhiều người Nhật trẻ không phân biệt /g/ và /ŋ/ mà đều đọc là /g/ ở mọi vị trí."
                : "💡 Note: In modern casual Japanese, many native speakers simplify both positions to standard /g/."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
            <AudioWordBadge text="がくせい" romaji="gakusei (/g/)" meaning={isVi ? "học sinh (đầu từ)" : "student (initial /g/)"} />
            <AudioWordBadge text="かがく" romaji="kagaku (/ŋ/)" meaning={isVi ? "khoa học (giữa từ)" : "science (medial /ŋ/)"} />
            <AudioWordBadge text="かぎ" romaji="kagi (/ŋ/)" meaning={isVi ? "chìa khóa" : "key"} />
            <AudioWordBadge text="にほんご" romaji="nihongo (/ŋ/)" meaning={isVi ? "tiếng Nhật" : "Japanese"} />
          </div>
        </section>
      )}

      {/* 6. VOWEL DEVOICING (VÔ THANH HÓA NGUYÊN ÂM / 無声化) */}
      {shouldShow("devoicing") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              6
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Sự vô thanh hóa của nguyên âm (Vowel Devoicing / 無声化)" : "Vowel Devoicing (無声化)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Nguyên âm [i] và [u] khi ở giữa các phụ âm vô thanh hoặc ở đuôi ~です, ~ます sẽ bị phát âm lướt nhẹ/thì thầm."
                  : "Vowels [i] and [u] soften into whispered sounds between voiceless consonants or at ~desu/~masu endings."}
              </p>
            </div>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p>
              {isVi ? (
                <>
                  Các nguyên âm như <strong>[i]</strong> và <strong>[u]</strong> khi nằm giữa các phụ âm vô thanh (k, s, t, h, p) có xu hướng bị <strong>vô thanh hóa</strong> (không rung dây thanh quản, giống phát âm thì thầm lướt qua).
                </>
              ) : (
                <>
                  The vowels <strong>[i]</strong> and <strong>[u]</strong> tend to become <strong>devoiced</strong> (whispered without vocal cord vibration) when surrounded by voiceless consonants (k, s, t, h, p).
                </>
              )}
            </p>
            <p>
              {isVi ? (
                <>
                  Đặc biệt, đối với các câu kết thúc bằng đuôi <strong>～です</strong> và <strong>～ます</strong>, nguyên âm <strong>[u]</strong> ở cuối từ cũng có xu hướng bị vô thanh hóa (đọc thành <em>des(u)</em> và <em>mas(u)</em>).
                </>
              ) : (
                <>
                  Additionally, at sentence endings ending with <strong>～です (desu)</strong> and <strong>～ます (masu)</strong>, the trailing <strong>[u]</strong> vowel drops, sounding like <em>des(u)</em> and <em>mas(u)</em>.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
            <AudioWordBadge text="すき" romaji="s(u)ki" meaning={isVi ? "thích" : "like"} accentNote="s[u]ki" />
            <AudioWordBadge text="です" romaji="des(u)" meaning={isVi ? "là (thì, là)" : "is/am/are"} accentNote="des[u]" />
            <AudioWordBadge text="したいです" romaji="shitaides(u)" meaning={isVi ? "muốn làm" : "want to do"} accentNote="shitaides[u]" />
            <AudioWordBadge text="ききます" romaji="kikimas(u)" meaning={isVi ? "nghe" : "listen"} accentNote="kikimas[u]" />
          </div>
        </section>
      )}

      {/* 7. PITCH ACCENT (TRỌNG ÂM CAO THẤP / アクセント) */}
      {shouldShow("pitch-accent") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              7
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Trọng âm cao thấp (Pitch Accent / アクセント)" : "Pitch Accent (Pitch Accent / アクセント)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Tiếng Nhật phân biệt từ bằng độ cao thấp của âm giọng. Tiếng Nhật chuẩn có 4 kiểu trọng âm."
                  : "Japanese distinguishes word meanings through high/low pitch patterns. Standard Japanese has 4 main patterns."}
              </p>
            </div>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p>
              {isVi ? (
                <>
                  Tiếng Nhật là ngôn ngữ có <strong>trọng âm cao thấp (Pitch Accent)</strong>. Độ cao của từng đơn vị âm (mora) quyết định nghĩa của từ.
                  Đặc trưng của tiếng Nhật tiêu chuẩn (Tokyo): <strong>Độ cao âm của mora thứ nhất và mora thứ hai KHÁC NHAU</strong>, và <strong>một khi giọng đã hạ xuống thì không lên lại trong từ đó</strong>.
                </>
              ) : (
                <>
                  Japanese uses a pitch-accent system (high vs. low tone). Two cardinal rules of standard Tokyo accent: <strong>The pitch of mora 1 and mora 2 are always different</strong>, and <strong>once the pitch drops within a word, it never rises again</strong>.
                </>
              )}
            </p>
          </div>

          {/* 4 Pitch Accent Patterns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {/* 1. Heiban */}
            <div className="rounded-xl border bg-background/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-foreground">
                  ① {isVi ? "Kiểu bằng (Heiban - 平板)" : "Flat pattern (Heiban - 平板)"}
                </span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  Low → High → High (Particle stays HIGH)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {isVi
                  ? "Âm đầu thấp, âm thứ 2 cao lên và giữ cao liên tục sang cả trợ từ đứng sau."
                  : "Starts low on 1st mora, rises high on 2nd mora, stays high onto following particles."}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <AudioWordBadge text="にわ" romaji="niwa" meaning={isVi ? "vườn [thấp-cao]" : "garden [L-H]"} />
                <AudioWordBadge text="はな" romaji="hana (mũi)" meaning={isVi ? "mũi (はなが - cao)" : "nose (hana ga - H)"} />
                <AudioWordBadge text="なまえ" romaji="namae" meaning={isVi ? "tên" : "name"} />
                <AudioWordBadge text="にほんご" romaji="nihongo" meaning={isVi ? "tiếng Nhật" : "Japanese"} />
              </div>
            </div>

            {/* 2. Atamadaka */}
            <div className="rounded-xl border bg-background/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-foreground">
                  ② {isVi ? "Kiểu hạ ở đầu từ (Atamadaka - 頭高)" : "Head-high pattern (Atamadaka - 頭高)"}
                </span>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                  HIGH ↓ Low → Low
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {isVi
                  ? "Âm thứ nhất cao, ngay sau đó hạ thấp đột ngột xuống các âm còn lại."
                  : "Starts HIGH on 1st mora, drops immediately to low pitch for remaining morae."}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <AudioWordBadge text="ほん" romaji="hon" meaning={isVi ? "quyển sách" : "book"} />
                <AudioWordBadge text="てんき" romaji="tenki" meaning={isVi ? "thời tiết" : "weather"} />
                <AudioWordBadge text="らいげつ" romaji="raigetsu" meaning={isVi ? "tháng sau" : "next month"} />
              </div>
            </div>

            {/* 3. Nakadaka */}
            <div className="rounded-xl border bg-background/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-foreground">
                  ③ {isVi ? "Kiểu hạ ở giữa từ (Nakadaka - 中高)" : "Middle-high pattern (Nakadaka - 中高)"}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Low → HIGH ↓ Low
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {isVi
                  ? "Âm đầu thấp, nhô cao ở giữa từ rồi hạ thấp xuống trước đuôi từ."
                  : "Starts low, rises high in the middle, then drops low before the end."}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <AudioWordBadge text="たまご" romaji="tamago" meaning={isVi ? "trứng" : "egg"} />
                <AudioWordBadge text="ひこうき" romaji="hikouki" meaning={isVi ? "máy bay" : "airplane"} />
                <AudioWordBadge text="せんせい" romaji="sensei" meaning={isVi ? "giáo viên" : "teacher"} />
              </div>
            </div>

            {/* 4. Odaka */}
            <div className="rounded-xl border bg-background/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-foreground">
                  ④ {isVi ? "Kiểu hạ ở cuối từ (Odaka - 尾高)" : "Tail-high pattern (Odaka - 尾高)"}
                </span>
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  Low → HIGH (Particle DROPS ↓)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {isVi
                  ? "Âm đầu thấp, các âm sau giữ cao đến hết từ. Nhưng khi thêm trợ từ thì trợ từ bị HẠ THẤP."
                  : "Starts low, rises high until end of word, but pitch DROPS on following particle."}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <AudioWordBadge text="くつ" romaji="kutsu" meaning={isVi ? "giày" : "shoes"} />
                <AudioWordBadge text="はな" romaji="hana (hoa)" meaning={isVi ? "hoa (はなが↓)" : "flower (hana ga↓)"} />
                <AudioWordBadge text="やすみ" romaji="yasumi" meaning={isVi ? "ngày nghỉ" : "rest/holiday"} />
                <AudioWordBadge text="おとうと" romaji="otouto" meaning={isVi ? "em trai" : "younger brother"} />
              </div>
            </div>
          </div>

          {/* Minimal distinction example */}
          <div className="rounded-xl border bg-accent/40 p-4 mt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {isVi ? "Phân biệt từ đồng âm nhờ Trọng âm (Pitch Accent Distinction):" : "Homophone Meaning Differences via Pitch Accent:"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <AudioWordBadge text="はし" romaji="hashi [L-H]" meaning={isVi ? "cây cầu (Heiban)" : "bridge (Heiban)"} className="flex-1" />
                <span className="text-xs font-bold text-muted-foreground">vs</span>
                <AudioWordBadge text="はし" romaji="hashi [H-L]" meaning={isVi ? "đôi đũa (Atamadaka)" : "chopsticks (Atamadaka)"} className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <AudioWordBadge text="いち" romaji="ichi [L-H]" meaning={isVi ? "vị trí" : "position"} className="flex-1" />
                <span className="text-xs font-bold text-muted-foreground">vs</span>
                <AudioWordBadge text="いち" romaji="ichi [H-L]" meaning={isVi ? "số một (1)" : "number one (1)"} className="flex-1" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. SENTENCE INTONATION (NGỮ ĐIỆU CÂU / イントネーション) */}
      {shouldShow("intonation") && (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              8
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {isVi ? "Ngữ điệu câu (Sentence Intonation / イントネーション)" : "Sentence Intonation (イントネーション)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "3 kiểu ngữ điệu chính: Đều giọng (→), Cao giọng ở cuối (↗), và Thấp giọng ở cuối (↘)."
                  : "3 core intonation types: Flat tone (→), Rising end (↗), and Falling end (↘)."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border bg-background/50 p-3.5">
              <div className="flex items-center gap-2 font-bold text-xs text-foreground mb-1">
                <span className="text-primary text-base">→</span>
                <span>① {isVi ? "Đều giọng" : "Flat Intonation"}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Phát âm đều giọng từ đầu đến cuối câu (dùng cho câu trần thuật thông thường)."
                  : "Steady, level pitch throughout the sentence (used for standard declarative statements)."}
              </p>
            </div>

            <div className="rounded-xl border bg-background/50 p-3.5">
              <div className="flex items-center gap-2 font-bold text-xs text-foreground mb-1">
                <span className="text-emerald-500 text-base">↗</span>
                <span>② {isVi ? "Cao giọng ở cuối câu" : "Rising Intonation"}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Lên giọng ở cuối câu (dùng cho câu hỏi, nghi vấn, hoặc thể hiện ngạc nhiên)."
                  : "Pitch rises at the end of the sentence (used for questions, confirmation, surprise)."}
              </p>
            </div>

            <div className="rounded-xl border bg-background/50 p-3.5">
              <div className="flex items-center gap-2 font-bold text-xs text-foreground mb-1">
                <span className="text-amber-500 text-base">↘</span>
                <span>③ {isVi ? "Thấp giọng ở cuối câu" : "Falling Intonation"}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isVi
                  ? "Hạ giọng ở cuối câu (bày tỏ sự đồng ý, cảm thán, hoặc thất vọng)."
                  : "Pitch drops at the end (expresses agreement, realization, or disappointment)."}
              </p>
            </div>
          </div>

          {/* Dialogue Example Card */}
          <div className="rounded-xl border bg-accent/30 p-4 flex flex-col gap-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              {isVi ? "Đoạn hội thoại mẫu thực tế:" : "Practical Example Conversation:"}
            </h4>

            <div className="flex flex-col gap-3.5">
              {/* Line 1 */}
              <div className="flex items-start gap-3 rounded-lg bg-card p-3 border">
                <span className="font-bold text-xs text-primary shrink-0 mt-0.5">Sato:</span>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      あした 友達と お花見を します。
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      【→ {isVi ? "đều giọng" : "flat"}】
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isVi ? "Ngày mai tôi sẽ đi ngắm hoa với bạn." : "Tomorrow I am going cherry-blossom viewing with a friend."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese("あした友達とお花見をします")}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-primary shrink-0"
                  title="Listen"
                >
                  <Volume2 className="size-4" />
                </button>
              </div>

              {/* Line 2 */}
              <div className="flex items-start gap-3 rounded-lg bg-card p-3 border border-emerald-500/30">
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">Sato:</span>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      ミラーさんも いっしょに 行きませんか。
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      【↗ {isVi ? "cao giọng ở cuối" : "rising end"}】
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isVi ? "Anh Miller có đi cùng với tôi không?" : "Won't you come along with us, Mr. Miller?"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese("ミラーさんもいっしょに行きませんか")}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-emerald-500 shrink-0"
                  title="Listen"
                >
                  <Volume2 className="size-4" />
                </button>
              </div>

              {/* Line 3 */}
              <div className="flex items-start gap-3 rounded-lg bg-card p-3 border border-amber-500/30">
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">Miller:</span>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      いいですね。
                    </span>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      【↘ {isVi ? "thấp giọng ở cuối" : "falling end"}】
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isVi ? "Nghe hay đấy nhỉ." : "That sounds wonderful!"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese("いいですね")}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-amber-500 shrink-0"
                  title="Listen"
                >
                  <Volume2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
