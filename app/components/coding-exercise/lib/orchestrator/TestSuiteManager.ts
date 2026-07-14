import { ApiError, AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import type { ProgressionScores } from "@/lib/api/lessons";
import type { ExerciseDefinition } from "@jiki/curriculum";
import type { SyntaxError } from "@jiki/interpreters";
import toast from "react-hot-toast";
import type { StoreApi } from "zustand/vanilla";
import { ERROR_HIGHLIGHT_COLOR } from "../../ui/codemirror/extensions/lineHighlighter";
import { processMessageContent } from "../../ui/messageUtils";
import type { TestExpect, TestSuiteResult } from "../test-results-types";
import { zeroProgressionScores } from "../test-runner/progression";
import type { ExerciseContext, OrchestratorStore } from "../types";

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
   *
   * Resolves with the created submission's uuid so this run's hidden
   * progression scores can be patched onto it, or null when there is no
   * context, the API didn't return a uuid, or the submission failed.
   */
  private submitExerciseFiles(code: string): Promise<string | null> {
    if (!this.context) {
      return Promise.resolve(null);
    }

    const files = [{ filename: "solution.js", code }];
    const context = this.context;

    return submitExercise(context, files).catch((error: unknown) => {
      // Network/auth/rate-limit errors get a global UI treatment already.
      if (error instanceof NetworkError || error instanceof AuthenticationError || error instanceof RateLimitError) {
        return null;
      }
      if (error instanceof ApiError) {
        console.warn("Failed to submit exercise:", error);
        toast.error("Couldn't save your submission. Please try again.", { id: "exercise-submission-error" });
        return null;
      }
      console.warn("Failed to submit exercise:", error);
      return null;
    });
  }

  /**
   * Patch this run's hidden progression scores onto its submission (fire and
   * forget). Pure telemetry decoration: skipped silently when the create
   * didn't yield a uuid, and failures only warn - never bother the student.
   */
  private patchProgressionScores(submissionUuid: Promise<string | null>, scores: ProgressionScores): void {
    if (!this.context) {
      return;
    }

    const context = this.context;

    void submissionUuid
      .then((uuid) => {
        if (uuid === null) {
          return;
        }
        return patchSubmissionProgression(context, uuid, scores);
      })
      .catch((error: unknown) => {
        console.warn("Failed to record progression scores:", error);
      });
  }

  /**
   * Run tests on the provided code
   */
  async runCode(code: string, exercise: ExerciseDefinition): Promise<void> {
    this.prepareStateForTestRun();

    // Fire and forget - submission is recorded server-side but doesn't block
    // the test run. The uuid it resolves with is used to patch this run's
    // hidden progression scores onto the submission once the run completes.
    const submissionUuid = this.submitExerciseFiles(code);

    try {
      // Import and run our new test runner
      const { runTests } = await import("../test-runner/runTests");

      // Get the current language from the store
      const language = this.store.getState().language;

      const { testSuiteResult, progressionScores } = await runTests(code, exercise, language);

      // Set the results in the store (will also set the first test as current)
      const state = this.store.getState();
      state.setTestSuiteResult(testSuiteResult);

      // Update task progress if TaskManager is available
      if (this.taskManager) {
        this.taskManager.updateTaskProgress(testSuiteResult, exercise);
      }

      this.patchProgressionScores(submissionUuid, progressionScores);
    } catch (error) {
      console.error(error);

      // Check if it's a SyntaxError (has location property)
      if (error && typeof error === "object" && "location" in error) {
        this.handleSyntaxError(error as SyntaxError);
        // Nothing ran, so every progression score (including the free
        // "scenarios" baseline) is zero.
        this.patchProgressionScores(submissionUuid, zeroProgressionScores(exercise));
      } else {
        // Unexpected error: no progression patch for this run.
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

async function submitExercise(
  context: ExerciseContext,
  files: { filename: string; code: string }[]
): Promise<string | null> {
  if (context.type === "challenge") {
    const { submitChallengeExercise } = await import("@/lib/api/challenges");
    return submitChallengeExercise(context.slug, files);
  }
  const { submitLessonExercise } = await import("@/lib/api/lessons");
  return submitLessonExercise(context.slug, files);
}

async function patchSubmissionProgression(
  context: ExerciseContext,
  uuid: string,
  scores: ProgressionScores
): Promise<void> {
  if (context.type === "challenge") {
    const { updateChallengeExerciseSubmissionProgression } = await import("@/lib/api/challenges");
    return updateChallengeExerciseSubmissionProgression(context.slug, uuid, scores);
  }
  const { updateLessonExerciseSubmissionProgression } = await import("@/lib/api/lessons");
  return updateLessonExerciseSubmissionProgression(context.slug, uuid, scores);
}
