import { describe, expect, it } from "vitest";
import mazeExercise from "../../src/exercises/maze-solve-walk";
import { progressionMetrics } from "../../src/exercises/maze-solve-walk/progressionMetrics";
import solution from "../../src/exercises/maze-solve-walk/solution.jiki?raw";
import stub from "../../src/exercises/maze-solve-walk/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(mazeExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, mazeExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Solves the maze one step at a time - never a stride of 2 or more.
const SINGLE_STEP_GRIND = `walk(1)
walk(1)
walk(1)
turn_left()
walk(1)
walk(1)
walk(1)
turn_right()
walk(1)
walk(1)
turn_left()
walk(1)
walk(1)
walk(1)`;

// The first stride only: 3 of the 11 steps to the target.
const FIRST_STRIDE_ATTEMPT = `walk(3)`;

describe("maze-solve-walk progression", () => {
  it("scores the full anchor, path progress, and strides for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, path_progress: 4, walked_in_strides: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, walked_in_strides: 0 }
    });
  });

  it("solves the maze but earns no stride points when grinding with walk(1)", () => {
    const scores = runProgression(SINGLE_STEP_GRIND);

    expect(scores).toEqual({
      score: 14,
      metrics: { scenarios: 10, path_progress: 4, walked_in_strides: 0 }
    });
  });

  it("scores partial path progress plus strides for the first walk(3)", () => {
    const { metrics } = runProgression(FIRST_STRIDE_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.path_progress).toBeGreaterThan(0);
    expect(metrics.path_progress).toBeLessThan(4);
    expect(metrics.walked_in_strides).toBe(8);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, walked_in_strides: 0 }
    });
  });
});
