import type { ExerciseDefinition } from "@jiki/curriculum";
import type { StoreApi } from "zustand/vanilla";
import type { TestExpect } from "../test-results-types";
import type { OrchestratorStore } from "../types";

// Define SyntaxError interface inline since it's not exported from interpreters
interface SyntaxError {
  message: string;
  location: {
    line: number;
  };
}

/**
 * Manages test suite execution, results, and processing
 */
export class TestSuiteManager {
  constructor(private readonly store: StoreApi<OrchestratorStore>) {}

  /**
   * Prepare state for a new test run
   */
  private prepareStateForTestRun() {
    const state = this.store.getState();
    state.setHasSyntaxError(false);
    state.setStatus("running");
    state.setError(null);
  }

  /**
   * Handle syntax errors from compilation
   */
  private handleSyntaxError(error: SyntaxError) {
    const state = this.store.getState();

    state.setHasSyntaxError(true);
    state.setTestSuiteResult(null);

    // Location is always present in SyntaxError
    state.setInformationWidgetData({
      html: error.message,
      line: error.location.line,
      status: "ERROR"
    });
    state.setShouldShowInformationWidget(true);
    state.setHighlightedLine(error.location.line);
  }

  /**
   * Run tests on the provided code
   */
  async runCode(code: string, exercise: ExerciseDefinition): Promise<void> {
    this.prepareStateForTestRun();

    try {
      // Import and run our new test runner
      const { runTests } = await import("../test-runner/runTests");

      // Get the current language from the store
      const language = this.store.getState().language;

      const testResults = runTests(code, exercise, language);

      // Set the results in the store (will also set the first test as current)
      const state = this.store.getState();
      state.setTestSuiteResult(testResults);
    } catch (error) {
      // Check if it's a SyntaxError (has location property)
      if (error && typeof error === "object" && "location" in error) {
        this.handleSyntaxError(error as SyntaxError);
      }
      this.store.getState().setStatus("error");
    }
  }

  /**
   * Get the first expect (failing or first overall) for the current test
   */
  getFirstExpect(): TestExpect | null {
    const currentTest = this.store.getState().currentTest;
    if (!currentTest) {
      return null;
    }
    const firstFailing = currentTest.expects.find((expect) => expect.pass === false);
    return firstFailing || currentTest.expects[0] || null;
  }
}
