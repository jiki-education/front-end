// @ts-nocheck - Test file with extensive mocking
import TasksView from "@/components/coding-exercise/ui/TasksView";
import type { Orchestrator } from "@/components/coding-exercise/lib/Orchestrator";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/orchestrator/store";
import type { Task, TaskProgress } from "@jiki/curriculum";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the orchestrator store hook
jest.mock("@/components/coding-exercise/lib/orchestrator/store", () => ({
  useOrchestratorStore: jest.fn()
}));

const mockUseOrchestratorStore = useOrchestratorStore as jest.MockedFunction<typeof useOrchestratorStore>;

// Helper functions to create mock data
function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    name: "Test Task",
    bonus: false,
    ...overrides
  };
}

function createMockProgress(overrides: Partial<TaskProgress> = {}): TaskProgress {
  return {
    taskId: "task-1",
    status: "not-started",
    passedScenarios: [],
    totalScenarios: 2,
    ...overrides
  };
}

function createMockOrchestrator(): Orchestrator {
  return {
    setCurrentTask: jest.fn()
  } as unknown as Orchestrator;
}

// Helper to create mock hook return value
function createMockHookState(
  overrides: {
    taskProgress?: Map<string, TaskProgress>;
    completedTasks?: Set<string>;
    currentTaskId?: string | null;
  } = {}
) {
  return {
    taskProgress: overrides.taskProgress || new Map<string, TaskProgress>(),
    completedTasks: overrides.completedTasks || new Set<string>(),
    currentTaskId: overrides.currentTaskId !== undefined ? overrides.currentTaskId : null
  };
}

describe("TasksView", () => {
  let mockOrchestrator: Orchestrator;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOrchestrator = createMockOrchestrator();

    // Default mock implementation
    mockUseOrchestratorStore.mockReturnValue(createMockHookState());
  });

  describe("Empty state", () => {
    it("should display no tasks message when tasks array is undefined", () => {
      render(<TasksView tasks={undefined} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("No tasks available for this exercise.")).toBeInTheDocument();
    });

    it("should display no tasks message when tasks array is empty", () => {
      render(<TasksView tasks={[]} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("No tasks available for this exercise.")).toBeInTheDocument();
    });

    it("should apply custom className to container", () => {
      const { container } = render(<TasksView tasks={[]} orchestrator={mockOrchestrator} className="custom-class" />);

      expect(container.firstChild).toHaveClass("p-4", "custom-class");
    });
  });

  describe("Task rendering", () => {
    it("should render basic task information", () => {
      const tasks = [
        createMockTask({ id: "task-1", name: "First Task" }),
        createMockTask({ id: "task-2", name: "Second Task" })
      ];

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("First Task")).toBeInTheDocument();
      expect(screen.getByText("Second Task")).toBeInTheDocument();
    });

    it("should display bonus badge for bonus tasks", () => {
      const tasks = [
        createMockTask({ id: "task-1", name: "Regular Task", bonus: false }),
        createMockTask({ id: "task-2", name: "Bonus Task", bonus: true })
      ];

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("Bonus")).toBeInTheDocument();
      expect(screen.getByText("Bonus")).toHaveClass("bg-yellow-100", "text-yellow-700");
    });

    it("should display task description when provided", () => {
      const tasks = [
        createMockTask({
          id: "task-1",
          name: "Task with Description",
          description: "This is a task description"
        })
      ];

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("This is a task description")).toBeInTheDocument();
    });

    it("should not display description section when description is not provided", () => {
      const tasks = [createMockTask({ id: "task-1", name: "Task" })];

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
    });
  });

  describe("Task status and progress", () => {
    it("should display progress counter", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          taskId: "task-1",
          passedScenarios: ["scenario-1"],
          totalScenarios: 3
        })
      );

      mockUseOrchestratorStore.mockReturnValue(createMockHookState({ taskProgress }));

      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("1/3")).toBeInTheDocument();
    });

    it("should not display progress counter when totalScenarios is 0", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          taskId: "task-1",
          totalScenarios: 0
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.queryByText("0/0")).not.toBeInTheDocument();
    });

    it("should display progress bar for in-progress tasks", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          taskId: "task-1",
          status: "in-progress",
          passedScenarios: ["scenario-1"],
          totalScenarios: 4
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const progressBar = container.querySelector(".bg-blue-500");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle("width: 25%"); // 1/4 = 25%
    });

    it("should not display progress bar for not-started tasks", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          taskId: "task-1",
          status: "not-started"
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(container.querySelector(".bg-blue-500")).not.toBeInTheDocument();
    });

    it("should not display progress bar for completed tasks", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          taskId: "task-1",
          status: "completed"
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(["task-1"]),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(container.querySelector(".bg-blue-500")).not.toBeInTheDocument();
    });
  });

  describe("Task text styling", () => {
    it("should apply completed styling for completed tasks", () => {
      mockUseOrchestratorStore.mockReturnValue({
        taskProgress: new Map(),
        completedTasks: new Set(["task-1"]),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1", name: "Completed Task" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const taskName = screen.getByText("Completed Task");
      expect(taskName).toHaveClass("text-green-700", "font-medium");
    });

    it("should apply in-progress styling for in-progress tasks", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          status: "in-progress"
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1", name: "In Progress Task" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const taskName = screen.getByText("In Progress Task");
      expect(taskName).toHaveClass("text-blue-700");
    });

    it("should apply default styling for not-started tasks", () => {
      const tasks = [createMockTask({ id: "task-1", name: "Not Started Task" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const taskName = screen.getByText("Not Started Task");
      expect(taskName).toHaveClass("text-gray-700");
    });
  });

  describe("Current task highlighting", () => {
    it("should highlight current task with blue background", () => {
      mockUseOrchestratorStore.mockReturnValue({
        taskProgress: new Map(),
        completedTasks: new Set(),
        currentTaskId: "task-1"
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const taskContainer = container.querySelector(".bg-blue-50");
      expect(taskContainer).toBeInTheDocument();
      expect(taskContainer).toHaveClass(
        "bg-blue-50",
        "border-l-4",
        "border-blue-400",
        "-mx-2",
        "px-2",
        "py-2",
        "rounded-r",
        "shadow-sm"
      );
    });

    it("should not highlight non-current tasks", () => {
      mockUseOrchestratorStore.mockReturnValue({
        taskProgress: new Map(),
        completedTasks: new Set(),
        currentTaskId: "task-2"
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(container.querySelector(".bg-blue-50")).not.toBeInTheDocument();
    });
  });

  describe("Task interactions", () => {
    it("should call setCurrentTask when task is clicked", () => {
      const tasks = [createMockTask({ id: "task-1", name: "Clickable Task" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const taskElement = screen.getByText("Clickable Task").closest("div");
      fireEvent.click(taskElement!);

      expect(mockOrchestrator.setCurrentTask).toHaveBeenCalledWith("task-1");
    });

    it("should apply hover styling", () => {
      const tasks = [createMockTask({ id: "task-1", name: "Hoverable Task" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const taskContainer = container.querySelector(".cursor-pointer");
      expect(taskContainer).toHaveClass("cursor-pointer", "transition-all", "hover:opacity-80");
    });
  });

  describe("TaskStatusIndicator", () => {
    it("should show checkmark for completed tasks", () => {
      mockUseOrchestratorStore.mockReturnValue({
        taskProgress: new Map(),
        completedTasks: new Set(["task-1"]),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("✓")).toBeInTheDocument();
      expect(screen.getByText("✓").closest("span")).toHaveClass("bg-green-500", "text-white");
    });

    it("should show numbered indicator for in-progress tasks", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          status: "in-progress"
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("1").closest("span")).toHaveClass(
        "border-2",
        "border-blue-500",
        "bg-blue-50",
        "text-blue-700"
      );
    });

    it("should show numbered indicator for not-started tasks", () => {
      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("1").closest("span")).toHaveClass("bg-gray-200", "text-gray-700");
    });

    it("should show ring around current task indicator", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          status: "in-progress"
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: "task-1"
      });

      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("1").closest("span")).toHaveClass("ring-2", "ring-blue-300");
    });

    it("should show ring around current not-started task indicator", () => {
      mockUseOrchestratorStore.mockReturnValue({
        taskProgress: new Map(),
        completedTasks: new Set(),
        currentTaskId: "task-1"
      });

      const tasks = [createMockTask({ id: "task-1" })];
      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("1").closest("span")).toHaveClass("ring-2", "ring-gray-300");
    });

    it("should display correct task numbers", () => {
      const tasks = [
        createMockTask({ id: "task-1", name: "First" }),
        createMockTask({ id: "task-2", name: "Second" }),
        createMockTask({ id: "task-3", name: "Third" })
      ];

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should handle multiple tasks with different states", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-2",
        createMockProgress({
          taskId: "task-2",
          status: "in-progress",
          passedScenarios: ["scenario-1"],
          totalScenarios: 2
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(["task-3"]),
        currentTaskId: "task-1"
      });

      const tasks = [
        createMockTask({ id: "task-1", name: "Current Not Started", bonus: false }),
        createMockTask({ id: "task-2", name: "In Progress Task", bonus: false }),
        createMockTask({ id: "task-3", name: "Completed Task", bonus: true })
      ];

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      // Check task 1 (current, not-started)
      const currentTaskContainer = screen.getByText("Current Not Started").closest(".flex-1");
      expect(currentTaskContainer).toHaveClass("bg-blue-50");
      expect(screen.getByText("Current Not Started")).toHaveClass("text-gray-700");

      // Check task 2 (in-progress)
      expect(screen.getByText("In Progress Task")).toHaveClass("text-blue-700");
      expect(screen.getByText("1/2")).toBeInTheDocument();

      // Check task 3 (completed, bonus)
      expect(screen.getByText("Completed Task")).toHaveClass("text-green-700", "font-medium");
      expect(screen.getByText("Bonus")).toBeInTheDocument();
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("should handle tasks without progress data gracefully", () => {
      const tasks = [createMockTask({ id: "unknown-task", name: "Unknown Task" })];

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress: new Map(), // Empty map
        completedTasks: new Set(),
        currentTaskId: null
      });

      render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      expect(screen.getByText("Unknown Task")).toBeInTheDocument();
      expect(screen.getByText("Unknown Task")).toHaveClass("text-gray-700");
      expect(screen.getByText("1")).toBeInTheDocument(); // Shows task number
    });

    it("should handle edge case of 100% progress bar", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          status: "in-progress",
          passedScenarios: ["scenario-1", "scenario-2"],
          totalScenarios: 2
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const progressBar = container.querySelector(".bg-blue-500");
      expect(progressBar).toHaveStyle("width: 100%");
    });

    it("should handle division by zero edge case with in-progress task having 0 total scenarios", () => {
      const taskProgress = new Map<string, TaskProgress>();
      taskProgress.set(
        "task-1",
        createMockProgress({
          status: "in-progress",
          passedScenarios: [],
          totalScenarios: 0
        })
      );

      mockUseOrchestratorStore.mockReturnValue({
        taskProgress,
        completedTasks: new Set(),
        currentTaskId: null
      });

      const tasks = [createMockTask({ id: "task-1" })];
      const { container } = render(<TasksView tasks={tasks} orchestrator={mockOrchestrator} />);

      const progressBar = container.querySelector(".bg-blue-500");
      expect(progressBar).toHaveStyle("width: 0%");
    });
  });
});
