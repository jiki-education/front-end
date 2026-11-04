import { describe, expect, it } from "vitest";
import tileRackExercise from "../../src/exercises/tile-rack";
import { progressionMetrics } from "../../src/exercises/tile-rack/progressionMetrics";
import solutionJavascript from "../../src/exercises/tile-rack/solution.javascript?raw";
import stubJavascript from "../../src/exercises/tile-rack/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(tileRackExercise, studentCode, language);
  const runs = buildScenarioRuns(results, tileRackExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Starts the counter at 0, so every position is one short.
const STARTS_AT_ZERO_ATTEMPT = `function findTile(rack, letter) {
  let position = 0
  for (const tile of rack) {
    if (tile === letter) {
      return \`Move to position \${position}\`
    }
    position = position + 1
  }
  return "Error: Tile not on rack"
}`;

// Never moves the counter, so every match reports position 1.
const NO_INCREMENT_ATTEMPT = `function findTile(rack, letter) {
  let position = 1
  for (const tile of rack) {
    if (tile === letter) {
      return \`Move to position \${position}\`
    }
  }
  return "Error: Tile not on rack"
}`;

// Returns the error inside the loop, so only the first tile is checked.
const ERROR_IN_LOOP_ATTEMPT = `function findTile(rack, letter) {
  let position = 1
  for (const tile of rack) {
    if (tile === letter) {
      return \`Move to position \${position}\`
    } else {
      return "Error: Tile not on rack"
    }
    position = position + 1
  }
  return "Error: Tile not on rack"
}`;

describe("tile-rack progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, checks_whole_rack: 3, tracks_position: 4, formats_message: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, checks_whole_rack: 0, tracks_position: 0, formats_message: 0 }
    });
  });

  it("credits a counter that starts at 0 as working position tracking", () => {
    // Only the two not-found scenarios pass: 2 of 7.
    expect(runProgression(STARTS_AT_ZERO_ATTEMPT, "javascript")).toEqual({
      score: 12,
      metrics: { scenarios: 3, checks_whole_rack: 3, tracks_position: 4, formats_message: 2 }
    });
  });

  it("withholds the tracking credit when the counter never moves", () => {
    // The tile at the start and the two not-found scenarios pass: 3 of 7.
    expect(runProgression(NO_INCREMENT_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 4, checks_whole_rack: 3, tracks_position: 0, formats_message: 2 }
    });
  });

  it("credits one tile of coverage when the error is returned inside the loop", () => {
    // The tile at the start and the two not-found scenarios pass: 3 of 7.
    expect(runProgression(ERROR_IN_LOOP_ATTEMPT, "javascript")).toEqual({
      score: 7,
      metrics: { scenarios: 4, checks_whole_rack: 1, tracks_position: 0, formats_message: 2 }
    });
  });
});
