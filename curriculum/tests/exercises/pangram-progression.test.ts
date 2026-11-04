import { describe, expect, it } from "vitest";
import pangramExercise from "../../src/exercises/pangram";
import { progressionMetrics } from "../../src/exercises/pangram/progressionMetrics";
import lowerPangramSolutionJavascript from "../../src/exercises/lower-pangram/solution.javascript?raw";
import solutionJavascript from "../../src/exercises/pangram/solution.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(pangramExercise, studentCode, language);
  const runs = buildScenarioRuns(results, pangramExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const HELPERS = `function includes(haystack, needle) {
  for (const character of haystack) {
    if (needle === character) {
      return true
    }
  }
  return false
}

function indexOf(haystack, needle) {
  let idx = 0
  for (const letter of haystack) {
    if (needle === letter) {
      return idx
    }
    idx = idx + 1
  }
  return -1
}
`;

// A working toLowerCase, but isPangram calls it without keeping the result.
const RESULT_DISCARDED_ATTEMPT = `${HELPERS}
function toLowerCase(someString) {
  let output = ""
  for (const char of someString) {
    if (includes("abcdefghijklmnopqrstuvwxyz", char)) {
      output = output + char
    } else {
      let upperIdx = indexOf("ABCDEFGHIJKLMNOPQRSTUVWXYZ", char)
      if (upperIdx !== -1) {
        output = output + "abcdefghijklmnopqrstuvwxyz"[upperIdx]
      }
    }
  }
  return output
}

function isPangram(sentence) {
  toLowerCase(sentence)
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false
    }
  }
  return true
}`;

// indexOf works, but toLowerCase only converts uppercase letters and forgets
// to keep the lowercase ones, so whole words vanish.
const DROPS_LOWERCASE_ATTEMPT = `${HELPERS}
function toLowerCase(someString) {
  let output = ""
  for (const char of someString) {
    let upperIdx = indexOf("ABCDEFGHIJKLMNOPQRSTUVWXYZ", char)
    if (upperIdx !== -1) {
      output = output + "abcdefghijklmnopqrstuvwxyz"[upperIdx]
    }
  }
  return output
}

function isPangram(sentence) {
  sentence = toLowerCase(sentence)
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false
    }
  }
  return true
}`;

describe("pangram progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, lowercases_text: 8, index_of_correct: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    // The raw stub is a {{LESSON:...}} placeholder, which never parses.
    expect(runProgression("{{LESSON:lower-pangram}}", "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, lowercases_text: 0, index_of_correct: 0 }
    });
  });

  it("scores only the baseline for the carried-in lower-pangram code", () => {
    // Every scenario but the mixed-case one already passes: 10 of 11.
    expect(runProgression(lowerPangramSolutionJavascript, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 9, lowercases_text: 0, index_of_correct: 0 }
    });
  });

  it("scores index_of but not lowercases_text when toLowerCase drops lowercase letters", () => {
    // Every sentence now looks incomplete, so only the five "false" scenarios
    // pass: the score drops below the carried-in code, which the high-water
    // mark absorbs, while index_of shows the new helper works.
    expect(runProgression(DROPS_LOWERCASE_ATTEMPT, "javascript")).toEqual({
      score: 8,
      metrics: { scenarios: 5, lowercases_text: 0, index_of_correct: 3 }
    });
  });

  it("scores both helpers when toLowerCase works but its result is discarded", () => {
    // Same scenarios as the carried-in code: only the mixed-case one fails.
    expect(runProgression(RESULT_DISCARDED_ATTEMPT, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 9, lowercases_text: 8, index_of_correct: 3 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    expect(runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, lowercases_text: 0, index_of_correct: 0 }
    });
  });
});
