import { describe, expect, it } from "vitest";
import lunchboxExercise from "../../src/exercises/lunchbox";
import { progressionMetrics } from "../../src/exercises/lunchbox/progressionMetrics";
import solutionJavascript from "../../src/exercises/lunchbox/solution.javascript?raw";
import stubJavascript from "../../src/exercises/lunchbox/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(lunchboxExercise, studentCode, language);
  const runs = buildScenarioRuns(results, lunchboxExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// The main trap: walks the items largest-first, so "pack-the-most" packs the
// water bottle and both arrays come out in the wrong order.
const LARGEST_FIRST_ATTEMPT = `function packLunch(items, capacity) {
  let lunchbox = []
  let backpack = []
  let total = 0
  for (const item of items) {
    if (total + item[1] <= capacity) {
      lunchbox.push(item[0])
      total = total + item[1]
    } else {
      backpack.push(item[0])
    }
  }
  return [lunchbox, backpack]
}`;

// Right logic, but pushes the [name, size] pairs instead of the names.
const PUSHES_PAIRS_ATTEMPT = `function packLunch(items, capacity) {
  let lunchbox = []
  let backpack = []
  let total = 0
  for (const item of items.toReversed()) {
    if (total + item[1] <= capacity) {
      lunchbox.push(item)
      total = total + item[1]
    } else {
      backpack.push(item)
    }
  }
  return [lunchbox, backpack]
}`;

// Solves the main task, but over the bonus line limit (20 lines against 16).
const VERBOSE_SOLUTION = `function packLunch(items, capacity) {
  let lunchbox = []
  let backpack = []
  let total = 0
  let smallestFirst = items.toReversed()
  for (const item of smallestFirst) {
    const name = item[0]
    const size = item[1]
    const newTotal = total + size
    const fits = newTotal <= capacity
    if (fits) {
      lunchbox.push(name)
      total = newTotal
    } else {
      backpack.push(name)
    }
  }
  let result = [lunchbox, backpack]
  return result
}`;

describe("lunchbox progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, items_placed: 5, returns_two_arrays: 2, loc: 3 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, items_placed: 0, returns_two_arrays: 0, loc: 0 }
    });
  });

  it("scores most items_placed for walking the items largest-first", () => {
    // Only "empty-lunchbox" passes. Placement is right everywhere except
    // "pack-the-most" (0 of 5): 3 of 4 scenarios' worth.
    expect(runProgression(LARGEST_FIRST_ATTEMPT, "javascript")).toEqual({
      score: 8,
      metrics: { scenarios: 2, items_placed: 4, returns_two_arrays: 2, loc: 0 }
    });
  });

  it("scores full items_placed for pushing pairs instead of names", () => {
    expect(runProgression(PUSHES_PAIRS_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 2, items_placed: 5, returns_two_arrays: 2, loc: 0 }
    });
  });

  it("scores partial loc for a solve over the bonus line limit", () => {
    // 16 / 20 lines of the 3 loc points.
    expect(runProgression(VERBOSE_SOLUTION, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, items_placed: 5, returns_two_arrays: 2, loc: 2 }
    });
  });
});
