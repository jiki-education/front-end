import {
  initReadOnlyRangesExtension,
  updateReadOnlyRangesEffect
} from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { EditorState } from "@codemirror/state";

// Regression test for the silent-reset bug:
//   When the user edits a stub, then resets, the doc-replace transaction
//   reaches preventModifyTargetRanges (a CodeMirror changeFilter) which
//   recomputes readonly-range line numbers for the after-state. The state
//   field's heuristic produces invalid (negative) line numbers when the doc
//   shrinks while the cursor is near the top, triggering a RangeError that
//   the filter catches and treats as "veto this transaction".
//
//   EditorManager.resetContent works around this by clearing readonly ranges
//   *first*, then dispatching the doc-replace, then re-applying the ranges.
//   This test asserts that the two-step pattern actually lands the new doc.

const STUB = ["// Sun", "", "// Cloud", 'rectangle(25, 50, 50, 10, "white");', "", "// Rain Drops"].join("\n");

describe("readonly-range reset workaround (resetContent two-step pattern)", () => {
  it("doc-replace lands after readonly ranges are cleared first", () => {
    let state = EditorState.create({
      doc: STUB,
      extensions: [initReadOnlyRangesExtension()]
    });
    state = state.update({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 4, toLine: 4 }]) }).state;

    // Simulate the user appending lines one at a time. The state field's
    // line-tracking heuristic leaves the range at {4,4} (cursor is below it).
    for (const line of [
      "// Cloud",
      'rectangle(25, 50, 50, 10, "white"); foo',
      'circle(25, 50, 10, "white");',
      'circle(40, 40, 15, "white");',
      'circle(55, 40, 20, "white");',
      'circle(75, 50, 10, "white");',
      "",
      "// Sun",
      'circle(75, 30, 15, "yellow");',
      "",
      "// Rain",
      'ellipse(30, 70, 3, 5, "blue");',
      'ellipse(50, 70, 3, 5, "blue");',
      'ellipse(70, 70, 3, 5, "blue");'
    ]) {
      const insert = "\n" + line;
      const at = state.doc.length;
      state = state.update({
        changes: { from: at, insert },
        selection: { anchor: at + insert.length }
      }).state;
    }

    // Step 1: clear readonly ranges (this is what resetContent does first)
    state = state.update({ effects: updateReadOnlyRangesEffect.of([]) }).state;

    // Step 2: replace the doc with the stub, with cursor at the start —
    // the failure-mode condition for the underlying bug.
    const afterReset = state.update({
      changes: { from: 0, to: state.doc.length, insert: STUB },
      selection: { anchor: 0 }
    }).state;

    expect(afterReset.doc.toString()).toBe(STUB);
  });
});
