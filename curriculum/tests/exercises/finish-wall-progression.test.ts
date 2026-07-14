import { describe, expect, it } from "vitest";
import finishWallExercise from "../../src/exercises/finish-wall";
import { progressionMetrics } from "../../src/exercises/finish-wall/progressionMetrics";
import solution from "../../src/exercises/finish-wall/solution.jiki?raw";
import stub from "../../src/exercises/finish-wall/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(finishWallExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, finishWallExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

const UNROLLED_ATTEMPT = `rectangle(0, 0, 20, 10, "brick")
rectangle(20, 0, 20, 10, "brick")
rectangle(40, 0, 20, 10, "brick")
rectangle(60, 0, 20, 10, "brick")
rectangle(80, 0, 20, 10, "brick")`;

const PARTIAL_LOOP_ATTEMPT = `set x to -1
repeat 4 times do
  change x to x + 1
  rectangle(x * 20, 0, 20, 10, "brick")
end`;

describe("finish-wall progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 23,
      metrics: { scenarios: 10, bricks_placed: 5, used_loop: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, bricks_placed: 0, used_loop: 0 }
    });
  });

  it("scores all bricks but NOT used_loop for five pasted rectangle lines", () => {
    const scores = runProgression(UNROLLED_ATTEMPT);

    // The scenario's single-rectangle-call code check fails, so no anchor.
    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 0, bricks_placed: 5, used_loop: 0 }
    });
  });

  it("scores partial bricks plus used_loop for a repeat 4 attempt", () => {
    const scores = runProgression(PARTIAL_LOOP_ATTEMPT);

    expect(scores).toEqual({
      score: 12,
      metrics: { scenarios: 0, bricks_placed: 4, used_loop: 8 }
    });
  });
});
