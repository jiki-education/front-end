import { render, screen } from "@testing-library/react";
import { InspectedIOTestResultView } from "@/components/coding-exercise/ui/test-results-view/InspectedIOTestResultView";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestrator } from "@/components/coding-exercise/lib/OrchestratorContext";
import type { IOTestResult, IOTestExpect } from "@/components/coding-exercise/lib/test-results-types";
import styles from "@/components/coding-exercise/CodingExercise.module.css";

// Mock dependencies
jest.mock("@/components/coding-exercise/lib/Orchestrator");
jest.mock("@/components/coding-exercise/lib/OrchestratorContext");
jest.mock("@/components/coding-exercise/ui/test-results-view/PassMessage", () => ({
  PassMessage: () => <div data-testid="pass-message">Pass Message</div>
}));
jest.mock("@/components/coding-exercise/ui/test-results-view/IOTestResultView", () => ({
  IOTestResultView: ({ expect }: { expect: IOTestExpect }) => (
    <div data-testid="io-test-result-view">
      <div data-testid="expect-actual">{String(expect.actual)}</div>
      <div data-testid="expect-expected">{String(expect.expected)}</div>
    </div>
  )
}));

const mockUseOrchestrator = useOrchestrator as jest.Mock;
const mockUseOrchestratorStore = useOrchestratorStore as jest.Mock;

describe("InspectedIOTestResultView", () => {
  const mockOrchestrator = {
    getFirstExpect: jest.fn()
  };

  const createMockIOTest = (name: string, status: "pass" | "fail"): IOTestResult => ({
    type: "io",
    slug: "test-slug",
    name,
    status,
    expects: [],
    functionName: "testFunction",
    args: ["arg1"],
    frames: [],
    logLines: []
  });

  const createMockExpect = (actual: any, expected: any): IOTestExpect => ({
    type: "io",
    pass: actual === expected,
    actual,
    expected,
    diff: [],
    matcher: "toEqual",
    codeRun: "testFunction('arg1')"
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOrchestrator.mockReturnValue(mockOrchestrator);
  });

  it("should return null when currentTest is null", () => {
    mockUseOrchestratorStore.mockReturnValue({
      currentTest: null
    });

    const { container } = render(<InspectedIOTestResultView />);

    expect(container.firstChild).toBeNull();
  });

  it("should return null when currentTest is not an IO test", () => {
    mockUseOrchestratorStore.mockReturnValue({
      currentTest: {
        type: "visual",
        slug: "visual-test",
        name: "Visual Test"
      }
    });

    const { container } = render(<InspectedIOTestResultView />);

    expect(container.firstChild).toBeNull();
  });

  it("should render test name and result view when currentTest is an IO test", () => {
    const mockTest = createMockIOTest("Test Acronym", "fail");
    const mockExpect = createMockExpect("CAT", "PNG");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect);

    render(<InspectedIOTestResultView />);

    expect(screen.getByText("Test Acronym")).toBeInTheDocument();
    expect(screen.getByTestId("io-test-result-view")).toBeInTheDocument();
    expect(screen.getByTestId("expect-actual")).toHaveTextContent("CAT");
    expect(screen.getByTestId("expect-expected")).toHaveTextContent("PNG");
  });

  it("should show pass message when test passes", () => {
    const mockTest = createMockIOTest("Test Acronym", "pass");
    const mockExpect = createMockExpect("PNG", "PNG");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect);

    render(<InspectedIOTestResultView />);

    expect(screen.getByTestId("pass-message")).toBeInTheDocument();
  });

  it("should not show pass message when test fails", () => {
    const mockTest = createMockIOTest("Test Acronym", "fail");
    const mockExpect = createMockExpect("CAT", "PNG");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect);

    render(<InspectedIOTestResultView />);

    expect(screen.queryByTestId("pass-message")).not.toBeInTheDocument();
  });

  it("should update firstExpect when currentTest changes", () => {
    const mockTest1 = createMockIOTest("Test 1", "fail");
    const mockExpect1 = createMockExpect("CAT", "PNG");

    const mockTest2 = createMockIOTest("Test 2", "fail");
    const mockExpect2 = createMockExpect("DOG", "BIRD");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest1
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect1);

    const { rerender } = render(<InspectedIOTestResultView />);

    expect(screen.getByTestId("expect-actual")).toHaveTextContent("CAT");
    expect(screen.getByTestId("expect-expected")).toHaveTextContent("PNG");

    // Update to new test
    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest2
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect2);

    rerender(<InspectedIOTestResultView />);

    // Should show updated expect values
    expect(screen.getByTestId("expect-actual")).toHaveTextContent("DOG");
    expect(screen.getByTestId("expect-expected")).toHaveTextContent("BIRD");
    expect(mockOrchestrator.getFirstExpect).toHaveBeenCalledTimes(2);
  });

  it("should not render IOTestResultView when firstExpect is null", () => {
    const mockTest = createMockIOTest("Test Acronym", "fail");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(null);

    render(<InspectedIOTestResultView />);

    expect(screen.queryByTestId("io-test-result-view")).not.toBeInTheDocument();
  });

  it("should apply correct CSS class for failing test", () => {
    const mockTest = createMockIOTest("Test Acronym", "fail");
    const mockExpect = createMockExpect("CAT", "PNG");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect);

    const { container } = render(<InspectedIOTestResultView />);

    const scenarioDiv = container.querySelector(`.${styles.scenario}`);
    expect(scenarioDiv).toHaveClass("fail");
  });

  it("should apply correct CSS class for passing test", () => {
    const mockTest = createMockIOTest("Test Acronym", "pass");
    const mockExpect = createMockExpect("PNG", "PNG");

    mockUseOrchestratorStore.mockReturnValue({
      currentTest: mockTest
    });
    mockOrchestrator.getFirstExpect.mockReturnValue(mockExpect);

    const { container } = render(<InspectedIOTestResultView />);

    const scenarioDiv = container.querySelector(`.${styles.scenario}`);
    expect(scenarioDiv).toHaveClass("pass");
  });
});
