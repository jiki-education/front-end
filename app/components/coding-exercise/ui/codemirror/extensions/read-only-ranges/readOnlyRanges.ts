import { StateEffect, StateField } from "@codemirror/state";
import type { ReadonlyRange } from "@jiki/curriculum";
import readOnlyRangesExtension from "./readOnlyRangesExtension";

export type { ReadonlyRange };
export const updateReadOnlyRangesEffect = StateEffect.define<ReadonlyRange[]>();
export const readOnlyRangesStateField = StateField.define<ReadonlyRange[]>({
  create() {
    return [];
  },
  update(ranges, tr) {
    for (const effect of tr.effects) {
      if (effect.is(updateReadOnlyRangesEffect)) {
        return effect.value;
      }
    }

    if (!tr.docChanged || ranges.length === 0) {
      return ranges;
    }

    // Map each range's offsets through the transaction so the range follows
    // its anchored content. assoc=1 on `from` and assoc=-1 on `to` means
    // insertions at the boundaries land *outside* the readonly span.
    const startDoc = tr.startState.doc;
    const endDoc = tr.state.doc;
    return ranges.flatMap((r) => {
      // Ranges can be stale against startDoc (e.g. set via the effect against a
      // shorter doc), so clamp line lookups or startDoc.line() throws "Invalid
      // line number". A range starting beyond the doc has nothing left to anchor.
      if (r.fromLine > startDoc.lines) {
        return [];
      }
      const toLine = Math.min(r.toLine, startDoc.lines);
      const oldFromLine = startDoc.line(r.fromLine);
      const oldToLine = startDoc.line(toLine);
      const oldFrom = oldFromLine.from + (r.fromChar ?? 0);
      // Drop toChar when the original toLine no longer exists — the clamped
      // last line has a different length, so the offset is meaningless.
      const useToChar = r.toChar !== undefined && toLine === r.toLine;
      const oldTo = useToChar ? oldToLine.from + r.toChar! : oldToLine.to;

      const newFrom = tr.changes.mapPos(oldFrom, 1);
      const newTo = tr.changes.mapPos(oldTo, -1);

      const newFromLine = endDoc.lineAt(newFrom);
      const newToLine = endDoc.lineAt(newTo);

      // Rebuild explicitly rather than spreading `r`, so a clamped range that
      // dropped its toChar doesn't carry the stale value through.
      const mapped: ReadonlyRange = {
        fromLine: newFromLine.number,
        toLine: newToLine.number
      };
      if (r.fromChar !== undefined) {
        mapped.fromChar = newFrom - newFromLine.from;
      }
      if (useToChar) {
        mapped.toChar = newTo - newToLine.from;
      }
      return [mapped];
    });
  }
});

export function initReadOnlyRangesExtension() {
  return [
    readOnlyRangesStateField,
    readOnlyRangesExtension((state) => {
      const doc = state.doc;
      // Clamp against the current doc: a stale range (persisted from longer code)
      // would otherwise make doc.line() throw here, which the changeFilter catches
      // and turns into a vetoed transaction — silently blocking every edit.
      return state.field(readOnlyRangesStateField).flatMap((r) => {
        if (r.fromLine > doc.lines) {
          return [];
        }
        const toLine = Math.min(r.toLine, doc.lines);
        const useToChar = r.toChar !== undefined && toLine === r.toLine;
        return [
          {
            from: doc.line(r.fromLine).from + (r.fromChar ?? 0),
            to: useToChar ? doc.line(toLine).from + r.toChar! : doc.line(toLine).to
          }
        ];
      });
    })
  ];
}
