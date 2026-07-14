import { describe, expect, it } from "vitest";
import scrollAndShootExercise from "../../src/exercises/scroll-and-shoot";
import { progressionMetrics } from "../../src/exercises/scroll-and-shoot/progressionMetrics";
import solution from "../../src/exercises/scroll-and-shoot/solution.javascript?raw";
import stub from "../../src/exercises/scroll-and-shoot/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(scrollAndShootExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, scrollAndShootExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// A single left-to-right pass: shoots the lowest alien in each column it
// visits, but never turns around (and uses a counted repeat).
const ONE_WAY_ATTEMPT = `repeat(10) {
  if (isAlienAbove()) {
    shoot()
  }
  moveRight()
}`;

describe("scroll-and-shoot progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, aliens_shot: 4, swept_both_ways: 8 }
    });
  });

  it("scores 0 for the stub (an empty game loop)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, swept_both_ways: 0 }
    });
  });

  it("scores partial aliens_shot but no sweep for a single left-to-right pass", () => {
    const scores = runProgression(ONE_WAY_ATTEMPT);

    // one-alien and one-row are winnable in one pass (2 of 5 scenarios); on
    // three-rows only the lowest alien in 8 of the visited columns dies.
    expect(scores).toEqual({
      score: 6,
      metrics: { scenarios: 4, aliens_shot: 2, swept_both_ways: 0 }
    });
  });
});
