import type { Task, VisualScenario } from "../types";
import type { InterpretResult } from "@jiki/interpreters";
import type RandomSaladExercise from "./Exercise";

export const tasks = [
  {
    id: "make-random-salad" as const,
    name: "tasks.makeRandomSalad.name",
    description: "tasks.makeRandomSalad.description",
    hints: [],
    requiredScenarios: ["random-salad"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Returns the arguments of the student's makeSalad() call (leaves, tomatoes, croutons, olives).
function saladArgs(result: InterpretResult): number[] | undefined {
  const call = result.meta.functionCallLog.find((entry) => entry.name === "makeSalad" || entry.name === "make_salad");
  if (!call || call.args.length !== 4 || !call.args.every((arg) => typeof arg === "number")) return undefined;
  return call.args;
}

interface RandomIntRule {
  min: number;
  max: number;
  value: number;
}

// The Math.randomInt call each ingredient should come from, given the values
// the student passed to makeSalad().
function rulesFor([leaves, tomatoes, croutons, olives]: number[]) {
  return {
    leaves: { min: 40, max: 100, value: leaves },
    tomatoes: { min: 5, max: Math.floor(leaves / 5), value: tomatoes },
    croutons: { min: tomatoes, max: tomatoes * 2, value: croutons },
    olives: { min: 1, max: Math.floor(tomatoes / 2), value: olives }
  };
}

// True if every rule has its own Math.randomInt call in the log, with the
// rule's arguments and returning the value the student passed to makeSalad().
// Each log entry can satisfy only one rule, so one call can't stand in for two
// ingredients when their rules happen to have the same arguments and value.
function allRulesMet(result: InterpretResult, rules: RandomIntRule[]) {
  const unused = result.meta.functionCallLog.filter((entry) => entry.name === "Math.randomInt");
  return rules.every((rule) => {
    const index = unused.findIndex(
      (entry) =>
        entry.return === rule.value &&
        Math.floor(entry.args[0]) === Math.floor(rule.min) &&
        Math.floor(entry.args[1]) === Math.floor(rule.max)
    );
    if (index === -1) return false;
    unused.splice(index, 1);
    return true;
  });
}

// Each check also needs the rules before it to be met, because later ranges
// depend on earlier values.
function checkRules(result: InterpretResult, pick: (rules: ReturnType<typeof rulesFor>) => RandomIntRule[]) {
  const args = saladArgs(result);
  return args !== undefined && allRulesMet(result, pick(rulesFor(args)));
}

export const scenarios: VisualScenario[] = [
  {
    slug: "random-salad",
    name: "scenarios.randomSalad.name",
    description: "scenarios.randomSalad.description",
    taskId: "make-random-salad",
    randomSeed: true,
    setup(exercise) {
      const ex = exercise as RandomSaladExercise;
      ex.setupBackground("/static/images/exercise-assets/random-salad/plate.webp");
    },
    codeChecks: [
      {
        pass: (result) => checkRules(result, (r) => [r.leaves]),
        errorKey: "checks.needLeavesRandomInt"
      },
      {
        pass: (result) => checkRules(result, (r) => [r.leaves, r.tomatoes]),
        errorKey: "checks.needTomatoesRandomInt"
      },
      {
        pass: (result) => checkRules(result, (r) => [r.leaves, r.tomatoes, r.croutons]),
        errorKey: "checks.needCroutonsRandomInt"
      },
      {
        pass: (result) => checkRules(result, (r) => [r.leaves, r.tomatoes, r.olives]),
        errorKey: "checks.needOlivesRandomInt"
      }
    ],
    expectations(exercise) {
      const ex = exercise as RandomSaladExercise;
      return [
        {
          pass: ex.saladMade === true,
          errorHtml: exercise.t("checks.saladNotMade")
        }
      ];
    }
  }
];
