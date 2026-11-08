import { describe, expect, it } from "vitest";
import threeLetterAcronymExercise from "../../src/exercises/three-letter-acronym";
import { progressionMetrics } from "../../src/exercises/three-letter-acronym/progressionMetrics";
import solutionJavascript from "../../src/exercises/three-letter-acronym/solution.javascript?raw";
import stubJavascript from "../../src/exercises/three-letter-acronym/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(threeLetterAcronymExercise, studentCode, language);
  const runs = buildScenarioRuns(results, threeLetterAcronymExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// The classic slip: strings are 0-indexed, so [1] picks each second letter.
const SECOND_LETTERS_ATTEMPT = `function acronym(word1, word2, word3) {
  return word1[1] + word2[1] + word3[1]
}`;

// Takes the first word's letter but never joins the other two.
const FIRST_WORD_ONLY_ATTEMPT = `function acronym(word1, word2, word3) {
  return word1[0]
}`;

// Solves it with one variable per letter, over the bonus line limit.
const WITH_VARIABLES_ATTEMPT = `function acronym(word1, word2, word3) {
  let first = word1[0]
  let second = word2[0]
  let third = word3[0]
  return first + second + third
}`;

describe("three-letter-acronym progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 17,
      metrics: { scenarios: 10, letter_from_each_word: 5, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, letter_from_each_word: 0, loc: 0 }
    });
  });

  it("credits the shape when the wrong index is used", () => {
    expect(runProgression(SECOND_LETTERS_ATTEMPT, "javascript")).toEqual({
      score: 5,
      metrics: { scenarios: 0, letter_from_each_word: 5, loc: 0 }
    });
  });

  it("credits a third of the shape for a single letter", () => {
    expect(runProgression(FIRST_WORD_ONLY_ATTEMPT, "javascript")).toEqual({
      score: 2,
      metrics: { scenarios: 0, letter_from_each_word: 2, loc: 0 }
    });
  });

  it("scales the line-count credit for a solved but longer solution", () => {
    // Six lines against a target of three.
    expect(runProgression(WITH_VARIABLES_ATTEMPT, "javascript")).toEqual({
      score: 16,
      metrics: { scenarios: 10, letter_from_each_word: 5, loc: 1 }
    });
  });
});
