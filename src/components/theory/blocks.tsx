"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JapaneseText } from "@/components/theory/japanese-text";
import {
  FillInBlankExerciseBlock,
  MultipleChoiceExerciseBlock,
  ReorderSentenceExerciseBlock,
  SentencePracticeBlock,
  PictureCardsExerciseBlock,
} from "@/components/theory/exercise-blocks";
import { TranslationBlock } from "@/components/theory/translation-blocks";
import type { ContentBlock, VocabItem } from "@/lib/theory";

function VocabRow({ item }: { item: VocabItem }) {
  return (
    <li className="flex flex-col gap-1 border-b border-border/60 py-3 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex shrink-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:w-52">
        <JapaneseText
          text={item.kanji ?? item.jp}
          reading={item.kanji ? item.jp : undefined}
          className="text-lg font-medium"
        />
      </div>
      <div className="flex-1 text-sm text-foreground">
        <p>{item.meaning}</p>
        {item.note && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
        )}
      </div>
    </li>
  );
}

function VocabList({ items }: { items: VocabItem[] }) {
  return (
    <ul className="flex flex-col rounded-xl border bg-card px-4 shadow-2xs sm:px-5">
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
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
    <div className="flex flex-col gap-2">
      {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-2xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c, i) => (
                <th key={i} scope="col" className="px-4 py-2.5 sm:px-5">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, ri) => (
              <tr key={ri} className="transition-colors hover:bg-accent/40">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 whitespace-nowrap sm:px-5">
                    {speakableColumns.includes(ci) ? (
                      <JapaneseText text={cell} />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
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
    <div className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
      <JapaneseText text={jp} className="text-base font-medium" />
      <span className="text-sm text-muted-foreground">{vi}</span>
    </div>
  );
}

function GrammarPatternCard({
  block,
}: {
  block: Extract<ContentBlock, { type: "grammar-pattern" }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {block.pattern}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {block.explanation && (
          <p className="text-sm leading-relaxed text-foreground">
            {block.explanation}
          </p>
        )}

        {block.subPoints && block.subPoints.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {block.subPoints.map((sp, i) => (
              <div key={i} className="text-sm leading-relaxed">
                {sp.label && (
                  <span className="font-semibold text-foreground">
                    {sp.label}:{" "}
                  </span>
                )}
                <span className="text-foreground">{sp.text}</span>
              </div>
            ))}
          </div>
        )}

        {block.examples && block.examples.length > 0 && (
          <div className="flex flex-col divide-y divide-border/60 rounded-lg border bg-muted/30 px-3.5 py-1">
            {block.examples.map((ex, i) => (
              <ExampleLine key={i} jp={ex.jp} vi={ex.vi} />
            ))}
          </div>
        )}

        {block.notes && block.notes.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {block.notes.map((n, i) => (
              <p
                key={i}
                className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:text-amber-400"
              >
                <span className="font-semibold">[Chú ý] </span>
                {n}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NoteBox({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed bg-muted/40 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
      {text}
    </p>
  );
}

/**
 * Dispatches a single content block to its renderer. This is the only place
 * that needs to change when a new block type is introduced for a future
 * lesson with a different structure — lesson data and the section layout
 * around this never need to.
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
      return <h3 className="text-lg font-semibold text-foreground">{block.text}</h3>;
    case "paragraph":
      return <p className="text-sm text-foreground">{block.text}</p>;
    case "translation-section":
      return (
        <TranslationBlock
          title={block.title}
          instruction={block.instruction}
          sentences={block.sentences}
          examples={block.examples}
          dialogueTitle={block.dialogueTitle}
          dialogueLines={block.dialogueLines}
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
    default:
      return null;
  }
}
