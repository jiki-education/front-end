import { describe, expect, it } from "vitest";
import hammingExercise from "../../src/exercises/hamming";
import { progressionMetrics } from "../../src/exercises/hamming/progressionMetrics";
import solutionJavascript from "../../src/exercises/hamming/solution.javascript?raw";
import stubJavascript from "../../src/exercises/hamming/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(hammingExercise, studentCode, language);
  const runs = buildScenarioRuns(results, hammingExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Returns 0 without looking at the strands.
const RETURN_ZERO_ATTEMPT = `function hammingDistance(str1, str2) {
  return 0
}`;

// Walks the strand but counts every letter instead of comparing.
const COUNT_EVERY_LETTER_ATTEMPT = `function hammingDistance(str1, str2) {
  let distance = 0
  for (const letter of str1) {
    distance = distance + 1
  }
  return distance
}`;

// Compares, but counts the matches instead of the differences.
const COUNTS_MATCHES_ATTEMPT = `function hammingDistance(str1, str2) {
  let counter = 0
  let distance = 0
  for (const letter of str1) {
    if (letter === str2[counter]) {
      distance = distance + 1
    }
    counter = counter + 1
  }
  return distance
}`;

// The usual stumble: the index moves before the comparison, so each letter
// is compared with its neighbour.
const OFF_BY_ONE_ATTEMPT = `function hammingDistance(str1, str2) {
  let counter = 0
  let distance = 0
  for (const letter of str1) {
    counter = counter + 1
    if (letter !== str2[counter]) {
      distance = distance + 1
    }
  }
  return distance
}`;

describe("hamming progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, walks_strand: 4, compares_letters: 3, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, walks_strand: 0, compares_letters: 0, loc: 0 }
    });
  });

  it("scores only the scenarios a constant 0 happens to pass", () => {
    // Three of the five scenarios expect 0.
    expect(runProgression(RETURN_ZERO_ATTEMPT, "javascript")).toEqual({
      score: 6,
      metrics: { scenarios: 6, walks_strand: 0, compares_letters: 0, loc: 0 }
    });
  });

  it("credits the walk but not the comparison when every letter is counted", () => {
    // Only the empty strands and the single differing letter pass: 2 of 5.
    expect(runProgression(COUNT_EVERY_LETTER_ATTEMPT, "javascript")).toEqual({
      score: 8,
      metrics: { scenarios: 4, walks_strand: 4, compares_letters: 0, loc: 0 }
    });
  });

  it("credits the walk and the comparison when matches are counted instead", () => {
    // Only the empty strands pass: 1 of 5.
    expect(runProgression(COUNTS_MATCHES_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 2, walks_strand: 4, compares_letters: 3, loc: 0 }
    });
  });

  it("credits the walk and the comparison through an off-by-one index", () => {
    // Reading one past the end of str2 is a runtime error, so only the
    // empty strands pass (1 of 5). The loop still walked the whole strand.
    expect(runProgression(OFF_BY_ONE_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 2, walks_strand: 4, compares_letters: 3, loc: 0 }
    });
  });
});
