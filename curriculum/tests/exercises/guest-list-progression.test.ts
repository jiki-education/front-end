import { describe, expect, it } from "vitest";
import guestListExercise from "../../src/exercises/guest-list";
import { progressionMetrics } from "../../src/exercises/guest-list/progressionMetrics";
import solutionJavascript from "../../src/exercises/guest-list/solution.javascript?raw";
import stubJavascript from "../../src/exercises/guest-list/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "javascript") {
  const results = runExerciseTests(guestListExercise, studentCode, language);
  const runs = buildScenarioRuns(results, guestListExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = {
  score: 0,
  metrics: { scenarios: 0, counts_whole_queue: 0, returns_number: 0, loc: 0 }
};

// Returns from inside the loop at the first chancer, so it can only ever
// answer 0 or 1.
const EARLY_RETURN_ATTEMPT = `function numChancersInQueue(queue, guestList) {
  for (const person of queue) {
    if (!guestList.includes(person)) {
      return 1
    }
  }
  return 0
}`;

// Counts everyone in the queue without checking the guest list.
const QUEUE_LENGTH_ATTEMPT = `function numChancersInQueue(queue, guestList) {
  return queue.length
}`;

// Accumulates across the whole queue, but counts the invited guests instead
// of the chancers.
const COUNTS_INVITED_ATTEMPT = `function numChancersInQueue(queue, guestList) {
  let count = 0
  for (const person of queue) {
    if (guestList.includes(person)) {
      count = count + 1
    }
  }
  return count
}`;

// Correct, but hand-rolls the membership search, so it overshoots the
// nine-line budget.
const NESTED_SEARCH_ATTEMPT = `function numChancersInQueue(queue, guestList) {
  let count = 0
  for (const person of queue) {
    let found = false
    for (const guest of guestList) {
      if (guest === person) {
        found = true
      }
    }
    if (!found) {
      count = count + 1
    }
  }
  return count
}`;

describe("guest-list progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, counts_whole_queue: 5, returns_number: 2, loc: 3 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual(ZERO);
  });

  it("scores no counts_whole_queue for an early return", () => {
    // empty-queue, everyone-invited and guests-who-havent-arrived pass: 3 of 6.
    expect(runProgression(EARLY_RETURN_ATTEMPT)).toEqual({
      score: 7,
      metrics: { scenarios: 5, counts_whole_queue: 0, returns_number: 2, loc: 0 }
    });
  });

  it("scores no counts_whole_queue for returning the queue's length", () => {
    // empty-queue and everyone-chancing-it pass: 2 of 6.
    expect(runProgression(QUEUE_LENGTH_ATTEMPT)).toEqual({
      score: 5,
      metrics: { scenarios: 3, counts_whole_queue: 0, returns_number: 2, loc: 0 }
    });
  });

  it("scores counts_whole_queue for accumulating the wrong side of the check", () => {
    // empty-queue and guests-who-havent-arrived pass: 2 of 6.
    expect(runProgression(COUNTS_INVITED_ATTEMPT)).toEqual({
      score: 10,
      metrics: { scenarios: 3, counts_whole_queue: 5, returns_number: 2, loc: 0 }
    });
  });

  it("scores partial loc for a correct hand-rolled search over the line budget", () => {
    // Over the nine-line target, so loc scales down.
    expect(runProgression(NESTED_SEARCH_ATTEMPT)).toEqual({
      score: 19,
      metrics: { scenarios: 10, counts_whole_queue: 5, returns_number: 2, loc: 2 }
    });
  });
});
