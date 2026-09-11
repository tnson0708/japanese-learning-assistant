"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JapaneseText } from "@/components/theory/japanese-text";
import { BookOpen, GraduationCap, Info } from "lucide-react";
import {
  FillInBlankExerciseBlock,
  MultipleChoiceExerciseBlock,
  ReorderSentenceExerciseBlock,
  SentencePracticeBlock,
  PictureCardsExerciseBlock,
  ListeningAudioListBlock,
  SelfIntroExerciseBlock,
  PictureParticleWriteBlock,
  PictureCuedWriteBlock,
  DialogueCompletionBlock,
} from "@/components/theory/exercise-blocks";
import {
  ListeningDictationBlock,
  ListeningPictureChoiceBlock,
  ListeningTrueFalseBlock,
  ReadingComprehensionBlock,
} from "@/components/theory/listening-exercise-blocks";
import { TranslationBlock } from "@/components/theory/translation-blocks";
import type { ContentBlock, VocabItem } from "@/lib/theory";

function VocabRow({ item }: { item: VocabItem }) {
  return (
    <li className="flex flex-col gap-1 border-b border-border/60 py-3 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex shrink-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:w-52">
        <JapaneseText
          text={item.kanji ?? item.jp}
          reading={item.kanji ? item.jp : undefined}
          className="text-lg font-bold text-foreground"
        />
      </div>
      <div className="flex-1 text-sm text-foreground">
        <p className="font-medium">{item.meaning}</p>
        {item.note && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
        )}
      </div>
    </li>
  );
}

function VocabList({ items }: { items: VocabItem[] }) {
  return (
    <ul className="flex flex-col rounded-xl border border-border/80 bg-card px-4 shadow-2xs sm:px-5">
      {items.map((item, i) => (
        <VocabRow key={i} item={item} />
      ))}
    </ul>
  );
}

function VocabGroup({ heading, items }: { heading?: string; items: VocabItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {heading && (
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
          {heading}
        </h3>
      )}
      <VocabList items={items} />
    </div>
  );
}

function SimpleTable({
  title,
  columns,
  rows,
  speakableColumns = [],
}: {
  title?: string;
  columns: string[];
  rows: string[][];
  speakableColumns?: number[];
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {title && (
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-red-600" />
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-2xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c, i) => (
                <th key={i} scope="col" className="px-4 py-3 sm:px-5">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, ri) => (
              <tr key={ri} className="transition-colors hover:bg-accent/40">
                {row.map((cell, ci) => {
                  const isSpeakable = speakableColumns.includes(ci);
                  return (
                    <td key={ci} className="px-4 py-3 whitespace-nowrap sm:px-5">
                      {isSpeakable ? (
                        <JapaneseText text={cell} className="font-semibold text-foreground" />
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExampleLine({ jp, vi }: { jp: string; vi: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0">
      <JapaneseText text={jp} className="text-base font-bold text-foreground" />
      <span className="text-xs font-medium text-muted-foreground">{vi}</span>
    </div>
  );
}

function GrammarPatternCard({
  block,
}: {
  block: Extract<ContentBlock, { type: "grammar-pattern" }>;
}) {
  return (
    <Card className="border-border/80 bg-card shadow-2xs rounded-xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
            <GraduationCap className="size-4" />
          </div>
          <CardTitle className="text-base font-bold text-foreground">
            {block.pattern}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        {block.explanation && (
          <p className="text-xs sm:text-sm leading-relaxed text-foreground font-medium">
            {block.explanation}
          </p>
        )}

        {block.subPoints && block.subPoints.length > 0 && (
          <div className="flex flex-col gap-3">
            {block.subPoints.map((sp, i) => (
              <div key={i} className="text-xs sm:text-sm leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/50">
                {sp.label && (
                  <span className="font-bold text-red-600 block mb-1">
                    {sp.label}
                  </span>
                )}
                <span className="text-foreground font-medium">{sp.text}</span>
              </div>
            ))}
          </div>
        )}

        {block.examples && block.examples.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Ví dụ mẫu
            </span>
            <div className="flex flex-col divide-y divide-border/60 rounded-xl border border-red-200/60 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 px-4 py-2">
              {block.examples.map((ex, i) => (
                <ExampleLine key={i} jp={ex.jp} vi={ex.vi} />
              ))}
            </div>
          </div>
        )}

        {block.notes && block.notes.length > 0 && (
          <div className="flex flex-col gap-2">
            {block.notes.map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-900 dark:text-amber-300"
              >
                <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">[Chú ý quan trọng]: </span>
                  <span>{n}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NoteBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground">
      <Info className="size-4 text-red-600 shrink-0 mt-0.5" />
      <span className="font-medium text-foreground">{text}</span>
    </div>
  );
}

/**
 * Dispatches a single content block to its renderer.
 */
export function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "vocab-list":
      return <VocabList items={block.items} />;
    case "vocab-group":
      return <VocabGroup heading={block.heading} items={block.items} />;
    case "table":
      return <SimpleTable {...block} />;
    case "grammar-pattern":
      return <GrammarPatternCard block={block} />;
    case "note":
      return <NoteBox text={block.text} />;
    case "heading":
      return <h3 className="text-base font-bold text-foreground border-b pb-2">{block.text}</h3>;
    case "paragraph":
      return <p className="text-xs sm:text-sm text-foreground leading-relaxed">{block.text}</p>;
    case "translation-section":
      return (
        <TranslationBlock
          title={block.title}
          instruction={block.instruction}
          sentences={block.sentences}
          examples={block.examples}
          dialogueTitle={block.dialogueTitle}
          dialogueLines={block.dialogueLines}
          dialogueAudioUrl={block.dialogueAudioUrl}
        />
      );
    case "exercise-fill-in-blank":
      return (
        <FillInBlankExerciseBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          questions={block.questions}
        />
      );
    case "exercise-multiple-choice":
      return (
        <MultipleChoiceExerciseBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          questions={block.questions}
        />
      );
    case "exercise-sentence-practice":
      return (
        <SentencePracticeBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          items={block.items}
        />
      );
    case "exercise-reorder-sentence":
      return (
        <ReorderSentenceExerciseBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          questions={block.questions}
        />
      );
    case "exercise-picture-cards":
      return (
        <PictureCardsExerciseBlock
          title={block.title}
          instruction={block.instruction}
          people={block.people}
          groups={block.groups}
        />
      );
    case "listening-audio-list":
      return (
        <ListeningAudioListBlock
          title={block.title}
          instruction={block.instruction}
          items={block.items}
        />
      );
    case "exercise-listening-dictation":
      return (
        <ListeningDictationBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          exampleJp={block.exampleJp}
          exampleVi={block.exampleVi}
          items={block.items}
        />
      );
    case "exercise-listening-picture-choice":
      return (
        <ListeningPictureChoiceBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          groups={block.groups}
        />
      );
    case "exercise-listening-truefalse":
      return (
        <ListeningTrueFalseBlock
          title={block.title}
          instruction={block.instruction}
          audioUrl={block.audioUrl}
          items={block.items}
        />
      );
    case "exercise-self-intro":
      return (
        <SelfIntroExerciseBlock
          title={block.title}
          instruction={block.instruction}
          introText={block.introText}
          lines={block.lines}
          closingText={block.closingText}
          sampleAnswerJp={block.sampleAnswerJp}
          sampleAnswerVi={block.sampleAnswerVi}
        />
      );
    case "exercise-reading-comprehension":
      return (
        <ReadingComprehensionBlock
          title={block.title}
          instruction={block.instruction}
          passageTitle={block.passageTitle}
          passageJp={block.passageJp}
          passageVi={block.passageVi}
          passageImageUrl={block.passageImageUrl}
          items={block.items}
        />
      );
    case "exercise-picture-particle-write":
      return (
        <PictureParticleWriteBlock
          title={block.title}
          instruction={block.instruction}
          imageUrl={block.imageUrl}
          imageAlt={block.imageAlt}
          example={block.example}
          items={block.items}
        />
      );
    case "exercise-picture-cued-write":
      return (
        <PictureCuedWriteBlock
          title={block.title}
          instruction={block.instruction}
          imageUrl={block.imageUrl}
          imageAlt={block.imageAlt}
          suffixJp={block.suffixJp}
          example={block.example}
          items={block.items}
        />
      );
    case "exercise-dialogue-completion":
      return (
        <DialogueCompletionBlock
          title={block.title}
          instruction={block.instruction}
          example={block.example}
          items={block.items}
        />
      );
    default:
      return null;
  }
}
