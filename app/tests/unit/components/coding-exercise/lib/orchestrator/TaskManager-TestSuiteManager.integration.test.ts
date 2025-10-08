import { TestSuiteManager } from "@/components/coding-exercise/lib/orchestrator/TestSuiteManager";
import { TaskManager } from "@/components/coding-exercise/lib/orchestrator/TaskManager";
import type { ExerciseDefinition, Task, Scenario, TaskProgress } from "@jiki/curriculum";
import type { TestSuiteResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockStore } from "@/tests/mocks";

// Mock the test runner
jest.mock("@/components/coding-exercise/lib/test-runner/runTests", () => ({
  runTests: jest.fn()
}));

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  api: {
    post: jest.fn().mockResolvedValue({})
  }
}));

import { runTests } from "@/components/coding-exercise/lib/test-runner/runTests";

const mockRunTests = runTests as jest.MockedFunction<typeof runTests>;

// Helper functions to create mock data
function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    name: "Test Task",
    bonus: false,
    ...overrides
  };
}

function createMockScenario(overrides: Partial<Scenario> = {}): Scenario {
  return {
    slug: "scenario-1",
    name: "Test Scenario",
    description: "Test description",
    taskId: "task-1",
    setup: jest.fn(),
    expectations: jest.fn(),
    ...overrides
  };
}

function createMockExercise(overrides: Partial<ExerciseDefinition> = {}): ExerciseDefinition {
  return {
    slug: "test-exercise",
    title: "Test Exercise",
    instructions: "Test instructions",
    estimatedMinutes: 5,
    levelId: "level-1",
    initialCode: "// Test code",
    ExerciseClass: class TestExercise {} as any,
    tasks: [createMockTask()],
    scenarios: [createMockScenario()],
    ...overrides
  };
}

function createMockTestResult(slug: string, status: "pass" | "fail" = "pass") {
  return {
    slug,
    name: slug,
    status,
    passed: status === "pass",
    expects: [],
    frames: [],
    view: {} as any,
    animationTimeline: {} as any
  };
}

function createMockTestSuiteResult(tests: ReturnType<typeof createMockTestResult>[] = []): TestSuiteResult {
  const hasFailures = tests.some((t) => t.status === "fail");
  return {
    tests,
    status: hasFailures ? "fail" : "pass"
  };
}

describe("TaskManager and TestSuiteManager Integration", () => {
  let taskManager: TaskManager;
  let testSuiteManager: TestSuiteManager;
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create store with initial state for task management
    mockStore = createMockStore({
      taskProgress: new Map(),
      completedTasks: new Set(),
      currentTaskId: null
    });

    // Override store getState to properly track updates
    let currentTaskProgress = new Map<string, TaskProgress>();
    let currentCompletedTasks = new Set<string>();
    let currentTaskId: string | null = null;

    (mockStore.getState().setTaskProgress as jest.Mock).mockImplementation((taskProgress) => {
      currentTaskProgress = new Map(taskProgress);
    });

    (mockStore.getState().setCompletedTasks as jest.Mock).mockImplementation((completedTasks) => {
      currentCompletedTasks = new Set(completedTasks);
    });

    (mockStore.getState().setCurrentTaskId as jest.Mock).mockImplementation((taskId) => {
      currentTaskId = taskId;
    });

    // Override getState to return current state
    const originalGetState = mockStore.getState;
    mockStore.getState = jest.fn(() => ({
      ...originalGetState(),
      taskProgress: currentTaskProgress,
      completedTasks: currentCompletedTasks,
      currentTaskId: currentTaskId
    })) as any;

    taskManager = new TaskManager(mockStore);
    testSuiteManager = new TestSuiteManager(mockStore, taskManager);
  });

  describe("Integration flow", () => {
    it("should update task progress when test suite runs successfully", async () => {
      // Set up exercise with tasks and scenarios
      const tasks = [
        createMockTask({
          id: "task-1",
          name: "Move Character",
          requiredScenarios: ["scenario-1", "scenario-2"]
        }),
        createMockTask({
          id: "task-2",
          name: "Bonus Task",
          bonus: true,
          requiredScenarios: ["scenario-3"]
        })
      ];

      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-3", taskId: "task-2" })
      ];

      const exercise = createMockExercise({ tasks, scenarios });

      // Initialize task progress
      taskManager.initializeTaskProgress(exercise);

      // Mock test results - task-1 partially complete, task-2 complete
      const testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "fail"),
        createMockTestResult("scenario-3", "pass")
      ]);

      mockRunTests.mockReturnValue(testResults);

      // Run tests through TestSuiteManager
      await testSuiteManager.runCode("// test code", exercise);

      // Verify that TaskManager.updateTaskProgress was called
      expect(mockStore.setState).toHaveBeenCalled();

      // Check the actual task progress state from setState calls
      const setStateCalls = (mockStore.setState as jest.Mock).mock.calls;
      const lastSetStateCall = setStateCalls[setStateCalls.length - 1];
      const finalState = lastSetStateCall[0]({});
      const finalTaskProgress = finalState.taskProgress;

      // Task 1 should be in-progress (1/2 scenarios passed)
      const task1Progress = finalTaskProgress.get("task-1");
      expect(task1Progress?.status).toBe("in-progress");
      expect(task1Progress?.passedScenarios).toEqual(["scenario-1"]);
      expect(task1Progress?.totalScenarios).toBe(2);

      // Task 2 should be completed (1/1 scenarios passed)
      const task2Progress = finalTaskProgress.get("task-2");
      expect(task2Progress?.status).toBe("completed");
      expect(task2Progress?.passedScenarios).toEqual(["scenario-3"]);
      expect(task2Progress?.totalScenarios).toBe(1);

      // Check completed tasks set from setState
      const finalCompletedTasks = finalState.completedTasks;

      expect(finalCompletedTasks.has("task-1")).toBe(false);
      expect(finalCompletedTasks.has("task-2")).toBe(true);
    });

    it("should handle test failures gracefully", async () => {
      const tasks = [createMockTask({ id: "task-1" })];
      const scenarios = [createMockScenario({ slug: "scenario-1", taskId: "task-1" })];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      // Mock test results with all failures
      const testResults = createMockTestSuiteResult([createMockTestResult("scenario-1", "fail")]);

      mockRunTests.mockReturnValue(testResults);

      await testSuiteManager.runCode("// test code", exercise);

      // Verify task remains not-started
      const setStateCalls = (mockStore.setState as jest.Mock).mock.calls;
      const lastSetStateCall = setStateCalls[setStateCalls.length - 1];
      const finalState = lastSetStateCall[0]({});
      const finalTaskProgress = finalState.taskProgress;

      const task1Progress = finalTaskProgress.get("task-1");
      expect(task1Progress?.status).toBe("not-started");
      expect(task1Progress?.passedScenarios).toEqual([]);
    });

    it("should handle syntax errors without crashing task progress", async () => {
      const exercise = createMockExercise();
      taskManager.initializeTaskProgress(exercise);

      // Mock a syntax error
      mockRunTests.mockImplementation(() => {
        throw new Error("Syntax error in code");
      });

      await testSuiteManager.runCode("invalid code", exercise);

      // Verify error handling
      expect(mockStore.getState().setStatus).toHaveBeenCalledWith("error");

      // Task progress should remain in initialized state
      const initializeCalls = (mockStore.getState().setTaskProgress as jest.Mock).mock.calls;
      expect(initializeCalls).toHaveLength(1); // Only the initialization call
    });

    it("should work without TaskManager (backward compatibility)", async () => {
      // Create TestSuiteManager without TaskManager
      const testSuiteManagerWithoutTaskManager = new TestSuiteManager(mockStore);

      const exercise = createMockExercise();
      const testResults = createMockTestSuiteResult([]);
      mockRunTests.mockReturnValue(testResults);

      // Should not throw error
      await expect(testSuiteManagerWithoutTaskManager.runCode("// code", exercise)).resolves.not.toThrow();

      // Should still set test results
      expect(mockStore.getState().setTestSuiteResult).toHaveBeenCalledWith(testResults);
    });

    it("should handle complex scenario with multiple test runs", async () => {
      const tasks = [createMockTask({ id: "task-1", requiredScenarios: ["scenario-1", "scenario-2"] })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      // First test run - no passes
      let testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "fail"),
        createMockTestResult("scenario-2", "fail")
      ]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// code v1", exercise);

      // Second test run - partial success
      testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "fail")
      ]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// code v2", exercise);

      // Third test run - full success
      testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "pass")
      ]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// code v3", exercise);

      // Verify final state is completed
      const setStateCalls = (mockStore.setState as jest.Mock).mock.calls;
      const lastSetStateCall = setStateCalls[setStateCalls.length - 1];
      const finalState = lastSetStateCall[0]({});
      const finalTaskProgress = finalState.taskProgress;

      const task1Progress = finalTaskProgress.get("task-1");
      expect(task1Progress?.status).toBe("completed");
      expect(task1Progress?.passedScenarios).toEqual(["scenario-1", "scenario-2"]);
      expect(task1Progress?.completedAt).toBeInstanceOf(Date);
    });

    it("should handle edge case where task becomes incomplete after being complete", async () => {
      const tasks = [createMockTask({ id: "task-1", requiredScenarios: ["scenario-1", "scenario-2"] })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      // First run - complete task
      let testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "pass")
      ]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// complete code", exercise);

      // Second run - task becomes incomplete due to code changes
      testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "fail")
      ]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// broken code", exercise);

      // Verify task is now in-progress and removed from completed set
      const setStateCalls = (mockStore.setState as jest.Mock).mock.calls;
      const lastSetStateCall = setStateCalls[setStateCalls.length - 1];
      const finalState = lastSetStateCall[0]({});
      const finalTaskProgress = finalState.taskProgress;

      const task1Progress = finalTaskProgress.get("task-1");
      expect(task1Progress?.status).toBe("in-progress");

      const finalCompletedTasks = finalState.completedTasks;

      expect(finalCompletedTasks.has("task-1")).toBe(false);
    });
  });

  describe("Task progress edge cases", () => {
    it("should handle tasks with no required scenarios", async () => {
      const tasks = [createMockTask({ id: "task-1", requiredScenarios: [] })];
      const scenarios: Scenario[] = [];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      const testResults = createMockTestSuiteResult([]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// code", exercise);

      const setStateCalls = (mockStore.setState as jest.Mock).mock.calls;
      const lastSetStateCall = setStateCalls[setStateCalls.length - 1];
      const finalState = lastSetStateCall[0]({});
      const finalTaskProgress = finalState.taskProgress;

      const task1Progress = finalTaskProgress.get("task-1");
      expect(task1Progress?.status).toBe("not-started"); // No scenarios to pass means not-started
      expect(task1Progress?.totalScenarios).toBe(0);
    });

    it("should handle scenarios that don't match any test results", async () => {
      const tasks = [createMockTask({ id: "task-1", requiredScenarios: ["missing-scenario"] })];
      const scenarios = [createMockScenario({ slug: "missing-scenario", taskId: "task-1" })];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      // Test results don't include the required scenario
      const testResults = createMockTestSuiteResult([createMockTestResult("different-scenario", "pass")]);
      mockRunTests.mockReturnValue(testResults);
      await testSuiteManager.runCode("// code", exercise);

      const setStateCalls = (mockStore.setState as jest.Mock).mock.calls;
      const lastSetStateCall = setStateCalls[setStateCalls.length - 1];
      const finalState = lastSetStateCall[0]({});
      const finalTaskProgress = finalState.taskProgress;

      const task1Progress = finalTaskProgress.get("task-1");
      expect(task1Progress?.status).toBe("not-started");
      expect(task1Progress?.passedScenarios).toEqual([]);
    });
  });
});
