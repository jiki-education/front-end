import { render, screen } from "@testing-library/react";
import ScenariosPanel from "@/components/coding-exercise/ui/test-results-view/ScenariosPanel";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestrator } from "@/components/coding-exercise/lib/OrchestratorContext";

// Mock dependencies
jest.mock("@/components/coding-exercise/lib/Orchestrator");
jest.mock("@/components/coding-exercise/lib/OrchestratorContext");
jest.mock("@/components/coding-exercise/ui/test-results-view/RunCodePromptView", () => ({
  RunCodePromptView: () => <div data-testid="run-code-prompt">Run Code Prompt</div>
}));
jest.mock("@/components/coding-exercise/ui/test-results-view/SyntaxErrorView", () => ({
  SyntaxErrorView: () => <div data-testid="syntax-error">Syntax Error</div>
}));
// Don't mock TestResultsView so we can test the real scrubber rendering behavior
jest.mock("@/components/coding-exercise/ui/scrubber/Scrubber", () => ({
  __esModule: true,
  default: () => <div data-testid="scrubber">Scrubber</div>
}));
jest.mock("@/components/coding-exercise/ui/FrameDescription", () => ({
  __esModule: true,
  default: () => <div data-testid="frame-description">Frame Description</div>
}));

const mockUseOrchestrator = useOrchestrator as jest.Mock;
const mockUseOrchestratorStore = useOrchestratorStore as jest.Mock;

describe("ScenariosPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOrchestrator.mockReturnValue({
      getFirstExpect: jest.fn().mockReturnValue(null)
    } as any);
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

    // Test that TestResultsView is rendered (it has class testResultsArea)
    expect(document.querySelector(".testResultsArea")).toBeInTheDocument();
    expect(screen.queryByTestId("syntax-error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("run-code-prompt")).not.toBeInTheDocument();
  });

  it("should show scrubber when currentTest has frames", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: {
        type: "visual",
        frames: [{ time: 0, line: 1 }],
        name: "Test scenario",
        status: "pass",
        view: document.createElement("div")
      }
    });

    render(<ScenariosPanel />);

    // Test that TestResultsView is rendered (it has class testResultsArea)
    expect(document.querySelector(".testResultsArea")).toBeInTheDocument();
    expect(screen.getByTestId("scrubber")).toBeInTheDocument();
    // Frame description is rendered elsewhere, not testing it here
  });

  it("should show scrubber when currentTest has no frames (scrubber will be disabled)", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: {
        type: "visual",
        frames: [],
        name: "Test scenario",
        status: "pass",
        view: document.createElement("div")
      }
    });

    render(<ScenariosPanel />);

    // Test that TestResultsView is rendered (it has class testResultsArea)
    expect(document.querySelector(".testResultsArea")).toBeInTheDocument();
    expect(screen.getByTestId("scrubber")).toBeInTheDocument();
    // Frame description is rendered elsewhere, not testing it here
  });

  it("should not show scrubber when currentTest is null", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: null
    });

    render(<ScenariosPanel />);

    // Test that TestResultsView is rendered (it has class testResultsArea)
    expect(document.querySelector(".testResultsArea")).toBeInTheDocument();
    expect(screen.queryByTestId("scrubber")).not.toBeInTheDocument();
    // Frame description testing is not part of this test
  });
});
