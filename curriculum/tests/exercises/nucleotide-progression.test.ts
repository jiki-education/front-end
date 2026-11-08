import { describe, expect, it } from "vitest";
import nucleotideExercise from "../../src/exercises/nucleotide";
import { progressionMetrics } from "../../src/exercises/nucleotide/progressionMetrics";
import solutionJavascript from "../../src/exercises/nucleotide/solution.javascript?raw";
import stubJavascript from "../../src/exercises/nucleotide/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(nucleotideExercise, studentCode, language);
  const runs = buildScenarioRuns(results, nucleotideExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Every scenario passes, but validation is a chain of comparisons rather
// than a membership check.
const COMPARISON_CHAIN_ATTEMPT = `function isValid(letter) {
  return letter === "A" || letter === "C" || letter === "G" || letter === "T"
}

function countNucleotide(strand, nucleotide) {
  if (!isValid(nucleotide)) {
    return -1
  }
  let count = 0
  for (const letter of strand) {
    if (!isValid(letter)) {
      return -1
    }
    if (letter === nucleotide) {
      count = count + 1
    }
  }
  return count
}`;

// Validates the nucleotide argument with includes, but not the strand.
const NO_STRAND_CHECK_ATTEMPT = `function countNucleotide(strand, nucleotide) {
  if (!"ACGT".includes(nucleotide)) {
    return -1
  }
  let count = 0
  for (const letter of strand) {
    if (letter === nucleotide) {
      count = count + 1
    }
  }
  return count
}`;

// Counts correctly, with no validation at all.
const COUNT_ONLY_ATTEMPT = `function countNucleotide(strand, nucleotide) {
  let count = 0
  for (const letter of strand) {
    if (letter === nucleotide) {
      count = count + 1
    }
  }
  return count
}`;

describe("nucleotide progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 18,
      metrics: { scenarios: 10, uses_membership_check: 6, returns_number: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uses_membership_check: 0, returns_number: 0 }
    });
  });

  it("scores no membership credit for a chain of comparisons", () => {
    expect(runProgression(COMPARISON_CHAIN_ATTEMPT, "javascript")).toEqual({
      score: 12,
      metrics: { scenarios: 10, uses_membership_check: 0, returns_number: 2 }
    });
  });

  it("scores the membership check when only the strand validation is missing", () => {
    // The invalid-strand scenario fails: 6 of 7.
    expect(runProgression(NO_STRAND_CHECK_ATTEMPT, "javascript")).toEqual({
      score: 17,
      metrics: { scenarios: 9, uses_membership_check: 6, returns_number: 2 }
    });
  });

  it("scores returns_number for counting with no validation", () => {
    // Both invalid-input scenarios fail: 5 of 7.
    expect(runProgression(COUNT_ONLY_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 7, uses_membership_check: 0, returns_number: 2 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    expect(runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uses_membership_check: 0, returns_number: 0 }
    });
  });
});
