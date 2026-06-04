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
    return ranges.map((r) => {
      const oldFromLine = startDoc.line(r.fromLine);
      const oldToLine = startDoc.line(r.toLine);
      const oldFrom = oldFromLine.from + (r.fromChar ?? 0);
      const oldTo = r.toChar !== undefined ? oldToLine.from + r.toChar : oldToLine.to;

      const newFrom = tr.changes.mapPos(oldFrom, 1);
      const newTo = tr.changes.mapPos(oldTo, -1);

      const newFromLine = endDoc.lineAt(newFrom);
      const newToLine = endDoc.lineAt(newTo);

      return {
        ...r,
        fromLine: newFromLine.number,
        toLine: newToLine.number,
        ...(r.fromChar !== undefined ? { fromChar: newFrom - newFromLine.from } : {}),
        ...(r.toChar !== undefined ? { toChar: newTo - newToLine.from } : {})
      };
    });
  }
});

export function initReadOnlyRangesExtension() {
  return [
    readOnlyRangesStateField,
    readOnlyRangesExtension((state) => {
      return state.field(readOnlyRangesStateField).map((r) => {
        return {
          from: state.doc.line(r.fromLine).from + (r.fromChar ?? 0),
          to: r.toChar !== undefined ? state.doc.line(r.toLine).from + r.toChar : state.doc.line(r.toLine).to
        };
      });
    })
  ];
}
