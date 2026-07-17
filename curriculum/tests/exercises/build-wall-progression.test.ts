import { describe, expect, it } from "vitest";
import buildWallExercise from "../../src/exercises/build-wall";
import { progressionMetrics } from "../../src/exercises/build-wall/progressionMetrics";
import solution from "../../src/exercises/build-wall/solution.javascript?raw";
import stub from "../../src/exercises/build-wall/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(buildWallExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, buildWallExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// A looped 5x5 block of bricks: 25 of the 55 laid, no offset rows yet.
const PARTIAL_WALL_ATTEMPT = `let y = 100
repeat(5) {
  y = y - 10
  let col = 0
  repeat(5) {
    rectangle(col * 20, y, 20, 10, "brick")
    col = col + 1
  }
}`;

describe("build-wall progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, bricks_built: 4, used_loops: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, bricks_built: 0, used_loops: 0 }
    });
  });

  it("scores partial bricks plus used_loops for a half-built wall", () => {
    const scores = runProgression(PARTIAL_WALL_ATTEMPT);

    // 25 of 55 bricks: round(4 * 25 / 55) = 2.
    expect(scores).toEqual({
      score: 10,
      metrics: { scenarios: 0, bricks_built: 2, used_loops: 8 }
    });
  });
});
