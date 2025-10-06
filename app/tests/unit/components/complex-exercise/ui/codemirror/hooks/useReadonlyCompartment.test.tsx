import { renderHook } from "@testing-library/react";
import { EditorView } from "@codemirror/view";
import { useReadonlyCompartment } from "@/components/complex-exercise/ui/codemirror/hooks/useReadonlyCompartment";
import { readonlyCompartment } from "@/components/complex-exercise/ui/codemirror/CodeMirror";

// Mock EditorView and readonlyCompartment
jest.mock("@codemirror/view", () => ({
  EditorView: {
    editable: {
      of: jest.fn((value) => ({ type: "editable", value }))
    }
  }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/CodeMirror", () => ({
  readonlyCompartment: {
    reconfigure: jest.fn((config) => ({ type: "reconfigure", config }))
  }
}));

describe("useReadonlyCompartment", () => {
  let mockEditorView: Partial<EditorView>;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy = jest.fn();
    mockEditorView = {
      dispatch: dispatchSpy
    };
  });

  it("should dispatch reconfigure with editable false when readonly is true", () => {
    renderHook(() => useReadonlyCompartment(mockEditorView as EditorView, true));

    expect(EditorView.editable.of).toHaveBeenCalledWith(false);
    expect(readonlyCompartment.reconfigure).toHaveBeenCalledWith([{ type: "editable", value: false }]);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: {
        type: "reconfigure",
        config: [{ type: "editable", value: false }]
      }
    });
  });

  it("should dispatch reconfigure with editable true when readonly is false", () => {
    renderHook(() => useReadonlyCompartment(mockEditorView as EditorView, false));

    expect(EditorView.editable.of).toHaveBeenCalledWith(true);
    expect(readonlyCompartment.reconfigure).toHaveBeenCalledWith([{ type: "editable", value: true }]);
    expect(dispatchSpy).toHaveBeenCalledWith({
      effects: {
        type: "reconfigure",
        config: [{ type: "editable", value: true }]
      }
    });
  });

  it("should not dispatch when editorView is null", () => {
    renderHook(() => useReadonlyCompartment(null, true));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(EditorView.editable.of).not.toHaveBeenCalled();
    expect(readonlyCompartment.reconfigure).not.toHaveBeenCalled();
  });

  it("should dispatch when readonly changes from false to true", () => {
    const { rerender } = renderHook(({ readonly }) => useReadonlyCompartment(mockEditorView as EditorView, readonly), {
      initialProps: { readonly: false }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(EditorView.editable.of).toHaveBeenCalledWith(true);

    jest.clearAllMocks();

    // Change to readonly
    rerender({ readonly: true });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(EditorView.editable.of).toHaveBeenCalledWith(false);
    expect(readonlyCompartment.reconfigure).toHaveBeenCalledWith([{ type: "editable", value: false }]);
  });

  it("should dispatch when readonly changes from true to false", () => {
    const { rerender } = renderHook(({ readonly }) => useReadonlyCompartment(mockEditorView as EditorView, readonly), {
      initialProps: { readonly: true }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(EditorView.editable.of).toHaveBeenCalledWith(false);

    jest.clearAllMocks();

    // Change to editable
    rerender({ readonly: false });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(EditorView.editable.of).toHaveBeenCalledWith(true);
    expect(readonlyCompartment.reconfigure).toHaveBeenCalledWith([{ type: "editable", value: true }]);
  });

  it("should not dispatch when readonly stays the same", () => {
    const { rerender } = renderHook(({ readonly }) => useReadonlyCompartment(mockEditorView as EditorView, readonly), {
      initialProps: { readonly: true }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Rerender with same value
    rerender({ readonly: true });

    // React doesn't re-run effect when dependencies don't change
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should dispatch when editorView changes from null to valid", () => {
    const { rerender } = renderHook(({ view, readonly }) => useReadonlyCompartment(view, readonly), {
      initialProps: { view: null as EditorView | null, readonly: true }
    });

    expect(dispatchSpy).not.toHaveBeenCalled();

    // Change editorView to valid
    rerender({ view: mockEditorView as EditorView, readonly: true });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(EditorView.editable.of).toHaveBeenCalledWith(false);
  });

  it("should cleanup properly on unmount", () => {
    const { unmount } = renderHook(() => useReadonlyCompartment(mockEditorView as EditorView, true));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    unmount();

    // Verify no additional dispatches on unmount
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple rapid changes", () => {
    const { rerender } = renderHook(({ readonly }) => useReadonlyCompartment(mockEditorView as EditorView, readonly), {
      initialProps: { readonly: false }
    });

    const states = [true, false, true, false, true];

    states.forEach((readonly) => {
      jest.clearAllMocks();
      rerender({ readonly });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(EditorView.editable.of).toHaveBeenCalledWith(!readonly);
    });
  });

  it("should handle editorView becoming null", () => {
    const { rerender } = renderHook(({ view, readonly }) => useReadonlyCompartment(view, readonly), {
      initialProps: { view: mockEditorView as EditorView | null, readonly: false }
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // Change editorView to null
    rerender({ view: null, readonly: false });

    // Should not dispatch when view becomes null
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
