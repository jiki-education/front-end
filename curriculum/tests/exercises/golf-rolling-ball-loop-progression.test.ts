import { describe, expect, it } from "vitest";
import golfExercise from "../../src/exercises/golf-rolling-ball-loop";
import { progressionTest } from "../../src/exercises/golf-rolling-ball-loop/progressionTest";
import solution from "../../src/exercises/golf-rolling-ball-loop/solution.jiki?raw";
import stub from "../../src/exercises/golf-rolling-ball-loop/stub.jiki?raw";
import type { ScenarioRuns } from "../../src/exercises/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";

// Mirrors the app's progression evaluator scoring: run the visible scenarios,
// hand the run artifacts to each metric, clamp to 0..maxScore, and convert to
// integer points.
function runProgression(studentCode: string): number[] {
  const results = runExerciseTests(golfExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results);
  return scoreMetrics(runs);
}

function scoreMetrics(runs: ScenarioRuns): number[] {
  return progressionTest.metrics.map((metric) => {
    let raw: number;
    try {
      raw = metric.score(runs, "jikiscript");
    } catch {
      raw = 0;
    }
    const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
    return Math.round((metric.points * clamped) / metric.maxScore);
  });
}

function total(scores: number[]): number {
  return scores.reduce((sum, s) => sum + s, 0);
}

const UNROLLED_SOLUTION = Array.from({ length: 60 }, () => "roll()").join("\n");

const PARTIAL_LOOP_ATTEMPT = `repeat 30 times do
  roll()
end`;

describe("golf-rolling-ball-loop progression test", () => {
  it("scores full marks (17) for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual([5, 10, 2]);
    expect(total(scores)).toBe(17);
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual([0, 0, 0]);
    expect(total(scores)).toBe(0);
  });

  it("scores distance and precision but NOT used-loop for a hand-unrolled solution", () => {
    const scores = runProgression(UNROLLED_SOLUTION);

    expect(scores).toEqual([5, 0, 2]);
  });

  it("scores partial distance plus used-loop for a repeat 30 attempt", () => {
    const scores = runProgression(PARTIAL_LOOP_ATTEMPT);

    // Ball reaches 58: 30 of the 60 steps toward the hole => half distance points.
    expect(scores[0]).toBeGreaterThan(0);
    expect(scores[0]).toBeLessThan(5);
    expect(scores[1]).toBe(10);
    expect(scores[2]).toBe(0);
  });

  it("scores 0 across the board when no scenario runs are available", () => {
    const scores = scoreMetrics(buildScenarioRuns([]));

    expect(scores).toEqual([0, 0, 0]);
  });
});
