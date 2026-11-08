import { describe, expect, it } from "vitest";
import acronymExercise from "../../src/exercises/acronym";
import { progressionMetrics } from "../../src/exercises/acronym/progressionMetrics";
import solutionJavascript from "../../src/exercises/acronym/solution.javascript?raw";
import stubJavascript from "../../src/exercises/acronym/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(acronymExercise, studentCode, language);
  const runs = buildScenarioRuns(results, acronymExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Takes the first character after each space, with no helpers at all.
const NAIVE_ATTEMPT = `function acronym(phrase) {
  let result = ""
  let isNewWord = true
  for (const char of phrase) {
    if (char === " ") {
      isNewWord = true
    } else if (isNewWord) {
      result = result + char
      isNewWord = false
    }
  }
  return result
}`;

// A working uppercase helper and hyphen handling, but nothing yet tests
// whether a character is a letter, so underscores and emoji slip in.
const UPPERCASE_HELPER_ATTEMPT = `function toUpper(char) {
  let lower = "abcdefghijklmnopqrstuvwxyz"
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let idx = 0
  for (const letter of lower) {
    if (letter === char) {
      return upper[idx]
    }
    idx = idx + 1
  }
  return char
}

function acronym(phrase) {
  let result = ""
  let isNewWord = true
  for (const char of phrase) {
    if (char === " " || char === "-") {
      isNewWord = true
    } else if (isNewWord) {
      result = result + toUpper(char)
      isNewWord = false
    }
  }
  return result
}`;

// A letter test that works, wired in, but the uppercase helper only maps
// the first half of the alphabet.
const HALF_ALPHABET_ATTEMPT = `function includes(text, target) {
  for (const character of text) {
    if (target === character) {
      return true
    }
  }
  return false
}

function toUpper(char) {
  let lower = "abcdefghijklm"
  let upper = "ABCDEFGHIJKLM"
  let idx = 0
  for (const letter of lower) {
    if (letter === char) {
      return upper[idx]
    }
    idx = idx + 1
  }
  return char
}

function acronym(phrase) {
  let result = ""
  let isNewWord = true
  for (const char of phrase) {
    if (char === " " || char === "-") {
      isNewWord = true
    } else if (isNewWord && includes("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", char)) {
      result = result + toUpper(char)
      isNewWord = false
    }
  }
  return result
}`;

describe("acronym progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 22,
      metrics: { scenarios: 10, uppercases_letters: 6, letter_tests_correct: 4, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uppercases_letters: 0, letter_tests_correct: 0, loc: 0 }
    });
  });

  it("scores only the baseline for the naive first-character attempt", () => {
    expect(runProgression(NAIVE_ATTEMPT, "javascript")).toEqual({
      score: 6,
      metrics: { scenarios: 6, uppercases_letters: 0, letter_tests_correct: 0, loc: 0 }
    });
  });

  it("scores uppercasing once the uppercase helper works", () => {
    expect(runProgression(UPPERCASE_HELPER_ATTEMPT, "javascript")).toEqual({
      score: 14,
      metrics: { scenarios: 8, uppercases_letters: 6, letter_tests_correct: 0, loc: 0 }
    });
  });

  it("scores partial uppercasing when the helper only knows half the alphabet", () => {
    expect(runProgression(HALF_ALPHABET_ATTEMPT, "javascript")).toEqual({
      score: 15,
      metrics: { scenarios: 8, uppercases_letters: 3, letter_tests_correct: 4, loc: 0 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    expect(runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uppercases_letters: 0, letter_tests_correct: 0, loc: 0 }
    });
  });
});
