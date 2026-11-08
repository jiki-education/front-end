import { describe, expect, it } from "vitest";
import runLengthEncodingExercise from "../../src/exercises/run-length-encoding";
import { progressionMetrics } from "../../src/exercises/run-length-encoding/progressionMetrics";
import solutionJavascript from "../../src/exercises/run-length-encoding/solution.javascript?raw";
import stubJavascript from "../../src/exercises/run-length-encoding/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(runLengthEncodingExercise, studentCode, language);
  const runs = buildScenarioRuns(results, runLengthEncodingExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// A finished encode, with decode still the stub.
const ENCODE_ONLY_ATTEMPT = `function encode(input) {
  let result = ""
  let previous = ""
  let count = 0
  for (const char of input) {
    if (char === previous) {
      count = count + 1
    } else {
      if (count > 1) {
        result = \`\${result}\${count}\`
      }
      result = \`\${result}\${previous}\`
      previous = char
      count = 1
    }
  }
  if (count > 1) {
    result = \`\${result}\${count}\`
  }
  return \`\${result}\${previous}\`
}

function decode(input) {

}`;

// encode writes a count in front of singles and never flushes the final run; decode reads each digit as a whole count.
const FIRST_TRIES_ATTEMPT = `function encode(input) {
  let result = ""
  let previous = ""
  let count = 0
  for (const char of input) {
    if (char === previous) {
      count = count + 1
    } else {
      if (count > 0) {
        result = \`\${result}\${count}\${previous}\`
      }
      previous = char
      count = 1
    }
  }
  return result
}

function decode(input) {
  let result = ""
  let count = 1
  for (const char of input) {
    if ("0123456789".includes(char)) {
      count = Number(char)
    } else {
      for (let i = 0; i < count; i++) {
        result = \`\${result}\${char}\`
      }
      count = 1
    }
  }
  return result
}`;

describe("run-length-encoding progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 18,
      metrics: { scenarios: 10, encode_progress: 4, decode_progress: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, encode_progress: 0, decode_progress: 0 }
    });
  });

  it("credits encode and not decode", () => {
    // The two functions are graded separately, so the breakdown shows which one is stuck.
    expect(runProgression(ENCODE_ONLY_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 5, encode_progress: 4, decode_progress: 0 }
    });
  });

  it("credits near misses in both functions", () => {
    // Most scenarios fail on a character or two, so both functions earn most of their progress.
    expect(runProgression(FIRST_TRIES_ATTEMPT, "javascript")).toEqual({
      score: 11,
      metrics: { scenarios: 5, encode_progress: 3, decode_progress: 3 }
    });
  });
});
