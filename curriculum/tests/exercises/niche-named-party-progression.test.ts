import { describe, expect, it } from "vitest";
import nicheNamedPartyExercise from "../../src/exercises/niche-named-party";
import { progressionMetrics } from "../../src/exercises/niche-named-party/progressionMetrics";
import solutionJavascript from "../../src/exercises/niche-named-party/solution.javascript?raw";
import stubJavascript from "../../src/exercises/niche-named-party/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(nicheNamedPartyExercise, studentCode, language);
  const runs = buildScenarioRuns(results, nicheNamedPartyExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Every scenario passes, but the counting loop is pasted twice instead of
// living in a helper.
const INLINED_LOOPS_ATTEMPT = `function handleGuest(name, allowedPrefix) {
  let prefixLength = 0
  for (const letter of allowedPrefix) {
    prefixLength = prefixLength + 1
  }
  let nameLength = 0
  for (const letter of name) {
    nameLength = nameLength + 1
  }
  if (prefixLength > nameLength) {
    return false
  }

  let i = 0
  repeat(prefixLength) {
    if (allowedPrefix[i] !== name[i]) {
      return false
    }
    i = i + 1
  }
  return true
}`;

// The helper starts counting at 1, so every length is one too many.
const OFF_BY_ONE_ATTEMPT = `function getLength(someString) {
  let counter = 1
  for (const letter of someString) {
    counter = counter + 1
  }
  return counter
}

function handleGuest(name, allowedPrefix) {
  if (getLength(allowedPrefix) > getLength(name)) {
    return false
  }

  let i = 0
  repeat(getLength(allowedPrefix)) {
    if (allowedPrefix[i] !== name[i]) {
      return false
    }
    i = i + 1
  }
  return true
}`;

// A working helper used once, for the loop count, with no length guard: the
// empty name is read past its end.
const NO_GUARD_ATTEMPT = `function getLength(someString) {
  let counter = 0
  for (const letter of someString) {
    counter = counter + 1
  }
  return counter
}

function handleGuest(name, allowedPrefix) {
  let i = 0
  repeat(getLength(allowedPrefix)) {
    if (allowedPrefix[i] !== name[i]) {
      return false
    }
    i = i + 1
  }
  return true
}`;

describe("niche-named-party progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, length_helper_correct: 5, reuses_length_helper: 3, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, length_helper_correct: 0, reuses_length_helper: 0, loc: 0 }
    });
  });

  it("scores no helper credit when the counting loop is pasted twice", () => {
    // 22 lines against the 20-line target still rounds to full loc points.
    expect(runProgression(INLINED_LOOPS_ATTEMPT, "javascript")).toEqual({
      score: 12,
      metrics: { scenarios: 10, length_helper_correct: 0, reuses_length_helper: 0, loc: 2 }
    });
  });

  it("scores reuse but not correctness for an off-by-one length helper", () => {
    // The loop runs one step past the prefix, so every guest who should get
    // in is turned away: 4 of 7.
    expect(runProgression(OFF_BY_ONE_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 6, length_helper_correct: 0, reuses_length_helper: 3, loc: 0 }
    });
  });

  it("scores a correct helper without reuse when the length guard is missing", () => {
    // The two scenarios with a name shorter than the prefix fail: 5 of 7.
    expect(runProgression(NO_GUARD_ATTEMPT, "javascript")).toEqual({
      score: 12,
      metrics: { scenarios: 7, length_helper_correct: 5, reuses_length_helper: 0, loc: 0 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    expect(runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, length_helper_correct: 0, reuses_length_helper: 0, loc: 0 }
    });
  });
});
