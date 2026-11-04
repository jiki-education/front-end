import { describe, expect, it } from "vitest";
import mealPrepExercise from "../../src/exercises/meal-prep";
import { progressionMetrics } from "../../src/exercises/meal-prep/progressionMetrics";
import solutionJavascript from "../../src/exercises/meal-prep/solution.javascript?raw";
import stubJavascript from "../../src/exercises/meal-prep/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(mealPrepExercise, studentCode, language);
  const runs = buildScenarioRuns(results, mealPrepExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Hands the recipe straight back: right only when the fridge is empty.
const RETURNS_RECIPE_ATTEMPT = `function shoppingList(fridge, recipe) {
  return recipe
}`;

// Builds a list with push, but copies every recipe item without checking the fridge.
const COPIES_RECIPE_ATTEMPT = `function shoppingList(fridge, recipe) {
  let list = []
  for (const ingredient of recipe) {
    list.push(ingredient)
  }
  return list
}`;

// Everything in place except the check is the wrong way round.
const BACKWARDS_CHECK_ATTEMPT = `function shoppingList(fridge, recipe) {
  let list = []
  for (const ingredient of recipe) {
    if (fridge.includes(ingredient)) {
      list.push(ingredient)
    }
  }
  return list
}`;

describe("meal-prep progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, filters_recipe: 5, builds_with_push: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, filters_recipe: 0, builds_with_push: 0 }
    });
  });

  it("scores only the empty-fridge scenario for returning the recipe unchanged", () => {
    expect(runProgression(RETURNS_RECIPE_ATTEMPT, "javascript")).toEqual({
      score: 3,
      metrics: { scenarios: 3, filters_recipe: 0, builds_with_push: 0 }
    });
  });

  it("scores builds_with_push for copying the recipe with push", () => {
    expect(runProgression(COPIES_RECIPE_ATTEMPT, "javascript")).toEqual({
      score: 7,
      metrics: { scenarios: 3, filters_recipe: 0, builds_with_push: 4 }
    });
  });

  it("scores both metrics when only the fridge check is backwards", () => {
    // Every scenario fails, but the loop, check and push are all in place.
    expect(runProgression(BACKWARDS_CHECK_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 0, filters_recipe: 5, builds_with_push: 4 }
    });
  });
});
