import { TaskManager } from "@/components/coding-exercise/lib/orchestrator/TaskManager";
import type { ExerciseDefinition, Task, Scenario, TaskProgress } from "@jiki/curriculum";
import type { TestSuiteResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockStore } from "@/tests/mocks";

// Mock the SoundManager
jest.mock("@/lib/sound/SoundManager", () => {
  return {
    __esModule: true,
    default: {
      getInstance: () => ({
        play: jest.fn()
      })
    }
  };
});

// Mock data helpers
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
    logLines: [],
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

describe("TaskManager", () => {
  let taskManager: TaskManager;
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
    taskManager = new TaskManager(mockStore);
  });

  describe("initializeTaskProgress", () => {
    it("should initialize task progress for all tasks", () => {
      const tasks = [
        createMockTask({ id: "task-1", name: "First Task", bonus: false }),
        createMockTask({ id: "task-2", name: "Second Task", bonus: true })
      ];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-3", taskId: "task-2" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      expect(mockStore.getState().setTaskProgress).toHaveBeenCalledWith(expect.any(Map));

      const setTaskProgressCall = (mockStore.getState().setTaskProgress as jest.Mock).mock.calls[0][0];
      expect(setTaskProgressCall.size).toBe(2);

      const task1Progress = setTaskProgressCall.get("task-1");
      expect(task1Progress).toEqual({
        taskId: "task-1",
        status: "not-started",
        passedScenarios: [],
        totalScenarios: 2
      });

      const task2Progress = setTaskProgressCall.get("task-2");
      expect(task2Progress).toEqual({
        taskId: "task-2",
        status: "not-started",
        passedScenarios: [],
        totalScenarios: 1
      });
    });

    it("should use requiredScenarios when provided", () => {
      const tasks = [
        createMockTask({
          id: "task-1",
          requiredScenarios: ["specific-scenario-1", "specific-scenario-2"]
        })
      ];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-3", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });

      taskManager.initializeTaskProgress(exercise);

      const setTaskProgressCall = (mockStore.getState().setTaskProgress as jest.Mock).mock.calls[0][0];
      const task1Progress = setTaskProgressCall.get("task-1");
      expect(task1Progress.totalScenarios).toBe(2);
    });

    it("should set first non-bonus task as current", () => {
      const tasks = [
        createMockTask({ id: "bonus-task", bonus: true }),
        createMockTask({ id: "regular-task", bonus: false }),
        createMockTask({ id: "another-task", bonus: false })
      ];
      const exercise = createMockExercise({ tasks, scenarios: [] });

      taskManager.initializeTaskProgress(exercise);

      expect(mockStore.getState().setCurrentTaskId).toHaveBeenCalledWith("regular-task");
    });

    it("should set first bonus task as current if all tasks are bonus", () => {
      const tasks = [
        createMockTask({ id: "bonus-task-1", bonus: true }),
        createMockTask({ id: "bonus-task-2", bonus: true })
      ];
      const exercise = createMockExercise({ tasks, scenarios: [] });

      taskManager.initializeTaskProgress(exercise);

      expect(mockStore.getState().setCurrentTaskId).toHaveBeenCalledWith("bonus-task-1");
    });

    it("should initialize empty completed tasks set", () => {
      const exercise = createMockExercise();

      taskManager.initializeTaskProgress(exercise);

      expect(mockStore.getState().setCompletedTasks).toHaveBeenCalledWith(new Set());
    });
  });

  describe("updateTaskProgress", () => {
    beforeEach(() => {
      // Set up initial task progress in mock store
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set("task-1", {
        taskId: "task-1",
        status: "not-started",
        passedScenarios: [],
        totalScenarios: 2
      });

      mockStore = createMockStore({
        taskProgress,
        completedTasks: new Set()
      });
      taskManager = new TaskManager(mockStore);
    });

    it("should update task progress when scenarios pass", () => {
      const tasks = [createMockTask({ id: "task-1" })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });
      const testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "fail")
      ]);

      taskManager.updateTaskProgress(testResults, exercise);

      const setStateCall = (mockStore.setState as jest.Mock).mock.calls[0][0];
      const newState = setStateCall({});
      const updatedProgress = newState.taskProgress.get("task-1");

      expect(updatedProgress.status).toBe("in-progress");
      expect(updatedProgress.passedScenarios).toEqual(["scenario-1"]);
      expect(updatedProgress.totalScenarios).toBe(2);
    });

    it("should mark task as completed when all scenarios pass", () => {
      const tasks = [createMockTask({ id: "task-1" })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });
      const testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "pass")
      ]);

      taskManager.updateTaskProgress(testResults, exercise);

      const setStateCall = (mockStore.setState as jest.Mock).mock.calls[0][0];
      const newState = setStateCall({});
      const updatedProgress = newState.taskProgress.get("task-1");

      expect(updatedProgress.status).toBe("completed");
      expect(updatedProgress.passedScenarios).toEqual(["scenario-1", "scenario-2"]);
      expect(typeof updatedProgress.completedAt).toBe("string");
      expect(updatedProgress.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      expect(newState.completedTasks.has("task-1")).toBe(true);
    });

    it("should preserve completedAt date when task remains completed", () => {
      const completedDate = "2023-01-01T00:00:00.000Z";
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set("task-1", {
        taskId: "task-1",
        status: "completed",
        passedScenarios: ["scenario-1", "scenario-2"],
        totalScenarios: 2,
        completedAt: completedDate
      });

      mockStore = createMockStore({
        taskProgress,
        completedTasks: new Set(["task-1"])
      });
      taskManager = new TaskManager(mockStore);

      const tasks = [createMockTask({ id: "task-1" })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });
      const testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "pass")
      ]);

      taskManager.updateTaskProgress(testResults, exercise);

      const setStateCall = (mockStore.setState as jest.Mock).mock.calls[0][0];
      const newState = setStateCall({});
      const updatedProgress = newState.taskProgress.get("task-1");

      expect(updatedProgress.completedAt).toBe(completedDate);
    });

    it("should remove task from completed set when scenarios fail", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set("task-1", {
        taskId: "task-1",
        status: "completed",
        passedScenarios: ["scenario-1", "scenario-2"],
        totalScenarios: 2,
        completedAt: new Date().toISOString()
      });

      mockStore = createMockStore({
        taskProgress,
        completedTasks: new Set(["task-1"])
      });
      taskManager = new TaskManager(mockStore);

      const tasks = [createMockTask({ id: "task-1" })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-1" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });
      const testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "fail")
      ]);

      taskManager.updateTaskProgress(testResults, exercise);

      const setStateCall = (mockStore.setState as jest.Mock).mock.calls[0][0];
      const newState = setStateCall({});
      expect(newState.completedTasks.has("task-1")).toBe(false);
    });

    it("should handle multiple tasks correctly", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set("task-1", {
        taskId: "task-1",
        status: "not-started",
        passedScenarios: [],
        totalScenarios: 1
      });
      taskProgress.set("task-2", {
        taskId: "task-2",
        status: "not-started",
        passedScenarios: [],
        totalScenarios: 1
      });

      mockStore = createMockStore({
        taskProgress,
        completedTasks: new Set()
      });
      taskManager = new TaskManager(mockStore);

      const tasks = [createMockTask({ id: "task-1" }), createMockTask({ id: "task-2" })];
      const scenarios = [
        createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
        createMockScenario({ slug: "scenario-2", taskId: "task-2" })
      ];
      const exercise = createMockExercise({ tasks, scenarios });
      const testResults = createMockTestSuiteResult([
        createMockTestResult("scenario-1", "pass"),
        createMockTestResult("scenario-2", "fail")
      ]);

      taskManager.updateTaskProgress(testResults, exercise);

      const setStateCall = (mockStore.setState as jest.Mock).mock.calls[0][0];
      const newState = setStateCall({});

      expect(newState.taskProgress.get("task-1").status).toBe("completed");
      expect(newState.taskProgress.get("task-2").status).toBe("not-started");

      expect(newState.completedTasks.has("task-1")).toBe(true);
      expect(newState.completedTasks.has("task-2")).toBe(false);
    });
  });

  describe("getTaskCompletionStatus", () => {
    it("should return correct status from store", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set("task-1", {
        taskId: "task-1",
        status: "in-progress",
        passedScenarios: ["scenario-1"],
        totalScenarios: 2
      });

      mockStore = createMockStore({ taskProgress });
      taskManager = new TaskManager(mockStore);

      expect(taskManager.getTaskCompletionStatus("task-1")).toBe("in-progress");
    });

    it("should return not-started for unknown task", () => {
      expect(taskManager.getTaskCompletionStatus("unknown-task")).toBe("not-started");
    });
  });

  describe("getTaskProgress", () => {
    it("should return task progress from store", () => {
      const progress: TaskProgress = {
        taskId: "task-1",
        status: "in-progress",
        passedScenarios: ["scenario-1"],
        totalScenarios: 2
      };
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set("task-1", progress);

      mockStore = createMockStore({ taskProgress });
      taskManager = new TaskManager(mockStore);

      expect(taskManager.getTaskProgress("task-1")).toBe(progress);
    });

    it("should return null for unknown task", () => {
      expect(taskManager.getTaskProgress("unknown-task")).toBeNull();
    });
  });

  describe("isTaskCompleted", () => {
    it("should return true for completed task", () => {
      mockStore = createMockStore({
        completedTasks: new Set(["task-1"])
      });
      taskManager = new TaskManager(mockStore);

      expect(taskManager.isTaskCompleted("task-1")).toBe(true);
    });

    it("should return false for non-completed task", () => {
      mockStore = createMockStore({
        completedTasks: new Set()
      });
      taskManager = new TaskManager(mockStore);

      expect(taskManager.isTaskCompleted("task-1")).toBe(false);
    });
  });

  describe("getCompletedTaskIds", () => {
    it("should return array of completed task IDs", () => {
      mockStore = createMockStore({
        completedTasks: new Set(["task-1", "task-3"])
      });
      taskManager = new TaskManager(mockStore);

      const completed = taskManager.getCompletedTaskIds();
      expect(completed).toEqual(expect.arrayContaining(["task-1", "task-3"]));
      expect(completed).toHaveLength(2);
    });

    it("should return empty array when no tasks completed", () => {
      expect(taskManager.getCompletedTaskIds()).toEqual([]);
    });
  });

  describe("setCurrentTask", () => {
    it("should call store action to set current task", () => {
      taskManager.setCurrentTask("task-2");

      expect(mockStore.getState().setCurrentTaskId).toHaveBeenCalledWith("task-2");
    });
  });

  describe("private methods", () => {
    describe("determineTaskStatus", () => {
      it("should return completed when all required scenarios pass", () => {
        const requiredScenarios = ["scenario-1", "scenario-2"];
        const passedScenarios = ["scenario-1", "scenario-2"];

        // Access private method via bracket notation
        const status = taskManager["determineTaskStatus"](requiredScenarios, passedScenarios);
        expect(status).toBe("completed");
      });

      it("should return in-progress when some scenarios pass", () => {
        const requiredScenarios = ["scenario-1", "scenario-2"];
        const passedScenarios = ["scenario-1"];

        const status = taskManager["determineTaskStatus"](requiredScenarios, passedScenarios);
        expect(status).toBe("in-progress");
      });

      it("should return not-started when no scenarios pass", () => {
        const requiredScenarios = ["scenario-1", "scenario-2"];
        const passedScenarios: string[] = [];

        const status = taskManager["determineTaskStatus"](requiredScenarios, passedScenarios);
        expect(status).toBe("not-started");
      });
    });

    describe("groupScenariosByTask", () => {
      it("should group scenarios by taskId", () => {
        const scenarios = [
          createMockScenario({ slug: "scenario-1", taskId: "task-1" }),
          createMockScenario({ slug: "scenario-2", taskId: "task-1" }),
          createMockScenario({ slug: "scenario-3", taskId: "task-2" })
        ];
        const exercise = createMockExercise({ scenarios });

        const grouped = taskManager["groupScenariosByTask"](exercise);

        expect(grouped.size).toBe(2);
        expect(grouped.get("task-1")).toHaveLength(2);
        expect(grouped.get("task-2")).toHaveLength(1);
        expect(grouped.get("task-1")![0].slug).toBe("scenario-1");
        expect(grouped.get("task-1")![1].slug).toBe("scenario-2");
        expect(grouped.get("task-2")![0].slug).toBe("scenario-3");
      });
    });

    describe("getPassedScenariosForTask", () => {
      it("should return only passed scenarios from required list", () => {
        const testResults = createMockTestSuiteResult([
          createMockTestResult("scenario-1", "pass"),
          createMockTestResult("scenario-2", "fail"),
          createMockTestResult("scenario-3", "pass")
        ]);
        const requiredScenarios = ["scenario-1", "scenario-2"];

        const passed = taskManager["getPassedScenariosForTask"](testResults, requiredScenarios);

        expect(passed).toEqual(["scenario-1"]);
      });

      it("should return empty array when no scenarios pass", () => {
        const testResults = createMockTestSuiteResult([
          createMockTestResult("scenario-1", "fail"),
          createMockTestResult("scenario-2", "fail")
        ]);
        const requiredScenarios = ["scenario-1", "scenario-2"];

        const passed = taskManager["getPassedScenariosForTask"](testResults, requiredScenarios);

        expect(passed).toEqual([]);
      });
    });

    describe("updateCompletedTasksSet", () => {
      it("should add task when newly completed", () => {
        const completedTasks = new Set<string>();

        taskManager["updateCompletedTasksSet"](completedTasks, "task-1", true);

        expect(completedTasks.has("task-1")).toBe(true);
      });

      it("should remove task when no longer completed", () => {
        const completedTasks = new Set<string>(["task-1"]);

        taskManager["updateCompletedTasksSet"](completedTasks, "task-1", false);

        expect(completedTasks.has("task-1")).toBe(false);
      });
    });
  });
});
