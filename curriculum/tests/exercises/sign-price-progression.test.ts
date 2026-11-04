import { describe, expect, it } from "vitest";
import signPriceExercise from "../../src/exercises/sign-price";
import { progressionMetrics } from "../../src/exercises/sign-price/progressionMetrics";
import solutionJavascript from "../../src/exercises/sign-price/solution.javascript?raw";
import stubJavascript from "../../src/exercises/sign-price/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(signPriceExercise, studentCode, language);
  const runs = buildScenarioRuns(results, signPriceExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Counts the letters correctly but returns the bare price.
const BARE_NUMBER_ATTEMPT = `function signPrice(signText) {
  let price = 0
  for (const letter of signText) {
    if (letter !== " ") {
      price = price + 12
    }
  }
  return price
}`;

// Formats the message but charges for the spaces too.
const COUNTS_SPACES_ATTEMPT = `function signPrice(signText) {
  let price = 0
  for (const letter of signText) {
    price = price + 12
  }
  return \`That will cost $\${price}\`
}`;

describe("sign-price progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, reads_every_letter: 3, price_correct: 4, formats_message: 2, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, reads_every_letter: 0, price_correct: 0, formats_message: 0, loc: 0 }
    });
  });

  it("credits the loop and the price when the message is missing", () => {
    // Every scenario fails on the format.
    expect(runProgression(BARE_NUMBER_ATTEMPT, "javascript")).toEqual({
      score: 7,
      metrics: { scenarios: 0, reads_every_letter: 3, price_correct: 4, formats_message: 0, loc: 0 }
    });
  });

  it("credits the loop and the message when spaces are charged for", () => {
    // Only the two space-free signs pass: 2 of 6.
    expect(runProgression(COUNTS_SPACES_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 3, reads_every_letter: 3, price_correct: 1, formats_message: 2, loc: 0 }
    });
  });
});
