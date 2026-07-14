import { describe, expect, it } from "vitest";
import rainbowSplodgesExercise from "../../src/exercises/rainbow-splodges";
import { progressionMetrics } from "../../src/exercises/rainbow-splodges/progressionMetrics";
import solution from "../../src/exercises/rainbow-splodges/solution.jiki?raw";
import stub from "../../src/exercises/rainbow-splodges/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// The scenario uses randomSeed, so the metrics only measure structural
// properties (shape counts, call counts) - never exact positions.
function runProgression(studentCode: string) {
  const results = runExerciseTests(rainbowSplodgesExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, rainbowSplodgesExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// A loop drawing 60 random circles that deliberately stay clear of the edges
// (so the scenario's touch-the-edges expectation always fails).
const SIXTY_INSET_CIRCLES = `set x to 0
set y to 0
set hue to 0
repeat 60 times do
  change x to random_number(10, 90)
  change y to random_number(10, 90)
  change hue to random_number(0, 360)
  circle(x, y, 5, hsl(hue, 80, 50))
end`;

describe("rainbow-splodges progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    // The scenario's touch-the-edges expectation can genuinely miss on an
    // unlucky seed (its errorHtml says "Try running it again!"), so allow a
    // couple of retries before asserting exact full marks.
    let scores = runProgression(solution);
    for (let attempt = 0; attempt < 2 && scores.metrics.scenarios !== 10; attempt++) {
      scores = runProgression(solution);
    }

    expect(scores).toEqual({
      score: 25,
      metrics: { scenarios: 10, used_loop: 8, circles_drawn: 4, used_random: 3 }
    });
  });

  it("scores 0 for the stub (its loop draws nothing)", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_loop: 0, circles_drawn: 0, used_random: 0 }
    });
  });

  it("scores loop and random credit plus partial circles for a 60-circle attempt", () => {
    const scores = runProgression(SIXTY_INSET_CIRCLES);

    // 60 of 200 circles => round(4 * 60/200) = 1.
    expect(scores).toEqual({
      score: 12,
      metrics: { scenarios: 0, used_loop: 8, circles_drawn: 1, used_random: 3 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_loop: 0, circles_drawn: 0, used_random: 0 }
    });
  });
});
