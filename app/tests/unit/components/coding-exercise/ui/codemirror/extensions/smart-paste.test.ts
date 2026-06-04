import { smartPasteHandler } from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRangesExtension";
import { EditorSelection, EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";

function createMockEditor(doc: string, cursorPos: number) {
  return {
    state: EditorState.create({
      doc,
      selection: EditorSelection.single(cursorPos)
    }),
    dispatch: jest.fn()
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
});
