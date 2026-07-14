import {
  initReadOnlyRangesExtension,
  readOnlyRangesStateField,
  updateReadOnlyRangesEffect
} from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges";
import { readOnlyRangeDecoration } from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyLineDeco";
import {
  clampRangeToDoc,
  clampRangesToDoc,
  resolveRangePositions
} from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/resolveRange";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

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

// A char offset can overshoot its line even when the line itself still exists —
// the line was edited shorter while the stored range kept its old offset. Before
// clamping, `doc.line(fromLine).from + fromChar` produced a position past the
// document, mapPos() threw "Position N is out of range" inside the changeFilter,
// and the catch there vetoed *every* edit in the document. These lock the fix.

// line 1 is only 2 chars ("ab"); the ranges below claim offsets far past it.
const SHRUNK_LINE_DOC = ["ab", "cdefghij", "kl"].join("\n");

function makeView(doc: string) {
  return new EditorView({
    state: EditorState.create({ doc, extensions: [initReadOnlyRangesExtension(), readOnlyRangeDecoration()] })
  });
}

describe("char offsets that overshoot a surviving line", () => {
  it("clamps fromChar past the line to the line end", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    const line1 = state.doc.line(1);
    const pos = resolveRangePositions({ fromLine: 1, fromChar: 50, toLine: 2 }, state.doc);
    // from clamps to the end of line 1 rather than spilling past it.
    expect(pos).toEqual({ from: line1.to, to: state.doc.line(2).to });
  });

  it("clamps toChar past its line to the line end", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    const line2 = state.doc.line(2);
    const pos = resolveRangePositions({ fromLine: 1, toLine: 2, toChar: 99 }, state.doc);
    expect(pos?.to).toBe(line2.to);
  });

  it("still allows edits outside the lock when fromChar overshoots its line", () => {
    const view = makeView(SHRUNK_LINE_DOC);
    view.dispatch({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 1, fromChar: 50, toLine: 2 }]) });

    // Line 3 is outside the lock; typing there must not be silently vetoed.
    const before = view.state.doc.toString();
    view.dispatch({ changes: { from: view.state.doc.line(3).from, insert: "X" } });
    expect(view.state.doc.toString()).not.toBe(before);
    view.destroy();
  });

  it("still allows edits outside the lock when toChar overshoots its line", () => {
    const view = makeView(SHRUNK_LINE_DOC);
    view.dispatch({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 1, toLine: 2, toChar: 99 }]) });

    const before = view.state.doc.toString();
    view.dispatch({ changes: { from: view.state.doc.line(3).from, insert: "X" } });
    expect(view.state.doc.toString()).not.toBe(before);
    view.destroy();
  });

  it("maps a fromChar-overshooting range through a doc edit without throwing", () => {
    let state = makeState(SHRUNK_LINE_DOC);
    state = state.update({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 1, fromChar: 50, toLine: 2 }]) }).state;

    expect(() => {
      const at = state.doc.length;
      state = state.update({ changes: { from: at, insert: "\nmore" } }).state;
    }).not.toThrow();

    // The overshooting fromChar is re-anchored within the (still line-1) bounds.
    const mapped = state.field(readOnlyRangesStateField)[0];
    const line1 = state.doc.line(mapped.fromLine);
    expect(line1.from + (mapped.fromChar ?? 0)).toBeLessThanOrEqual(line1.to);
  });
});

describe("resolveRangePositions basics", () => {
  it("returns null when the range starts beyond the document", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    expect(resolveRangePositions({ fromLine: 10, toLine: 12 }, state.doc)).toBeNull();
  });

  it("never returns from greater than to", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    const pos = resolveRangePositions({ fromLine: 1, fromChar: 50, toLine: 1, toChar: 0 }, state.doc);
    expect(pos!.from).toBeLessThanOrEqual(pos!.to);
  });
});

// Malformed ranges — a fromLine below 1, or an inverted fromLine > toLine — are
// rejected rather than resolved. A sub-1 line would throw in doc.line() ("Invalid
// line number 0"); an inverted range has no valid forward span. Either otherwise
// poisons the changeFilter into silently vetoing every edit in the document.
describe("malformed ranges", () => {
  it("rejects a fromLine below 1 instead of throwing", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    expect(clampRangeToDoc({ fromLine: 0, toLine: 2 }, state.doc)).toBeNull();
    // The resolver must not throw "Invalid line number 0" — it returns null.
    expect(resolveRangePositions({ fromLine: 0, toLine: 2 }, state.doc)).toBeNull();
  });

  it("rejects an inverted range (fromLine > toLine)", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    expect(clampRangeToDoc({ fromLine: 3, toLine: 1 }, state.doc)).toBeNull();
    expect(resolveRangePositions({ fromLine: 3, toLine: 1 }, state.doc)).toBeNull();
  });

  it("still allows edits when a fromLine=0 range is present", () => {
    const view = makeView(SHRUNK_LINE_DOC);
    expect(() => {
      view.dispatch({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 0, toLine: 2 }]) });
    }).not.toThrow();

    const before = view.state.doc.toString();
    view.dispatch({ changes: { from: view.state.doc.line(3).from, insert: "X" } });
    expect(view.state.doc.toString()).not.toBe(before);
    view.destroy();
  });

  it("still allows edits when an inverted range is present", () => {
    const view = makeView(SHRUNK_LINE_DOC);
    view.dispatch({ effects: updateReadOnlyRangesEffect.of([{ fromLine: 3, toLine: 1 }]) });

    const before = view.state.doc.toString();
    view.dispatch({ changes: { from: view.state.doc.line(2).from, insert: "X" } });
    expect(view.state.doc.toString()).not.toBe(before);
    view.destroy();
  });
});

// clampRangesToDoc is the stored-range entry point shared by the orchestrator
// (EditorManager) and re-exported from there. Its per-range clamping is covered
// in EditorManager.test.ts; these lock the list-level behaviour it inherits from
// the malformed-range guard — a bad range is dropped, valid siblings survive.
describe("clampRangesToDoc drops malformed ranges", () => {
  it("keeps valid ranges and drops sub-1 and inverted ones", () => {
    const state = makeState(SHRUNK_LINE_DOC);
    const ranges = [
      { fromLine: 1, toLine: 2 }, // valid
      { fromLine: 0, toLine: 2 }, // sub-1, dropped
      { fromLine: 3, toLine: 1 } // inverted, dropped
    ];
    expect(clampRangesToDoc(ranges, state.doc)).toEqual([{ fromLine: 1, toLine: 2 }]);
  });
});
