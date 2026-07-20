import { ApiError, AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import type { ExerciseDefinition, Messages as CurriculumMessages } from "@jiki/curriculum";
import type { Messages as InterpreterMessages, SyntaxError } from "@jiki/interpreters";
import { toastError } from "@/lib/toast";
import type { StoreApi } from "zustand/vanilla";
import { ERROR_HIGHLIGHT_COLOR } from "../../ui/codemirror/extensions/lineHighlighter";
import { processMessageContent } from "../../ui/messageUtils";
import type { TestExpect, TestSuiteResult } from "../test-results-types";
import type { ExerciseContext, OrchestratorStore } from "../types";

/**
 * Manages test suite execution, results, and processing
 */
export class TestSuiteManager {
  constructor(
    private readonly store: StoreApi<OrchestratorStore>,
    // The active locale's interpreter catalog, injected into every interpreter run
    // (fetched in the blocking exercise load). Tests supply an empty dict, which
    // resolves to each interpreter's `system` default.
    private readonly interpreterLocaleMessages: InterpreterMessages,
    // The active locale's curriculum message dict, injected into each exercise
    // instance before it runs (fetched in the blocking load). Tests supply an
    // empty dict, which resolves keys as-is.
    private readonly exerciseLocaleMessages: CurriculumMessages,
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
    state.setHasUnhandledError(false);
    state.setUnhandledErrorBase64("");
    state.setStatus("running");
    state.setError(null);
    state.setUnderlineRange(undefined);
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
      html: processMessageContent(error.message),
      line: error.location.line,
      status: "ERROR"
    });
    state.setShouldShowInformationWidget(true);
    state.setHighlightedLine(error.location.line);
    state.setHighlightedLineColor(ERROR_HIGHLIGHT_COLOR);
    state.setUnderlineRange({
      from: Math.max(0, error.location.absolute.begin - 1),
      to: Math.max(0, error.location.absolute.end - 1)
    });
  }

  /**
   * Submit exercise files to the backend (fire and forget).
   * Network/auth/rate-limit errors are handled globally; surface other
   * HTTP errors (e.g. 422/500) via a toast so the student knows their
   * submission wasn't recorded.
   */
  private submitExerciseFiles(code: string): void {
    if (!this.context) {
      return;
    }

    const files = [{ filename: "solution.js", code }];

    const submission =
      this.context.type === "challenge"
        ? import("@/lib/api/challenges").then(({ submitChallengeExercise }) =>
            submitChallengeExercise(this.context!.slug, files)
          )
        : import("@/lib/api/lessons").then(({ submitLessonExercise }) =>
            submitLessonExercise(this.context!.slug, files)
          );

    void submission.catch((error: unknown) => {
      // Network/auth/rate-limit errors get a global UI treatment already.
      if (error instanceof NetworkError || error instanceof AuthenticationError || error instanceof RateLimitError) {
        return;
      }
      if (error instanceof ApiError) {
        console.warn("Failed to submit exercise:", error);
        toastError("exercise.submissionFailed", undefined, { id: "exercise-submission-error" });
        return;
      }
      console.warn("Failed to submit exercise:", error);
    });
  }

  /**
   * Run tests on the provided code
   */
  async runCode(code: string, exercise: ExerciseDefinition): Promise<void> {
    this.prepareStateForTestRun();

    // Fire and forget - submission is recorded server-side but doesn't block the test run
    this.submitExerciseFiles(code);

    try {
      // Import and run our new test runner
      const { runTests } = await import("../test-runner/runTests");

      // Get the current language from the store
      const language = this.store.getState().language;

      const testResults = await runTests(
        code,
        exercise,
        language,
        this.interpreterLocaleMessages,
        this.exerciseLocaleMessages
      );

      // Set the results in the store (will also set the first test as current)
      const state = this.store.getState();
      state.setTestSuiteResult(testResults);

      // Update task progress if TaskManager is available
      if (this.taskManager) {
        this.taskManager.updateTaskProgress(testResults, exercise);
      }
    } catch (error) {
      console.error(error);

      // Check if it's a SyntaxError (has location property)
      if (error && typeof error === "object" && "location" in error) {
        this.handleSyntaxError(error as SyntaxError);
      } else {
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
          throw error;
        }
        const state = this.store.getState();
        state.setHasUnhandledError(true);
        state.setUnhandledErrorBase64(
          btoa(JSON.stringify({ error: String(error), code, type: "Error firing runCode" }))
        );
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
