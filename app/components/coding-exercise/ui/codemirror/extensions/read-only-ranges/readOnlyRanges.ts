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
    // if we are adding lines
    if (tr.startState.doc.lines < tr.state.doc.lines) {
      const cursor = tr.state.selection.main.head;
      const newLine = tr.state.doc.lineAt(cursor).number;
      const diff = tr.state.doc.lines - tr.startState.doc.lines;
      return ranges.map((r) => {
        if (r.fromLine >= newLine) {
          return { ...r, fromLine: r.fromLine + diff, toLine: r.toLine + diff };
        }
        return r;
      });
    }
    // if we are deleting lines
    if (tr.startState.doc.lines > tr.state.doc.lines) {
      const cursor = tr.state.selection.main.head;
      const lineAtCursor = tr.state.doc.lineAt(cursor);
      const diff = tr.startState.doc.lines - tr.state.doc.lines;

      const lineDeletedAbove = lineAtCursor.number - 1;

      return ranges.map((r) => {
        if (r.fromLine > lineDeletedAbove) {
          return { ...r, fromLine: r.fromLine - diff, toLine: r.toLine - diff };
        }
        return r;
      });
    }

    for (const effect of tr.effects) {
      if (effect.is(updateReadOnlyRangesEffect)) {
        return effect.value;
      }
    }

    return ranges;
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
