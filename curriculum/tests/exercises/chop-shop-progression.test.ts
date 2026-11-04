import { describe, expect, it } from "vitest";
import chopShopExercise from "../../src/exercises/chop-shop";
import { progressionMetrics } from "../../src/exercises/chop-shop/progressionMetrics";
import solutionJavascript from "../../src/exercises/chop-shop/solution.javascript?raw";
import stubJavascript from "../../src/exercises/chop-shop/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(chopShopExercise, studentCode, language);
  const runs = buildScenarioRuns(results, chopShopExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = { score: 0, metrics: { scenarios: 0, has_time_lookup: 0, times_every_cut: 0, uses_cuts_table: 0 } };

// Always answers yes, which happens to pass four of the six scenarios.
const ALWAYS_TRUE_ATTEMPT = `function canFitIn(queue, nextCut, time) {
  return true
}`;

// A working solution whose lookup is a chain of ifs instead of the table.
const IF_CHAIN_SOLUTION = `function nameToTime(name) {
  if (name === "Mohawk") {
    return 20
  } else if (name === "Slicked-Back Pixie") {
    return 15
  } else if (name === "Bob") {
    return 25
  } else if (name === "Shave and Polish") {
    return 15
  } else if (name === "Afro Trim") {
    return 45
  }
  return 30
}

function canFitIn(queue, nextCut, time) {
  let remaining = time
  for (const haircut of queue) {
    remaining = remaining - nameToTime(haircut)
  }
  return remaining >= nameToTime(nextCut)
}`;

// The full table and lookup, but the queue is never accounted for.
const IGNORES_QUEUE_ATTEMPT = `let cuts = [
  ["Mohawk", 20],
  ["Slicked-Back Pixie", 15],
  ["Bob", 25],
  ["Shave and Polish", 15],
  ["Afro Trim", 45],
  ["Up-do", 30]
]

function nameToTime(name) {
  for (const cut of cuts) {
    if (cut[0] === name) {
      return cut[1]
    }
  }
}

function canFitIn(queue, nextCut, time) {
  return time >= nameToTime(nextCut)
}`;

describe("chop-shop progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, has_time_lookup: 3, times_every_cut: 3, uses_cuts_table: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual(ZERO);
  });

  it("scores only the scenarios a constant yes happens to pass", () => {
    expect(runProgression(ALWAYS_TRUE_ATTEMPT, "javascript")).toEqual({
      score: 7,
      metrics: { scenarios: 7, has_time_lookup: 0, times_every_cut: 0, uses_cuts_table: 0 }
    });
  });

  it("scores everything but uses_cuts_table for an if-chain lookup", () => {
    expect(runProgression(IF_CHAIN_SOLUTION, "javascript")).toEqual({
      score: 16,
      metrics: { scenarios: 10, has_time_lookup: 3, times_every_cut: 3, uses_cuts_table: 0 }
    });
  });

  it("scores the lookup and table but barely any times_every_cut when the queue is ignored", () => {
    // "busy-day-no-time" fails: 5 of 6 scenarios. Only the newcomer's cut is
    // timed in the busiest scenario: 1 of 7.
    expect(runProgression(IGNORES_QUEUE_ATTEMPT, "javascript")).toEqual({
      score: 15,
      metrics: { scenarios: 8, has_time_lookup: 3, times_every_cut: 0, uses_cuts_table: 4 }
    });
  });
});
