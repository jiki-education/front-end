import type { ExerciseDefinition, TaskProgress, Scenario } from "@jiki/curriculum";
import type { StoreApi } from "zustand/vanilla";
import type { TestSuiteResult } from "../test-results-types";
import type { OrchestratorStore } from "../types";
import SoundManager from "@/lib/sound/SoundManager";

/**
 * Manages task completion status and progress tracking
 */
export class TaskManager {
  private readonly soundManager: SoundManager;

  constructor(private readonly store: StoreApi<OrchestratorStore>) {
    this.soundManager = SoundManager.getInstance();
  }

  /**
   * Initialize task progress for an exercise
   */
  initializeTaskProgress(exercise: ExerciseDefinition): void {
    const state = this.store.getState();
    const taskProgress = new Map<string, TaskProgress>();

    // Initialize progress for each task
    for (const task of exercise.tasks) {
      const requiredScenarios = this.getRequiredScenarios(task, exercise);

      taskProgress.set(task.id, {
        taskId: task.id,
        status: "not-started",
        passedScenarios: [],
        totalScenarios: requiredScenarios.length
      });
    }

    // Update store with task state
    state.setTaskProgress(taskProgress);
    state.setCompletedTasks(new Set());

    // Set first incomplete task as current
    this.setCurrentTaskToFirstIncomplete(exercise);
  }

  /**
   * Set the current task to the first incomplete task
   */
  private setCurrentTaskToFirstIncomplete(exercise: ExerciseDefinition): void {
    const state = this.store.getState();
    const firstIncompleteTask = this.findFirstIncompleteTask(exercise, state.completedTasks);

    if (firstIncompleteTask) {
      state.setCurrentTaskId(firstIncompleteTask.id);
    }

    // Tasks will be recalculated fresh on each visit - no persistence needed
  }

  /**
   * Update task progress based on test results
   */
  updateTaskProgress(testResults: TestSuiteResult, exercise: ExerciseDefinition): void {
    const state = this.store.getState();
    // Create local copies to avoid mutating store state directly
    // IMPORTANT: These new Map()/new Set() calls are required for safe mutation
    const taskProgress = new Map(state.taskProgress);
    const completedTasks = new Set(state.completedTasks);
    const scenariosByTask = this.groupScenariosByTask(exercise);
    const newlyCompletedTasks: string[] = [];

    for (const [taskId, scenarios] of scenariosByTask) {
      const updatedData = this.calculateTaskUpdate(taskId, scenarios, exercise, testResults, taskProgress);
      if (updatedData) {
        taskProgress.set(taskId, updatedData.progress);

        // Track newly completed tasks for sound effects
        if (updatedData.isNowCompleted && !completedTasks.has(taskId)) {
          newlyCompletedTasks.push(taskId);
        }

        this.updateCompletedTasksSet(completedTasks, taskId, updatedData.isNowCompleted);
      }
    }

    // Atomic state update - batch both updates together
    this.store.setState((prevState) => ({
      ...prevState,
      taskProgress,
      completedTasks
    }));

    // Play sound effect for newly completed tasks
    if (newlyCompletedTasks.length > 0) {
      this.soundManager.play("task-completed");
    }

    // Update current task to first incomplete task
    this.setCurrentTaskToFirstIncomplete(exercise);
  }

  /**
   * Get task completion status
   */
  getTaskCompletionStatus(taskId: string): "not-started" | "in-progress" | "completed" {
    const taskProgress = this.store.getState().taskProgress.get(taskId);
    return taskProgress?.status || "not-started";
  }

  /**
   * Get progress for a specific task
   */
  getTaskProgress(taskId: string): TaskProgress | null {
    return this.store.getState().taskProgress.get(taskId) || null;
  }

  /**
   * Check if a task is completed
   */
  isTaskCompleted(taskId: string): boolean {
    return this.store.getState().completedTasks.has(taskId);
  }

  /**
   * Get all completed task IDs
   */
  getCompletedTaskIds(): string[] {
    return Array.from(this.store.getState().completedTasks);
  }

  /**
   * Set the current active task
   */
  setCurrentTask(taskId: string): void {
    this.store.getState().setCurrentTaskId(taskId);
  }

  /**
   * Calculate updated task progress for a single task
   */
  private calculateTaskUpdate(
    taskId: string,
    scenarios: Scenario[],
    exercise: ExerciseDefinition,
    testResults: TestSuiteResult,
    taskProgress: Map<string, TaskProgress>
  ): { progress: TaskProgress; isNowCompleted: boolean } | null {
    const task = exercise.tasks.find((t) => t.id === taskId);
    if (!task) {
      return null;
    }

    const currentProgress = taskProgress.get(taskId);
    if (!currentProgress) {
      return null;
    }

    const requiredScenarios = this.getRequiredScenarios(task, exercise, scenarios);
    const passedScenarios = this.getPassedScenariosForTask(testResults, requiredScenarios);
    const newStatus = this.determineTaskStatus(requiredScenarios, passedScenarios);

    const wasCompleted = currentProgress.status === "completed";
    const isNowCompleted = newStatus === "completed";

    const updatedProgress: TaskProgress = {
      ...currentProgress,
      status: newStatus,
      passedScenarios,
      totalScenarios: requiredScenarios.length,
      completedAt: isNowCompleted && !wasCompleted ? new Date().toISOString() : currentProgress.completedAt
    };

    return { progress: updatedProgress, isNowCompleted };
  }

  /**
   * Determine task status based on scenario completion
   */
  private determineTaskStatus(
    requiredScenarios: string[],
    passedScenarios: string[]
  ): "not-started" | "in-progress" | "completed" {
    const allRequired = requiredScenarios.every((slug) => passedScenarios.includes(slug));
    return allRequired ? "completed" : passedScenarios.length > 0 ? "in-progress" : "not-started";
  }

  /**
   * Update the completed tasks set based on task completion status
   */
  private updateCompletedTasksSet(completedTasks: Set<string>, taskId: string, isNowCompleted: boolean): void {
    if (isNowCompleted) {
      completedTasks.add(taskId);
    } else {
      completedTasks.delete(taskId);
    }
  }

  /**
   * Group scenarios by their taskId
   */
  private groupScenariosByTask(exercise: ExerciseDefinition): Map<string, Scenario[]> {
    const scenariosByTask = new Map<string, Scenario[]>();

    for (const scenario of exercise.scenarios) {
      const taskScenarios: Scenario[] = scenariosByTask.get(scenario.taskId) || [];
      taskScenarios.push(scenario);
      scenariosByTask.set(scenario.taskId, taskScenarios);
    }

    return scenariosByTask;
  }

  /**
   * Get required scenarios for a task with consistent fallback logic
   */
  private getRequiredScenarios(
    task: ExerciseDefinition["tasks"][0],
    exercise: ExerciseDefinition,
    filteredScenarios?: Scenario[]
  ): string[] {
    return (
      task.requiredScenarios ||
      (filteredScenarios
        ? filteredScenarios.map((s) => s.slug)
        : exercise.scenarios.filter((s) => s.taskId === task.id).map((s) => s.slug))
    );
  }

  /**
   * Find the first incomplete task (non-bonus tasks have priority)
   */
  private findFirstIncompleteTask(
    exercise: ExerciseDefinition,
    completedTasks: Set<string>
  ): ExerciseDefinition["tasks"][0] | null {
    // First try to find the first incomplete non-bonus task
    const firstIncompleteRegularTask = exercise.tasks.find((task) => !task.bonus && !completedTasks.has(task.id));
    if (firstIncompleteRegularTask) {
      return firstIncompleteRegularTask;
    }

    // If all regular tasks are complete, find the first incomplete bonus task
    const firstIncompleteBonusTask = exercise.tasks.find((task) => task.bonus && !completedTasks.has(task.id));
    return firstIncompleteBonusTask || null;
  }

  /**
   * Get passed scenarios for a specific task
   */
  private getPassedScenariosForTask(testResults: TestSuiteResult, requiredScenarios: string[]): string[] {
    return requiredScenarios.filter((scenarioSlug) => {
      const testResult = testResults.tests.find((t) => t.slug === scenarioSlug);
      return testResult?.status === "pass";
    });
  }
}
