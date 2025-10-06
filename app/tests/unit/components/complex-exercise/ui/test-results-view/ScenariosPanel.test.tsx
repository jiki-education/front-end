import { render, screen } from "@testing-library/react";
import ScenariosPanel from "@/components/complex-exercise/ui/test-results-view/ScenariosPanel";
import { useOrchestratorStore } from "@/components/complex-exercise/lib/Orchestrator";
import { useOrchestrator } from "@/components/complex-exercise/lib/OrchestratorContext";

// Mock dependencies
jest.mock("@/components/complex-exercise/lib/Orchestrator");
jest.mock("@/components/complex-exercise/lib/OrchestratorContext");
jest.mock("@/components/complex-exercise/ui/test-results-view/RunCodePromptView", () => ({
  RunCodePromptView: () => <div data-testid="run-code-prompt">Run Code Prompt</div>
}));
jest.mock("@/components/complex-exercise/ui/test-results-view/SyntaxErrorView", () => ({
  SyntaxErrorView: () => <div data-testid="syntax-error">Syntax Error</div>
}));
jest.mock("@/components/complex-exercise/ui/test-results-view/TestResultsView", () => ({
  __esModule: true,
  default: () => <div data-testid="test-results">Test Results</div>
}));
jest.mock("@/components/complex-exercise/ui/scrubber/Scrubber", () => ({
  __esModule: true,
  default: () => <div data-testid="scrubber">Scrubber</div>
}));
jest.mock("@/components/complex-exercise/ui/FrameDescription", () => ({
  __esModule: true,
  default: () => <div data-testid="frame-description">Frame Description</div>
}));

const mockUseOrchestrator = useOrchestrator as jest.Mock;
const mockUseOrchestratorStore = useOrchestratorStore as jest.Mock;

describe("ScenariosPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOrchestrator.mockReturnValue({} as any);
  });

  it("should show SyntaxErrorView when hasSyntaxError is true", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: true,
      testSuiteResult: null,
      currentTest: null
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("syntax-error")).toBeInTheDocument();
    expect(screen.queryByTestId("run-code-prompt")).not.toBeInTheDocument();
    expect(screen.queryByTestId("test-results")).not.toBeInTheDocument();
  });

  it("should show RunCodePromptView when testSuiteResult is null", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: null,
      currentTest: null
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("run-code-prompt")).toBeInTheDocument();
    expect(screen.queryByTestId("syntax-error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("test-results")).not.toBeInTheDocument();
  });

  it("should show TestResultsView when testSuiteResult exists", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: null
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("test-results")).toBeInTheDocument();
    expect(screen.queryByTestId("syntax-error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("run-code-prompt")).not.toBeInTheDocument();
  });

  it("should show scrubber when currentTest has frames", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: {
        frames: [{ time: 0, line: 1 }]
      }
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("test-results")).toBeInTheDocument();
    expect(screen.getByTestId("scrubber")).toBeInTheDocument();
    expect(screen.getByTestId("frame-description")).toBeInTheDocument();
  });

  it("should not show scrubber when currentTest has no frames", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: {
        frames: []
      }
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("test-results")).toBeInTheDocument();
    expect(screen.queryByTestId("scrubber")).not.toBeInTheDocument();
    expect(screen.queryByTestId("frame-description")).not.toBeInTheDocument();
  });

  it("should not show scrubber when currentTest is null", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: null
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("test-results")).toBeInTheDocument();
    expect(screen.queryByTestId("scrubber")).not.toBeInTheDocument();
    expect(screen.queryByTestId("frame-description")).not.toBeInTheDocument();
  });
});
