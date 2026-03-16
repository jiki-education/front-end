import type { Task, VisualScenario } from "../types";
import type GoldPanningExercise from "./Exercise";

export const tasks = [
  {
    id: "pan-and-sell" as const,
    name: "Pan for gold and sell your haul",
    description:
      "Pan 5 times to collect gold nuggets, keeping a running total, then sell everything at the trading post.",
    hints: [],
    requiredScenarios: ["random-pans"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "random-pans",
    name: "Pan and sell",
    description: "Pan 5 times for a random number of nuggets each time, then sell the total.",
    taskId: "pan-and-sell",
    setup(exercise) {
      const values = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
      (exercise as GoldPanningExercise).setupPans(values);
    },
    expectations(exercise) {
      const ex = exercise as GoldPanningExercise;
      const expectedTotal = ex.initialPanValues.reduce((sum, v) => sum + v, 0);
      return [
        {
          pass: ex.sold === true,
          errorHtml: "You didn't sell your nuggets. Make sure you call <code>sell()</code> after panning."
        },
        {
          pass: ex.soldNuggets === expectedTotal,
          errorHtml: `Expected to sell ${expectedTotal} nuggets (${ex.initialPanValues.join(" + ")}) but you sold ${ex.soldNuggets}. Make sure you add each pan result to your running total.`
        }
      ];
    }
  }
];
