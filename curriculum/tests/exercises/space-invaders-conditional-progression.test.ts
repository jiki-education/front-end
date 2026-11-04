import { describe, expect, it } from "vitest";
import spaceInvadersExercise from "../../src/exercises/space-invaders-conditional";
import { progressionMetrics } from "../../src/exercises/space-invaders-conditional/progressionMetrics";
import solution from "../../src/exercises/space-invaders-conditional/solution.jiki?raw";
import stub from "../../src/exercises/space-invaders-conditional/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(spaceInvadersExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, spaceInvadersExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// The right shape but the sweep stops halfway across the screen: every
// formation still has aliens beyond position 4, so every scenario fails.
const HALF_SWEEP_ATTEMPT = `repeat 5 times do
  if is_alien_above() do
    shoot()
  end
  move()
end`;

// Hardcoded for the first formation's opening: shoots the col-0 alien then
// stops. In formations without a col-0 alien the shot misses and the run
// halts with nothing killed.
const HARDCODED_ATTEMPT = `shoot()
move()`;

describe("space-invaders-conditional progression", () => {
  it("scores the full anchor, aliens, and conditional checks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, aliens_shot: 4, used_conditional_check: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, used_conditional_check: 0 }
    });
  });

  it("scores conditional checks plus partial aliens for a half sweep", () => {
    const { metrics } = runProgression(HALF_SWEEP_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_conditional_check).toBe(8);
    expect(metrics.aliens_shot).toBeGreaterThan(0);
    expect(metrics.aliens_shot).toBeLessThan(4);
  });

  it("scores no conditional checks for a hardcoded shot", () => {
    const { metrics } = runProgression(HARDCODED_ATTEMPT);

    expect(metrics.used_conditional_check).toBe(0);
    expect(metrics.aliens_shot).toBeLessThan(4);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, used_conditional_check: 0 }
    });
  });
});
