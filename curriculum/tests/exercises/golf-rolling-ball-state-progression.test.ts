import { describe, expect, it } from "vitest";
import golfStateExercise from "../../src/exercises/golf-rolling-ball-state";
import { progressionMetrics } from "../../src/exercises/golf-rolling-ball-state/progressionMetrics";
import solution from "../../src/exercises/golf-rolling-ball-state/solution.jiki?raw";
import stub from "../../src/exercises/golf-rolling-ball-state/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// No bonus scenarios, so every scenario counts toward the anchor.
function runProgression(studentCode: string) {
  const results = runExerciseTests(golfStateExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, golfStateExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Teleports straight to the hole with a literal - no state, no loop.
const TELEPORT = `move_to(88)`;

// Tracks position in a variable and loops, but only covers half the distance.
const HALFWAY_LOOP = `set position to 28
repeat 30 times do
  change position to position + 1
  move_to(position)
end`;

describe("golf-rolling-ball-state progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 26,
      metrics: { scenarios: 10, distance: 5, used_loop: 8, position_variable: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, distance: 0, used_loop: 0, position_variable: 0 }
    });
  });

  it("scores only distance for teleporting straight to the hole", () => {
    const scores = runProgression(TELEPORT);

    // The scenario fails (positions were skipped), but the ball IS at the hole.
    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 0, distance: 5, used_loop: 0, position_variable: 0 }
    });
  });

  it("scores loop and state credit plus partial distance for a halfway attempt", () => {
    const { metrics } = runProgression(HALFWAY_LOOP);

    expect(metrics.scenarios).toBe(0);
    // 30 of the 60 steps toward the hole.
    expect(metrics.distance).toBeGreaterThan(0);
    expect(metrics.distance).toBeLessThan(5);
    expect(metrics.used_loop).toBe(8);
    expect(metrics.position_variable).toBe(3);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, distance: 0, used_loop: 0, position_variable: 0 }
    });
  });
});
