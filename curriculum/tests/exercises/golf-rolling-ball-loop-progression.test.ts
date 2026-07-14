import { describe, expect, it } from "vitest";
import golfExercise from "../../src/exercises/golf-rolling-ball-loop";
import { progression } from "../../src/exercises/golf-rolling-ball-loop/progression";
import solution from "../../src/exercises/golf-rolling-ball-loop/solution.jiki?raw";
import stub from "../../src/exercises/golf-rolling-ball-loop/stub.jiki?raw";
import type { ScenarioRuns } from "../../src/exercises/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";

// Mirrors the app's progression evaluator: run the visible scenarios, compute
// the fixed 10-point scenarios anchor, then hand the run artifacts to each
// metric (clamped to 0..maxScore, converted to integer points).
function runProgression(studentCode: string): Record<string, number> {
  const results = runExerciseTests(golfExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results);

  // Golf has no bonus scenarios, so every result counts toward the anchor.
  const passing = results.filter((r) => r.status === "pass").length;
  const scores: Record<string, number> = {
    scenarios: Math.round((passing / results.length) * 10)
  };
  for (const metric of progression.metrics) {
    scores[metric.name] = scoreMetric(metric.name, runs);
  }
  return scores;
}

function scoreMetric(name: string, runs: ScenarioRuns): number {
  const metric = progression.metrics.find((m) => m.name === name)!;
  let raw: number;
  try {
    raw = metric.score(runs, "jikiscript");
  } catch {
    raw = 0;
  }
  const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
  return Math.round((metric.points * clamped) / metric.maxScore);
}

const UNROLLED_SOLUTION = Array.from({ length: 60 }, () => "roll()").join("\n");

const PARTIAL_LOOP_ATTEMPT = `repeat 30 times do
  roll()
end`;

describe("golf-rolling-ball-loop progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({ scenarios: 10, distance: 5, used_loop: 10, precision: 2 });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({ scenarios: 0, distance: 0, used_loop: 0, precision: 0 });
  });

  it("scores distance and precision but NOT used-loop for a hand-unrolled solution", () => {
    const scores = runProgression(UNROLLED_SOLUTION);

    // The scenario itself fails its lines-of-code check, so no anchor points.
    expect(scores).toEqual({ scenarios: 0, distance: 5, used_loop: 0, precision: 2 });
  });

  it("scores partial distance plus used-loop for a repeat 30 attempt", () => {
    const scores = runProgression(PARTIAL_LOOP_ATTEMPT);

    // Ball reaches 58: 30 of the 60 steps toward the hole => half distance points.
    expect(scores.scenarios).toBe(0);
    expect(scores.distance).toBeGreaterThan(0);
    expect(scores.distance).toBeLessThan(5);
    expect(scores.used_loop).toBe(10);
    expect(scores.precision).toBe(0);
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const runs = buildScenarioRuns([]);

    for (const metric of progression.metrics) {
      expect(scoreMetric(metric.name, runs)).toBe(0);
    }
  });
});
