import { TestSuiteManager } from "@/components/coding-exercise/lib/orchestrator/TestSuiteManager";
import type { ExerciseContext } from "@/components/coding-exercise/lib/types";
import { ApiError, AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import { createMockExercise, createMockOrchestratorStore } from "@/tests/mocks";

jest.mock("@/components/coding-exercise/lib/test-runner/runTests", () => ({
  runTests: jest.fn()
}));

jest.mock("@/lib/api/lessons", () => ({
  submitLessonExercise: jest.fn(),
  markLessonBonusCompleted: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("@/lib/api/challenges", () => ({
  submitChallengeExercise: jest.fn()
}));

jest.mock("@/lib/api/exerciseSubmissions", () => ({
  updateExerciseSubmissionProgression: jest.fn()
}));

jest.mock("@/lib/toast", () => ({
  toastError: jest.fn()
}));

function flushMicrotasks() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const BASELINE_SCORES = { v: 0, score: 0, metrics: { scenarios: 0 } };

function mockRunOutcome(
  progressionScores: { v: number; score: number; metrics: Record<string, number> } = BASELINE_SCORES
) {
  return { testSuiteResult: { tests: [], passed: true }, progressionScores };
}

describe("TestSuiteManager", () => {
  let mockStore: any;
  const mockCode = "console.log('test')";
  const mockExercise = createMockExercise();

  function buildManager(context?: ExerciseContext, storeOverrides: Record<string, unknown> = {}) {
    mockStore = createMockOrchestratorStore({
      setHasSyntaxError: jest.fn(),
      setStatus: jest.fn(),
      setError: jest.fn(),
      setTestSuiteResult: jest.fn(),
      setInformationWidgetData: jest.fn(),
      setShouldShowInformationWidget: jest.fn(),
      setHighlightedLine: jest.fn(),
      currentTest: null,
      language: "javascript",
      ...storeOverrides
    });
    return new TestSuiteManager(mockStore, {}, {}, undefined, context);
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    const lessons = await import("@/lib/api/lessons");
    (lessons.submitLessonExercise as jest.Mock).mockResolvedValue("submission-uuid");
    const challenges = await import("@/lib/api/challenges");
    (challenges.submitChallengeExercise as jest.Mock).mockResolvedValue("submission-uuid");
    const exerciseSubmissions = await import("@/lib/api/exerciseSubmissions");
    (exerciseSubmissions.updateExerciseSubmissionProgression as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("runCode submission", () => {
    it("submits to the lesson endpoint when context is a lesson", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitLessonExercise).toHaveBeenCalledWith("maze-solve-basic", [
        { filename: "solution.js", code: mockCode }
      ]);
    });

    it("submits to the challenge endpoint when context is a challenge", async () => {
      const manager = buildManager({ type: "challenge", slug: "structured-house" });

      const { submitChallengeExercise } = await import("@/lib/api/challenges");
      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitChallengeExercise).toHaveBeenCalledWith("structured-house", [
        { filename: "solution.js", code: mockCode }
      ]);
      expect(submitLessonExercise).not.toHaveBeenCalled();
    });

    it("does not submit when no context is provided", async () => {
      const manager = buildManager();

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { submitChallengeExercise } = await import("@/lib/api/challenges");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitLessonExercise).not.toHaveBeenCalled();
      expect(submitChallengeExercise).not.toHaveBeenCalled();
    });

    it("runs tests with the language regardless of submission state", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);

      expect(runTests).toHaveBeenCalledWith(mockCode, mockExercise, "javascript", {}, {});
    });

    it("does not block test execution when submission fails", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockRejectedValueOnce(new NetworkError("offline"));

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await expect(manager.runCode(mockCode, mockExercise)).resolves.not.toThrow();
      expect(mockStore.getState().setTestSuiteResult).toHaveBeenCalled();
    });
  });

  describe("submission error handling", () => {
    it("toasts on a generic ApiError (e.g. 500)", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockRejectedValueOnce(new ApiError(500, "Internal Server Error"));

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      const { toastError } = await import("@/lib/toast");

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(toastError).toHaveBeenCalledTimes(1);
      expect(toastError).toHaveBeenCalledWith("exercise.submissionFailed", undefined, {
        id: "exercise-submission-error"
      });
    });

    it("does not toast on NetworkError (handled globally)", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockRejectedValueOnce(new NetworkError("offline"));

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      const { toastError } = await import("@/lib/toast");

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(toastError).not.toHaveBeenCalled();
    });

    it("does not toast on AuthenticationError or RateLimitError (handled globally)", async () => {
      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      const { toastError } = await import("@/lib/toast");

      for (const error of [new AuthenticationError("Unauthorized"), new RateLimitError("Too Many Requests", 1)]) {
        const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });
        (submitLessonExercise as jest.Mock).mockRejectedValueOnce(error);
        (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

        await manager.runCode(mockCode, mockExercise);
        await flushMicrotasks();
      }

      expect(toastError).not.toHaveBeenCalled();
    });
  });

  describe("runCode error handling", () => {
    it("handles syntax errors correctly", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      const syntaxError = {
        message: "Unexpected token",
        location: { line: 5, relative: { begin: 1, end: 9 }, absolute: { begin: 42, end: 50 } }
      };
      (runTests as jest.Mock).mockImplementation(() => {
        throw syntaxError;
      });

      await manager.runCode(mockCode, mockExercise);

      const state = mockStore.getState();
      expect(state.setHasSyntaxError).toHaveBeenCalledWith(true);
      expect(state.setTestSuiteResult).toHaveBeenCalledWith(null);
      expect(state.setInformationWidgetData).toHaveBeenCalledWith(
        expect.objectContaining({ line: 5, status: "ERROR" })
      );
      const widgetCall = (state.setInformationWidgetData as jest.Mock).mock.calls[0][0];
      expect(widgetCall.html).toContain("Unexpected token");
      expect(widgetCall.html).not.toContain("Oops, something went wrong!");
      expect(state.setShouldShowInformationWidget).toHaveBeenCalledWith(true);
      expect(state.setHighlightedLine).toHaveBeenCalledWith(5);
      expect(state.setUnderlineRange).toHaveBeenCalledWith({ from: 41, to: 49 });
      expect(state.setStatus).toHaveBeenCalledWith("error");
    });

    it("clears the underline range at the start of every run", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockResolvedValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);

      expect(mockStore.getState().setUnderlineRange).toHaveBeenCalledWith(undefined);
    });

    it("rethrows non-syntax errors in test/dev so they surface in the overlay", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw new Error("Some other error");
      });

      await expect(manager.runCode(mockCode, mockExercise)).rejects.toThrow("Some other error");

      expect(mockStore.getState().setHasSyntaxError).toHaveBeenCalledWith(false);
    });
  });

  // The mock exercise's bonus task owns test-scenario-bonus; the required
  // task owns test-scenario-1 and test-scenario-2.
  describe("bonus completion reporting", () => {
    const lesson: ExerciseContext = { type: "lesson", slug: "maze-solve-basic" };
    const suite = (bonusStatus: "pass" | "fail") => ({
      tests: [
        { slug: "test-scenario-1", status: "pass" },
        { slug: "test-scenario-2", status: "pass" },
        { slug: "test-scenario-bonus", status: bonusStatus }
      ],
      passed: true
    });

    async function run(manager: TestSuiteManager, result: ReturnType<typeof suite>) {
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue({ testSuiteResult: result, progressionScores: BASELINE_SCORES });
      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();
    }

    it("PATCHes bonus_completed and flags the store when every bonus scenario passes", async () => {
      const manager = buildManager(lesson);
      const { markLessonBonusCompleted } = await import("@/lib/api/lessons");

      await run(manager, suite("pass"));

      expect(markLessonBonusCompleted).toHaveBeenCalledWith("maze-solve-basic");
      expect(mockStore.getState().setIsBonusCompleted).toHaveBeenCalledWith(true);
    });

    it("does nothing while a bonus scenario is still failing", async () => {
      const manager = buildManager(lesson);
      const { markLessonBonusCompleted } = await import("@/lib/api/lessons");

      await run(manager, suite("fail"));

      expect(markLessonBonusCompleted).not.toHaveBeenCalled();
      expect(mockStore.getState().setIsBonusCompleted).not.toHaveBeenCalled();
    });

    it("does not resend once the bonus is already recorded", async () => {
      const manager = buildManager(lesson, { isBonusCompleted: true });
      const { markLessonBonusCompleted } = await import("@/lib/api/lessons");

      await run(manager, suite("pass"));

      expect(markLessonBonusCompleted).not.toHaveBeenCalled();
    });

    it("does not report for challenges", async () => {
      const manager = buildManager({ type: "challenge", slug: "structured-house" });
      const { markLessonBonusCompleted } = await import("@/lib/api/lessons");

      await run(manager, suite("pass"));

      expect(markLessonBonusCompleted).not.toHaveBeenCalled();
    });

    it("does not report for an exercise without bonus tasks", async () => {
      const manager = buildManager(lesson);
      const { markLessonBonusCompleted } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue({
        testSuiteResult: { tests: [{ slug: "test-scenario-1", status: "pass" }], passed: true },
        progressionScores: BASELINE_SCORES
      });
      const noBonus = createMockExercise({ tasks: [{ id: "test-task-1", name: "Basic Test Task", bonus: false }] });

      await manager.runCode(mockCode, noBonus);
      await flushMicrotasks();

      expect(markLessonBonusCompleted).not.toHaveBeenCalled();
    });

    it("clears the flag so the next passing run retries when the request fails", async () => {
      const manager = buildManager(lesson);
      const { markLessonBonusCompleted } = await import("@/lib/api/lessons");
      (markLessonBonusCompleted as jest.Mock).mockRejectedValueOnce(new NetworkError("offline"));
      jest.spyOn(console, "warn").mockImplementation(() => {});

      await run(manager, suite("pass"));

      expect(mockStore.getState().setIsBonusCompleted).toHaveBeenLastCalledWith(false);
    });
  });

  describe("progression test wiring", () => {
    const syntaxError = {
      message: "Unexpected token",
      location: { line: 5, relative: { begin: 1, end: 9 }, absolute: { begin: 42, end: 50 } }
    };

    const progressionExercise = createMockExercise({
      progressionMetrics: {
        version: 3,
        metrics: [
          { name: "distance", maxScore: 60, points: 5, score: () => 0 },
          { name: "used_loop", maxScore: 1, points: 10, score: () => 0 }
        ]
      }
    });

    it("patches the run's evaluated scores onto the created submission", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(
        mockRunOutcome({ v: 1, score: 27, metrics: { scenarios: 10, distance: 5, used_loop: 10, precision: 2 } })
      );

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(updateExerciseSubmissionProgression).toHaveBeenCalledWith("submission-uuid", {
        v: 1,
        score: 27,
        metrics: { scenarios: 10, distance: 5, used_loop: 10, precision: 2 }
      });
    });

    it("patches with the challenge submission's uuid for challenge contexts", async () => {
      const manager = buildManager({ type: "challenge", slug: "structured-house" });

      const { submitChallengeExercise } = await import("@/lib/api/challenges");
      (submitChallengeExercise as jest.Mock).mockResolvedValue("challenge-uuid");
      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(updateExerciseSubmissionProgression).toHaveBeenCalledWith("challenge-uuid", BASELINE_SCORES);
    });

    it("patches all-zero scores (including the scenarios baseline) on the syntax-error path", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw syntaxError;
      });

      await manager.runCode(mockCode, progressionExercise);
      await flushMicrotasks();

      expect(mockStore.getState().setHasSyntaxError).toHaveBeenCalledWith(true);
      expect(updateExerciseSubmissionProgression).toHaveBeenCalledWith("submission-uuid", {
        v: 3,
        score: 0,
        metrics: { scenarios: 0, distance: 0, used_loop: 0 }
      });
    });

    it("skips the patch silently when the create didn't return a uuid", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockResolvedValue(null);
      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(updateExerciseSubmissionProgression).not.toHaveBeenCalled();
    });

    it("does not patch when the run fails in an unexpected way", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });

      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw new Error("Some other error");
      });

      await expect(manager.runCode(mockCode, mockExercise)).rejects.toThrow("Some other error");
      await flushMicrotasks();

      expect(updateExerciseSubmissionProgression).not.toHaveBeenCalled();
    });

    it("does not patch when there is no context", async () => {
      const manager = buildManager();

      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(updateExerciseSubmissionProgression).not.toHaveBeenCalled();
    });

    it("only warns when the patch fails - never toasts", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);

      const { updateExerciseSubmissionProgression } = await import("@/lib/api/exerciseSubmissions");
      (updateExerciseSubmissionProgression as jest.Mock).mockRejectedValue(new ApiError(500, "boom"));
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      const { toastError } = await import("@/lib/toast");

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(toastError).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith("Failed to record progression scores:", expect.any(ApiError));
    });

    it("does not affect the visible run when the whole progression patch flow fails", async () => {
      const manager = buildManager({ type: "lesson", slug: "maze-solve-basic" });
      jest.spyOn(console, "warn").mockImplementation(() => undefined);

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockRejectedValue(new NetworkError("offline"));
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await expect(manager.runCode(mockCode, mockExercise)).resolves.not.toThrow();
      await flushMicrotasks();

      expect(mockStore.getState().setTestSuiteResult).toHaveBeenCalledWith({ tests: [], passed: true });
    });
  });

  describe("getFirstExpect", () => {
    it("should return first failing expect when available", () => {
      const manager = buildManager();
      const failingExpect = { pass: false, description: "Should fail" };
      const passingExpect = { pass: true, description: "Should pass" };
      mockStore.getState = jest.fn(() => ({ currentTest: { expects: [passingExpect, failingExpect] } }));
      expect(manager.getFirstExpect()).toBe(failingExpect);
    });

    it("should return first expect when no failures", () => {
      const manager = buildManager();
      const expect1 = { pass: true, description: "First" };
      const expect2 = { pass: true, description: "Second" };
      mockStore.getState = jest.fn(() => ({ currentTest: { expects: [expect1, expect2] } }));
      expect(manager.getFirstExpect()).toBe(expect1);
    });

    it("should return null when no current test", () => {
      const manager = buildManager();
      mockStore.getState = jest.fn(() => ({ currentTest: null }));
      expect(manager.getFirstExpect()).toBeNull();
    });

    it("should return null when expects array is empty", () => {
      const manager = buildManager();
      mockStore.getState = jest.fn(() => ({ currentTest: { expects: [] } }));
      expect(manager.getFirstExpect()).toBeNull();
    });
  });
});
