import { describe, it, expect } from "vitest";
import { runExerciseTests } from "../runScenarioTest";
import nicheNamedPartyExercise from "../../src/exercises/niche-named-party";

// The bonus task ("solve-tightly") is excluded from all-exercises.test.ts, so
// guard here that the reference JavaScript solution actually meets the line
// limit the bonus advertises. JavaScript is the launch language and the only
// one all-exercises validates.
describe("niche-named-party bonus line-count check", () => {
  it("javascript reference solution passes the bonus", async () => {
    const slug = "niche-named-party";
    const solution = (await import(`../../src/exercises/${slug}/solution.javascript?raw`)).default;

    const bonusScenarios = nicheNamedPartyExercise.scenarios.filter(
      (s) => s.slug === "niche-named-party-bonus-line-count"
    );
    const testExercise = { ...nicheNamedPartyExercise, scenarios: bonusScenarios };

    const results = runExerciseTests(testExercise, solution, "javascript");
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.status, JSON.stringify(result.expects, null, 2)).toBe("pass");
    }
  });
});
