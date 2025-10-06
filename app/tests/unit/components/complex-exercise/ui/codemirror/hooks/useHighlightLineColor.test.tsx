import { renderHook } from "@testing-library/react";
import type { EditorView } from "@codemirror/view";
import { useHighlightLineColor } from "@/components/complex-exercise/ui/codemirror/hooks/useHighlightLineColor";
import { changeColorEffect } from "@/components/complex-exercise/ui/codemirror/extensions/lineHighlighter";

// Mock the lineHighlighter extension
jest.mock("@/components/complex-exercise/ui/codemirror/extensions/lineHighlighter", () => ({
  changeColorEffect: {
    of: jest.fn((value) => ({ type: "changeColor", value }))
  }
}));

describe("useHighlightLineColor", () => {
  let mockEditorView: Partial<EditorView>;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy = jest.fn();
    mockEditorView = {
      dispatch: dispatchSpy
    };
  });

  it("should dispatch changeColorEffect when color is provided", () => {
    const color = "#ff0000";

    renderHook(() => useHighlightLineColor(mockEditorView as EditorView, color));

    expect(changeColorEffect.of).toHaveBeenCalledWith("#ff0000");
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeColor", value: "#ff0000" }
    });
  });

  it("should not dispatch when editorView is null", () => {
    renderHook(() => useHighlightLineColor(null, "#00ff00"));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(changeColorEffect.of).not.toHaveBeenCalled();
  });

  it("should not dispatch when color is empty string", () => {
    renderHook(() => useHighlightLineColor(mockEditorView as EditorView, ""));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(changeColorEffect.of).not.toHaveBeenCalled();
  });

  it("should dispatch when color changes", () => {
    const { rerender } = renderHook(({ color }) => useHighlightLineColor(mockEditorView as EditorView, color), {
      initialProps: { color: "#ff0000" }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(changeColorEffect.of).toHaveBeenCalledWith("#ff0000");

    jest.clearAllMocks();

    // Change the color
    rerender({ color: "#00ff00" });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(changeColorEffect.of).toHaveBeenCalledWith("#00ff00");
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeColor", value: "#00ff00" }
    });
  });

  it("should not dispatch when color stays the same", () => {
    const { rerender } = renderHook(({ color }) => useHighlightLineColor(mockEditorView as EditorView, color), {
      initialProps: { color: "#ff0000" }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Rerender with same color
    rerender({ color: "#ff0000" });

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should dispatch when editorView changes from null to valid", () => {
    const { rerender } = renderHook(({ view, color }) => useHighlightLineColor(view, color), {
      initialProps: { view: null as EditorView | null, color: "#ff0000" }
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    // Change editorView to valid
    rerender({ view: mockEditorView as EditorView, color: "#ff0000" });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(changeColorEffect.of).toHaveBeenCalledWith("#ff0000");
  });

  it("should handle RGB color format", () => {
    renderHook(() => useHighlightLineColor(mockEditorView as EditorView, "rgb(255, 0, 0)"));

    expect(changeColorEffect.of).toHaveBeenCalledWith("rgb(255, 0, 0)");
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeColor", value: "rgb(255, 0, 0)" }
    });
  });

  it("should handle RGBA color format", () => {
    renderHook(() => useHighlightLineColor(mockEditorView as EditorView, "rgba(255, 0, 0, 0.5)"));

    expect(changeColorEffect.of).toHaveBeenCalledWith("rgba(255, 0, 0, 0.5)");
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeColor", value: "rgba(255, 0, 0, 0.5)" }
    });
  });

  it("should handle named colors", () => {
    renderHook(() => useHighlightLineColor(mockEditorView as EditorView, "red"));

    expect(changeColorEffect.of).toHaveBeenCalledWith("red");
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: { type: "changeColor", value: "red" }
    });
  });

  it("should cleanup properly on unmount", () => {
    const { unmount } = renderHook(() => useHighlightLineColor(mockEditorView as EditorView, "#ff0000"));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    unmount();

    // Verify no additional dispatches on unmount
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple rapid color changes", () => {
    const { rerender } = renderHook(({ color }) => useHighlightLineColor(mockEditorView as EditorView, color), {
      initialProps: { color: "#ff0000" }
    });

    const colors = ["#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];

    colors.forEach((color) => {
      jest.clearAllMocks();
      rerender({ color });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(changeColorEffect.of).toHaveBeenCalledWith(color);
    });
  });

  it("should handle transition from color to empty string", () => {
    const { rerender } = renderHook(({ color }) => useHighlightLineColor(mockEditorView as EditorView, color), {
      initialProps: { color: "#ff0000" }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Change to empty string
    rerender({ color: "" });

    // Should not dispatch for empty string
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
