import { describe, expect, it } from "vitest";
import mazeExercise from "../../src/exercises/maze-walk";
import { progressionMetrics } from "../../src/exercises/maze-walk/progressionMetrics";
import solution from "../../src/exercises/maze-walk/solution.jiki?raw";
import stub from "../../src/exercises/maze-walk/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(mazeExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, mazeExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// A walk() body that ignores numSteps and always moves three times: the
// hardcoded moves overshoot on walk(2) and halt against a wall partway.
const HARDCODED_BODY_ATTEMPT = `function walk with numSteps do
  move()
  move()
  move()
end

walk(3)
turn_left()
walk(2)
turn_right()
walk(4)`;

describe("maze-walk progression", () => {
  it("scores the full anchor, path progress, and loop usage for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, path_progress: 4, used_loop_in_walk: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, used_loop_in_walk: 0 }
    });
  });

  it("scores partial path progress but no loop points for a hardcoded walk body", () => {
    const { metrics } = runProgression(HARDCODED_BODY_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_loop_in_walk).toBe(0);
    expect(metrics.path_progress).toBeGreaterThan(0);
    expect(metrics.path_progress).toBeLessThan(4);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, path_progress: 0, used_loop_in_walk: 0 }
    });
  });
});
