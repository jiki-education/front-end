import { renderHook } from "@testing-library/react";
import type { EditorView } from "@codemirror/view";
import { useHighlightLine } from "@/components/complex-exercise/ui/codemirror/hooks/useHighlightLine";
import { changeLineEffect } from "@/components/complex-exercise/ui/codemirror/extensions/lineHighlighter";

// Mock the lineHighlighter extension
jest.mock("@/components/complex-exercise/ui/codemirror/extensions/lineHighlighter", () => ({
  changeLineEffect: {
    of: jest.fn((value) => ({ type: "changeLine", value }))
  }
}));

describe("useHighlightLine", () => {
  let mockEditorView: Partial<EditorView>;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy = jest.fn();
    mockEditorView = {
      dispatch: dispatchSpy
    };
  });

  it("should dispatch changeLineEffect when highlightedLine is provided", () => {
    const highlightedLine = 5;

    renderHook(() => useHighlightLine(mockEditorView as EditorView, highlightedLine));

    expect(changeLineEffect.of).toHaveBeenCalledWith(5);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeLine", value: 5 }
    });
  });

  it("should not dispatch when editorView is null", () => {
    renderHook(() => useHighlightLine(null, 10));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(changeLineEffect.of).not.toHaveBeenCalled();
  });

  it("should not dispatch when highlightedLine is 0", () => {
    renderHook(() => useHighlightLine(mockEditorView as EditorView, 0));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(changeLineEffect.of).not.toHaveBeenCalled();
  });

  it("should dispatch when highlightedLine changes", () => {
    const { rerender } = renderHook(({ line }) => useHighlightLine(mockEditorView as EditorView, line), {
      initialProps: { line: 5 }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(changeLineEffect.of).toHaveBeenCalledWith(5);

    // Clear mocks before rerender
    jest.clearAllMocks();

    // Change the highlighted line
    rerender({ line: 10 });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(changeLineEffect.of).toHaveBeenCalledWith(10);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeLine", value: 10 }
    });
  });

  it("should not dispatch when highlightedLine stays the same", () => {
    const { rerender } = renderHook(({ line }) => useHighlightLine(mockEditorView as EditorView, line), {
      initialProps: { line: 5 }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Rerender with same line
    rerender({ line: 5 });

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should dispatch when editorView changes from null to valid", () => {
    const { rerender } = renderHook(({ view, line }) => useHighlightLine(view, line), {
      initialProps: { view: null as EditorView | null, line: 5 }
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    // Change editorView to valid
    rerender({ view: mockEditorView as EditorView, line: 5 });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(changeLineEffect.of).toHaveBeenCalledWith(5);
  });

  it("should handle large line numbers", () => {
    renderHook(() => useHighlightLine(mockEditorView as EditorView, 9999));

    expect(changeLineEffect.of).toHaveBeenCalledWith(9999);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeLine", value: 9999 }
    });
  });

  it("should handle line number 1", () => {
    renderHook(() => useHighlightLine(mockEditorView as EditorView, 1));

    expect(changeLineEffect.of).toHaveBeenCalledWith(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeLine", value: 1 }
    });
  });

  it("should cleanup properly on unmount", () => {
    const { unmount } = renderHook(() => useHighlightLine(mockEditorView as EditorView, 5));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    unmount();

    // Verify no additional dispatches on unmount
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple rapid changes", () => {
    const { rerender } = renderHook(({ line }) => useHighlightLine(mockEditorView as EditorView, line), {
      initialProps: { line: 1 }
    });

    const lines = [2, 3, 4, 5, 6];

    lines.forEach((line) => {
      jest.clearAllMocks();
      rerender({ line });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(changeLineEffect.of).toHaveBeenCalledWith(line);
    });
  });
});
