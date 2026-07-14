import type { ReadonlyRange } from "@jiki/curriculum";

// A ReadonlyRange is authored against one version of the document but can be
// applied against another — locked lines persisted from previously-edited
// longer code get set while a shorter doc is loading, or a stored range
// outlives an edit that shortened its line. Every place that turns a range into
// concrete document positions has therefore hit the same class of bug
// ("Invalid line number N in M-line document", "Position N is out of range"),
// which the changeFilter then swallows into a blanket edit veto.
//
// These two resolvers are the single source of truth for coercing a possibly
// stale range onto the current document. Nothing else should do
// `doc.line(...).from + char` arithmetic by hand — go through here so a new
// staleness dimension only needs fixing in one place.

// Minimal structural views of a CodeMirror document/line, so these resolvers
// stay usable from both state (Text) and view contexts without importing either.
interface DocLine {
  from: number;
  to: number;
}
interface Doc {
  lines: number;
  line: (n: number) => DocLine;
}

// Clamp a range's line numbers into the document. Returns a range whose
// fromLine/toLine are guaranteed valid for `doc.line()`, or null when the range
// starts entirely beyond the document (nothing left to anchor). When the
// original toLine no longer exists, toChar is dropped: the clamped last line has
// a different length, so the stored offset is meaningless.
export function clampRangeToDoc(range: ReadonlyRange, doc: Pick<Doc, "lines">): ReadonlyRange | null {
  if (range.fromLine > doc.lines) {
    return null;
  }
  if (range.toLine <= doc.lines) {
    return range;
  }
  return { ...range, toLine: doc.lines, toChar: undefined };
}

// Resolve a range to absolute { from, to } document positions, clamping every
// coordinate to the current document. Returns null when the range starts beyond
// the document. A fromChar/toChar that overshoots its (surviving) line clamps to
// that line's end rather than spilling past it. `from` is never greater than
// `to`, so the result is always a valid, forward document range.
export function resolveRangePositions(range: ReadonlyRange, doc: Doc): { from: number; to: number } | null {
  const clamped = clampRangeToDoc(range, doc);
  if (!clamped) {
    return null;
  }
  const fromLine = doc.line(clamped.fromLine);
  const toLine = doc.line(clamped.toLine);
  const from = Math.min(fromLine.from + (clamped.fromChar ?? 0), fromLine.to);
  const to = clamped.toChar !== undefined ? Math.min(toLine.from + clamped.toChar, toLine.to) : toLine.to;
  return { from: Math.min(from, to), to };
}
