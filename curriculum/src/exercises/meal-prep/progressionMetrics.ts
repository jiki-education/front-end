import { methodCalls, PUSH_METHODS } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun, ScenarioRuns } from "../types";
import { scenarios } from "./scenarios";

// Which recipe items each scenario wants back is the scenarios' job. These
// metrics see the two building blocks underneath: the shopping list is built
// up with push, and it is a genuine filter of the recipe (so the loop and the
// fridge check are in place, even if the check is still the wrong way round).

function recipeFor(run: ScenarioRun): string[] | undefined {
  const scenario = scenarios.find((candidate) => candidate.slug === run.scenarioSlug);
  const recipe = scenario?.args[1];
  return Array.isArray(recipe) ? (recipe as string[]) : undefined;
}

// True when every element of `items` appears in `source`, in the same order.
function isSubsequence(items: unknown[], source: string[]): boolean {
  let cursor = 0;
  for (const item of items) {
    while (cursor < source.length && source[cursor] !== item) {
      cursor++;
    }
    if (cursor === source.length) {
      return false;
    }
    cursor++;
  }
  return true;
}

function filtersRecipe(runs: ScenarioRuns): boolean {
  const answered = runs.all.filter((run) => run.isolated !== true && Array.isArray(run.actual));
  if (answered.length === 0) {
    return false;
  }

  let filteredSomething = false;
  for (const run of answered) {
    const actual = run.actual as unknown[];
    const recipe = recipeFor(run);
    if (recipe === undefined || !isSubsequence(actual, recipe)) {
      return false;
    }
    if (actual.length > 0 && actual.length < recipe.length) {
      filteredSomething = true;
    }
  }
  return filteredSomething;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The list only ever holds recipe items, in recipe order, and in at
      // least one scenario some (but not all) of them were dropped. That
      // means the student loops the recipe and checks each item against the
      // fridge. A backwards check (keeping what's already in the fridge)
      // still earns this, since flipping it is the last step.
      name: "filters_recipe",
      maxScore: 1,
      points: 5,
      score: (runs) => (filtersRecipe(runs) ? 1 : 0)
    },
    {
      // The headline concept of the level: the list is built up with push
      // rather than written out or returned as an existing array.
      name: "builds_with_push",
      maxScore: 1,
      points: 4,
      score: (runs) => (runs.all.some((run) => methodCalls(run, PUSH_METHODS).length > 0) ? 1 : 0)
    }
  ]
};
