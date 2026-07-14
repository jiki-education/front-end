import { describe, expect, it } from "vitest";
import golfExercise from "../../src/exercises/golf-rolling-ball-loop";
import { progressionMetrics } from "../../src/exercises/golf-rolling-ball-loop/progressionMetrics";
import solution from "../../src/exercises/golf-rolling-ball-loop/solution.jiki?raw";
import stub from "../../src/exercises/golf-rolling-ball-loop/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// Golf has no bonus scenarios, so every scenario counts toward the anchor.
function runProgression(studentCode: string) {
  const results = runExerciseTests(golfExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, golfExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

const UNROLLED_SOLUTION = Array.from({ length: 60 }, () => "roll()").join("\n");

const PARTIAL_LOOP_ATTEMPT = `repeat 30 times do
  roll()
end`;

describe("golf-rolling-ball-loop progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 27,
      metrics: { scenarios: 10, distance: 5, used_loop: 10, precision: 2 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, distance: 0, used_loop: 0, precision: 0 }
    });
  });

  it("scores distance and precision but NOT used-loop for a hand-unrolled solution", () => {
    const scores = runProgression(UNROLLED_SOLUTION);

    // The scenario itself fails its lines-of-code check, so no anchor points.
    expect(scores).toEqual({
      score: 7,
      metrics: { scenarios: 0, distance: 5, used_loop: 0, precision: 2 }
    });
  });

  it("scores partial distance plus used-loop for a repeat 30 attempt", () => {
    const { metrics } = runProgression(PARTIAL_LOOP_ATTEMPT);

    // Ball reaches 58: 30 of the 60 steps toward the hole => half distance points.
    expect(metrics.scenarios).toBe(0);
    expect(metrics.distance).toBeGreaterThan(0);
    expect(metrics.distance).toBeLessThan(5);
    expect(metrics.used_loop).toBe(10);
    expect(metrics.precision).toBe(0);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, distance: 0, used_loop: 0, precision: 0 }
    });
  });
});
