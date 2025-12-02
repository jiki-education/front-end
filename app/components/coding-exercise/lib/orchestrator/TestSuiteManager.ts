import type { ExerciseDefinition } from "@jiki/curriculum";
import type { StoreApi } from "zustand/vanilla";
import type { TestSuiteResult, TestExpect } from "../test-results-types";
import type { ExerciseContext, OrchestratorStore } from "../types";

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
  constructor(
    private readonly store: StoreApi<OrchestratorStore>,
    private readonly taskManager?: {
      updateTaskProgress: (testResults: TestSuiteResult, exercise: ExerciseDefinition) => void;
    },
    private readonly context?: ExerciseContext
  ) {}

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
   * Get lesson slug from the current URL
   */
  private getLessonSlugFromURL(): string | null {
    // Get the pathname from window location
    if (typeof window === "undefined") {
      return null;
    }

    const pathname = window.location.pathname;
    // URL format is /lesson/[slug], so extract the slug
    const match = pathname.match(/\/lesson\/([^/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Submit exercise files to the backend (fire and forget)
   */
  private async submitExerciseFiles(code: string): Promise<void> {
    try {
      // Check if this is a project submission
      if (this.context?.type === "project") {
        const { submitProjectExercise } = await import("@/lib/api/projects");

        // Fire and forget - we don't await or care about the response
        void submitProjectExercise(this.context.slug, [
          {
            filename: "solution.js", // or appropriate extension
            code: code
          }
        ]).catch(() => {
          // Silently ignore errors (no internet, etc.)
        });
        return;
      }

      // Handle lesson submission (existing logic)
      const lessonSlug = this.getLessonSlugFromURL();
      if (!lessonSlug) {
        return; // Can't submit without a lesson slug
      }

      const { api } = await import("@/lib/api/client");

      // Fire and forget - we don't await or care about the response
      void api
        .post(`/internal/lessons/${lessonSlug}/exercise_submissions`, {
          submission: {
            files: [
              {
                filename: "solution.js", // or appropriate extension
                code: code
              }
            ]
          }
        })
        .catch(() => {
          // Silently ignore errors (no internet, etc.)
        });
    } catch {
      // Silently ignore any import or other errors
    }
  }

  /**
   * Run tests on the provided code
   */
  async runCode(code: string, exercise: ExerciseDefinition): Promise<void> {
    this.prepareStateForTestRun();

    // Submit exercise files asynchronously (gets lesson slug from URL)
    // Fire and forget - don't await
    void this.submitExerciseFiles(code);

    try {
      // Import and run our new test runner
      const { runTests } = await import("../test-runner/runTests");

      // Get the current language from the store
      const language = this.store.getState().language;

      const testResults = runTests(code, exercise, language);

      // Set the results in the store (will also set the first test as current)
      const state = this.store.getState();
      state.setTestSuiteResult(testResults);

      // Update task progress if TaskManager is available
      if (this.taskManager) {
        this.taskManager.updateTaskProgress(testResults, exercise);
      }
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
