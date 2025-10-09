import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestrator } from "@/components/coding-exercise/lib/OrchestratorContext";
import ConsoleTab from "@/components/coding-exercise/ui/test-results-view/ConsoleTab";
import { createMockOrchestrator, createMockOrchestratorStore, createMockTestResult } from "@/tests/mocks";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the orchestrator hooks
jest.mock("@/components/coding-exercise/lib/Orchestrator", () => ({
  useOrchestratorStore: jest.fn(),
  default: jest.fn()
}));

jest.mock("@/components/coding-exercise/lib/OrchestratorContext", () => ({
  useOrchestrator: jest.fn()
}));

// Helper to create mock log lines with Python-style output
function createPythonLogLines() {
  return [
    { time: 0, output: "Starting Python execution..." },
    { time: 50000, output: "x = 5" },
    { time: 100000, output: "print('Hello, World!')" },
    { time: 150000, output: "Hello, World!" },
    { time: 200000, output: "y = x * 2" },
    { time: 250000, output: "print(f'Result: {y}')" },
    { time: 300000, output: "Result: 10" },
    { time: 350000, output: "Execution complete." }
  ];
}

// Helper to create mock store state
function createMockStoreState(overrides?: any) {
  const store = createMockOrchestratorStore(overrides);
  return store.getState();
}

describe("ConsoleTab Component", () => {
  let mockOrchestrator: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOrchestrator = createMockOrchestrator();
    (useOrchestrator as jest.Mock).mockReturnValue(mockOrchestrator);
  });

  describe("empty state", () => {
    it("should render empty message when no current test", () => {
      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: null,
          currentTestTime: 0
        })
      );

      render(<ConsoleTab />);

      const emptyMessage = screen.getByText("No console output");
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveClass("console-tab-empty", "text-gray-500", "text-center", "p-5", "italic");
    });

    it("should render empty message when current test has no log lines", () => {
      const testResult = createMockTestResult({
        logLines: []
      });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 0
        })
      );

      render(<ConsoleTab />);

      const emptyMessage = screen.getByText("No console output");
      expect(emptyMessage).toBeInTheDocument();
    });
  });

  describe("console output rendering", () => {
    it("should render console container with proper styling", () => {
      const logLines = createPythonLogLines();
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 400000 // Show all logs
        })
      );

      render(<ConsoleTab />);

      const consoleContainer = screen.getByRole("log");
      expect(consoleContainer).toBeInTheDocument();
      expect(consoleContainer).toHaveClass(
        "console-tab",
        "bg-gray-900",
        "text-gray-300",
        "font-mono",
        "text-xs",
        "p-2",
        "overflow-y-auto",
        "h-full"
      );
    });

    it("should render all log lines when currentTestTime shows all", () => {
      const logLines = createPythonLogLines();
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 400000 // After all log times
        })
      );

      render(<ConsoleTab />);

      // Check that all log lines are rendered
      logLines.forEach((logLine) => {
        expect(screen.getByText(logLine.output)).toBeInTheDocument();
      });

      // Verify we have the expected number of log lines
      const allLogLines = screen.getAllByTestId(/^log-line-/);
      expect(allLogLines).toHaveLength(logLines.length);
    });

    it("should render Python-specific console output correctly", () => {
      const pythonLogLines = [
        { time: 0, output: ">>> x = [1, 2, 3, 4, 5]" },
        { time: 50000, output: ">>> for i in x:" },
        { time: 100000, output: "...     print(i * 2)" },
        { time: 150000, output: "2" },
        { time: 200000, output: "4" },
        { time: 250000, output: "6" },
        { time: 300000, output: "8" },
        { time: 350000, output: "10" },
        { time: 400000, output: ">>>" }
      ];

      const testResult = createMockTestResult({ logLines: pythonLogLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 500000
        })
      );

      render(<ConsoleTab />);

      // Check Python-specific output patterns
      expect(screen.getByText(">>> x = [1, 2, 3, 4, 5]")).toBeInTheDocument();
      expect(screen.getByText(">>> for i in x:")).toBeInTheDocument();
      expect(
        screen.getByText(
          (content, element) => content.includes("print(i * 2)") && element?.tagName.toLowerCase() === "span"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("log line components", () => {
    it("should render log line with proper structure and styling", () => {
      const logLines = [{ time: 100000, output: "print('Hello from Python!')" }];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 200000
        })
      );

      render(<ConsoleTab />);

      const logLine = screen.getByTestId("log-line-0");
      expect(logLine).toBeInTheDocument();
      expect(logLine).toHaveClass("log-line", "py-0.5", "cursor-pointer", "hover:bg-gray-700");

      // Check timestamp
      const timestamp = screen.getByText("0.100s");
      expect(timestamp).toBeInTheDocument();
      expect(timestamp).toHaveClass("log-timestamp", "text-gray-500", "mr-2");

      // Check output content
      expect(screen.getByText("print('Hello from Python!')")).toBeInTheDocument();
    });

    it("should format timestamps correctly", () => {
      const logLines = [
        { time: 0, output: "Start" },
        { time: 1500000, output: "1.5 seconds" }, // 1.5 seconds in microseconds
        { time: 10000000, output: "10 seconds" }, // 10 seconds in microseconds
        { time: 500000, output: "Half second" } // 0.5 seconds in microseconds
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 20000000 // Show all
        })
      );

      render(<ConsoleTab />);

      expect(screen.getByText("0.000s")).toBeInTheDocument(); // 0 microseconds
      expect(screen.getByText("1.500s")).toBeInTheDocument(); // 1.5 seconds
      expect(screen.getByText("10.000s")).toBeInTheDocument(); // 10 seconds
      expect(screen.getByText("0.500s")).toBeInTheDocument(); // 0.5 seconds
    });
  });

  describe("timeline interaction", () => {
    it("should show active state for log lines when currentTestTime >= log.time", () => {
      const logLines = [
        { time: 100000, output: "First log" }, // 0.1s
        { time: 200000, output: "Second log" }, // 0.2s
        { time: 300000, output: "Third log" } // 0.3s
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 250000 // 0.25s - should show first two logs as active
        })
      );

      render(<ConsoleTab />);

      const firstLog = screen.getByTestId("log-line-0");
      const secondLog = screen.getByTestId("log-line-1");
      const thirdLog = screen.getByTestId("log-line-2");

      // First two should be active (opacity-100 bg-gray-800)
      expect(firstLog).toHaveClass("opacity-100", "bg-gray-800");
      expect(secondLog).toHaveClass("opacity-100", "bg-gray-800");

      // Third should be inactive (opacity-40)
      expect(thirdLog).toHaveClass("opacity-40");
      expect(thirdLog).not.toHaveClass("bg-gray-800");
    });

    it("should show inactive state for log lines when currentTestTime < log.time", () => {
      const logLines = [
        { time: 100000, output: "Future log" },
        { time: 200000, output: "Another future log" }
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 50000 // Before any logs
        })
      );

      render(<ConsoleTab />);

      const firstLog = screen.getByTestId("log-line-0");
      const secondLog = screen.getByTestId("log-line-1");

      // Both should be inactive
      expect(firstLog).toHaveClass("opacity-40");
      expect(firstLog).not.toHaveClass("bg-gray-800");
      expect(secondLog).toHaveClass("opacity-40");
      expect(secondLog).not.toHaveClass("bg-gray-800");
    });

    it("should call orchestrator.setCurrentTestTime when log line is clicked", () => {
      const logLines = [{ time: 150000, output: "Clickable log" }];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 0
        })
      );

      render(<ConsoleTab />);

      const logLine = screen.getByTestId("log-line-0");
      fireEvent.click(logLine);

      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(150000);
    });
  });

  describe("Python execution scenarios", () => {
    it("should handle Python print statements and variable assignments", () => {
      const pythonLogLines = [
        { time: 0, output: "name = 'Alice'" },
        { time: 50000, output: "age = 25" },
        { time: 100000, output: "print(f'Hello, {name}! You are {age} years old.')" },
        { time: 150000, output: "Hello, Alice! You are 25 years old." },
        { time: 200000, output: "is_adult = age >= 18" },
        { time: 250000, output: "print(f'Is adult: {is_adult}')" },
        { time: 300000, output: "Is adult: True" }
      ];

      const testResult = createMockTestResult({ logLines: pythonLogLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 400000
        })
      );

      render(<ConsoleTab />);

      // Verify Python-specific patterns are displayed
      expect(screen.getByText("name = 'Alice'")).toBeInTheDocument();
      expect(screen.getByText("print(f'Hello, {name}! You are {age} years old.')")).toBeInTheDocument();
      expect(screen.getByText("Hello, Alice! You are 25 years old.")).toBeInTheDocument();
      expect(screen.getByText("Is adult: True")).toBeInTheDocument();
    });

    it("should handle Python error messages and tracebacks", () => {
      const pythonErrorLogs = [
        { time: 0, output: "x = 10" },
        { time: 50000, output: "y = 0" },
        { time: 100000, output: "result = x / y" },
        { time: 150000, output: "Traceback (most recent call last):" },
        { time: 200000, output: '  File "<string>", line 3, in <module>' },
        { time: 250000, output: "ZeroDivisionError: division by zero" }
      ];

      const testResult = createMockTestResult({
        logLines: pythonErrorLogs,
        status: "fail"
      });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 300000
        })
      );

      render(<ConsoleTab />);

      // Verify error traceback is displayed
      expect(screen.getByText("Traceback (most recent call last):")).toBeInTheDocument();
      expect(screen.getByText("ZeroDivisionError: division by zero")).toBeInTheDocument();
      expect(screen.getByText("result = x / y")).toBeInTheDocument();
    });

    it("should handle Python loops and iterations", () => {
      const pythonLoopLogs = [
        { time: 0, output: "numbers = [1, 2, 3]" },
        { time: 50000, output: "for num in numbers:" },
        { time: 100000, output: "    square = num ** 2" },
        { time: 150000, output: "    print(f'{num} squared is {square}')" },
        { time: 200000, output: "1 squared is 1" },
        { time: 250000, output: "    square = num ** 2" },
        { time: 300000, output: "    print(f'{num} squared is {square}')" },
        { time: 350000, output: "2 squared is 4" },
        { time: 400000, output: "    square = num ** 2" },
        { time: 450000, output: "    print(f'{num} squared is {square}')" },
        { time: 500000, output: "3 squared is 9" }
      ];

      const testResult = createMockTestResult({ logLines: pythonLoopLogs });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 600000
        })
      );

      render(<ConsoleTab />);

      // Verify loop structure and output
      expect(screen.getByText("numbers = [1, 2, 3]")).toBeInTheDocument();
      expect(screen.getByText("for num in numbers:")).toBeInTheDocument();
      expect(
        screen.getAllByText(
          (content, element) => content.includes("square = num ** 2") && element?.tagName.toLowerCase() === "span"
        )
      ).toHaveLength(3);
      expect(screen.getByText("1 squared is 1")).toBeInTheDocument();
      expect(screen.getByText("2 squared is 4")).toBeInTheDocument();
      expect(screen.getByText("3 squared is 9")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA roles and labels", () => {
      const logLines = createPythonLogLines();
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 400000
        })
      );

      render(<ConsoleTab />);

      // Console container should have log role
      const consoleContainer = screen.getByRole("log");
      expect(consoleContainer).toBeInTheDocument();

      // Log lines should be clickable buttons
      const logLiness = screen.getAllByTestId(/^log-line-/);
      logLiness.forEach((logLine) => {
        expect(logLine).toHaveClass("cursor-pointer");
      });
    });

    it("should support keyboard navigation", () => {
      const logLines = [
        { time: 100000, output: "First log" },
        { time: 200000, output: "Second log" }
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 0
        })
      );

      render(<ConsoleTab />);

      const firstLogLine = screen.getByTestId("log-line-0");

      // Simulate keyboard interaction
      fireEvent.keyDown(firstLogLine, { key: "Enter" });
      fireEvent.keyUp(firstLogLine, { key: "Enter" });
      fireEvent.click(firstLogLine);

      expect(mockOrchestrator.setCurrentTestTime).toHaveBeenCalledWith(100000);
    });
  });

  describe("edge cases", () => {
    it("should handle empty output strings", () => {
      const logLines = [
        { time: 0, output: "" },
        { time: 50000, output: "   " }, // Whitespace only
        { time: 100000, output: "Normal output" }
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 200000
        })
      );

      render(<ConsoleTab />);

      // Should render all log lines even with empty/whitespace content
      expect(screen.getAllByTestId(/^log-line-/)).toHaveLength(3);
      expect(screen.getByText("Normal output")).toBeInTheDocument();
    });

    it("should handle very long output lines", () => {
      const longOutput = "This is a very long output line that might wrap or overflow in the console view. ".repeat(10);
      const logLines = [
        { time: 0, output: longOutput },
        { time: 50000, output: "Short line" }
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 100000
        })
      );

      render(<ConsoleTab />);

      expect(
        screen.getByText(
          (content, element) =>
            content.includes("This is a very long output line that might wrap") &&
            element?.tagName.toLowerCase() === "span"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Short line")).toBeInTheDocument();
    });

    it("should handle special characters and Unicode in output", () => {
      const logLines = [
        { time: 0, output: "print('Hello 🐍 Python!')" },
        { time: 50000, output: "Hello 🐍 Python!" },
        { time: 100000, output: "Special chars: <>&\"'" },
        { time: 150000, output: "Unicode: αβγδε 中文 🚀" }
      ];
      const testResult = createMockTestResult({ logLines });

      (useOrchestratorStore as jest.Mock).mockReturnValue(
        createMockStoreState({
          currentTest: testResult,
          currentTestTime: 200000
        })
      );

      render(<ConsoleTab />);

      expect(screen.getByText("Hello 🐍 Python!")).toBeInTheDocument();
      expect(screen.getByText("Special chars: <>&\"'")).toBeInTheDocument();
      expect(screen.getByText("Unicode: αβγδε 中文 🚀")).toBeInTheDocument();
    });
  });
});
