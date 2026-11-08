import { describe, expect, it } from "vitest";
import skyscraperExercise from "../../src/exercises/cityscape-skyscraper";
import { progressionMetrics } from "../../src/exercises/cityscape-skyscraper/progressionMetrics";
import solution from "../../src/exercises/cityscape-skyscraper/solution.jiki?raw";
import stub from "../../src/exercises/cityscape-skyscraper/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// No bonus scenarios, so every scenario counts toward the anchor.
function runProgression(studentCode: string) {
  const results = runExerciseTests(skyscraperExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, skyscraperExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Ground floor only, with literal arguments (fails the variables code check).
const GROUND_FLOOR_ONLY = `build_wall(17, 2)
build_glass(18, 2)
build_entrance(19, 2)
build_glass(20, 2)
build_wall(21, 2)`;

// Fetched the floor count but built nothing yet.
const FETCHED_FLOORS_ONLY = `set floors to num_floors()`;

describe("cityscape-skyscraper progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, used_num_floors: 8, built_rows: 4 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_num_floors: 0, built_rows: 0 }
    });
  });

  it("scores partial built-rows for a hardcoded ground floor", () => {
    const { metrics } = runProgression(GROUND_FLOOR_ONLY);

    // Literal arguments fail every scenario's code check, so no anchor.
    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_num_floors).toBe(0);
    expect(metrics.built_rows).toBeGreaterThan(0);
    expect(metrics.built_rows).toBeLessThan(4);
  });

  it("scores used-num-floors for code that only fetches the floor count", () => {
    const scores = runProgression(FETCHED_FLOORS_ONLY);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, used_num_floors: 8, built_rows: 0 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_num_floors: 0, built_rows: 0 }
    });
  });
});
