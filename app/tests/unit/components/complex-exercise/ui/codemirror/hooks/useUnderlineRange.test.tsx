import { renderHook } from "@testing-library/react";
import type { EditorView } from "@codemirror/view";
import { useUnderlineRange } from "@/components/complex-exercise/ui/codemirror/hooks/useUnderlineRange";
import { addUnderlineEffect } from "@/components/complex-exercise/ui/codemirror/extensions/underlineRange";

// Mock the underlineRange extension
jest.mock("@/components/complex-exercise/ui/codemirror/extensions/underlineRange", () => ({
  addUnderlineEffect: {
    of: jest.fn((value) => ({ type: "addUnderline", value }))
  }
}));

// Mock document.querySelector for scrollIntoView test
const mockScrollIntoView = jest.fn();
const mockQuerySelector = jest.fn();
Object.defineProperty(document, "querySelector", {
  value: mockQuerySelector,
  writable: true
});

describe("useUnderlineRange", () => {
  let mockEditorView: Partial<EditorView>;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy = jest.fn();
    mockEditorView = {
      dispatch: dispatchSpy
    };
    mockQuerySelector.mockReturnValue(null);
    mockScrollIntoView.mockClear();
  });

  it("should dispatch addUnderlineEffect when range is provided", () => {
    const range = { from: 10, to: 20 };

    renderHook(() => useUnderlineRange(mockEditorView as EditorView, range));

    expect(addUnderlineEffect.of).toHaveBeenCalledWith(range);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "addUnderline", value: range }
    });
  });

  it("should not dispatch when editorView is null", () => {
    const range = { from: 10, to: 20 };

    renderHook(() => useUnderlineRange(null, range));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(addUnderlineEffect.of).not.toHaveBeenCalled();
  });

  it("should not dispatch when range is undefined", () => {
    renderHook(() => useUnderlineRange(mockEditorView as EditorView, undefined));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(addUnderlineEffect.of).not.toHaveBeenCalled();
  });

  it("should scroll to underlined element when found", () => {
    const range = { from: 10, to: 20 };
    const mockElement = {
      scrollIntoView: mockScrollIntoView
    };
    mockQuerySelector.mockReturnValue(mockElement);

    renderHook(() => useUnderlineRange(mockEditorView as EditorView, range));

    expect(mockQuerySelector).toHaveBeenCalledWith(".cm-underline");
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center"
    });
  });

  it("should not scroll when underlined element is not found", () => {
    const range = { from: 10, to: 20 };
    mockQuerySelector.mockReturnValue(null);

    renderHook(() => useUnderlineRange(mockEditorView as EditorView, range));

    expect(mockQuerySelector).toHaveBeenCalledWith(".cm-underline");
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it("should dispatch when range changes", () => {
    const initialRange = { from: 10, to: 20 };
    const newRange = { from: 30, to: 40 };

    const { rerender } = renderHook(({ range }) => useUnderlineRange(mockEditorView as EditorView, range), {
      initialProps: { range: initialRange }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(addUnderlineEffect.of).toHaveBeenCalledWith(initialRange);

    jest.clearAllMocks();

    // Change range
    rerender({ range: newRange });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(addUnderlineEffect.of).toHaveBeenCalledWith(newRange);
  });

  it("should handle transition from range to undefined", () => {
    const { rerender } = renderHook(({ range }) => useUnderlineRange(mockEditorView as EditorView, range), {
      initialProps: { range: { from: 10, to: 20 } as { from: number; to: number } | undefined }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Change to undefined
    rerender({ range: undefined });

    // Should not dispatch for undefined
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should handle transition from undefined to range", () => {
    const { rerender } = renderHook(({ range }) => useUnderlineRange(mockEditorView as EditorView, range), {
      initialProps: { range: undefined as { from: number; to: number } | undefined }
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    jest.clearAllMocks();

    // Change to defined range
    rerender({ range: { from: 10, to: 20 } });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(addUnderlineEffect.of).toHaveBeenCalledWith({ from: 10, to: 20 });
  });

  it("should dispatch when editorView changes from null to valid", () => {
    const range = { from: 10, to: 20 };

    const { rerender } = renderHook(({ view, range }) => useUnderlineRange(view, range), {
      initialProps: { view: null as EditorView | null, range }
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    // Change editorView to valid
    rerender({ view: mockEditorView as EditorView, range });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(addUnderlineEffect.of).toHaveBeenCalledWith(range);
  });

  it("should handle zero-length range", () => {
    const range = { from: 10, to: 10 };

    renderHook(() => useUnderlineRange(mockEditorView as EditorView, range));

    expect(addUnderlineEffect.of).toHaveBeenCalledWith(range);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "addUnderline", value: range }
    });
  });

  it("should handle large ranges", () => {
    const range = { from: 0, to: 10000 };

    renderHook(() => useUnderlineRange(mockEditorView as EditorView, range));

    expect(addUnderlineEffect.of).toHaveBeenCalledWith(range);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "addUnderline", value: range }
    });
  });

  it("should cleanup properly on unmount", () => {
    const range = { from: 10, to: 20 };

    const { unmount } = renderHook(() => useUnderlineRange(mockEditorView as EditorView, range));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    unmount();

    // Verify no additional dispatches on unmount
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple rapid range changes", () => {
    const { rerender } = renderHook(({ range }) => useUnderlineRange(mockEditorView as EditorView, range), {
      initialProps: { range: { from: 0, to: 10 } }
    });

    const ranges = [
      { from: 10, to: 20 },
      { from: 20, to: 30 },
      { from: 30, to: 40 },
      { from: 40, to: 50 }
    ];

    ranges.forEach((range) => {
      jest.clearAllMocks();
      rerender({ range });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(addUnderlineEffect.of).toHaveBeenCalledWith(range);
    });
  });

  it("should dispatch even when range values are the same but object reference changes", () => {
    const { rerender } = renderHook(({ range }) => useUnderlineRange(mockEditorView as EditorView, range), {
      initialProps: { range: { from: 10, to: 20 } }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // New object with same values
    rerender({ range: { from: 10, to: 20 } });

    // React will re-run effect because object reference changed
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
