import type { InterpretResult } from "@jiki/interpreters";
import type { ProgressionMetrics } from "../types";
import type RandomSaladExercise from "./Exercise";
import { allRulesMet, rulesFor, saladArgs, type RandomIntRule } from "./randomIntRules";

type FunctionCallLogEntry = InterpretResult["meta"]["functionCallLog"][number];

// The scenario is a single all-or-nothing run (its codeChecks require the
// whole random chain), so the baseline is 0 until everything works. These
// metrics grade the chain one link at a time. All checks are seed-agnostic:
// they follow the actual returned values through the call log.
const SCENARIO_SLUG = "random-salad";

// The random helper's log name differs per language (random_number in
// Jikiscript, Math.randomInt in JavaScript, randint in Python).
function isRandomCall(entry: FunctionCallLogEntry): boolean {
  return /rand/.test(entry.name.toLowerCase());
}

// How many links of the leaves -> tomatoes -> croutons/olives chain the
// student has built. Each ingredient passed to makeSalad() must come from its
// own random call with the right bounds (see randomIntRules.ts).
function chainedIngredients(result: InterpretResult): number {
  const args = saladArgs(result);
  if (!args) {
    return 0;
  }
  const rules = rulesFor(args);
  const met = (...chain: RandomIntRule[]) => allRulesMet(result, isRandomCall, chain);

  if (!met(rules.leaves)) {
    return 0;
  }
  if (!met(rules.leaves, rules.tomatoes)) {
    return 1;
  }
  return (
    2 +
    (met(rules.leaves, rules.tomatoes, rules.croutons) ? 1 : 0) +
    (met(rules.leaves, rules.tomatoes, rules.olives) ? 1 : 0)
  );
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: each ingredient count comes from a random call whose
      // bounds use the previous call's returned value.
      name: "random_ingredients",
      maxScore: 4,
      points: 8,
      score: (runs) => {
        const result = runs.bySlug(SCENARIO_SLUG)?.result;
        if (!result) {
          return 0;
        }
        return chainedIngredients(result);
      }
    },
    {
      // Partial progress: a salad (of any composition) reached the plate.
      name: "salad_made",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const ex = runs.bySlug(SCENARIO_SLUG)?.exercise as RandomSaladExercise | undefined;
        return ex?.saladMade === true ? 1 : 0;
      }
    }
  ]
};
