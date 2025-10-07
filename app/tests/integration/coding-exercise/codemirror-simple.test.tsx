import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CodeEditor from "@/components/coding-exercise/ui/CodeEditor";
import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import { createTestExercise } from "@/tests/mocks/createTestExercise";

// Simple integration test that uses real orchestrator with mocked CodeMirror editor
jest.mock("@codemirror/view", () => {
  // Create mock EditorView constructor and add static properties
  const MockEditorView = jest.fn().mockImplementation(() => ({
    state: {
      doc: { toString: () => "test content", length: 12 },
      update: jest.fn().mockReturnValue({ changes: {} })
    },
    dispatch: jest.fn(),
    focus: jest.fn(),
    destroy: jest.fn()
  }));

  // Add static properties to EditorView
  (MockEditorView as any).editable = { of: jest.fn() };
  (MockEditorView as any).updateListener = { of: jest.fn() };

  return {
    EditorView: MockEditorView,
    highlightActiveLine: jest.fn(),
    highlightActiveLineGutter: jest.fn(),
    dropCursor: jest.fn(),
    rectangularSelection: jest.fn(),
    crosshairCursor: jest.fn(),
    keymap: { of: jest.fn() },
    Decoration: {
      mark: jest.fn(() => ({})),
      line: jest.fn(() => ({})),
      widget: jest.fn(() => ({}))
    },
    WidgetType: jest.fn()
  };
});

jest.mock("@codemirror/state", () => ({
  EditorState: {
    create: jest.fn().mockReturnValue({}),
    allowMultipleSelections: { of: jest.fn() }
  },
  Compartment: jest.fn().mockImplementation(() => ({
    of: jest.fn(() => []),
    reconfigure: jest.fn(() => ({ of: jest.fn() }))
  })),
  StateEffect: {
    define: jest.fn(() => ({ of: jest.fn() }))
  },
  StateField: {
    define: jest.fn(() => jest.fn())
  }
}));

jest.mock("@codemirror/commands", () => ({
  defaultKeymap: [],
  historyKeymap: [],
  indentWithTab: jest.fn()
}));

jest.mock("@codemirror/language", () => ({
  indentOnInput: jest.fn(),
  bracketMatching: jest.fn(),
  foldKeymap: [],
  foldEffect: jest.fn(),
  unfoldEffect: jest.fn()
}));

jest.mock("@codemirror/lang-javascript", () => ({
  javascript: jest.fn()
}));

jest.mock("@codemirror/lint", () => ({
  lintKeymap: []
}));

jest.mock("@codemirror/search", () => ({
  searchKeymap: []
}));

jest.mock("codemirror", () => ({
  minimalSetup: jest.fn()
}));

// Mock all CodeMirror extensions
jest.mock("@/components/coding-exercise/ui/codemirror/extensions", () => ({
  breakpointGutter: jest.fn(),
  foldGutter: jest.fn(),
  underlineExtension: jest.fn(),
  readOnlyRangeDecoration: jest.fn(),
  jsTheme: jest.fn(),
  highlightLine: jest.fn(),
  showInfoWidgetField: jest.fn(),
  informationWidgetDataField: jest.fn(),
  lineInformationExtension: jest.fn(),
  multiHighlightLine: jest.fn(),
  cursorTooltip: jest.fn(),
  highlightedCodeBlock: jest.fn(),
  initReadOnlyRangesExtension: jest.fn(),
  informationWidgetDataEffect: { of: jest.fn() },
  showInfoWidgetEffect: { of: jest.fn() }
}));

// Mock utility functions
jest.mock("@/components/coding-exercise/ui/codemirror/utils/getBreakpointLines", () => ({
  getBreakpointLines: jest.fn(() => [])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/getFoldedLines", () => ({
  getFoldedLines: jest.fn(() => [])
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

jest.mock("@codemirror/lang-javascript", () => ({
  javascript: jest.fn(() => [])
}));

jest.mock("@codemirror/lang-python", () => ({
  python: jest.fn(() => [])
}));

jest.mock("@exercism/codemirror-lang-jikiscript", () => ({
  jikiscript: jest.fn(() => [])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/getCodeMirrorFieldValue", () => ({
  getCodeMirrorFieldValue: jest.fn(() => [])
}));

jest.mock("@/components/coding-exercise/ui/codemirror/utils/unfoldableFunctionNames", () => ({
  unfoldableFunctionsField: jest.fn()
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/move-cursor-by-paste-length", () => ({
  moveCursorByPasteLength: jest.fn()
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/read-only-ranges/readOnlyRanges", () => ({
  readOnlyRangesStateField: jest.fn(),
  updateReadOnlyRangesEffect: { of: jest.fn() }
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/breakpoint", () => ({
  breakpointEffect: jest.fn()
}));

jest.mock("@/components/coding-exercise/ui/codemirror/extensions/lineHighlighter", () => ({
  INFO_HIGHLIGHT_COLOR: "#ffffff",
  changeLineEffect: { of: jest.fn() },
  changeColorEffect: { of: jest.fn() }
}));

jest.mock("@/components/coding-exercise/lib/localStorage", () => ({
  loadCodeMirrorContent: jest.fn(() => ({ success: false })),
  saveCodeMirrorContent: jest.fn(() => ({ success: true }))
}));

describe("CodeMirror Integration with Real Orchestrator", () => {
  it("renders CodeEditor with real orchestrator and mocked CodeMirror", () => {
    const exercise = createTestExercise({ slug: "integration-test", initialCode: "console.log('Hello World');" });
    const orchestrator = new Orchestrator(exercise);

    render(
      <OrchestratorTestProvider orchestrator={orchestrator}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Should render the editor container (using data-testid attribute)
    const editorElement = document.querySelector('[data-testid="codemirror-editor"]');
    expect(editorElement).toBeInTheDocument();
  });

  it("integrates orchestrator state management", () => {
    const exercise = createTestExercise({ slug: "state-test", initialCode: "const initial = true;" });
    const orchestrator = new Orchestrator(exercise);

    render(
      <OrchestratorTestProvider orchestrator={orchestrator}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Check initial state
    const state = orchestrator.getStore().getState();
    expect(state.exerciseUuid).toBe("state-test");
    expect(state.code).toBe("const initial = true;");
    expect(state.defaultCode).toBe("const initial = true;");
    expect(state.readonly).toBe(false);
  });

  it("responds to orchestrator state changes", () => {
    const exercise = createTestExercise({ slug: "change-test", initialCode: "const x = 1;" });
    const orchestrator = new Orchestrator(exercise);

    render(
      <OrchestratorTestProvider orchestrator={orchestrator}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Change state through orchestrator
    act(() => {
      orchestrator.setCode("const y = 2;");
      orchestrator.setReadonly(true);
      orchestrator.setHighlightedLine(5);
    });

    // Verify state changed
    const state = orchestrator.getStore().getState();
    expect(state.code).toBe("const y = 2;");
    expect(state.readonly).toBe(true);
    expect(state.highlightedLine).toBe(5);
    expect(state.hasCodeBeenEdited).toBe(true);
  });

  it("handles multiple orchestrator instances independently", () => {
    const exercise1 = createTestExercise({ slug: "uuid-1", initialCode: "code1" });
    const exercise2 = createTestExercise({ slug: "uuid-2", initialCode: "code2" });
    const orchestrator1 = new Orchestrator(exercise1);
    const orchestrator2 = new Orchestrator(exercise2);

    const { rerender } = render(
      <OrchestratorTestProvider orchestrator={orchestrator1}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Verify first orchestrator
    expect(orchestrator1.getStore().getState().exerciseUuid).toBe("uuid-1");
    expect(orchestrator1.getStore().getState().code).toBe("code1");

    rerender(
      <OrchestratorTestProvider orchestrator={orchestrator2}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Verify second orchestrator
    expect(orchestrator2.getStore().getState().exerciseUuid).toBe("uuid-2");
    expect(orchestrator2.getStore().getState().code).toBe("code2");

    // Verify they're independent
    act(() => {
      orchestrator1.setCode("modified1");
      orchestrator2.setCode("modified2");
    });

    expect(orchestrator1.getStore().getState().code).toBe("modified1");
    expect(orchestrator2.getStore().getState().code).toBe("modified2");
  });

  it("exposes editor management methods", () => {
    const exercise = createTestExercise({ slug: "methods-test", initialCode: "test code" });
    const orchestrator = new Orchestrator(exercise);

    render(
      <OrchestratorTestProvider orchestrator={orchestrator}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Test that key orchestrator methods exist and can be called
    expect(typeof orchestrator.setCode).toBe("function");
    expect(typeof orchestrator.setReadonly).toBe("function");
    expect(typeof orchestrator.setHighlightedLine).toBe("function");
    expect(typeof orchestrator.setShouldAutoRunCode).toBe("function");
    expect(typeof orchestrator.runCode).toBe("function");

    // Test calling methods doesn't throw
    expect(() => {
      act(() => {
        orchestrator.setCode("new code");
        orchestrator.setReadonly(false);
        orchestrator.setShouldAutoRunCode(true);
      });
    }).not.toThrow();
  });

  it("maintains proper editor state lifecycle", () => {
    const exercise = createTestExercise({ slug: "lifecycle-test", initialCode: "initial code" });
    const orchestrator = new Orchestrator(exercise);

    const { unmount } = render(
      <OrchestratorTestProvider orchestrator={orchestrator}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Verify initial state
    expect(orchestrator.getStore().getState().code).toBe("initial code");

    // Change state
    act(() => {
      orchestrator.setCode("updated code");
    });
    expect(orchestrator.getStore().getState().code).toBe("updated code");

    // Unmount should not throw
    expect(() => unmount()).not.toThrow();
  });

  it("supports editor configuration and extensions", () => {
    const exercise = createTestExercise({ slug: "config-test", initialCode: "test" });
    const orchestrator = new Orchestrator(exercise);

    render(
      <OrchestratorTestProvider orchestrator={orchestrator}>
        <CodeEditor />
      </OrchestratorTestProvider>
    );

    // Test configuration methods
    act(() => {
      orchestrator.setBreakpoints([1, 3, 5]);
      orchestrator.setFoldedLines([2, 4]);
      orchestrator.setHighlightedLineColor("#ff0000");
      orchestrator.setInformationWidgetData({
        html: "<div>Test</div>",
        line: 1,
        status: "SUCCESS"
      });
    });

    const state = orchestrator.getStore().getState();
    expect(state.breakpoints).toEqual([1, 3, 5]);
    expect(state.foldedLines).toEqual([2, 4]);
    expect(state.highlightedLineColor).toBe("#ff0000");
    expect(state.informationWidgetData.html).toBe("<div>Test</div>");
  });
});
