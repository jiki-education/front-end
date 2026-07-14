import { describe, expect, it } from "vitest";
import rainbowExercise from "../../src/exercises/rainbow";
import { progressionMetrics } from "../../src/exercises/rainbow/progressionMetrics";
import solution from "../../src/exercises/rainbow/solution.jiki?raw";
import stub from "../../src/exercises/rainbow/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(rainbowExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, rainbowExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// All 100 bars via a loop, but one flat color: no rainbow at all yet.
const FLAT_COLOR_ATTEMPT = `set x to 0
repeat 100 times do
  rectangle(x, 0, 1, 100, hsl(200, 50, 50))
  change x to x + 1
end`;

// Hue mutated, but too slowly to sweep the wheel (0..99 instead of 0..297).
const SLOW_HUE_ATTEMPT = `set x to 0
set hue to 0
repeat 100 times do
  rectangle(x, 0, 1, 100, hsl(hue, 50, 50))
  change x to x + 1
  change hue to hue + 1
end`;

describe("rainbow progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 26,
      metrics: { scenarios: 10, used_loop: 8, distinct_colors: 5, hue_span: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_loop: 0, distinct_colors: 0, hue_span: 0 }
    });
  });

  it("scores only used_loop for 100 bars in one flat color", () => {
    const scores = runProgression(FLAT_COLOR_ATTEMPT);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, used_loop: 8, distinct_colors: 0, hue_span: 0 }
    });
  });

  it("scores distinct colors and a partial hue span for a too-slow hue sweep", () => {
    const { metrics } = runProgression(SLOW_HUE_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_loop).toBe(8);
    expect(metrics.distinct_colors).toBeGreaterThan(3);
    // Hues 0..99 only reach the 0 and 60 samples => round(3 * 2/6) = 1.
    expect(metrics.hue_span).toBe(1);
  });
});
