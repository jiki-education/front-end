import { render, screen } from "@testing-library/react";
import ScenariosPanel from "@/components/coding-exercise/ui/test-results-view/ScenariosPanel";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestrator } from "@/components/coding-exercise/lib/OrchestratorContext";

// Mock dependencies
jest.mock("@/components/coding-exercise/lib/Orchestrator");
jest.mock("@/components/coding-exercise/lib/OrchestratorContext");
jest.mock("@/components/coding-exercise/ui/test-results-view/SyntaxErrorView", () => ({
  SyntaxErrorView: () => <div data-testid="syntax-error">Syntax Error</div>
}));
jest.mock("@/components/coding-exercise/ui/test-results-view/TestResultsButtons", () => ({
  TestResultsButtons: () => <div data-testid="test-results-buttons">Test Results Buttons</div>
}));
jest.mock("@/components/coding-exercise/ui/test-results-view/InspectedTestResultView", () => ({
  InspectedTestResultView: () => <div data-testid="inspected-test-result">Inspected Test Result</div>
}));

const mockUseOrchestrator = useOrchestrator as jest.Mock;
const mockUseOrchestratorStore = useOrchestratorStore as jest.Mock;

describe("ScenariosPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOrchestrator.mockReturnValue({
      getFirstExpect: jest.fn().mockReturnValue(null),
      getExercise: jest.fn().mockReturnValue({ type: "visual", scenarios: [] })
    } as any);
  });

  it("should show SyntaxErrorView when hasSyntaxError is true", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: true,
      testSuiteResult: null,
      currentTest: null,
      currentTestIdx: 0
    });

    render(<ScenariosPanel />);

    expect(screen.getByTestId("syntax-error")).toBeInTheDocument();
    expect(screen.queryByTestId("test-results-buttons")).not.toBeInTheDocument();
    expect(screen.queryByTestId("inspected-test-result")).not.toBeInTheDocument();
  });

  it("should show TestResultsView when testSuiteResult is null (preview mode)", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: null,
      currentTest: null,
      currentTestIdx: 0
    });

    render(<ScenariosPanel />);

    // TestResultsView renders buttons and InspectedTestResultView
    expect(screen.getByTestId("test-results-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("inspected-test-result")).toBeInTheDocument();
    expect(screen.queryByTestId("syntax-error")).not.toBeInTheDocument();
  });

  it("should show TestResultsView when testSuiteResult exists", () => {
    mockUseOrchestratorStore.mockReturnValue({
      hasSyntaxError: false,
      testSuiteResult: { tests: [], status: "idle" },
      currentTest: null,
      currentTestIdx: 0
    });

    render(<ScenariosPanel />);

    // TestResultsView renders buttons and InspectedTestResultView
    expect(screen.getByTestId("test-results-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("inspected-test-result")).toBeInTheDocument();
    expect(screen.queryByTestId("syntax-error")).not.toBeInTheDocument();
  });
});
