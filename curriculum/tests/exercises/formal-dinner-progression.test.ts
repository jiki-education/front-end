import { describe, expect, it } from "vitest";
import formalDinnerExercise from "../../src/exercises/formal-dinner";
import { progressionMetrics } from "../../src/exercises/formal-dinner/progressionMetrics";
import solutionJavascript from "../../src/exercises/formal-dinner/solution.javascript?raw";
import stubJavascript from "../../src/exercises/formal-dinner/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "javascript") {
  const results = runExerciseTests(formalDinnerExercise, studentCode, language);
  const runs = buildScenarioRuns(results, formalDinnerExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = {
  score: 0,
  metrics: { scenarios: 0, reads_matching_table: 0, returns_table: 0, loc: 0 }
};

// Never looks anything up: passes only the scenarios whose answer is the
// no-table string.
const ALWAYS_NO_TABLE_ATTEMPT = `function tableFor(names, tables, guest) {
  return "No table found"
}`;

// The matching is right, but it reads a fixed index, so it only returns the
// right table when the guest happens to sit first.
const FIXED_INDEX_ATTEMPT = `function tableFor(names, tables, guest) {
  const surname = guest.split(" ").slice(1).join(" ")
  for (let i = 0; i < names.length; i++) {
    if (names[i].endsWith(" " + surname)) {
      return tables[0]
    }
  }
  return "No table found"
}`;

// Parallel lookup right, but no word boundary before the surname, so "Pitt"
// matches "Ada Spitt".
const NO_BOUNDARY_ATTEMPT = `function tableFor(names, tables, guest) {
  const surname = guest.split(" ").slice(1).join(" ")
  for (let i = 0; i < names.length; i++) {
    if (names[i].endsWith(surname)) {
      return tables[i]
    }
  }
  return "No table found"
}`;

// Correct, but rebuilds the surname by hand instead of using slice and join,
// so it overshoots the nine-line budget.
const LONG_ATTEMPT = `function tableFor(names, tables, guest) {
  const parts = guest.split(" ")
  let surname = ""
  for (let i = 1; i < parts.length; i++) {
    if (i > 1) {
      surname = surname + " "
    }
    surname = surname + parts[i]
  }
  for (let i = 0; i < names.length; i++) {
    if (names[i].endsWith(" " + surname)) {
      return tables[i]
    }
  }
  return "No table found"
}`;

describe("formal-dinner progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, reads_matching_table: 6, returns_table: 2, loc: 3 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual(ZERO);
  });

  it("scores only the scenarios it fluked for always returning the no-table string", () => {
    // The five not-seated scenarios pass: 5 of 9.
    expect(runProgression(ALWAYS_NO_TABLE_ATTEMPT)).toEqual({
      score: 6,
      metrics: { scenarios: 6, reads_matching_table: 0, returns_table: 0, loc: 0 }
    });
  });

  it("scores returns_table but almost no reads_matching_table for a fixed index", () => {
    // name-present plus the not-seated scenarios pass: 6 of 9. Of the five
    // runs returning a table, only name-present's guest sits at index 0.
    expect(runProgression(FIXED_INDEX_ATTEMPT)).toEqual({
      score: 10,
      metrics: { scenarios: 7, reads_matching_table: 1, returns_table: 2, loc: 0 }
    });
  });

  it("scores most of reads_matching_table when only the word boundary is missing", () => {
    // Only partial-surname fails: 8 of 9. Its returned table belongs to
    // "Ada Spitt", which is not a match.
    expect(runProgression(NO_BOUNDARY_ATTEMPT)).toEqual({
      score: 16,
      metrics: { scenarios: 9, reads_matching_table: 5, returns_table: 2, loc: 0 }
    });
  });

  it("scores partial loc for a correct solution over the line budget", () => {
    // Over the nine-line target, so loc scales down.
    expect(runProgression(LONG_ATTEMPT)).toEqual({
      score: 20,
      metrics: { scenarios: 10, reads_matching_table: 6, returns_table: 2, loc: 2 }
    });
  });
});
