import { describe, expect, it } from "vitest";
import afterPartyExercise from "../../src/exercises/after-party";
import { progressionMetrics } from "../../src/exercises/after-party/progressionMetrics";
import solutionJavascript from "../../src/exercises/after-party/solution.javascript?raw";
import stubJavascript from "../../src/exercises/after-party/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "javascript") {
  const results = runExerciseTests(afterPartyExercise, studentCode, language);
  const runs = buildScenarioRuns(results, afterPartyExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = {
  score: 0,
  metrics: { scenarios: 0, reads_matching_plus_ones: 0, returns_number: 0 }
};

// Never looks anything up: passes only the scenarios whose answer is the
// not-on-the-list string.
const ALWAYS_NOT_ON_LIST_ATTEMPT = `function plusOnesFor(names, plusOnes, person) {
  return "Not on the list!"
}`;

// The matching is right, but it reads a fixed index (the classic
// parallel-arrays slip), so every number it returns belongs to Brian May.
const FIXED_INDEX_ATTEMPT = `function plusOnesFor(names, plusOnes, person) {
  for (let i = 0; i < names.length; i++) {
    if (names[i] === person || names[i].startsWith(person + " ")) {
      return plusOnes[0]
    }
  }
  return "Not on the list!"
}`;

// Parallel lookup right, but only exact matches, so first names never match
// a full name (only Cher does).
const EXACT_MATCH_ATTEMPT = `function plusOnesFor(names, plusOnes, person) {
  for (let i = 0; i < names.length; i++) {
    if (names[i] === person) {
      return plusOnes[i]
    }
  }
  return "Not on the list!"
}`;

// Parallel lookup right, but no word boundary, so "Brad" matches "Bradley
// Cooper".
const NO_BOUNDARY_ATTEMPT = `function plusOnesFor(names, plusOnes, person) {
  for (let i = 0; i < names.length; i++) {
    if (names[i].startsWith(person)) {
      return plusOnes[i]
    }
  }
  return "Not on the list!"
}`;

describe("after-party progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 18,
      metrics: { scenarios: 10, reads_matching_plus_ones: 6, returns_number: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual(ZERO);
  });

  it("scores only the scenarios it fluked for always returning the not-on-the-list string", () => {
    // empty-list, name-missing, similar-name and cheryl pass: 4 of 9.
    expect(runProgression(ALWAYS_NOT_ON_LIST_ATTEMPT)).toEqual({
      score: 4,
      metrics: { scenarios: 4, reads_matching_plus_ones: 0, returns_number: 0 }
    });
  });

  it("scores returns_number but no reads_matching_plus_ones for a fixed index", () => {
    // Only the not-on-the-list scenarios pass: 4 of 9.
    expect(runProgression(FIXED_INDEX_ATTEMPT)).toEqual({
      score: 6,
      metrics: { scenarios: 4, reads_matching_plus_ones: 0, returns_number: 2 }
    });
  });

  it("scores the full parallel lookup when only exact names match", () => {
    // The not-on-the-list scenarios plus cher pass: 5 of 9.
    expect(runProgression(EXACT_MATCH_ATTEMPT)).toEqual({
      score: 14,
      metrics: { scenarios: 6, reads_matching_plus_ones: 6, returns_number: 2 }
    });
  });

  it("scores the full parallel lookup when only the word boundary is missing", () => {
    // Only similar-name fails: 8 of 9.
    expect(runProgression(NO_BOUNDARY_ATTEMPT)).toEqual({
      score: 17,
      metrics: { scenarios: 9, reads_matching_plus_ones: 6, returns_number: 2 }
    });
  });
});
