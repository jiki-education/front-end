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

function findRandomIntCall(result: InterpretResult, expectedMin: number, expectedMax: number) {
  return result.meta.functionCallLog.find(
    (entry) =>
      entry.name === "Math.randomInt" &&
      Math.floor(entry.args[0]) === Math.floor(expectedMin) &&
      Math.floor(entry.args[1]) === Math.floor(expectedMax)
  );
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
        pass: (result) => findRandomIntCall(result, 40, 100) !== undefined,
        errorKey: "checks.needLeavesRandomInt"
      },
      {
        pass: (result) => {
          const leavesCall = findRandomIntCall(result, 40, 100);
          if (!leavesCall) return false;
          return findRandomIntCall(result, 5, Math.floor(leavesCall.return / 5)) !== undefined;
        },
        errorKey: "checks.needTomatoesRandomInt"
      },
      {
        pass: (result) => {
          const leavesCall = findRandomIntCall(result, 40, 100);
          if (!leavesCall) return false;
          const tomatoesCall = findRandomIntCall(result, 5, leavesCall.return / 5);
          if (!tomatoesCall) return false;
          const tomatoes = tomatoesCall.return;
          return findRandomIntCall(result, tomatoes, tomatoes * 2) !== undefined;
        },
        errorKey: "checks.needCroutonsRandomInt"
      },
      {
        pass: (result) => {
          const leavesCall = findRandomIntCall(result, 40, 100);
          if (!leavesCall) return false;
          const tomatoesCall = findRandomIntCall(result, 5, Math.floor(leavesCall.return / 5));
          if (!tomatoesCall) return false;
          return findRandomIntCall(result, 1, Math.floor(tomatoesCall.return / 2)) !== undefined;
        },
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
