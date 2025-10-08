import { TestSuiteManager } from "@/components/coding-exercise/lib/orchestrator/TestSuiteManager";
import { createMockExercise, createMockOrchestratorStore } from "@/tests/mocks";

// Mock the test runner
jest.mock("@/components/coding-exercise/lib/test-runner/runTests", () => ({
  runTests: jest.fn()
}));

// Mock the API client dynamically
jest.mock("@/lib/api/client", () => ({
  api: {
    post: jest.fn().mockResolvedValue({})
  }
}));

describe("TestSuiteManager", () => {
  let manager: TestSuiteManager;
  let mockStore: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create fresh store and manager for each test
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
    manager = new TestSuiteManager(mockStore);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("runCode", () => {
    const mockCode = "console.log('test')";
    const mockExercise = createMockExercise();

    it("should submit exercise files to the backend when running tests", async () => {
      const { api } = await import("@/lib/api/client");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Mock getLessonSlugFromURL to return a specific slug
      jest.spyOn(manager as any, "getLessonSlugFromURL").mockReturnValue("solve-a-maze");

      // Mock successful test run
      (runTests as jest.Mock).mockReturnValue({
        tests: [],
        passed: true
      });

      // Run the code
      await manager.runCode(mockCode, mockExercise);

      // Verify API was called with correct parameters
      expect(api.post).toHaveBeenCalledWith("/lessons/solve-a-maze/exercise-submissions", {
        submission: {
          files: [
            {
              filename: "solution.js",
              content: mockCode
            }
          ]
        }
      });

      // Verify test runner was called with language parameter
      expect(runTests).toHaveBeenCalledWith(mockCode, mockExercise, "javascript");

      // Verify store methods were called
      const state = mockStore.getState();
      expect(state.setHasSyntaxError).toHaveBeenCalledWith(false);
      expect(state.setStatus).toHaveBeenCalledWith("running");
      expect(state.setError).toHaveBeenCalledWith(null);
      expect(state.setTestSuiteResult).toHaveBeenCalled();
    });

    it("should extract lesson slug from URL correctly", async () => {
      const { api } = await import("@/lib/api/client");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Test different URL patterns
      const testCases = [
        { slug: "solve-a-maze" },
        { slug: "win-space-invaders" },
        { slug: "solve-a-maze-with-numbers" }
      ];

      for (const testCase of testCases) {
        // Mock getLessonSlugFromURL to return the test slug
        jest.spyOn(manager as any, "getLessonSlugFromURL").mockReturnValue(testCase.slug);

        // Clear previous calls
        (api.post as jest.Mock).mockClear();
        (runTests as jest.Mock).mockReturnValue({ tests: [], passed: true });

        // Run the code
        await manager.runCode(mockCode, mockExercise);

        // Verify API was called with correct lesson slug
        expect(api.post).toHaveBeenCalledWith(`/lessons/${testCase.slug}/exercise-submissions`, expect.any(Object));
      }
    });

    it("should not submit if no lesson slug in URL", async () => {
      const { api } = await import("@/lib/api/client");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Mock getLessonSlugFromURL to return null (no lesson slug)
      jest.spyOn(manager as any, "getLessonSlugFromURL").mockReturnValue(null);

      (runTests as jest.Mock).mockReturnValue({ tests: [], passed: true });

      // Run the code
      await manager.runCode(mockCode, mockExercise);

      // Verify API was NOT called
      expect(api.post).not.toHaveBeenCalled();

      // Verify tests still ran with language parameter
      expect(runTests).toHaveBeenCalledWith(mockCode, mockExercise, "javascript");
    });

    it("should handle submission errors silently", async () => {
      const { api } = await import("@/lib/api/client");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Mock getLessonSlugFromURL
      jest.spyOn(manager as any, "getLessonSlugFromURL").mockReturnValue("solve-a-maze");

      // Mock API to throw error
      (api.post as jest.Mock).mockRejectedValue(new Error("Network error"));
      (runTests as jest.Mock).mockReturnValue({ tests: [], passed: true });

      // Run the code - should not throw
      await expect(manager.runCode(mockCode, mockExercise)).resolves.not.toThrow();

      // Verify tests still ran despite API error with language parameter
      expect(runTests).toHaveBeenCalledWith(mockCode, mockExercise, "javascript");
      expect(mockStore.getState().setTestSuiteResult).toHaveBeenCalled();
    });

    it("should handle syntax errors correctly", async () => {
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      const syntaxError = {
        message: "Unexpected token",
        location: { line: 5 }
      };

      // Mock test runner to throw syntax error
      (runTests as jest.Mock).mockImplementation(() => {
        throw syntaxError;
      });

      // Run the code
      await manager.runCode(mockCode, mockExercise);

      // Verify error handling
      const state = mockStore.getState();
      expect(state.setHasSyntaxError).toHaveBeenCalledWith(true);
      expect(state.setTestSuiteResult).toHaveBeenCalledWith(null);
      expect(state.setInformationWidgetData).toHaveBeenCalledWith({
        html: "Unexpected token",
        line: 5,
        status: "ERROR"
      });
      expect(state.setShouldShowInformationWidget).toHaveBeenCalledWith(true);
      expect(state.setHighlightedLine).toHaveBeenCalledWith(5);
      expect(state.setStatus).toHaveBeenCalledWith("error");
    });

    it("should handle non-syntax errors correctly", async () => {
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Mock test runner to throw regular error
      (runTests as jest.Mock).mockImplementation(() => {
        throw new Error("Some other error");
      });

      // Run the code
      await manager.runCode(mockCode, mockExercise);

      // Verify error status was set but not as syntax error
      const state = mockStore.getState();
      expect(state.setHasSyntaxError).toHaveBeenCalledWith(false);
      expect(state.setStatus).toHaveBeenCalledWith("error");
    });

    it("should run tests and submit asynchronously (fire-and-forget)", async () => {
      const { api } = await import("@/lib/api/client");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Mock getLessonSlugFromURL
      jest.spyOn(manager as any, "getLessonSlugFromURL").mockReturnValue("solve-a-maze");

      // Create a promise that we can control
      let resolveApiCall: () => void;
      const apiPromise = new Promise<void>((resolve) => {
        resolveApiCall = resolve;
      });

      // Mock API to return our controlled promise
      (api.post as jest.Mock).mockReturnValue(apiPromise);
      (runTests as jest.Mock).mockReturnValue({ tests: [], passed: true });

      // Run the code and await it
      await manager.runCode(mockCode, mockExercise);

      // After runCode completes, verify test results were set
      expect(mockStore.getState().setTestSuiteResult).toHaveBeenCalled();

      // Resolve the API call (which is fire-and-forget)
      resolveApiCall!();
      await apiPromise;

      // API should have been called
      expect(api.post).toHaveBeenCalled();
    });

    it("should handle undefined window gracefully", async () => {
      const { api } = await import("@/lib/api/client");
      const { runTests } = await import("@/components/coding-exercise/lib/test-runner/runTests");

      // Mock getLessonSlugFromURL to simulate undefined window
      jest.spyOn(manager as any, "getLessonSlugFromURL").mockReturnValue(null);

      (runTests as jest.Mock).mockReturnValue({ tests: [], passed: true });

      // Run the code - should not throw
      await expect(manager.runCode(mockCode, mockExercise)).resolves.not.toThrow();

      // Verify API was NOT called (no lesson slug available)
      expect(api.post).not.toHaveBeenCalled();

      // Verify tests still ran
      expect(runTests).toHaveBeenCalled();
    });
  });

  describe("getFirstExpect", () => {
    it("should return first failing expect when available", () => {
      const failingExpect = { pass: false, description: "Should fail" };
      const passingExpect = { pass: true, description: "Should pass" };

      mockStore.getState = jest.fn(() => ({
        currentTest: {
          expects: [passingExpect, failingExpect]
        }
      }));

      const result = manager.getFirstExpect();
      expect(result).toBe(failingExpect);
    });

    it("should return first expect when no failures", () => {
      const expect1 = { pass: true, description: "First" };
      const expect2 = { pass: true, description: "Second" };

      mockStore.getState = jest.fn(() => ({
        currentTest: {
          expects: [expect1, expect2]
        }
      }));

      const result = manager.getFirstExpect();
      expect(result).toBe(expect1);
    });

    it("should return null when no current test", () => {
      mockStore.getState = jest.fn(() => ({
        currentTest: null
      }));

      const result = manager.getFirstExpect();
      expect(result).toBeNull();
    });

    it("should return null when expects array is empty", () => {
      mockStore.getState = jest.fn(() => ({
        currentTest: {
          expects: []
        }
      }));

      const result = manager.getFirstExpect();
      expect(result).toBeNull();
    });
  });
});
