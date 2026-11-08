import { describe, expect, it } from "vitest";
import alienDetectorExercise from "../../src/exercises/alien-detector";
import { progressionMetrics } from "../../src/exercises/alien-detector/progressionMetrics";
import solutionJavascript from "../../src/exercises/alien-detector/solution.javascript?raw";
import stubJavascript from "../../src/exercises/alien-detector/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "javascript") {
  const results = runExerciseTests(alienDetectorExercise, studentCode, language);
  const runs = buildScenarioRuns(results, alienDetectorExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = {
  score: 0,
  metrics: { scenarios: 0, aliens_shot: 0, swept_both_ways: 0, read_starting_rows: 0 }
};

// Reads only the bottom row and sweeps right once, shooting wherever it had
// an alien. The middle and top rows are never touched.
const BOTTOM_ROW_ONLY_ATTEMPT = `let row = getStartingAliensInRow(0)
let position = 0
repeat(10) {
  if (row[position]) {
    shoot()
  }
  moveRight()
  position = position + 1
}
if (row[position]) {
  shoot()
}`;

// Models all three rows and clears them as it shoots, but only sweeps right
// once, so it downs at most one alien per column.
const ONE_WAY_ATTEMPT = `let rows = [getStartingAliensInRow(0), getStartingAliensInRow(1), getStartingAliensInRow(2)]
let position = 0
repeat(10) {
  let shot = false
  for (const row of rows) {
    if (shot === false && row[position]) {
      shoot()
      row[position] = false
      shot = true
    }
  }
  moveRight()
  position = position + 1
}`;

// Sweeps back and forth across all three rows, but never marks a shot alien
// as gone, so it eventually fires at an emptied column and misses.
const NO_CLEARING_ATTEMPT = `let rows = [getStartingAliensInRow(0), getStartingAliensInRow(1), getStartingAliensInRow(2)]
let position = 0
let direction = "right"
repeat() {
  let shot = false
  for (const row of rows) {
    if (shot === false && row[position]) {
      shoot()
      shot = true
    }
  }
  if (position === 10) {
    direction = "left"
  } else if (position === 0) {
    direction = "right"
  }
  if (direction === "right") {
    moveRight()
    position = position + 1
  } else {
    moveLeft()
    position = position - 1
  }
}`;

describe("alien-detector progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, aliens_shot: 6, swept_both_ways: 3, read_starting_rows: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual(ZERO);
  });

  it("scores partial aliens and a third of the rows for a bottom-row-only sweep", () => {
    // one-alien and one-row pass: 2 of 5.
    expect(runProgression(BOTTOM_ROW_ONLY_ATTEMPT)).toEqual({
      score: 9,
      metrics: { scenarios: 4, aliens_shot: 4, swept_both_ways: 0, read_starting_rows: 1 }
    });
  });

  it("scores every row but no sweep back for a one-way pass", () => {
    // one-alien and one-row pass: 2 of 5.
    expect(runProgression(ONE_WAY_ATTEMPT)).toEqual({
      score: 10,
      metrics: { scenarios: 4, aliens_shot: 4, swept_both_ways: 0, read_starting_rows: 2 }
    });
  });

  it("scores the sweep and more aliens when only clearing the model is missing", () => {
    // one-alien and one-row pass: 2 of 5. The rest end on a missed shot.
    expect(runProgression(NO_CLEARING_ATTEMPT)).toEqual({
      score: 14,
      metrics: { scenarios: 4, aliens_shot: 5, swept_both_ways: 3, read_starting_rows: 2 }
    });
  });
});
