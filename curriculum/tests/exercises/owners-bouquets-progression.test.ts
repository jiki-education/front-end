import { describe, expect, it } from "vitest";
import ownersBouquetsExercise from "../../src/exercises/owners-bouquets";
import { progressionMetrics } from "../../src/exercises/owners-bouquets/progressionMetrics";
import solution from "../../src/exercises/owners-bouquets/solution.jiki?raw";
import stub from "../../src/exercises/owners-bouquets/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// No bonus scenarios, so every scenario counts toward the anchor.
function runProgression(studentCode: string) {
  const results = runExerciseTests(ownersBouquetsExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, ownersBouquetsExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Never asks the owner: hardcodes the 3-flower answer (only 3-flowers passes).
const HARDCODED_THREE = `plant(25)
plant(50)
plant(75)`;

// Asked the owner but never planted anything.
const ASKED_ONLY = `set count to ask_number_of_flowers()`;

describe("owners-bouquets progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 21,
      metrics: { scenarios: 10, used_flower_count: 8, planted: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_flower_count: 0, planted: 0 }
    });
  });

  it("scores a partial anchor and partial planting for a hardcoded 3-flower answer", () => {
    const { metrics } = runProgression(HARDCODED_THREE);

    // Passes only the 3-flowers scenario: 1 of 4.
    expect(metrics.scenarios).toBe(3);
    expect(metrics.used_flower_count).toBe(0);
    // 3 of 9 flowers planted in the 9-flowers run.
    expect(metrics.planted).toBe(1);
  });

  it("scores used-flower-count for code that only asks the owner", () => {
    const scores = runProgression(ASKED_ONLY);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, used_flower_count: 8, planted: 0 }
    });
  });
});
