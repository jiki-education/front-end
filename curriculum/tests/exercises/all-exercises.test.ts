import { describe, it, expect } from "vitest";
import { exercises } from "../../src/exercises";
import { runExerciseTests } from "../../src/test-runner";

describe("All Exercises - Solution Validation", () => {
  /**
   * This test ensures that every exercise's solution code passes all its non-bonus scenarios.
   * If this test fails, it means either:
   * 1. The solution code is incorrect
   * 2. The scenario expectations are wrong
   * 3. The exercise implementation has a bug
   *
   * Note: Bonus scenarios are excluded because they typically require different solutions.
   */

  for (const [slug, loader] of Object.entries(exercises)) {
    it(`${slug}: jikiscript solution should pass all non-bonus scenarios`, async () => {
      const exerciseModule = await loader();
      const exercise = exerciseModule.default;

      // Filter to non-bonus scenarios only
      const nonBonusScenarios = exercise.scenarios.filter((scenario) => {
        const task = exercise.tasks.find((t) => t.id === scenario.taskId);
        return task !== undefined && task.bonus !== true;
      });

      // Run jikiscript solution against non-bonus scenarios
      const results = runExerciseTests(
        { ...exercise, scenarios: nonBonusScenarios },
        exercise.solutions.jikiscript,
        "jikiscript"
      );

      // Assert all passed
      expect(results.length).toBeGreaterThan(0);

      // Verify individual results for better error messages
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
    });
  }
});
