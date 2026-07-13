import { TestSuiteManager } from "@/components/coding-exercise/lib/orchestrator/TestSuiteManager";
import type { ExerciseContext } from "@/components/coding-exercise/lib/types";
import { ApiError, AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import { createMockExercise, createMockOrchestratorStore } from "@/tests/mocks";

jest.mock("@/components/coding-exercise/lib/test-runner/runTests", () => ({
  runTests: jest.fn()
}));

jest.mock("@/lib/api/lessons", () => ({
  submitLessonExercise: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("@/lib/api/challenges", () => ({
  submitChallengeExercise: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: jest.fn() }
}));

function flushMicrotasks() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const BASELINE_SCORES = { v: 0, scenarios: 0 };

function mockRunOutcome(progressionScores: Record<string, number> = BASELINE_SCORES) {
  return { testSuiteResult: { tests: [], passed: true }, progressionScores };
}

describe("TestSuiteManager", () => {
  let mockStore: any;
  const mockCode = "console.log('test')";
  const mockExercise = createMockExercise();

  function buildManager(context?: ExerciseContext) {
    mockStore = createMockOrchestratorStore({
      setHasSyntaxError: jest.fn(),
      setStatus: jest.fn(),
      setError: jest.fn(),
      setTestSuiteResult: jest.fn(),
      setInformationWidgetData: jest.fn(),
      setShouldShowInformationWidget: jest.fn(),
      setHighlightedLine: jest.fn(),
      currentTest: null,
      language: "javascript"
    });
    return new TestSuiteManager(mockStore, undefined, context);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("runCode submission", () => {
    it("submits to the lesson endpoint when context is a lesson", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitLessonExercise).toHaveBeenCalledWith(
        "solve-a-maze",
        [{ filename: "solution.js", code: mockCode }],
        BASELINE_SCORES
      );
    });

    it("submits to the challenge endpoint when context is a challenge", async () => {
      const manager = buildManager({ type: "challenge", slug: "build-a-blog" });

      const { submitChallengeExercise } = await import("@/lib/api/challenges");
      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitChallengeExercise).toHaveBeenCalledWith(
        "build-a-blog",
        [{ filename: "solution.js", code: mockCode }],
        BASELINE_SCORES
      );
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
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);

      expect(runTests).toHaveBeenCalledWith(mockCode, mockExercise, "javascript");
    });

    it("does not block test execution when submission fails", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

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
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockRejectedValueOnce(new ApiError(500, "Internal Server Error"));

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      const toast = (await import("react-hot-toast")).default;

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(toast.error).toHaveBeenCalledTimes(1);
      expect((toast.error as jest.Mock).mock.calls[0][0]).toMatch(/submission|attempt/i);
    });

    it("does not toast on NetworkError (handled globally)", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      (submitLessonExercise as jest.Mock).mockRejectedValueOnce(new NetworkError("offline"));

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      const toast = (await import("react-hot-toast")).default;

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(toast.error).not.toHaveBeenCalled();
    });

    it("does not toast on AuthenticationError or RateLimitError (handled globally)", async () => {
      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      const toast = (await import("react-hot-toast")).default;

      for (const error of [new AuthenticationError("Unauthorized"), new RateLimitError("Too Many Requests", 1)]) {
        const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });
        (submitLessonExercise as jest.Mock).mockRejectedValueOnce(error);
        (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

        await manager.runCode(mockCode, mockExercise);
        await flushMicrotasks();
      }

      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe("runCode error handling", () => {
    it("handles syntax errors correctly", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

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
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockResolvedValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);

      expect(mockStore.getState().setUnderlineRange).toHaveBeenCalledWith(undefined);
    });

    it("rethrows non-syntax errors in test/dev so they surface in the overlay", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw new Error("Some other error");
      });

      await expect(manager.runCode(mockCode, mockExercise)).rejects.toThrow("Some other error");

      expect(mockStore.getState().setHasSyntaxError).toHaveBeenCalledWith(false);
    });
  });

  describe("progression test wiring", () => {
    const syntaxError = {
      message: "Unexpected token",
      location: { line: 5, relative: { begin: 1, end: 9 }, absolute: { begin: 42, end: 50 } }
    };

    const progressionExercise = createMockExercise({
      progressionTest: {
        version: 3,
        metrics: [
          { name: "distance", maxScore: 60, points: 5, score: () => 0 },
          { name: "used-loop", maxScore: 1, points: 10, score: () => 0 }
        ]
      }
    });

    it("includes the scores evaluated by the test run in the submission payload", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(
        mockRunOutcome({ v: 1, scenarios: 1, distance: 5, used_loop: 10, precision: 0 })
      );

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitLessonExercise).toHaveBeenCalledWith("solve-a-maze", [{ filename: "solution.js", code: mockCode }], {
        v: 1,
        scenarios: 1,
        distance: 5,
        used_loop: 10,
        precision: 0
      });
    });

    it("does not re-run the tests to score progression", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockReturnValue(mockRunOutcome());

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(runTests).toHaveBeenCalledTimes(1);
    });

    it("submits all-zero scores (including the scenarios baseline) on the syntax-error path", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw syntaxError;
      });

      await manager.runCode(mockCode, progressionExercise);
      await flushMicrotasks();

      expect(mockStore.getState().setHasSyntaxError).toHaveBeenCalledWith(true);
      expect(submitLessonExercise).toHaveBeenCalledWith("solve-a-maze", [{ filename: "solution.js", code: mockCode }], {
        v: 3,
        scenarios: 0,
        distance: 0,
        used_loop: 0
      });
    });

    it("submits the v0 baseline on the syntax-error path when the exercise has no progression test", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw syntaxError;
      });

      await manager.runCode(mockCode, mockExercise);
      await flushMicrotasks();

      expect(submitLessonExercise).toHaveBeenCalledWith(
        "solve-a-maze",
        [{ filename: "solution.js", code: mockCode }],
        BASELINE_SCORES
      );
    });

    it("submits without scores when the run fails in an unexpected way", async () => {
      const manager = buildManager({ type: "lesson", slug: "solve-a-maze" });

      const { submitLessonExercise } = await import("@/lib/api/lessons");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");
      (runTests as jest.Mock).mockImplementation(() => {
        throw new Error("Some other error");
      });

      await expect(manager.runCode(mockCode, mockExercise)).rejects.toThrow("Some other error");
      await flushMicrotasks();

      expect(submitLessonExercise).toHaveBeenCalledWith(
        "solve-a-maze",
        [{ filename: "solution.js", code: mockCode }],
        undefined
      );
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
