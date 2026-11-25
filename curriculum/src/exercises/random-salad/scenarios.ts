import type { Task, VisualScenario } from "../types";
import { checkRules } from "./randomIntRules";
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

function isMathRandomInt(entry: { name: string }) {
  return entry.name === "Math.randomInt";
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
        pass: (result) => checkRules(result, isMathRandomInt, (r) => [r.leaves]),
        errorKey: "checks.needLeavesRandomInt"
      },
      {
        pass: (result) => checkRules(result, isMathRandomInt, (r) => [r.leaves, r.tomatoes]),
        errorKey: "checks.needTomatoesRandomInt"
      },
      {
        pass: (result) => checkRules(result, isMathRandomInt, (r) => [r.leaves, r.tomatoes, r.croutons]),
        errorKey: "checks.needCroutonsRandomInt"
      },
      {
        pass: (result) => checkRules(result, isMathRandomInt, (r) => [r.leaves, r.tomatoes, r.olives]),
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
