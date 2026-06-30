import { smartPasteHandler } from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRangesExtension";
import { EditorSelection, EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";

function createMockEditor(doc: string, anchor: number, head: number = anchor) {
  const state = EditorState.create({
    doc,
    selection: EditorSelection.single(anchor, head)
  });
  return {
    state,
    // Mirror CodeMirror's real validation: applying a transaction whose
    // selection points outside the resulting document throws a RangeError.
    dispatch: jest.fn((spec) => state.update(spec))
  } as unknown as EditorView & { dispatch: jest.Mock };
}

function createMockClipboardEvent(text: string) {
  return {
    clipboardData: { getData: jest.fn().mockReturnValue(text) },
    preventDefault: jest.fn()
  } as unknown as ClipboardEvent & { preventDefault: jest.Mock };
}

describe("smartPasteHandler", () => {
  // Regression test for the readonly-swallow behavior. Before the fix that
  // removed `move-cursor-by-paste-length`, smartPaste returned `true` without
  // calling preventDefault when the paste target was inside a readonly range,
  // so the native paste fell through and mutated the doc anyway.
  it("swallows the paste when the cursor is inside a readonly range", () => {
    const doc = "line1\nline2\nline3";
    // Cursor at position 8 (inside "line2", which we'll mark readonly).
    const view = createMockEditor(doc, 8);
    const event = createMockClipboardEvent("PASTED");

    // Mark the entire "line2" span readonly: positions 6..11.
    const getReadOnlyRanges = () => [{ from: 6, to: 11 }];

    const result = smartPasteHandler(getReadOnlyRanges)(event, view);

    expect(result).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(view.dispatch).not.toHaveBeenCalled();
  });

  it("places the cursor at the end of the inserted text", () => {
    const doc = "line1\nline2\nline3";
    // Cursor at the very end of the doc, "line1" (0..5) is readonly.
    const view = createMockEditor(doc, doc.length);
    const event = createMockClipboardEvent("PASTED");
    const getReadOnlyRanges = () => [{ from: 0, to: 5 }];

    const result = smartPasteHandler(getReadOnlyRanges)(event, view);

    expect(result).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(view.dispatch).toHaveBeenCalledTimes(1);

    // createMockEditor's dispatch runs state.update(), which throws
    // "Selection points outside of document" if the anchor is out of range.
    // The resulting transaction must place the cursor right after the insert:
    // the text immediately before the cursor is exactly the pasted payload.
    const tr = view.dispatch.mock.results[0].value;
    const anchor = tr.state.selection.main.anchor;
    expect(tr.state.doc.toString().slice(anchor - "PASTED".length, anchor)).toBe("PASTED");
    expect(anchor).toBeLessThanOrEqual(tr.state.doc.length);
  });

  // The cursor must land at the end of the inserted text even for multi-unit
  // Unicode (emoji, astral, ZWJ sequences). Document positions and string
  // `.length` both count UTF-16 code units, so the anchor math stays correct.
  it.each([
    ["plain", "HELLO"],
    ["emoji", "👍"],
    ["astral", "𝟙𝟚𝟛"],
    ["zwj family", "👨‍👩‍👧‍👦"],
    ["cjk", "한글"]
  ])("places the cursor after a %s paste that replaces a selection", (_label, payload) => {
    const doc = "line1\nline2\nline3";
    // Select "line2" (6..11) and replace it; nothing is readonly.
    const view = createMockEditor(doc, 6, 11);
    const event = createMockClipboardEvent(payload);

    const result = smartPasteHandler(() => [])(event, view);

    expect(result).toBe(true);
    const tr = view.dispatch.mock.results[0].value;
    const text = tr.state.doc.toString();
    const anchor = tr.state.selection.main.anchor;
    // The `payload.length` code units immediately before the cursor are exactly
    // the inserted text, proving the cursor sits at the end of the insertion.
    expect(text.slice(anchor - payload.length, anchor)).toBe(payload);
    expect(anchor).toBeLessThanOrEqual(tr.state.doc.length);
  });

  // Regression test for "RangeError: Selection points outside of document".
  // A paste whose available target abuts the document end must never produce a
  // selection anchor past the resulting document length.
  it("never dispatches a selection outside the resulting document", () => {
    const doc = "abc";
    // Whole doc selected, no readonly ranges, long replacement text.
    const view = createMockEditor(doc, 0, doc.length);
    const event = createMockClipboardEvent("a much longer pasted string");
    const getReadOnlyRanges = () => [];

    expect(() => smartPasteHandler(getReadOnlyRanges)(event, view)).not.toThrow();
    expect(view.dispatch).toHaveBeenCalledTimes(1);
  });

  // Fuzz the handler across a wide grid of documents, selections, readonly
  // configurations, and clipboard payloads. The contract is invariant: the
  // dispatched transaction must apply without ever throwing "Selection points
  // outside of document", regardless of how stale or pathological the inputs.
  it("never throws across a fuzzed grid of inputs", () => {
    const docs = ["", "a", "abc", "line1\nline2\nline3", "x\ny\n", "\n\n"];
    const payloads = ["", "X", "PASTED", "a much longer pasted string\nwith a newline"];
    const readOnlyConfigs: Array<(len: number) => Array<{ from: number; to: number }>> = [
      () => [],
      () => [{ from: 0, to: 1 }],
      (len) => [{ from: 0, to: Math.min(3, len) }],
      (len) => [{ from: Math.max(0, len - 2), to: len }]
    ];

    let combos = 0;
    for (const doc of docs) {
      for (let anchor = 0; anchor <= doc.length; anchor++) {
        for (let head = anchor; head <= doc.length; head++) {
          for (const payload of payloads) {
            for (const makeRanges of readOnlyConfigs) {
              combos++;
              const view = createMockEditor(doc, anchor, head);
              const event = createMockClipboardEvent(payload);
              const ranges = makeRanges(doc.length).filter((r) => r.from < r.to);
              expect(() => smartPasteHandler(() => ranges)(event, view)).not.toThrow();
            }
          }
        }
      }
    }

    expect(combos).toBeGreaterThan(500);
  });
});
