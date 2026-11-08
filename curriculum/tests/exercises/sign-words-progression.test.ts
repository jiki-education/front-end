import { describe, expect, it } from "vitest";
import signWordsExercise from "../../src/exercises/sign-words";
import { progressionMetrics } from "../../src/exercises/sign-words/progressionMetrics";
import solutionJavascript from "../../src/exercises/sign-words/solution.javascript?raw";
import stubJavascript from "../../src/exercises/sign-words/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(signWordsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, signWordsExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Returns split()'s result directly: the double space leaves an empty piece.
const RETURNS_SPLIT_ATTEMPT = `function signWords(businessName) {
  return businessName.split(" ")
}`;

// Pushes every piece, but has no guard against the empty ones.
const NO_EMPTY_GUARD_ATTEMPT = `function signWords(businessName) {
  let words = []
  for (const chunk of businessName.split(" ")) {
    words.push(chunk)
  }
  return words
}`;

// The manual route without the final push after the loop, so the last word
// of every name is lost.
const MISSING_FINAL_WORD_ATTEMPT = `function signWords(businessName) {
  let words = []
  let word = ""
  for (const letter of businessName) {
    if (letter === " ") {
      if (word !== "") {
        words.push(word)
      }
      word = ""
    } else {
      word = word + letter
    }
  }
  return words
}`;

describe("sign-words progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, words_found: 5, builds_with_push: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, words_found: 0, builds_with_push: 0 }
    });
  });

  it("scores every word but no push for returning split() directly", () => {
    // Only double-space fails: 3 of 4 scenarios.
    expect(runProgression(RETURNS_SPLIT_ATTEMPT, "javascript")).toEqual({
      score: 13,
      metrics: { scenarios: 8, words_found: 5, builds_with_push: 0 }
    });
  });

  it("scores both metrics when only the empty-piece guard is missing", () => {
    expect(runProgression(NO_EMPTY_GUARD_ATTEMPT, "javascript")).toEqual({
      score: 17,
      metrics: { scenarios: 8, words_found: 5, builds_with_push: 4 }
    });
  });

  it("scores partial words_found when the final word is never pushed", () => {
    // Every scenario fails. Words found: 0/1, 1/2, 3/4 and 1/2, averaging 0.44.
    expect(runProgression(MISSING_FINAL_WORD_ATTEMPT, "javascript")).toEqual({
      score: 6,
      metrics: { scenarios: 0, words_found: 2, builds_with_push: 4 }
    });
  });
});
