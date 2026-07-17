import { describe, expect, it } from "vitest";
import golfScenariosExercise from "../../src/exercises/golf-scenarios";
import { progressionMetrics } from "../../src/exercises/golf-scenarios/progressionMetrics";
import solution from "../../src/exercises/golf-scenarios/solution.jiki?raw";
import stub from "../../src/exercises/golf-scenarios/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// No bonus scenarios, so every scenario counts toward the anchor.
function runProgression(studentCode: string) {
  const results = runExerciseTests(golfScenariosExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, golfScenariosExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Ignores the shot length: always rolls 20 steps (only the short shot passes).
const HARDCODED_TWENTY = `set x to 28
repeat 20 times do
  change x to x + 1
  move_to(x)
end`;

// Fetched the shot length but never moved the ball.
const FETCHED_LENGTH_ONLY = `set length to get_shot_length()`;

describe("golf-scenarios progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 22,
      metrics: { scenarios: 10, used_shot_length: 8, distance: 4 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_shot_length: 0, distance: 0 }
    });
  });

  it("scores a partial anchor and partial distance for a hardcoded 20-step roll", () => {
    const { metrics } = runProgression(HARDCODED_TWENTY);

    // Passes only the short shot: 1 of 4 scenarios.
    expect(metrics.scenarios).toBe(3);
    expect(metrics.used_shot_length).toBe(0);
    // On the 60-step shot the ball covers 20 of 60 steps.
    expect(metrics.distance).toBeGreaterThan(0);
    expect(metrics.distance).toBeLessThan(4);
  });

  it("scores used-shot-length for code that only fetches the length", () => {
    const scores = runProgression(FETCHED_LENGTH_ONLY);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, used_shot_length: 8, distance: 0 }
    });
  });
});
