import { describe, expect, it } from "vitest";
import mazeExercise from "../../src/exercises/maze-solve-basic";
import { progressionMetrics } from "../../src/exercises/maze-solve-basic/progressionMetrics";
import solution from "../../src/exercises/maze-solve-basic/solution.jiki?raw";
import stub from "../../src/exercises/maze-solve-basic/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(mazeExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, mazeExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// The first four moves of the canonical 16-step route: a quarter of the way.
const QUARTER_WAY_ATTEMPT = `move()
move()
turn_left()
move()
move()`;

// Walks into the wall at (0,1) immediately - the run halts at the start cell.
const WALL_CRASH_ATTEMPT = `turn_left()
move()`;

describe("maze-solve-basic progression", () => {
  it("scores the full 10-point anchor plus full path progress for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 15,
      metrics: { scenarios: 10, path_progress: 5 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0 }
    });
  });

  it("scores partial path progress for a quarter-way attempt", () => {
    const { metrics } = runProgression(QUARTER_WAY_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.path_progress).toBeGreaterThan(0);
    expect(metrics.path_progress).toBeLessThan(5);
  });

  it("scores no path progress when the run crashes at the start", () => {
    const { metrics } = runProgression(WALL_CRASH_ATTEMPT);

    expect(metrics.path_progress).toBe(0);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0 }
    });
  });
});
