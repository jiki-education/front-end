import { describe, it, expect } from "vitest";
import { runExerciseTests } from "../runScenarioTest";
import processGameExercise from "../../src/exercises/wordle-process-game";

// The bonus task ("duplicate-letters") is excluded from all-exercises.test.ts, so
// guard here that the reference JavaScript solution actually implements the
// duplicate-letter rule the bonus asks for. JavaScript is the launch language and
// the only one all-exercises validates.
describe("wordle-process-game duplicate-letter bonus", () => {
  it("javascript reference solution passes the bonus scenarios", async () => {
    const slug = "wordle-process-game";
    const solution = (await import(`../../src/exercises/${slug}/solution.javascript?raw`)).default;

    const bonusScenarios = processGameExercise.scenarios.filter((s) => s.taskId === "duplicate-letters");
    const testExercise = { ...processGameExercise, scenarios: bonusScenarios };

    const results = runExerciseTests(testExercise, solution, "javascript");
    expect(results.length).toBe(2);
    for (const result of results) {
      expect(result.status, JSON.stringify(result.expects, null, 2)).toBe("pass");
    }
  });
});
