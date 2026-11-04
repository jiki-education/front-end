import { describe, expect, it } from "vitest";
import spaceInvadersExercise from "../../src/exercises/space-invaders-nested-repeat";
import { progressionMetrics } from "../../src/exercises/space-invaders-nested-repeat/progressionMetrics";
import solution from "../../src/exercises/space-invaders-nested-repeat/solution.jiki?raw";
import stub from "../../src/exercises/space-invaders-nested-repeat/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(spaceInvadersExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, spaceInvadersExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// A single flat loop with the four shots written out: kills every alien but
// fails the line-count check, and never nests a repeat.
const FLAT_LOOP_ATTEMPT = `repeat 5 times do
  move()
  shoot()
  shoot()
  shoot()
  shoot()
  move()
end`;

// A nested loop that stops after two of the five columns.
const PARTIAL_NESTED_ATTEMPT = `repeat 2 times do
  move()
  repeat 4 times do
    shoot()
  end
  move()
end`;

describe("space-invaders-nested-repeat progression", () => {
  it("scores the full anchor, aliens, and nesting for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, aliens_shot: 4, used_nested_repeat: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, used_nested_repeat: 0 }
    });
  });

  it("scores all aliens but NOT nesting for a flat loop with unrolled shots", () => {
    const scores = runProgression(FLAT_LOOP_ATTEMPT);

    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, aliens_shot: 4, used_nested_repeat: 0 }
    });
  });

  it("scores nesting plus partial aliens for a repeat 2 attempt", () => {
    const { metrics } = runProgression(PARTIAL_NESTED_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_nested_repeat).toBe(8);
    expect(metrics.aliens_shot).toBeGreaterThan(0);
    expect(metrics.aliens_shot).toBeLessThan(4);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, used_nested_repeat: 0 }
    });
  });
});
