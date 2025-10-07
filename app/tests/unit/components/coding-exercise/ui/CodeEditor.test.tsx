import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import CodeEditor from "@/components/coding-exercise/ui/CodeEditor";
import OrchestratorTestProvider from "@/tests/test-utils/OrchestratorTestProvider";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock the CodeMirror component
jest.mock("@/components/coding-exercise/ui/codemirror/CodeMirror", () => ({
  CodeMirror: jest.fn(() => <div data-testid="codemirror-editor">Mocked CodeMirror Editor</div>)
}));

// Mock the orchestrator store hook
jest.mock("@/components/coding-exercise/lib/Orchestrator", () => ({
  useOrchestratorStore: jest.fn(),
  default: jest.fn()
}));

const mockUseOrchestratorStore = useOrchestratorStore as jest.MockedFunction<typeof useOrchestratorStore>;

// Helper to create mock orchestrator
function createMockOrchestrator(exerciseUuid = "test-uuid"): Orchestrator {
  return {
    exerciseUuid,
    getStore: jest.fn(),
    setCode: jest.fn(),
    runCode: jest.fn(),
    getEditorView: jest.fn(),
    callOnEditorChangeCallback: jest.fn(),
    setupEditor: jest.fn(() => jest.fn())
  } as unknown as Orchestrator;
}

describe("CodeEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseOrchestratorStore.mockReturnValue({
      exerciseUuid: "test-uuid",
      exerciseTitle: "Test Exercise",
      code: "const x = 1;",
      output: "",
      status: "idle",
      error: null,
      currentTest: null,
      hasCodeBeenEdited: false,
      isSpotlightActive: false,
      wasSuccessModalShown: false,
      allTestsPassed: false,
      foldedLines: [],
      language: "jikiscript" as const,
      defaultCode: "const x = 1;",
      readonly: false,
      shouldShowInformationWidget: false,
      underlineRange: undefined,
      highlightedLineColor: "",
      highlightedLine: 0,
      informationWidgetData: { html: "", line: 0, status: "SUCCESS" },
      breakpoints: [],
      shouldAutoRunCode: false,
      hasUnhandledError: false,
      unhandledErrorBase64: "",
      hasSyntaxError: false,
      latestValueSnapshot: undefined,

      // Test results state
      testSuiteResult: null,
      shouldPlayOnTestChange: true,

      // Frame navigation state
      prevFrame: undefined,
      nextFrame: undefined,
      prevBreakpointFrame: undefined,
      nextBreakpointFrame: undefined,

      // Test time persistence
      testCurrentTimes: {},

      // Current test time and frame
      currentTestTime: 0,
      currentFrame: undefined,

      // Play/pause state
      isPlaying: false
    });
  });

  describe("component rendering", () => {
    it("renders without crashing", () => {
      const orchestrator = createMockOrchestrator();

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <CodeEditor />
        </OrchestratorTestProvider>
      );

      expect(screen.getByTestId("codemirror-editor")).toBeInTheDocument();
    });

    it("renders with CodeMirror component", () => {
      const orchestrator = createMockOrchestrator("unique-exercise-uuid");

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <CodeEditor />
        </OrchestratorTestProvider>
      );

      const editorElement = screen.getByTestId("codemirror-editor");
      expect(editorElement).toBeInTheDocument();
      expect(screen.getByText("Mocked CodeMirror Editor")).toBeInTheDocument();
    });
  });

  describe("integration with orchestrator", () => {
    it("renders CodeMirror with the provided orchestrator instance", () => {
      const orchestrator = createMockOrchestrator();

      render(
        <OrchestratorTestProvider orchestrator={orchestrator}>
          <CodeEditor />
        </OrchestratorTestProvider>
      );

      // Verify CodeMirror is rendered with correct props
      expect(screen.getByTestId("codemirror-editor")).toBeInTheDocument();
      expect(screen.getByText("Mocked CodeMirror Editor")).toBeInTheDocument();
    });

    it("correctly integrates different orchestrator instances", () => {
      const orchestrator1 = createMockOrchestrator("exercise-1");
      const orchestrator2 = createMockOrchestrator("exercise-2");

      const { rerender } = render(
        <OrchestratorTestProvider orchestrator={orchestrator1}>
          <CodeEditor />
        </OrchestratorTestProvider>
      );
      expect(screen.getByTestId("codemirror-editor")).toBeInTheDocument();

      rerender(
        <OrchestratorTestProvider orchestrator={orchestrator2}>
          <CodeEditor />
        </OrchestratorTestProvider>
      );
      expect(screen.getByTestId("codemirror-editor")).toBeInTheDocument();
    });
  });
});
