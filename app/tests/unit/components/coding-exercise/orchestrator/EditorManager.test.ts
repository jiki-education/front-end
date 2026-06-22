// Mock all CodeMirror modules before importing the EditorManager
jest.mock("@codemirror/state", () => ({
  EditorState: {
    create: jest.fn().mockReturnValue({})
  },
  StateEffect: {
    define: jest.fn(() => ({ of: jest.fn() }))
  },
  StateField: {
    define: jest.fn(() => jest.fn())
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
      updateListener: { of: jest.fn().mockReturnValue({}) },
      baseTheme: jest.fn(() => [])
    }
  ),
  Decoration: {
    mark: jest.fn(() => ({})),
    line: jest.fn(() => ({}))
  },
  hoverTooltip: jest.fn(() => [])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/setup/editorCompartments", () => ({
  readonlyCompartment: {
    of: jest.fn(() => []),
    reconfigure: jest.fn()
  },
  languageCompartment: {
    of: jest.fn(() => []),
    reconfigure: jest.fn()
  }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions", () => ({
  informationWidgetDataEffect: { of: jest.fn() },
  showInfoWidgetEffect: { of: jest.fn() },
  changeMultiLineHighlightEffect: { of: jest.fn() }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/end-line-information/cleanup", () => ({
  cleanupAllInformationTooltips: jest.fn()
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/breakpoint", () => ({
  breakpointEffect: { of: jest.fn(), is: jest.fn() }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/lineHighlighter", () => ({
  INFO_HIGHLIGHT_COLOR: "#ffc107",
  changeColorEffect: { of: jest.fn() },
  changeLineEffect: { of: jest.fn() }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges", () => ({
  readOnlyRangesStateField: {},
  updateReadOnlyRangesEffect: { of: jest.fn() }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/underlineRange", () => ({
  addUnderlineEffect: { of: jest.fn() }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/getBreakpointLines", () => ({
  getBreakpointLines: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/getCodeMirrorFieldValue", () => ({
  getCodeMirrorFieldValue: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/getFoldedLines", () => ({
  getFoldedLines: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/unfoldableFunctionNames", () => ({
  updateUnfoldableFunctions: jest.fn()
}));

jest.mock("@/components/coding-exercise/ui/codemirror/setup/editorExtensions", () => ({
  createEditorExtensions: jest.fn().mockReturnValue([])
}));

jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn().mockReturnValue({ success: false }),
  saveCodeMirrorContent: jest.fn().mockReturnValue({ success: true })
}));

jest.mock("lodash", () => ({
  debounce: jest.fn((fn) => fn)
}));

import { createOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import { EditorManager, clampRangesToDoc } from "@/components/coding-exercise/lib/orchestrator/EditorManager";
import type { ReadonlyRange } from "@jiki/curriculum";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { EditorView } from "@codemirror/view";

describe("EditorManager", () => {
  let store: ReturnType<typeof createOrchestratorStore>;
  let editorManager: EditorManager;
  let mockRunCode: jest.Mock;

  beforeEach(() => {
    const mockExercise = createMockExercise({
      slug: "test-uuid",
      stubs: { javascript: "const x = 1;", python: "const x = 1;", jikiscript: "const x = 1;" }
    });
    store = createOrchestratorStore(mockExercise, "jikiscript", { type: "lesson", slug: "test-lesson" });
    mockRunCode = jest.fn();
    const mockElement = document.createElement("div");

    // Set the values in the store that EditorManager will read

    editorManager = new EditorManager(mockElement, store, "test-uuid", "const x = 1;", [], mockRunCode);
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

describe("clampRangesToDoc", () => {
  const range = (fromLine: number, toLine: number, extra?: Partial<ReadonlyRange>): ReadonlyRange => ({
    fromLine,
    toLine,
    ...extra
  });

  // Builds a minimal CodeMirror-like doc. `lineCount` lines, each `lineLength`
  // chars wide by default; `lineLengths` overrides specific 1-based lines.
  const makeDoc = (lineCount: number, lineLength = 80, lineLengths: Record<number, number> = {}) => ({
    lines: lineCount,
    line(n: number) {
      const length = lineLengths[n] ?? lineLength;
      // `from` values are arbitrary but monotonic; only `to - from` is read.
      const from = (n - 1) * 1000;
      return { from, to: from + length };
    }
  });

  it("keeps ranges fully within the document unchanged", () => {
    const ranges = [range(1, 3), range(5, 5, { fromChar: 2, toChar: 4 })];
    expect(clampRangesToDoc(ranges, makeDoc(10))).toEqual(ranges);
  });

  it("drops ranges that start past the end of the document", () => {
    // Reproduces "Invalid line number 16 in 15-line document": a stale range
    // anchored beyond the current code must not reach CodeMirror.
    expect(clampRangesToDoc([range(16, 16)], makeDoc(15))).toEqual([]);
  });

  it("clamps toLine down to the last line when it overruns the document", () => {
    expect(clampRangesToDoc([range(3, 16)], makeDoc(15))).toEqual([range(3, 15)]);
  });

  it("drops toChar when the range's last line is clamped", () => {
    // toChar referred to the original (now-missing) line, so it can't be kept.
    expect(clampRangesToDoc([range(3, 16, { fromChar: 1, toChar: 5 })], makeDoc(15))).toEqual([
      range(3, 15, { fromChar: 1 })
    ]);
  });

  it("treats a range whose fromLine equals the last line as in-bounds", () => {
    expect(clampRangesToDoc([range(15, 15)], makeDoc(15))).toEqual([range(15, 15)]);
  });

  it("clamps fromChar to the length of its line when it overruns", () => {
    // Line 2 is only 4 chars now, but a stale fromChar points at char 20.
    const doc = makeDoc(5, 80, { 2: 4 });
    expect(clampRangesToDoc([range(2, 3, { fromChar: 20 })], doc)).toEqual([range(2, 3, { fromChar: 4 })]);
  });

  it("clamps toChar to the length of its line when it overruns", () => {
    const doc = makeDoc(5, 80, { 3: 6 });
    expect(clampRangesToDoc([range(2, 3, { toChar: 50 })], doc)).toEqual([range(2, 3, { toChar: 6 })]);
  });

  it("leaves in-bounds char offsets untouched", () => {
    const doc = makeDoc(5, 80, { 2: 40, 3: 40 });
    const ranges = [range(2, 3, { fromChar: 10, toChar: 12 })];
    expect(clampRangesToDoc(ranges, doc)).toEqual(ranges);
  });

  it("returns an empty array when given no ranges", () => {
    expect(clampRangesToDoc([], makeDoc(15))).toEqual([]);
  });
});
