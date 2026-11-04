import { describe, expect, it } from "vitest";
import adventuresInPoetryExercise from "../../src/exercises/adventures-in-poetry";
import { progressionMetrics } from "../../src/exercises/adventures-in-poetry/progressionMetrics";
import solutionJavascript from "../../src/exercises/adventures-in-poetry/solution.javascript?raw";
import stubJavascript from "../../src/exercises/adventures-in-poetry/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(adventuresInPoetryExercise, studentCode, language);
  const runs = buildScenarioRuns(results, adventuresInPoetryExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Walks and stops at the flag, but never collects anything.
const WALK_ONLY_ATTEMPT = `let poem = ""

while (true) {
  let found = move()
  if (found === "🏁") {
    break
  }
}

recite(poem)`;

// The commonest failure: the flag is an emoji, so checking isEmoji() first skips it and the poet walks off the end.
const FLAG_AFTER_EMOJI_ATTEMPT = `let poem = ""

while (true) {
  let found = move()
  if (found === "" || isEmoji(found)) {
    continue
  }
  if (found === "🏁") {
    break
  }
  poem = poem + found + " "
}

recite(poem)`;

// Appends every square, blanks and scenery included, with a trailing space.
const APPEND_EVERYTHING_ATTEMPT = `let poem = ""

while (true) {
  let found = move()
  if (found === "🏁") {
    break
  }
  poem = poem + found + " "
}

recite(poem)`;

// Collects the right words with nested ifs instead of guard clauses (and ignores the apostrophe and comma rules).
const NESTED_WORDS_ATTEMPT = `let poem = ""
let words = 0

while (true) {
  let found = move()
  if (found === "🏁" || words >= 7) {
    break
  }
  if (found !== "") {
    if (isEmoji(found) === false) {
      if (words > 0) {
        poem = poem + " "
      }
      poem = poem + found
      words = words + 1
    }
  }
}

recite(poem)`;

describe("adventures-in-poetry progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, walk_completes: 2, words_collected: 4, skips_scenery: 2, guard_clauses: 3 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, walk_completes: 0, words_collected: 0, skips_scenery: 0, guard_clauses: 0 }
    });
  });

  it("credits a clean walk that collects nothing", () => {
    // break counts towards the guard-clause shape too.
    expect(runProgression(WALK_ONLY_ATTEMPT, "javascript")).toEqual({
      score: 4,
      metrics: { scenarios: 0, walk_completes: 2, words_collected: 0, skips_scenery: 0, guard_clauses: 2 }
    });
  });

  it("credits only the guard-clause shape when the poet walks off the end", () => {
    // Every run errors before reciting, so nothing about the walk is measurable.
    expect(runProgression(FLAG_AFTER_EMOJI_ATTEMPT, "javascript")).toEqual({
      score: 3,
      metrics: { scenarios: 0, walk_completes: 0, words_collected: 0, skips_scenery: 0, guard_clauses: 3 }
    });
  });

  it("credits the words but not the scenery when everything is appended", () => {
    // The three tracks with scenery fail skips_scenery; spacing is left to the scenarios.
    expect(runProgression(APPEND_EVERYTHING_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 0, walk_completes: 2, words_collected: 4, skips_scenery: 1, guard_clauses: 2 }
    });
  });

  it("credits a working walk that is the wrong shape", () => {
    // Every scenario carries the style checks, so the anchor stays at 0 until continue arrives.
    expect(runProgression(NESTED_WORDS_ATTEMPT, "javascript")).toEqual({
      score: 10,
      metrics: { scenarios: 0, walk_completes: 2, words_collected: 4, skips_scenery: 2, guard_clauses: 2 }
    });
  });
});
