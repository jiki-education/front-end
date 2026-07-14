import type { ReadonlyRange } from "@jiki/curriculum";

// A ReadonlyRange is authored against one version of the document but can be
// applied against another — locked lines persisted from previously-edited
// longer code get set while a shorter doc is loading, or a stored range
// outlives an edit that shortened its line. Every place that turns a range into
// concrete document positions has therefore hit the same class of bug
// ("Invalid line number N in M-line document", "Position N is out of range"),
// which the changeFilter then swallows into a blanket edit veto.
//
// These resolvers are the single source of truth for coercing a possibly stale
// range onto the current document. Nothing else should do `doc.line(...).from +
// char` arithmetic or line/char clamping by hand — go through here so a new
// staleness dimension only needs fixing in one place. Consumers that store
// ranges use clampRangesToDoc (range form); consumers that need document offsets
// use resolveRangePositions ({ from, to } form).

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
// cannot be anchored. When the original toLine no longer exists, toChar is
// dropped: the clamped last line has a different length, so the stored offset is
// meaningless.
export function clampRangeToDoc(range: ReadonlyRange, doc: Pick<Doc, "lines">): ReadonlyRange | null {
  // Reject malformed ranges outright rather than trying to resolve them. A line
  // below 1 would throw in doc.line() ("Invalid line number 0"), and an inverted
  // range (fromLine > toLine) has no valid forward span — either would otherwise
  // poison the changeFilter into silently vetoing every edit. Lines are 1-based.
  if (range.fromLine < 1 || range.toLine < 1 || range.fromLine > range.toLine) {
    return null;
  }
  if (range.fromLine > doc.lines) {
    return null;
  }
  if (range.toLine <= doc.lines) {
    return range;
  }
  return { ...range, toLine: doc.lines, toChar: undefined };
}

// Clamp a range fully onto the document — line numbers via clampRangeToDoc, then
// any fromChar/toChar down to the length of its (surviving) line. Returns a range
// safe to store and hand back to CodeMirror, or null when it can't be anchored.
// This is the range-form counterpart to resolveRangePositions: use it when the
// output is stored as a ReadonlyRange rather than resolved to offsets.
export function clampRangeCharsToDoc(range: ReadonlyRange, doc: Doc): ReadonlyRange | null {
  const clamped = clampRangeToDoc(range, doc);
  if (!clamped) {
    return null;
  }
  const next: ReadonlyRange = { fromLine: clamped.fromLine, toLine: clamped.toLine };
  if (clamped.fromChar !== undefined) {
    const fromLine = doc.line(clamped.fromLine);
    next.fromChar = Math.min(clamped.fromChar, fromLine.to - fromLine.from);
  }
  if (clamped.toChar !== undefined) {
    const toLine = doc.line(clamped.toLine);
    next.toChar = Math.min(clamped.toChar, toLine.to - toLine.from);
  }
  return next;
}

// Clamp a list of ranges onto the document, dropping any that can't be anchored.
// The stored-range entry point: localStorage/exercise defaults can outlive the
// code they were saved against, so every range gets coerced back into bounds
// before it reaches CodeMirror.
export function clampRangesToDoc(ranges: ReadonlyRange[], doc: Doc): ReadonlyRange[] {
  return ranges.flatMap((range) => {
    const clamped = clampRangeCharsToDoc(range, doc);
    return clamped ? [clamped] : [];
  });
}

// Resolve a range to absolute { from, to } document positions, clamping every
// coordinate to the current document. Returns null when the range starts beyond
// the document. A fromChar/toChar that overshoots its (surviving) line clamps to
// that line's end rather than spilling past it. `from` is never greater than
// `to`, so the result is always a valid, forward document range.
export function resolveRangePositions(range: ReadonlyRange, doc: Doc): { from: number; to: number } | null {
  const clamped = clampRangeCharsToDoc(range, doc);
  if (!clamped) {
    return null;
  }
  const fromLine = doc.line(clamped.fromLine);
  const toLine = doc.line(clamped.toLine);
  const from = fromLine.from + (clamped.fromChar ?? 0);
  const to = clamped.toChar !== undefined ? toLine.from + clamped.toChar : toLine.to;
  return { from: Math.min(from, to), to };
}
