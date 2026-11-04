import type { InterpretResult } from "@jiki/interpreters";
import type { ProgressionMetrics } from "../types";
import type RandomSaladExercise from "./Exercise";

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

// Mirrors the scenario codeChecks' lookup: a random call with these bounds.
function findRandomIntCall(
  result: InterpretResult,
  expectedMin: number,
  expectedMax: number
): FunctionCallLogEntry | undefined {
  return result.meta.functionCallLog.find(
    (entry) =>
      isRandomCall(entry) &&
      Math.floor(entry.args[0] as number) === Math.floor(expectedMin) &&
      Math.floor(entry.args[1] as number) === Math.floor(expectedMax)
  );
}

// How many links of the leaves -> tomatoes -> croutons/olives chain the
// student has built, each fed by the previous random result.
function chainedIngredients(result: InterpretResult): number {
  let count = 0;

  const leaves = findRandomIntCall(result, 40, 100);
  if (!leaves) {
    return count;
  }
  count++;

  const tomatoes = findRandomIntCall(result, 5, Math.floor((leaves.return as number) / 5));
  if (!tomatoes) {
    return count;
  }
  count++;

  const tomatoCount = tomatoes.return as number;
  if (findRandomIntCall(result, tomatoCount, tomatoCount * 2)) {
    count++;
  }
  if (findRandomIntCall(result, 1, Math.floor(tomatoCount / 2))) {
    count++;
  }

  return count;
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
