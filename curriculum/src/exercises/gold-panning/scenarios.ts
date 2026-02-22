import type { Task, VisualScenario } from "../types";
import type GoldPanningExercise from "./Exercise";

export const tasks = [
  {
    id: "pan-and-sell" as const,
    name: "Pan for gold and sell your haul",
    description:
      "Pan 5 times to collect gold nuggets, keeping a running total, then sell everything at the trading post.",
    hints: [
      "Start with a variable set to 0 to track your total nuggets",
      "Use a repeat loop to pan 5 times",
      "Inside the loop, update your total: nuggets = nuggets + pan()",
      "After the loop, call sell() with your total"
    ],
    requiredScenarios: ["pans-3-1-4-2-5"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "pans-3-1-4-2-5",
    name: "Pans: 3, 1, 4, 2, 5",
    description: "Find 3, 1, 4, 2, and 5 nuggets. Total should be 15.",
    taskId: "pan-and-sell",
    setup(exercise) {
      (exercise as GoldPanningExercise).setupPans([3, 1, 4, 2, 5]);
    },
    expectations(exercise) {
      const ex = exercise as GoldPanningExercise;
      return [
        {
          pass: ex.sold === true,
          errorHtml: "You didn't sell your nuggets. Make sure you call <code>sell()</code> after panning."
        },
        {
          pass: ex.soldNuggets === 15,
          errorHtml: `Expected to sell 15 nuggets (3 + 1 + 4 + 2 + 5) but you sold ${ex.soldNuggets}. Make sure you add each pan result to your running total.`
        }
      ];
    }
  }
];
