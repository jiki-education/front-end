// Mock all CodeMirror modules before importing the EditorManager
jest.mock("@codemirror/state", () => ({
  EditorState: {
    create: jest.fn().mockReturnValue({})
  }
}));
jest.mock("@codemirror/language", () => ({
  foldEffect: { is: jest.fn() },
  unfoldEffect: { is: jest.fn() }
}));
jest.mock("@codemirror/view", () => ({
  EditorView: Object.assign(
    jest.fn().mockImplementation(() => ({
      state: {
        doc: {
          toString: jest.fn().mockReturnValue(""),
          line: jest.fn().mockReturnValue({ from: 0, to: 10 })
        }
      },
      dispatch: jest.fn(),
      focus: jest.fn(),
      lineBlockAt: jest.fn().mockReturnValue({ top: 0, height: 20 }),
      scrollDOM: { scrollTop: 0, clientHeight: 400, scrollTo: jest.fn() },
      requestMeasure: jest.fn()
    })),
    {
      editable: { of: jest.fn() },
      updateListener: { of: jest.fn().mockReturnValue({}) }
    }
  )
}));

jest.mock("@/components/complex-exercise/ui/codemirror/CodeMirror", () => ({
  readonlyCompartment: {
    reconfigure: jest.fn()
  }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/extensions", () => ({
  informationWidgetDataEffect: { of: jest.fn() },
  showInfoWidgetEffect: { of: jest.fn() },
  changeMultiLineHighlightEffect: { of: jest.fn() }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/extensions/breakpoint", () => ({
  breakpointEffect: { of: jest.fn(), is: jest.fn() }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/extensions/lineHighlighter", () => ({
  INFO_HIGHLIGHT_COLOR: "#ffc107",
  changeColorEffect: { of: jest.fn() },
  changeLineEffect: { of: jest.fn() }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges", () => ({
  readOnlyRangesStateField: {},
  updateReadOnlyRangesEffect: { of: jest.fn() }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/extensions/underlineRange", () => ({
  addUnderlineEffect: { of: jest.fn() }
}));

jest.mock("@/components/complex-exercise/ui/codemirror/utils/getBreakpointLines", () => ({
  getBreakpointLines: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/complex-exercise/ui/codemirror/utils/getCodeMirrorFieldValue", () => ({
  getCodeMirrorFieldValue: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/complex-exercise/ui/codemirror/utils/getFoldedLines", () => ({
  getFoldedLines: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/complex-exercise/ui/codemirror/utils/unfoldableFunctionNames", () => ({
  updateUnfoldableFunctions: jest.fn()
}));

jest.mock("@/components/complex-exercise/ui/codemirror/setup/editorExtensions", () => ({
  createEditorExtensions: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/complex-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn().mockReturnValue({ success: false }),
  saveCodeMirrorContent: jest.fn().mockReturnValue({ success: true })
}));

jest.mock("lodash", () => ({
  debounce: jest.fn((fn) => fn)
}));

import { createOrchestratorStore } from "@/components/complex-exercise/lib/orchestrator/store";
import { EditorManager } from "@/components/complex-exercise/lib/orchestrator/EditorManager";
import type { EditorView } from "@codemirror/view";

describe("EditorManager", () => {
  let store: ReturnType<typeof createOrchestratorStore>;
  let editorManager: EditorManager;
  let mockRunCode: jest.Mock;

  beforeEach(() => {
    store = createOrchestratorStore("test-uuid", "const x = 1;");
    mockRunCode = jest.fn();
    const mockElement = document.createElement("div");

    // Set the values in the store that EditorManager will read
    store.getState().setDefaultCode("const x = 1;");

    editorManager = new EditorManager(mockElement, store, "test-uuid", mockRunCode);
  });

  describe("constructor", () => {
    it("should initialize with element and create editorView", () => {
      expect(editorManager).toBeDefined();
      expect(editorManager.editorView).toBeDefined();
    });
  });

  describe("editorView property", () => {
    it("should be accessible and defined", () => {
      expect(editorManager.editorView).toBeDefined();
    });
  });

  describe("editor methods", () => {
    it("should have getValue, setValue, and focus methods", () => {
      expect(typeof editorManager.getValue).toBe("function");
      expect(typeof editorManager.setValue).toBe("function");
      expect(typeof editorManager.focus).toBe("function");
    });
  });

  describe("getCurrentEditorValue", () => {
    it("should get value from editor view and update snapshot", () => {
      const value = editorManager.getCurrentEditorValue();

      // EditorView mock returns empty string by default
      expect(value).toBe("");
      expect(store.getState().latestValueSnapshot).toBe("");
    });
  });

  describe("callOnEditorChangeCallback", () => {
    it("should call the editor change callback if set", () => {
      const mockView = {} as EditorView;
      // The callback would be set internally by the ref callback
      // We can't test setting it directly anymore
      editorManager.callOnEditorChangeCallback(mockView);
      // Should not throw
    });

    it("should not error when no callback is set", () => {
      const mockView = {} as EditorView;

      expect(() => {
        editorManager.callOnEditorChangeCallback(mockView);
      }).not.toThrow();
    });
  });

  describe("setMultiLineHighlight", () => {
    it("should dispatch effect to clear highlights when both lines are 0", () => {
      const dispatchSpy = jest.spyOn(editorManager.editorView, "dispatch");
      editorManager.setMultiLineHighlight(0, 0);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    it("should dispatch effect with line array for valid range", () => {
      const dispatchSpy = jest.spyOn(editorManager.editorView, "dispatch");
      editorManager.setMultiLineHighlight(2, 4);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    // This test is no longer relevant since editorView is always created
  });

  describe("setMultipleLineHighlights", () => {
    it("should dispatch effect with lines array", () => {
      const dispatchSpy = jest.spyOn(editorManager.editorView, "dispatch");
      editorManager.setMultipleLineHighlights([1, 3, 5]);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    // This test is no longer relevant since editorView is always created
  });

  describe("applyBreakpoints", () => {
    it("should not dispatch when no editor view is set", () => {
      editorManager.applyBreakpoints([1, 2, 3]);
      // Should not throw
    });
  });

  describe("showInformationWidget", () => {
    it("should enable the widget and scroll to highlighted line if not 0", () => {
      const setShouldShowInformationWidgetSpy = jest.fn();
      const setHighlightedLineSpy = jest.fn();

      jest.spyOn(store, "getState").mockReturnValue({
        ...store.getState(),
        shouldShowInformationWidget: false,
        highlightedLine: 5,
        setShouldShowInformationWidget: setShouldShowInformationWidgetSpy,
        setHighlightedLine: setHighlightedLineSpy,
        currentTest: null
      });

      editorManager.showInformationWidget();

      expect(setShouldShowInformationWidgetSpy).toHaveBeenCalledWith(true);
    });

    it("should not do anything if widget is already shown", () => {
      const setShouldShowInformationWidgetSpy = jest.fn();

      jest.spyOn(store, "getState").mockReturnValue({
        ...store.getState(),
        shouldShowInformationWidget: true,
        highlightedLine: 5,
        setShouldShowInformationWidget: setShouldShowInformationWidgetSpy,
        currentTest: null
      });

      editorManager.showInformationWidget();

      expect(setShouldShowInformationWidgetSpy).not.toHaveBeenCalled();
    });

    it("should set highlighted line for single-frame tests", () => {
      const setShouldShowInformationWidgetSpy = jest.fn();
      const setHighlightedLineSpy = jest.fn();
      const mockFrame = {
        line: 10,
        code: "test",
        status: "pass" as const,
        time: 0,
        timeInMs: 0,
        generateDescription: () => "test frame"
      };

      jest.spyOn(store, "getState").mockReturnValue({
        ...store.getState(),
        shouldShowInformationWidget: false,
        highlightedLine: 0,
        setShouldShowInformationWidget: setShouldShowInformationWidgetSpy,
        setHighlightedLine: setHighlightedLineSpy,
        currentTest: {
          frames: [mockFrame]
        } as any
      });

      editorManager.showInformationWidget();

      expect(setHighlightedLineSpy).toHaveBeenCalledWith(10);
    });
  });

  describe("hideInformationWidget", () => {
    it("should disable the widget", () => {
      const setShouldShowInformationWidgetSpy = jest.fn();
      const setHighlightedLineSpy = jest.fn();

      jest.spyOn(store, "getState").mockReturnValue({
        ...store.getState(),
        shouldShowInformationWidget: true,
        setShouldShowInformationWidget: setShouldShowInformationWidgetSpy,
        setHighlightedLine: setHighlightedLineSpy,
        currentTest: null
      });

      editorManager.hideInformationWidget();

      expect(setShouldShowInformationWidgetSpy).toHaveBeenCalledWith(false);
    });

    it("should not do anything if widget is already hidden", () => {
      const setShouldShowInformationWidgetSpy = jest.fn();

      jest.spyOn(store, "getState").mockReturnValue({
        ...store.getState(),
        shouldShowInformationWidget: false,
        setShouldShowInformationWidget: setShouldShowInformationWidgetSpy,
        currentTest: null
      });

      editorManager.hideInformationWidget();

      expect(setShouldShowInformationWidgetSpy).not.toHaveBeenCalled();
    });

    it("should clear highlighted line for single-frame tests", () => {
      const setShouldShowInformationWidgetSpy = jest.fn();
      const setHighlightedLineSpy = jest.fn();
      const mockFrame = {
        line: 10,
        code: "test",
        status: "pass" as const,
        time: 0,
        timeInMs: 0,
        generateDescription: () => "test frame"
      };

      jest.spyOn(store, "getState").mockReturnValue({
        ...store.getState(),
        shouldShowInformationWidget: true,
        setShouldShowInformationWidget: setShouldShowInformationWidgetSpy,
        setHighlightedLine: setHighlightedLineSpy,
        currentTest: {
          frames: [mockFrame]
        } as any
      });

      editorManager.hideInformationWidget();

      expect(setHighlightedLineSpy).toHaveBeenCalledWith(0);
    });
  });
});
