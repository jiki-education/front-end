import { describe, expect, it } from "vitest";
import lookAroundExercise from "../../src/exercises/look-around";
import { progressionMetrics } from "../../src/exercises/look-around/progressionMetrics";
import solution from "../../src/exercises/look-around/solution.javascript?raw";
import stub from "../../src/exercises/look-around/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(lookAroundExercise, studentCode, "javascript");
  // The two bonus scenarios are excluded from the anchor and allPassed().
  const runs = buildScenarioRuns(results, lookAroundExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// Only the first helper exists: walks straight until blocked.
const CAN_MOVE_ONLY_ATTEMPT = `function canMove() {
  return look("ahead") !== "wall"
}

repeat(6) {
  if (canMove()) {
    move()
  }
}`;

describe("look-around progression", () => {
  it("scores the full anchor, all helpers, and full loc for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 17,
      metrics: { scenarios: 10, helpers_defined: 4, loc: 3 }
    });
  });

  it("scores 0 for the stub (an uninterpolated lesson placeholder)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, helpers_defined: 0, loc: 0 }
    });
  });

  it("scores one helper and the straight maze for a canMove-only attempt", () => {
    const scores = runProgression(CAN_MOVE_ONLY_ATTEMPT);

    // maze-1 passes (1 of 7 non-bonus); one of four helpers exists; loc stays
    // 0 until the exercise is solved.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 1, helpers_defined: 1, loc: 0 }
    });
  });
});
