import type { ExerciseDefinition, Task } from "@jiki/curriculum";
import type { TestResult, TestSuiteResult } from "./test-results-types";

/**
 * The scenario slugs a task requires to be considered complete. Falls back to
 * every scenario belonging to the task when `requiredScenarios` isn't set.
 */
function requiredScenarioSlugsForTask(task: Task, exercise: ExerciseDefinition): string[] {
  return task.requiredScenarios ?? exercise.scenarios.filter((s) => s.taskId === task.id).map((s) => s.slug);
}

/**
 * Slugs of every scenario that belongs to a bonus task. Bonus scenarios are
 * optional: they don't count toward the exercise's "passed" state.
 */
export function bonusScenarioSlugs(exercise: ExerciseDefinition): Set<string> {
  const bonusTaskIds = new Set(exercise.tasks.filter((task) => task.bonus).map((task) => task.id));
  return new Set(exercise.scenarios.filter((s) => bonusTaskIds.has(s.taskId)).map((s) => s.slug));
}

/**
 * Number of bonus tasks that are not yet fully passing, based on a test result.
 * Used to nudge the student toward outstanding bonuses at completion time.
 */
export function countOutstandingBonusTasks(exercise: ExerciseDefinition, result: TestSuiteResult): number {
  const passedSlugs = new Set(result.tests.filter((t) => t.status === "pass").map((t) => t.slug));

  return exercise.tasks
    .filter((task) => task.bonus)
    .filter((task) => !requiredScenarioSlugsForTask(task, exercise).every((slug) => passedSlugs.has(slug))).length;
}

/**
 * The first failing bonus scenario's test result, or null if none is failing.
 * Used to focus the scenario view on the bonus the student is about to tackle.
 */
export function firstFailingBonusScenario(exercise: ExerciseDefinition, result: TestSuiteResult): TestResult | null {
  const bonusSlugs = bonusScenarioSlugs(exercise);
  return result.tests.find((t) => bonusSlugs.has(t.slug) && t.status === "fail") ?? null;
}

/**
 * The id of the first bonus task that isn't yet fully passing, or null if none.
 */
export function firstOutstandingBonusTaskId(exercise: ExerciseDefinition, result: TestSuiteResult): string | null {
  const passedSlugs = new Set(result.tests.filter((t) => t.status === "pass").map((t) => t.slug));

  const task = exercise.tasks
    .filter((t) => t.bonus)
    .find((t) => !requiredScenarioSlugsForTask(t, exercise).every((slug) => passedSlugs.has(slug)));

  return task?.id ?? null;
}
