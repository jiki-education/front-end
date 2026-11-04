import { describe, expect, it } from "vitest";
import alphanumericExercise from "../../src/exercises/alphanumeric";
import { progressionMetrics } from "../../src/exercises/alphanumeric/progressionMetrics";
import solutionJavascript from "../../src/exercises/alphanumeric/solution.javascript?raw";
import stubJavascript from "../../src/exercises/alphanumeric/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(alphanumericExercise, studentCode, language);
  const runs = buildScenarioRuns(results, alphanumericExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Only isAlpha exists, and whatAmI falls back to "Unknown" for everything else.
const ONE_HELPER_ATTEMPT = `function isAlpha(string) {
  for (const char of string) {
    if (!"QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(char)) {
      return false
    }
  }
  return true
}

function whatAmI(string) {
  if (isAlpha(string)) {
    return "Alpha"
  }
  return "Unknown"
}`;

// All three helpers are composed, but isAlpha/isNumeric answer "contains any" instead of "only".
const BUGGY_HELPERS_ATTEMPT = `function isAlpha(string) {
  for (const char of string) {
    if ("QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(char)) {
      return true
    }
  }
  return false
}

function isNumeric(string) {
  for (const char of string) {
    if ("0123456789".includes(char)) {
      return true
    }
  }
  return false
}

function isAlphanumeric(string) {
  return isAlpha(string) || isNumeric(string)
}

function whatAmI(string) {
  if (isAlpha(string) && isNumeric(string)) {
    return "Alphanumeric"
  } else if (isAlpha(string)) {
    return "Alpha"
  } else if (isNumeric(string)) {
    return "Numeric"
  }
  return "Unknown"
}`;

// Correct helpers, but whatAmI checks Alphanumeric first so Alpha and Numeric collapse into it.
const ORDER_TRAP_ATTEMPT = `function isAlpha(string) {
  for (const char of string) {
    if (!"QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(char)) {
      return false
    }
  }
  return true
}

function isNumeric(string) {
  for (const char of string) {
    if (!"0123456789".includes(char)) {
      return false
    }
  }
  return true
}

function isAlphanumeric(string) {
  for (const char of string) {
    if (isAlpha(char) || isNumeric(char)) {
      continue
    }
    return false
  }
  return true
}

function whatAmI(string) {
  if (isAlphanumeric(string)) {
    return "Alphanumeric"
  } else if (isAlpha(string)) {
    return "Alpha"
  } else if (isNumeric(string)) {
    return "Numeric"
  }
  return "Unknown"
}`;

describe("alphanumeric progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 18,
      metrics: { scenarios: 10, helpers_composed: 4, helpers_correct: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, helpers_composed: 0, helpers_correct: 0 }
    });
  });

  it("credits one correct helper", () => {
    // One of three helpers composed; every logged helper call is right.
    expect(runProgression(ONE_HELPER_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 4, helpers_composed: 1, helpers_correct: 4 }
    });
  });

  it("credits composition but not the buggy helpers", () => {
    // Half of the logged helper calls give the wrong answer.
    expect(runProgression(BUGGY_HELPERS_ATTEMPT, "javascript")).toEqual({
      score: 11,
      metrics: { scenarios: 6, helpers_composed: 3, helpers_correct: 2 }
    });
  });

  it("credits correct helpers despite the ordering trap", () => {
    // The helpers are fully right; only the two ordering scenarios fail.
    expect(runProgression(ORDER_TRAP_ATTEMPT, "javascript")).toEqual({
      score: 14,
      metrics: { scenarios: 6, helpers_composed: 4, helpers_correct: 4 }
    });
  });
});
