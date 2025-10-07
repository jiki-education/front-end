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
      { from: 0, to: 10 },
      { from: 20, to: 30 }
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
    const ranges = [{ from: 0, to: 10 }];

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
    const initialRanges = [{ from: 0, to: 10 }];
    const newRanges = [
      { from: 5, to: 15 },
      { from: 25, to: 35 }
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
      initialProps: { ranges: [{ from: 0, to: 10 }] }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // New array with same content
    rerender({ ranges: [{ from: 0, to: 10 }] });

    // React will re-run effect because array reference changed
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle single range", () => {
    const range = [{ from: 100, to: 200 }];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, range));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(range);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: {
        type: "updateReadOnlyRanges",
        value: range
      }
    });
  });

  it("should handle multiple overlapping ranges", () => {
    const ranges = [
      { from: 0, to: 20 },
      { from: 10, to: 30 },
      { from: 25, to: 40 }
    ];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
  });

  it("should dispatch when editorView changes from null to valid", () => {
    const ranges = [{ from: 0, to: 10 }];

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
      { from: 0, to: 1000 },
      { from: 2000, to: 3000 },
      { from: 5000, to: 10000 }
    ];

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
  });

  it("should cleanup properly on unmount", () => {
    const ranges = [{ from: 0, to: 10 }];

    const { unmount } = renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    unmount();

    // Verify no additional dispatches on unmount
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle transition from ranges to empty array", () => {
    const { rerender } = renderHook(({ ranges }) => useReadonlyRanges(mockEditorView as EditorView, ranges), {
      initialProps: { ranges: [{ from: 0, to: 10 }] }
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
      from: i * 100,
      to: i * 100 + 50
    }));

    renderHook(() => useReadonlyRanges(mockEditorView as EditorView, ranges));

    expect(updateReadOnlyRangesEffect.of).toHaveBeenCalledWith(ranges);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
