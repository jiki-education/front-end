import { describe, it, expect } from "vitest";
import { runExerciseTests } from "../runScenarioTest";
import alphanumericExercise from "../../src/exercises/alphanumeric";

// The bonus task ("solve-tightly") is excluded from all-exercises.test.ts, so
// guard here that the reference JavaScript solution actually meets the line
// limit the bonus advertises. JavaScript is the launch language and the only
// one all-exercises validates.
describe("alphanumeric bonus line-count check", () => {
  it("javascript reference solution passes the bonus", async () => {
    const slug = "alphanumeric";
    const solution = (await import(`../../src/exercises/${slug}/solution.javascript?raw`)).default;

    const bonusScenarios = alphanumericExercise.scenarios.filter((s) => s.slug === "alphanumeric-bonus-line-count");
    const testExercise = { ...alphanumericExercise, scenarios: bonusScenarios };

    const results = runExerciseTests(testExercise, solution, "javascript");
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.status, JSON.stringify(result.expects, null, 2)).toBe("pass");
    }
  });
});
