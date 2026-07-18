import type { Task, VisualScenario } from "../types";
import type GoldPanningExercise from "./Exercise";

export const tasks = [
  {
    id: "pan-and-sell" as const,
    name: "tasks.panAndSell.name",
    description: "tasks.panAndSell.description",
    hints: [],
    requiredScenarios: ["random-pans"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "random-pans",
    name: "scenarios.randomPans.name",
    description: "scenarios.randomPans.description",
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
          errorHtml: exercise.t("checks.notSold")
        },
        {
          pass: ex.soldNuggets === expectedTotal,
          errorHtml: exercise.t("checks.wrongSoldTotal", {
            expectedTotal,
            panValues: ex.initialPanValues.join(" + "),
            got: ex.soldNuggets
          })
        }
      ];
    }
  }
];
