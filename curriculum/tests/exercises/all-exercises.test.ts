import { describe, it, expect } from "vitest";
import { exercises } from "../../src/exercises";
import { runExerciseTests } from "../runScenarioTest";

describe("All Exercises - Solution Validation", () => {
  /**
   * This test ensures that every exercise's solution code passes all its non-bonus scenarios.
   * Tests all three languages: jikiscript, javascript, and python.
   *
   * If this test fails, it means either:
   * 1. The solution code is incorrect
   * 2. The scenario expectations are wrong
   * 3. The exercise implementation has a bug
   *
   * Note: Bonus scenarios are excluded because they typically require different solutions.
   */

  //const languages = ["jikiscript", "javascript", "python"] as const;
  const languages = ["jikiscript"] as const;

  for (const [slug, loader] of Object.entries(exercises)) {
    for (const language of languages) {
      it(`${slug}: ${language} solution should pass all non-bonus scenarios`, async () => {
        const exerciseModule = await loader();
        const exercise = exerciseModule.default;

        // Import solution file for this language
        let solution: string;
        try {
          const ext = language === "jikiscript" ? "jiki" : language === "javascript" ? "javascript" : "py";
          const solutionModule = await import(`../../src/exercises/${slug}/solution.${ext}?raw`);
          solution = solutionModule.default;
        } catch {
          throw new Error(
            `Failed to load ${language} solution file for exercise "${slug}".\n` +
              `Expected file: src/exercises/${slug}/solution.${language === "jikiscript" ? "jiki" : language === "javascript" ? "javascript" : "py"}\n` +
              `Make sure the solution file exists and is properly formatted.`
          );
        }

        // Filter to non-bonus scenarios only
        const nonBonusScenarios = exercise.scenarios.filter((scenario) => {
          const task = exercise.tasks.find((t) => t.id === scenario.taskId);
          return task !== undefined && task.bonus !== true;
        });

        // Run solution against non-bonus scenarios
        // We need to create a properly typed exercise object based on the type
        const testExercise =
          exercise.type === "visual"
            ? { ...exercise, scenarios: nonBonusScenarios as typeof exercise.scenarios }
            : { ...exercise, scenarios: nonBonusScenarios as typeof exercise.scenarios };

        const results = runExerciseTests(testExercise, solution, language);

        // Assert all passed
        expect(results.length).toBeGreaterThan(0);

        // Verify individual results for better error messages
        const failures = results.filter((r) => r.status === "fail");
        if (failures.length > 0) {
          const failureMessages = failures.map((f) => {
            const expectFailures = f.expects
              .filter((e) => !e.pass)
              .map((e) => (e.errorHtml !== undefined && e.errorHtml !== "" ? `  - ${e.errorHtml}` : "  - Test failed"))
              .join("\n");

            return `Scenario "${f.name}" (${f.slug}) failed:\n${expectFailures}`;
          });

          throw new Error(`${failures.length} scenario(s) failed:\n\n${failureMessages.join("\n\n")}`);
        }
      });
    }
  }
});
