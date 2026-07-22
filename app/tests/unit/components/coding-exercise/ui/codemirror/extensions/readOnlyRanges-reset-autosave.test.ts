import {
  initReadOnlyRangesExtension,
  readOnlyRangesStateField,
  updateReadOnlyRangesEffect
} from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { ReadonlyRange } from "@jiki/curriculum";

// Regression test for the "reset then refresh loses locked lines" bug.
//
// EditorManager.setupEditor replaces the doc and (re)applies readonly ranges.
// On any doc change an updateListener autosaves the code together with the
// current readonly-ranges state field to localStorage. If the doc change and
// the ranges effect are dispatched as *separate* transactions, the autosave
// fires on the doc-change transaction while the ranges field is still empty,
// persisting mismatched data (correct code, empty ranges). After a refresh the
// empty ranges win and no lines are locked.
//
// The fix dispatches the doc change and the ranges effect in a single
// transaction so the listener observes the final ranges. These tests pin that
// invariant against real CodeMirror.

const STUB = ["// Sun", "", "// Cloud", 'rectangle(25, 50, 50, 10, "white");'].join("\n");
const RANGES: ReadonlyRange[] = [{ fromLine: 4, toLine: 4 }];

function mountEditor() {
  const rangesSeenOnDocChange: ReadonlyRange[][] = [];
  const view = new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [
        initReadOnlyRangesExtension(),
        EditorView.updateListener.of((update) => {
          // Mirrors EditorManager's autosave listener: it reads the ranges
          // state field whenever the doc changes.
          if (update.docChanged) {
            rangesSeenOnDocChange.push(update.state.field(readOnlyRangesStateField));
          }
        })
      ]
    })
  });
  return { view, rangesSeenOnDocChange };
}

describe("readonly-range autosave ordering (reset persistence)", () => {
  it("a single transaction lets a docChanged listener observe the new ranges", () => {
    const { view, rangesSeenOnDocChange } = mountEditor();

    // What the fixed setupEditor does: doc change + ranges effect together.
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: STUB },
      effects: updateReadOnlyRangesEffect.of(RANGES)
    });

    expect(rangesSeenOnDocChange).toEqual([RANGES]);
    view.destroy();
  });

  it("separate transactions expose the bug: the doc-change listener sees empty ranges", () => {
    const { view, rangesSeenOnDocChange } = mountEditor();

    // The old (buggy) ordering: doc change first, ranges effect second. The
    // autosave on the doc-change transaction captures empty ranges — the stale
    // data that would overwrite localStorage and unlock the lines on refresh.
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: STUB } });
    view.dispatch({ effects: updateReadOnlyRangesEffect.of(RANGES) });

    expect(rangesSeenOnDocChange).toEqual([[]]);
    view.destroy();
  });
});
