import {
  initReadOnlyRangesExtension,
  readOnlyRangesStateField,
  updateReadOnlyRangesEffect
} from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { readOnlyRangeDecoration } from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyLineDeco";
import { EditorState } from "@codemirror/state";

// Regression tests for JIKI-FRONT-END-1Y ("Invalid line number N in M-line
// document"): locked ranges persisted from previously-edited longer code get
// applied while a shorter doc is being set, so every doc.line() lookup against
// a stale range must be clamped or CodeMirror throws.

const SHORT_DOC = ["line 1", "line 2", "line 3"].join("\n"); // 3 lines

function makeState(doc: string) {
  return EditorState.create({
    doc,
    extensions: [initReadOnlyRangesExtension(), readOnlyRangeDecoration()]
  });
}

describe("read-only range clamping against a shorter document", () => {
  it("renders without throwing when a locked range starts beyond the doc", () => {
    let state = makeState(SHORT_DOC);
    expect(() => {
      state = state.update({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 10, toLine: 12 }]) }).state;
    }).not.toThrow();
    expect(state.field(readOnlyRangesStateField)).toEqual([{ fromLine: 10, toLine: 12 }]);
  });

  it("renders without throwing when a locked range ends beyond the doc", () => {
    let state = makeState(SHORT_DOC);
    expect(() => {
      state = state.update({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 2, toLine: 16, toChar: 4 }]) }).state;
    }).not.toThrow();
  });

  describe("mapping stale ranges through a doc-changing transaction", () => {
    it("does not throw when a stale range extends past the pre-change doc", () => {
      // Set a range that overshoots the current (short) doc via the effect,
      // then dispatch an unrelated edit so the state field's mapping branch
      // runs startDoc.line() against the stale, out-of-bounds line numbers.
      let state = makeState(SHORT_DOC);
      state = state.update({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 2, toLine: 16, toChar: 4 }]) }).state;

      expect(() => {
        const at = state.doc.length;
        state = state.update({ changes: { from: at, insert: "\nline 4" } }).state;
      }).not.toThrow();

      // The clamped range's toLine now anchors within the doc, and the stale
      // toChar (offset on a line that no longer exists) was dropped.
      const mapped = state.field(readOnlyRangesStateField)[0];
      expect(mapped.toLine).toBeLessThanOrEqual(state.doc.lines);
      expect(mapped.toChar).toBeUndefined();
    });

    it("drops a range that starts entirely beyond the pre-change doc", () => {
      let state = makeState(SHORT_DOC);
      state = state.update({
        effects: updateReadOnlyRangesEffect.of([
          { fromLine: 1, toLine: 1 },
          { fromLine: 10, toLine: 12 }
        ])
      }).state;

      const at = state.doc.length;
      state = state.update({ changes: { from: at, insert: "\nline 4" } }).state;

      // The in-bounds range survives; the fully out-of-bounds one is dropped.
      const ranges = state.field(readOnlyRangesStateField);
      expect(ranges).toHaveLength(1);
      expect(ranges[0].fromLine).toBe(1);
    });
  });
});
