import type { Task, VisualScenario } from "../types";
import type { InterpretResult } from "@jiki/interpreters";
import type RandomSaladExercise from "./Exercise";

export const tasks = [
  {
    id: "make-random-salad" as const,
    name: "Make a random salad",
    description: "Generate a random amount of each ingredient using Math.randomInt() and make the salad.",
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
    name: "Random salad",
    description: "Make a salad with random amounts of each ingredient.",
    taskId: "make-random-salad",
    randomSeed: true,
    setup(exercise) {
      const ex = exercise as RandomSaladExercise;
      ex.setupBackground("/static/images/exercise-assets/random-salad/plate.png");
    },
    codeChecks: [
      {
        pass: (result) => findRandomIntCall(result, 40, 100) !== undefined,
        errorHtml: "You need to call <code>Math.randomInt(40, 100)</code> to generate the number of leaves."
      },
      {
        pass: (result) => {
          const leavesCall = findRandomIntCall(result, 40, 100);
          if (!leavesCall) return false;
          return findRandomIntCall(result, 5, Math.floor(leavesCall.return / 5)) !== undefined;
        },
        errorHtml: "You need to call <code>Math.randomInt(5, leaves / 5)</code> to generate the number of tomatoes."
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
        errorHtml:
          "You need to call <code>Math.randomInt(tomatoes, tomatoes * 2)</code> to generate the number of croutons."
      },
      {
        pass: (result) => {
          const leavesCall = findRandomIntCall(result, 40, 100);
          if (!leavesCall) return false;
          const tomatoesCall = findRandomIntCall(result, 5, Math.floor(leavesCall.return / 5));
          if (!tomatoesCall) return false;
          return findRandomIntCall(result, 1, Math.floor(tomatoesCall.return / 2)) !== undefined;
        },
        errorHtml: "You need to call <code>Math.randomInt(1, tomatoes / 2)</code> to generate the number of olives."
      }
    ],
    expectations(exercise) {
      const ex = exercise as RandomSaladExercise;
      return [
        {
          pass: ex.saladMade === true,
          errorHtml: "You didn't make the salad. Make sure you call <code>makeSalad()</code> with all four ingredients."
        }
      ];
    }
  }
];
