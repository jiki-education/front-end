import { describe, expect, it } from "vitest";
import caesarCipherExercise from "../../src/exercises/caesar-cipher";
import { progressionMetrics } from "../../src/exercises/caesar-cipher/progressionMetrics";
import solutionJavascript from "../../src/exercises/caesar-cipher/solution.javascript?raw";
import stubJavascript from "../../src/exercises/caesar-cipher/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(caesarCipherExercise, studentCode, language);
  const runs = buildScenarioRuns(results, caesarCipherExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Returns the message unchanged.
const ECHO_ATTEMPT = `function encode(message, shift) {
  return message
}`;

// Decomposes into a helper, but never wraps past z.
const NO_WRAP_ATTEMPT = `function shiftLetter(letter, amount) {
  let alphabet = "abcdefghijklmnopqrstuvwxyz"
  let pos = alphabet.indexOf(letter)
  if (pos === -1) {
    return letter
  }
  return alphabet[pos + amount]
}

function encode(message, shift) {
  let result = ""
  for (const char of message) {
    result = result + shiftLetter(char, shift)
  }
  return result
}`;

// Wraps correctly, all inside encode, but shifts the spaces too.
const INLINE_SHIFTS_SPACES_ATTEMPT = `function encode(message, shift) {
  let alphabet = "abcdefghijklmnopqrstuvwxyz"
  let result = ""
  for (const char of message) {
    let pos = alphabet.indexOf(char)
    result = result + alphabet[(pos + shift) % 26]
  }
  return result
}`;

describe("caesar-cipher progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, message_progress: 6, uses_helper: 3, uses_modulo: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, message_progress: 0, uses_helper: 0, uses_modulo: 0 }
    });
  });

  it("scores 0 for echoing the message back", () => {
    // message_progress measures movement away from the input, so an echo earns nothing.
    expect(runProgression(ECHO_ATTEMPT, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, message_progress: 0, uses_helper: 0, uses_modulo: 0 }
    });
  });

  it("credits the helper when the wrap is missing", () => {
    // The three messages that wrap error out; the two that don't are right.
    expect(runProgression(NO_WRAP_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 4, message_progress: 2, uses_helper: 3, uses_modulo: 0 }
    });
  });

  it("credits nearly-right messages when spaces are shifted", () => {
    // The two messages with spaces fail, but only at the spaces.
    expect(runProgression(INLINE_SHIFTS_SPACES_ATTEMPT, "javascript")).toEqual({
      score: 14,
      metrics: { scenarios: 6, message_progress: 6, uses_helper: 0, uses_modulo: 2 }
    });
  });
});
