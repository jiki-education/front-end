import { renderHook } from "@testing-library/react";
import type { EditorView } from "@codemirror/view";
import { useReadonlyRanges } from "@/components/coding-exercise/ui/codemirror/hooks/useReadonlyRanges";
import { updateReadOnlyRangesEffect } from "@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges";

// Mock the readOnlyRanges extension
jest.mock("@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges", () => ({
  updateReadOnlyRangesEffect: {
    of: jest.fn((value) => ({ type: "updateReadOnlyRanges", value }))
  }
}));

describe("useReadonlyRanges", () => {
  let mockEditorView: Partial<EditorView>;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy = jest.fn();
    mockEditorView = {
      dispatch: dispatchSpy
    };
  });

  it("should dispatch updateReadOnlyRangesEffect with ranges", () => {
    const ranges = [
      { fromLine: 1, toLine: 3 },
      { fromLine: 5, toLine: 7 }
    ];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: {
        type: "updateReadOnlyRanges",
        value: ranges
      }
    });
  });

  it("should not dispatch when editorView is null", () => {
    const ranges = [{ fromLine: 1, toLine: 3 }];

    renderHook(() => useReadonlyRanges(null, ranges));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(updateReadOnlyRangesEffect.of).not.toHaveBeenCalled();
  });

  it("should dispatch with empty array", () => {
    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, []));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith([]);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: {
        type: "updateReadOnlyRanges",
        value: []
      }
    });
  });

  it("should dispatch when ranges change", () => {
    const initialRanges = [{ fromLine: 1, toLine: 3 }];
    const newRanges = [
      { fromLine: 2, toLine: 4 },
      { fromLine: 6, toLine: 8 }
    ];

    const { rerender } = renderHook(({ ranges }) => useReadonlyRanges(mockEditorView as EditorView, ranges), {
      initialProps: { ranges: initialRanges }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(initialRanges);

    jest.clearAllMocks();

    // Change ranges
    rerender({ ranges: newRanges });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(newRanges);
  });

  it("should dispatch when ranges array reference changes but content is same", () => {
    const { rerender } = renderHook(({ ranges }) => useReadonlyRanges(mockEditorView as EditorView, ranges), {
      initialProps: { ranges: [{ fromLine: 1, toLine: 3 }] }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // New array with same content
    rerender({ ranges: [{ fromLine: 1, toLine: 3 }] });

    // React will re-run effect because array reference changed
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle single range", () => {
    const range = [{ fromLine: 5, toLine: 10 }];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, range));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(range);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: {
        type: "updateReadOnlyRanges",
        value: range
      }
    });
  });

  it("should handle ranges with char-level specificity", () => {
    const ranges = [
      { fromLine: 1, toLine: 1, fromChar: 0, toChar: 15 },
      { fromLine: 3, toLine: 3, fromChar: 5 },
      { fromLine: 5, toLine: 5, toChar: 10 }
    ];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
  });

  it("should dispatch when editorView changes from null to valid", () => {
    const ranges = [{ fromLine: 1, toLine: 3 }];

    const { rerender } = renderHook(({ view, ranges }) => useReadonlyRanges(view, ranges), {
      initialProps: { view: null as EditorView | null, ranges }
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    // Change editorView to valid
    rerender({ view: mockEditorView as EditorView, ranges });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
  });

  it("should handle large ranges", () => {
    const ranges = [
      { fromLine: 1, toLine: 100 },
      { fromLine: 200, toLine: 300 },
      { fromLine: 500, toLine: 1000 }
    ];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
  });

  it("should cleanup properly on unmount", () => {
    const ranges = [{ fromLine: 1, toLine: 3 }];

    const { unmount } = renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    unmount();

    // Verify no additional dispatches on unmount
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle transition from ranges to empty array", () => {
    const { rerender } = renderHook(({ ranges }) => useReadonlyRanges(mockEditorView as EditorView, ranges), {
      initialProps: { ranges: [{ fromLine: 1, toLine: 3 }] }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Change to empty array
    rerender({ ranges: [] });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith([]);
  });

  it("should handle many ranges", () => {
    const ranges = Array.from({ length: 50 }, (_, i) => ({
      fromLine: i * 10 + 1,
      toLine: i * 10 + 5
    }));

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
