import { describe, expect, it } from "vitest";
import spaceInvadersExercise from "../../src/exercises/space-invaders-repeat";
import { progressionMetrics } from "../../src/exercises/space-invaders-repeat/progressionMetrics";
import solution from "../../src/exercises/space-invaders-repeat/solution.jiki?raw";
import stub from "../../src/exercises/space-invaders-repeat/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(spaceInvadersExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, spaceInvadersExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// The whole grid shot down by hand: 25 pasted lines, no loop. The scenario
// fails its line-count check even though every alien dies.
const UNROLLED_SOLUTION = Array.from({ length: 5 }, () => "move()\nmove()\nshoot()\nshoot()\nshoot()").join("\n");

// A loop that stops after two of the five columns.
const PARTIAL_LOOP_ATTEMPT = `repeat 2 times do
  move()
  move()
  shoot()
  shoot()
  shoot()
end`;

describe("space-invaders-repeat progression", () => {
  it("scores the full anchor, aliens, and repeat usage for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, aliens_shot: 4, used_repeat: 8 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, used_repeat: 0 }
    });
  });

  it("scores all aliens but NOT repeat usage for a hand-unrolled solution", () => {
    const scores = runProgression(UNROLLED_SOLUTION);

    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, aliens_shot: 4, used_repeat: 0 }
    });
  });

  it("scores repeat usage plus partial aliens for a repeat 2 attempt", () => {
    const { metrics } = runProgression(PARTIAL_LOOP_ATTEMPT);

    expect(metrics.scenarios).toBe(0);
    expect(metrics.used_repeat).toBe(8);
    expect(metrics.aliens_shot).toBeGreaterThan(0);
    expect(metrics.aliens_shot).toBeLessThan(4);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, aliens_shot: 0, used_repeat: 0 }
    });
  });
});
