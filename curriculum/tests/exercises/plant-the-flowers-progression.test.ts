import { describe, expect, it } from "vitest";
import plantTheFlowersExercise from "../../src/exercises/plant-the-flowers";
import { progressionMetrics } from "../../src/exercises/plant-the-flowers/progressionMetrics";
import solution from "../../src/exercises/plant-the-flowers/solution.jiki?raw";
import stub from "../../src/exercises/plant-the-flowers/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(plantTheFlowersExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, plantTheFlowersExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

const UNROLLED_ATTEMPT = Array.from({ length: 9 }, (_, i) => `plant(${(i + 1) * 10})`).join("\n");

const PARTIAL_LOOP_ATTEMPT = `set position to 10
repeat 5 times do
  plant(position)
  change position to position + 10
end`;

describe("plant-the-flowers progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 23,
      metrics: { scenarios: 10, flowers_planted: 5, used_loop: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, flowers_planted: 0, used_loop: 0 }
    });
  });

  it("scores all flowers but NOT used_loop for nine pasted plant lines", () => {
    const scores = runProgression(UNROLLED_ATTEMPT);

    // The scenario's max-lines code check fails, so no anchor.
    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 0, flowers_planted: 5, used_loop: 0 }
    });
  });

  it("scores partial flowers plus used_loop for a repeat 5 attempt", () => {
    const scores = runProgression(PARTIAL_LOOP_ATTEMPT);

    // 5 of the 9 target positions planted => round(5 * 5/9) = 3.
    expect(scores).toEqual({
      score: 11,
      metrics: { scenarios: 0, flowers_planted: 3, used_loop: 8 }
    });
  });
});
