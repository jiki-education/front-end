import { runExerciseSolution } from "../../src/test-runner";
import type { ExerciseDefinition } from "../../src/exercises/types";
import type { ScenarioTestResult } from "../../src/test-runner";

/**
 * Tests that an exercise's solution code passes all scenarios
 */
export function testExerciseSolution(
  exercise: ExerciseDefinition,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult[] {
  return runExerciseSolution(exercise, language);
}

/**
 * Asserts that all scenario results passed
 */
export function assertAllScenariosPassed(results: ScenarioTestResult[]): void {
  const failures = results.filter((r) => r.status === "fail");

  if (failures.length > 0) {
    const failureMessages = failures.map((f) => {
      const expectFailures = f.expects
        .filter((e) => !e.pass)
        .map((e) => `  - Expected: ${e.expected}, Got: ${e.actual}`)
        .join("\n");

      return `Scenario "${f.name}" (${f.slug}) failed:\n${expectFailures}`;
    });

    throw new Error(`${failures.length} scenario(s) failed:\n\n${failureMessages.join("\n\n")}`);
  }
}
