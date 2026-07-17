import { describe, expect, it } from "vitest";
import skylineExercise from "../../src/exercises/cityscape-skyline";
import { progressionMetrics } from "../../src/exercises/cityscape-skyline/progressionMetrics";
import solution from "../../src/exercises/cityscape-skyline/solution.jiki?raw";
import stub from "../../src/exercises/cityscape-skyline/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// All scenarios use randomSeed, so the metrics only measure structural
// properties (which helpers ran, how often) - never exact positions.
function runProgression(studentCode: string) {
  const results = runExerciseTests(skylineExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, skylineExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Fetched one width and one floor count, built nothing.
const ONE_RANDOM_EACH = `set width to random_width()
set floors to random_num_floors()`;

// Loops per building, re-rolling dimensions each time, but builds nothing.
const RANDOMS_PER_BUILDING_LOOP = `set n to num_buildings()
set width to 0
set floors to 0
repeat n times do
  change width to random_width()
  change floors to random_num_floors()
end`;

describe("cityscape-skyline progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, used_random_sizes: 8, randoms_per_building: 4 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_random_sizes: 0, randoms_per_building: 0 }
    });
  });

  it("scores used-random-sizes plus one building's worth of randoms for a single fetch of each", () => {
    const scores = runProgression(ONE_RANDOM_EACH);

    // One call each in the buildings-4 run: 1 of 4 buildings' randoms drawn.
    expect(scores).toEqual({
      score: 9,
      metrics: { scenarios: 0, used_random_sizes: 8, randoms_per_building: 1 }
    });
  });

  it("scores full randoms-per-building for a per-building re-roll loop", () => {
    const scores = runProgression(RANDOMS_PER_BUILDING_LOOP);

    expect(scores).toEqual({
      score: 12,
      metrics: { scenarios: 0, used_random_sizes: 8, randoms_per_building: 4 }
    });
  });
});
