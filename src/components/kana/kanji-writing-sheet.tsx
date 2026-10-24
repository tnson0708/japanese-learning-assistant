"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal, flushSync } from "react-dom";
import { PencilLine, Printer, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASIC_KANJI_WORDS, type BasicKanjiWord } from "@/lib/basic-kanji";
import { EXTRA_KANJI_WORDS } from "@/lib/extra-kanji";
import { normalizeSearch } from "@/lib/search-text";
import { cn } from "@/lib/utils";

/*
 * Printable kanji writing practice paper (Kanji tab → "In giấy tập viết"): one row per
 * kanji — a shaded model cell followed by empty cells with a 3×3 guide grid — laid out
 * on A4 portrait. The sheet is portaled straight into <body> so the `data-print-kanji-sheet`
 * rules in globals.css can hide every other body child while it prints.
 */

const SECTIONS = [
  { id: "basic", label: "Kanji cơ bản", items: BASIC_KANJI_WORDS },
  { id: "extra", label: "Kanji mở rộng", items: EXTRA_KANJI_WORDS },
] as const;

const KANJI_BY_CHAR = new Map<string, BasicKanjiWord>(
  SECTIONS.flatMap((s) => s.items.map((k) => [k.char, k] as const))
);

// CJK ideographs (+ extension A, compatibility, radicals) and the 々 repeat mark.
const HAN_CHAR = /[⺀-⿟々㐀-䶿一-鿿豈-﫿]/gu;

const STORAGE_KEY = "kanji-writing-sheet:v1";

// Sheet geometry, in millimetres. The printable area is A4 portrait inside the
// `@page kanji-sheet` margins, less room for the page header.
const PRINT_W = 186;
const PRINT_H = 270;
const MODEL_GAP = 4;
const LABEL_H = 3;

const CELL_SIZES = [
  { cell: 10, label: "Rất nhỏ" },
  { cell: 12, label: "Nhỏ" },
  { cell: 14.5, label: "Vừa" },
  { cell: 17.5, label: "Lớn" },
] as const;

/** "Cả dòng": trace every practice cell, whatever the row length for the chosen size. */
const TRACE_ALL = -1;
const TRACE_OPTIONS = [0, 1, 2, TRACE_ALL];

interface SheetLayout {
  cell: number;
  practiceCols: number;
  rowsPerPage: number;
  rowW: number;
  rowH: number;
}

function sheetLayout(cell: number): SheetLayout {
  const practiceCols = Math.floor((PRINT_W - MODEL_GAP) / cell) - 1;
  const rowH = cell + LABEL_H;
  return {
    cell,
    practiceCols,
    rowsPerPage: Math.floor(PRINT_H / rowH),
    rowW: cell * (practiceCols + 1) + MODEL_GAP,
    rowH,
  };
}
const GLYPH_FONT =
  'var(--font-kanji-textbook), "Klee One", "YuKyokasho", "Hiragino Mincho ProN", "Yu Mincho", serif';

interface SheetSettings {
  selected: string[];
  rowsPerKanji: number;
  traceCount: number;
  showHanViet: boolean;
  cellSize: number;
}

const DEFAULT_SETTINGS: SheetSettings = {
  selected: [],
  rowsPerKanji: 1,
  traceCount: 1,
  showHanViet: true,
  cellSize: 12,
};

interface SheetRow {
  char: string | null;
  label: string | null;
  trace: number;
}

const subscribeNoop = () => () => {};

function extractHan(text: string): string[] {
  return text.match(HAN_CHAR) ?? [];
}

function buildRows(settings: SheetSettings, layout: SheetLayout): SheetRow[] {
  const firstRowTrace = settings.traceCount === TRACE_ALL ? layout.practiceCols : settings.traceCount;
  const rows: SheetRow[] = settings.selected.flatMap((char) =>
    Array.from({ length: settings.rowsPerKanji }, (_, i) => ({
      char,
      label: settings.showHanViet ? KANJI_BY_CHAR.get(char)?.hanViet ?? null : null,
      trace: i === 0 ? firstRowTrace : 0,
    }))
  );
  // Pad the last page with blank rows so every page is a full sheet of paper.
  const perPage = layout.rowsPerPage;
  const total = Math.max(perPage, Math.ceil(rows.length / perPage) * perPage);
  while (rows.length < total) rows.push({ char: null, label: null, trace: 0 });
  return rows;
}

export function KanjiWritingSheetButton() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [settings, setSettings] = useState<SheetSettings>(DEFAULT_SETTINGS);
  const [query, setQuery] = useState("");
  const lastClicked = useRef<{ section: string; index: number } | null>(null);

  const loadedSaved = useRef(false);

  const openDialog = () => {
    // Every open starts with an empty selection; only the print options are remembered
    // (restored on first open, since storage isn't readable during SSR).
    setSettings((prev) => ({ ...prev, selected: [] }));
    setQuery("");
    lastClicked.current = null;
    if (!loadedSaved.current) {
      loadedSaved.current = true;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const next: SheetSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved), selected: [] };
          // Drop option values saved by older versions of this dialog.
          if (!TRACE_OPTIONS.includes(next.traceCount)) next.traceCount = DEFAULT_SETTINGS.traceCount;
          if (!CELL_SIZES.some((s) => s.cell === next.cellSize)) next.cellSize = DEFAULT_SETTINGS.cellSize;
          setSettings(next);
        }
      } catch {
        // Storage unavailable or corrupt — start from defaults.
      }
    }
    setOpen(true);
  };

  const update = (patch: Partial<SheetSettings> | ((s: SheetSettings) => Partial<SheetSettings>)) => {
    setSettings((prev) => {
      const next = { ...prev, ...(typeof patch === "function" ? patch(prev) : patch) };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, selected: [] }));
      } catch {
        // Ignore — the options just won't be remembered.
      }
      return next;
    });
  };

  const selectedSet = useMemo(() => new Set(settings.selected), [settings.selected]);

  const addChars = (chars: string[]) =>
    update((s) => {
      const seen = new Set(s.selected);
      const added = chars.filter((c) => !seen.has(c) && seen.add(c));
      return { selected: [...s.selected, ...added] };
    });

  const removeChars = (chars: string[]) => {
    const drop = new Set(chars);
    update((s) => ({ selected: s.selected.filter((c) => !drop.has(c)) }));
  };

  const typedHan = useMemo(() => extractHan(query), [query]);
  const normalizedQuery = typedHan.length ? "" : normalizeSearch(query);

  const filteredSections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
          (k) =>
            !normalizedQuery ||
            normalizeSearch(k.hanViet).includes(normalizedQuery) ||
            normalizeSearch(k.meaningVi).includes(normalizedQuery) ||
            k.hiragana.includes(query.trim())
        ),
      })),
    [normalizedQuery, query]
  );
  const filteredCount = filteredSections.reduce((n, s) => n + s.items.length, 0);

  const handleQueryEnter = () => {
    if (typedHan.length) {
      addChars(typedHan);
      setQuery("");
    } else if (normalizedQuery && filteredCount) {
      addChars(filteredSections.flatMap((s) => s.items.map((k) => k.char)));
      setQuery("");
    }
  };

  const handleTileClick = (sectionId: string, items: readonly BasicKanjiWord[], index: number, shift: boolean) => {
    const char = items[index].char;
    const last = lastClicked.current;
    if (shift && last && last.section === sectionId && last.index !== index) {
      // Shift-click selects the whole range from the previously clicked tile.
      const [from, to] = last.index < index ? [last.index, index] : [index, last.index];
      addChars(items.slice(from, to + 1).map((k) => k.char));
    } else if (selectedSet.has(char)) {
      removeChars([char]);
    } else {
      addChars([char]);
    }
    lastClicked.current = { section: sectionId, index };
  };

  const layout = useMemo(() => sheetLayout(settings.cellSize), [settings.cellSize]);
  const rows = useMemo(() => buildRows(settings, layout), [settings, layout]);
  const pageCount = rows.length / layout.rowsPerPage;
  const kanjiPerPage = Math.floor(layout.rowsPerPage / settings.rowsPerKanji);

  // While printing, the dialog is unmounted outright rather than closed (closing waits on an
  // exit animation that print preview pauses, leaving the dialog stuck half-closed). `open`
  // stays true, so it comes back with the same selection once preview is dismissed.
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    flushSync(() => setPrinting(true));
    document.body.setAttribute("data-print-kanji-sheet", "");
    window.addEventListener(
      "afterprint",
      () => {
        document.body.removeAttribute("data-print-kanji-sheet");
        setPrinting(false);
      },
      { once: true }
    );
    // The sheet is display:none on screen, so its web font may not be fetched yet — load
    // the glyphs first (bounded, so a slow network never blocks printing).
    try {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-kanji-textbook");
      if (family) {
        await Promise.race([
          document.fonts.load(`600 48px ${family}`, settings.selected.join("") || "漢"),
          new Promise((resolve) => setTimeout(resolve, 2500)),
        ]);
      }
    } catch {
      // Fall back to whatever font is available.
    }
    window.print();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={openDialog}
        className="gap-2 font-bold text-xs rounded-xl border-border/80 hover:bg-accent cursor-pointer"
      >
        <PencilLine className="size-4 text-red-600" />
        <span>
          In giấy tập viết<span className="hidden sm:inline"> Kanji</span>
        </span>
      </Button>

      {!printing && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="flex max-h-[92dvh] flex-col gap-3 sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">In giấy tập viết Kanji</DialogTitle>
              <DialogDescription className="text-xs">
                Mỗi dòng: ô mẫu + {layout.practiceCols} ô trống kẻ lưới · A4 dọc · {layout.rowsPerPage} dòng/trang
                {settings.rowsPerKanji > 1 && ` (${kanjiPerPage} chữ/trang)`}.
              </DialogDescription>
            </DialogHeader>

            {/* Quick add: paste kanji, or filter by Hán Việt / meaning / reading */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleQueryEnter();
                    }
                  }}
                  placeholder="Dán chữ Hán (vd: 日本語学校) hoặc tìm Hán Việt, nghĩa…"
                  className="h-10 w-full rounded-xl border border-border/80 bg-background pl-9 pr-9 text-sm outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-accent cursor-pointer"
                    aria-label="Xóa ô tìm"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <p className="px-1 text-[11px] text-muted-foreground">
                {typedHan.length ? (
                  <>
                    Nhấn <kbd className="font-semibold">Enter</kbd> để thêm {typedHan.length} chữ: {typedHan.join(" ")}
                  </>
                ) : normalizedQuery ? (
                  filteredCount ? (
                    <>
                      Nhấn <kbd className="font-semibold">Enter</kbd> để thêm cả {filteredCount} chữ đang lọc
                    </>
                  ) : (
                    "Không tìm thấy chữ nào"
                  )
                ) : (
                  "Bấm chữ để chọn / bỏ chọn · Shift + bấm để chọn cả dãy · Có thể dán bất kỳ chữ Hán nào, kể cả chữ ngoài danh sách"
                )}
              </p>
            </div>

            {/* Kanji tiles */}
            <div className="-mx-1 min-h-32 flex-1 overflow-y-auto px-1">
              {filteredSections.map((section) =>
                section.items.length === 0 ? null : (
                  <div key={section.id} className="mb-3">
                    <div className="sticky top-0 z-10 mb-1.5 flex items-center justify-between bg-popover py-1">
                      <span className="text-xs font-bold text-foreground">
                        {section.label}{" "}
                        <span className="font-semibold text-muted-foreground">({section.items.length})</span>
                      </span>
                      {(() => {
                        const chars = section.items.map((k) => k.char);
                        const allSelected = chars.every((c) => selectedSet.has(c));
                        return (
                          <button
                            type="button"
                            onClick={() => (allSelected ? removeChars(chars) : addChars(chars))}
                            className="rounded-lg px-2 py-0.5 text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          >
                            {allSelected ? "Bỏ chọn nhóm" : "Chọn cả nhóm"}
                          </button>
                        );
                      })()}
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5">
                      {section.items.map((k, index) => {
                        const order = settings.selected.indexOf(k.char);
                        const active = order !== -1;
                        return (
                          <button
                            key={k.id}
                            type="button"
                            title={`${k.hanViet} · ${k.meaningVi}`}
                            onClick={(e) => handleTileClick(section.id, section.items, index, e.shiftKey)}
                            className={cn(
                              "relative flex flex-col items-center rounded-lg border px-1 pt-1 pb-0.5 transition-colors cursor-pointer select-none",
                              active
                                ? "border-red-600 bg-red-600 text-white"
                                : "border-border/80 bg-card hover:border-red-500/50 hover:bg-accent/60"
                            )}
                          >
                            <span className="font-kanji-mincho text-xl leading-tight">{k.char}</span>
                            <span
                              className={cn(
                                "w-full truncate text-center text-[9px] font-semibold",
                                active ? "text-white/85" : "text-muted-foreground"
                              )}
                            >
                              {k.hanViet}
                            </span>
                            {active && (
                              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-black">
                                {order + 1}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Selected order + options */}
            <div className="-mx-4 -mb-4 flex flex-col gap-3 rounded-b-xl border-t bg-muted/50 p-4">
              <div className="flex items-start gap-2">
                <div className="flex min-h-8 flex-1 flex-wrap items-center gap-1">
                  {settings.selected.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      Chưa chọn chữ nào — in ra sẽ là giấy kẻ ô trống.
                    </span>
                  ) : (
                    settings.selected.map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => removeChars([char])}
                        title="Bỏ chữ này"
                        className="group flex items-center gap-0.5 rounded-md border border-border/80 bg-background px-1.5 py-0.5 hover:border-red-500/60 cursor-pointer"
                      >
                        <span className="font-kanji-mincho text-base leading-none">{char}</span>
                        <X className="size-3 text-muted-foreground group-hover:text-red-600" />
                      </button>
                    ))
                  )}
                </div>
                {settings.selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => update({ selected: [] })}
                    className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                  >
                    Xóa hết
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <OptionPills
                  label="Cỡ ô"
                  value={settings.cellSize}
                  options={CELL_SIZES.map((s) => s.cell)}
                  format={(n) => CELL_SIZES.find((s) => s.cell === n)?.label ?? String(n)}
                  title={(n) => {
                    const l = sheetLayout(n);
                    return `Ô ${String(n).replace(".", ",")} mm · ${l.rowsPerPage} dòng/trang · ${l.practiceCols} ô trống/dòng`;
                  }}
                  onChange={(cellSize) => update({ cellSize })}
                />
                <OptionPills
                  label="Dòng mỗi chữ"
                  value={settings.rowsPerKanji}
                  options={[1, 2, 3]}
                  onChange={(rowsPerKanji) => update({ rowsPerKanji })}
                />
                <OptionPills
                  label="Chữ mờ để tô"
                  value={settings.traceCount}
                  options={TRACE_OPTIONS}
                  format={(n) => (n === TRACE_ALL ? "Cả dòng" : String(n))}
                  onChange={(traceCount) => update({ traceCount })}
                />
                <label className="flex items-center gap-1.5 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.showHanViet}
                    onChange={(e) => update({ showHanViet: e.target.checked })}
                    className="size-3.5 accent-red-600"
                  />
                  Âm Hán Việt
                </label>
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="ml-auto gap-2 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In {settings.selected.length > 0 ? `${settings.selected.length} chữ · ` : ""}
                  {pageCount} trang
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {mounted && createPortal(<KanjiWritingSheet rows={rows} layout={layout} />, document.body)}
    </>
  );
}

function OptionPills({
  label,
  value,
  options,
  format = String,
  title,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  format?: (n: number) => string;
  title?: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <div className="flex rounded-lg border border-border/80 bg-background p-0.5">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            title={title?.(n)}
            aria-pressed={value === n}
            className={cn(
              "rounded-md px-2 py-0.5 font-bold transition-colors cursor-pointer",
              value === n ? "bg-red-600 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {format(n)}
          </button>
        ))}
      </div>
    </div>
  );
}

function KanjiWritingSheet({ rows, layout }: { rows: SheetRow[]; layout: SheetLayout }) {
  const pages: SheetRow[][] = [];
  for (let i = 0; i < rows.length; i += layout.rowsPerPage) pages.push(rows.slice(i, i + layout.rowsPerPage));

  return (
    <div className="kanji-writing-sheet hidden print:block text-black">
      {pages.map((pageRows, p) => (
        <div key={p} className="kanji-sheet-page">
          <div
            className="mx-auto mb-[2mm] flex items-end justify-between text-[9pt]"
            style={{ maxWidth: `${layout.rowW}mm` }}
          >
            <span className="font-bold">Luyện viết Kanji</span>
            <span className="text-neutral-600">
              Họ tên: ____________________ &nbsp; Ngày: ____________ &nbsp; Trang {p + 1}/{pages.length}
            </span>
          </div>
          {pageRows.map((row, r) => (
            <SheetRowSvg key={r} row={row} layout={layout} />
          ))}
        </div>
      ))}
    </div>
  );
}

function SheetRowSvg({ row, layout }: { row: SheetRow; layout: SheetLayout }) {
  const { cell, practiceCols, rowW, rowH } = layout;
  const glyph = (x: number, fill: string) =>
    row.char && (
      <text
        x={x + cell / 2}
        y={cell / 2}
        fontSize={cell * 0.74}
        textAnchor="middle"
        dominantBaseline="central"
        fill={fill}
        style={{ fontFamily: GLYPH_FONT, fontWeight: 600 }}
      >
        {row.char}
      </text>
    );

  return (
    <svg
      viewBox={`0 0 ${rowW} ${rowH}`}
      className="mx-auto block w-full"
      style={{ maxWidth: `${rowW}mm` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <GridCell x={0} size={cell} model />
      {glyph(0, "#000")}
      {row.label && (
        <text x={cell / 2} y={cell + 2.3} fontSize={2.3} textAnchor="middle" fill="#555">
          {row.label}
        </text>
      )}
      {Array.from({ length: practiceCols }, (_, i) => {
        const x = cell + MODEL_GAP + i * cell;
        return (
          <g key={i}>
            <GridCell x={x} size={cell} />
            {i < row.trace && glyph(x, "#c9c9c9")}
          </g>
        );
      })}
    </svg>
  );
}

function GridCell({ x, size: cell, model = false }: { x: number; size: number; model?: boolean }) {
  const t = cell / 3;
  const guide = { stroke: "#c4c4c4", strokeWidth: 0.15, strokeDasharray: "0.6 0.5" };
  return (
    <g>
      <rect
        x={x + 0.1}
        y={0.1}
        width={cell - 0.2}
        height={cell - 0.2}
        fill={model ? "#f1f1f1" : "#fff"}
        stroke="#999"
        strokeWidth={0.25}
        strokeDasharray={model ? "0.8 0.5" : undefined}
      />
      <line x1={x + t} y1={0} x2={x + t} y2={cell} {...guide} />
      <line x1={x + 2 * t} y1={0} x2={x + 2 * t} y2={cell} {...guide} />
      <line x1={x} y1={t} x2={x + cell} y2={t} {...guide} />
      <line x1={x} y1={2 * t} x2={x + cell} y2={2 * t} {...guide} />
    </g>
  );
}
