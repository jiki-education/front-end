import { describe, expect, it } from "vitest";
import stockMarketExercise from "../../src/exercises/stock-market";
import { progressionMetrics } from "../../src/exercises/stock-market/progressionMetrics";
import solution from "../../src/exercises/stock-market/solution.jiki?raw";
import stub from "../../src/exercises/stock-market/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// The growth rates are random every run, so the metrics only measure
// structural properties (calls made, reports filed) - never balances.
function runProgression(studentCode: string) {
  const results = runExerciseTests(stockMarketExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, stockMarketExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

const START_YEAR = new Date().getFullYear();

// Loops and reports for 20 years but invents a fixed growth rate.
const FIXED_RATE_LOOP = `set money to 10
set year to ${START_YEAR}
repeat 20 times do
  change money to money * 1.05
  report_tax(year, money)
  change year to year + 1
end`;

// Checked the market once, did nothing with it.
const SINGLE_GROWTH_CHECK = `set growth to market_growth(${START_YEAR})`;

describe("stock-market progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 25,
      metrics: { scenarios: 10, used_market_growth: 8, years_reported: 4, used_loop: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_market_growth: 0, years_reported: 0, used_loop: 0 }
    });
  });

  it("scores full years-reported but nothing else for a made-up fixed growth rate", () => {
    const scores = runProgression(FIXED_RATE_LOOP);

    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, used_market_growth: 0, years_reported: 4, used_loop: 0 }
    });
  });

  it("scores used-market-growth for a single throwaway market check", () => {
    const scores = runProgression(SINGLE_GROWTH_CHECK);

    // One runtime call proves the concept but not the loop.
    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 0, used_market_growth: 8, years_reported: 0, used_loop: 0 }
    });
  });
});
