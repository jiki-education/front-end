import { StateEffect, StateField } from "@codemirror/state";
import type { ReadonlyRange } from "@jiki/curriculum";
import readOnlyRangesExtension from "./readOnlyRangesExtension";
import { resolveRangePositions } from "./resolveRange";

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
      // Resolve against startDoc first: a range can be stale there (e.g. set via
      // the effect against a shorter doc), and an out-of-range position would
      // make mapPos throw. resolveRangePositions clamps every coordinate and
      // returns null when the range starts entirely beyond the doc.
      const old = resolveRangePositions(r, startDoc);
      if (!old) {
        return [];
      }
      const { from: oldFrom, to: oldTo } = old;
      // Keep toChar only when the original toLine still exists — the clamped last
      // line has a different length, so a stale offset would be meaningless.
      const useToChar = r.toChar !== undefined && r.toLine <= startDoc.lines;

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
      // Resolve against the current doc: a stale range (persisted from longer
      // code) would otherwise produce an out-of-range position, which the
      // changeFilter catches and turns into a vetoed transaction — silently
      // blocking every edit. resolveRangePositions clamps every coordinate.
      return state.field(readOnlyRangesStateField).flatMap((r) => {
        const pos = resolveRangePositions(r, state.doc);
        return pos ? [pos] : [];
      });
    })
  ];
}
