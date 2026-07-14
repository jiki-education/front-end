import { describe, expect, it } from "vitest";
import rainbowBallExercise from "../../src/exercises/rainbow-ball";
import { progressionMetrics } from "../../src/exercises/rainbow-ball/progressionMetrics";
import solution from "../../src/exercises/rainbow-ball/solution.javascript?raw";
import stub from "../../src/exercises/rainbow-ball/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// The scenario is seeded randomly, so intermediate assertions stay
// property-based rather than pinning exact values.
function runProgression(studentCode: string) {
  const results = runExerciseTests(rainbowBallExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, rainbowBallExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// A short diagonal trail: position and hue update, but no bouncing, so the
// canvas never fills.
const DIAGONAL_TRAIL_ATTEMPT = `let x = 0
let y = 0
let hue = 0
repeat(90) {
  x = x + 1
  y = y + 1
  hue = hue + 1
  circle(x, y, 10, hsl(hue, 80, 50))
}`;

describe("rainbow-ball progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, trail_variety: 8, canvas_coverage: 4 }
    });
  });

  it("scores 0 for the stub (a static circle drawn in a loop)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, trail_variety: 0, canvas_coverage: 0 }
    });
  });

  it("scores trail_variety but limited coverage for a non-bouncing diagonal trail", () => {
    const { metrics } = runProgression(DIAGONAL_TRAIL_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.trail_variety).toBe(8);
    expect(metrics.canvas_coverage).toBeLessThan(4);
  });
});
