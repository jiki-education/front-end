import { describe, expect, it } from "vitest";
import weatherSymbolsExercise from "../../src/exercises/weather-symbols";
import { progressionMetrics } from "../../src/exercises/weather-symbols/progressionMetrics";
import solutionJavascript from "../../src/exercises/weather-symbols/solution.javascript?raw";
import stubJavascript from "../../src/exercises/weather-symbols/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "javascript") {
  const results = runExerciseTests(weatherSymbolsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, weatherSymbolsExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = {
  score: 0,
  metrics: { scenarios: 0, weekday_labels: 0, boxes_drawn: 0, maps_descriptions: 0 }
};

const WEEKDAYS_LINE = `  let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]`;

// A single hardcoded draw for Monday.
const ONE_DRAW_ATTEMPT = `function drawForecast(days) {
  draw(0, "Monday", ["sun"])
}`;

// Loops and labels correctly, but draws the same symbols every day.
const FIXED_SYMBOLS_ATTEMPT = `function drawForecast(days) {
${WEEKDAYS_LINE}
  for (let i = 0; i < days.length; i++) {
    draw(i, weekdays[i], ["sun"])
  }
}`;

// Loops and labels correctly, and maps two of the seven descriptions (the
// rest fall back to a cloud).
const PARTIAL_MAPPING_ATTEMPT = `function drawForecast(days) {
${WEEKDAYS_LINE}
  for (let i = 0; i < days.length; i++) {
    let elements = ["cloud"]
    if (days[i] === "Sunny ☀️") {
      elements = ["sun"]
    } else if (days[i] === "Miserable 😩") {
      elements = ["cloud", "rain"]
    }
    draw(i, weekdays[i], elements)
  }
}`;

// Draws every box with the right symbols, but labels every box "Monday"
// instead of reading the parallel weekdays array.
const NO_WEEKDAYS_ATTEMPT = `function drawForecast(days) {
  for (let i = 0; i < days.length; i++) {
    draw(i, "Monday", toElements(days[i]))
  }
}

function toElements(description) {
  if (description === "Sunny ☀️") {
    return ["sun"]
  } else if (description === "Dull 😴") {
    return ["cloud"]
  } else if (description === "Miserable 😩") {
    return ["cloud", "rain"]
  } else if (description === "Hopeful 🤞") {
    return ["sun", "cloud"]
  } else if (description === "Rainbow territory! 🌈") {
    return ["sun", "cloud", "rain"]
  } else if (description === "Exciting 🤩") {
    return ["cloud", "snow"]
  } else {
    return ["sun", "cloud", "snow"]
  }
}`;

describe("weather-symbols progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript)).toEqual({
      score: 21,
      metrics: { scenarios: 10, weekday_labels: 5, boxes_drawn: 3, maps_descriptions: 3 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript)).toEqual(ZERO);
  });

  it("scores a sixth of each metric for a single hardcoded draw", () => {
    expect(runProgression(ONE_DRAW_ATTEMPT)).toEqual({
      score: 3,
      metrics: { scenarios: 0, weekday_labels: 1, boxes_drawn: 1, maps_descriptions: 1 }
    });
  });

  it("scores labels and boxes but little mapping for the same symbols every day", () => {
    expect(runProgression(FIXED_SYMBOLS_ATTEMPT)).toEqual({
      score: 9,
      metrics: { scenarios: 0, weekday_labels: 5, boxes_drawn: 3, maps_descriptions: 1 }
    });
  });

  it("scores more mapping for a partial description mapping", () => {
    // Three different symbol arrays across mixed-week's six descriptions.
    expect(runProgression(PARTIAL_MAPPING_ATTEMPT)).toEqual({
      score: 10,
      metrics: { scenarios: 0, weekday_labels: 5, boxes_drawn: 3, maps_descriptions: 2 }
    });
  });

  it("scores the full anchor but almost no weekday_labels when every box says Monday", () => {
    // The scenarios don't check labels, so they all pass. Only box 0 is
    // labelled correctly.
    expect(runProgression(NO_WEEKDAYS_ATTEMPT)).toEqual({
      score: 17,
      metrics: { scenarios: 10, weekday_labels: 1, boxes_drawn: 3, maps_descriptions: 3 }
    });
  });
});
