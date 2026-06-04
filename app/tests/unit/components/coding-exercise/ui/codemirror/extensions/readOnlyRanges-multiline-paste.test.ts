import {
  initReadOnlyRangesExtension,
  readOnlyRangesStateField,
  updateReadOnlyRangesEffect
} from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { EditorState } from "@codemirror/state";

// Regression test for the multi-line-paste-above-readonly bug:
//   Doc has editable L1-L3 and locked L4-L7. User pastes a 10-line snippet
//   starting at L2. Before the fix, the readonly-range state field decided
//   whether to shift ranges using the *post-change cursor line* — but for a
//   multi-line paste the cursor lands after the inserted text (well past the
//   readonly range), so the range was never shifted. preventModifyTargetRanges
//   then saw the readonly slice's content change and vetoed the transaction.
//
//   The fix maps range offsets through `tr.changes`, which works for any kind
//   of edit (single-char insert, multi-line paste, replacement, deletion).

describe("readonly ranges follow content through multi-line paste", () => {
  it("paste at L2 shifts L4-L7 readonly range to follow the locked content", () => {
    const initialDoc = ["L1", "L2", "L3", "LOCKED4", "LOCKED5", "LOCKED6", "LOCKED7"].join("\n");
    let state = EditorState.create({
      doc: initialDoc,
      extensions: [initReadOnlyRangesExtension()]
    });
    state = state.update({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 4, toLine: 7 }]) }).state;

    // Paste 10 lines worth of content (9 newlines) at the start of L2.
    const l2Start = state.doc.line(2).from;
    const pasted = Array.from({ length: 10 }, (_, i) => `P${i + 1}`).join("\n");

    const afterPaste = state.update({
      changes: { from: l2Start, insert: pasted },
      selection: { anchor: l2Start + pasted.length }
    }).state;

    // The transaction must have landed (i.e. preventModifyTargetRanges did not
    // veto). Doc length grew by exactly the pasted length.
    expect(afterPaste.doc.length).toBe(initialDoc.length + pasted.length);

    // Range moved down by 9 lines (the number of newlines in the paste) and
    // still points at the original locked content.
    const ranges = afterPaste.field(readOnlyRangesStateField);
    expect(ranges).toEqual([{ fromLine: 13, toLine: 16 }]);
    expect(afterPaste.doc.line(13).text).toBe("LOCKED4");
    expect(afterPaste.doc.line(16).text).toBe("LOCKED7");
  });
});
