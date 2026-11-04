import { describe, expect, it } from "vitest";
import goldPanningExercise from "../../src/exercises/gold-panning";
import { progressionMetrics } from "../../src/exercises/gold-panning/progressionMetrics";
import solution from "../../src/exercises/gold-panning/solution.jiki?raw";
import stub from "../../src/exercises/gold-panning/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// The pan values are random every run, so the metrics only measure
// structural properties (calls made, argument shapes) - never exact totals.
function runProgression(studentCode: string) {
  const results = runExerciseTests(goldPanningExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, goldPanningExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Solves the exercise without a loop: five pasted running-total lines.
const UNROLLED_SOLUTION = `set total to 0
change total to total + pan()
change total to total + pan()
change total to total + pan()
change total to total + pan()
change total to total + pan()
sell(total)`;

// Only got as far as panning three times, nothing kept or sold.
const THREE_PANS = `repeat 3 times do
  pan()
end`;

describe("gold-panning progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 25,
      metrics: { scenarios: 10, sold_computed_total: 8, pans: 4, used_loop: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, sold_computed_total: 0, pans: 0, used_loop: 0 }
    });
  });

  it("scores everything except used-loop for a hand-unrolled solution", () => {
    const scores = runProgression(UNROLLED_SOLUTION);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, sold_computed_total: 8, pans: 4, used_loop: 0 }
    });
  });

  it("scores partial pans for three throwaway pans", () => {
    const scores = runProgression(THREE_PANS);

    // 3 of 5 pans, nothing sold, too few runtime pans to imply the loop concept.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, sold_computed_total: 0, pans: 2, used_loop: 0 }
    });
  });
});
