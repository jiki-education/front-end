import type { Task, VisualScenario } from "../types";
import type { FixWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "fill-holes" as const,
    name: "tasks.fillHoles.name",
    description: "tasks.fillHoles.description",
    hints: [],
    requiredScenarios: ["fill-holes"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "fill-holes",
    name: "scenarios.fillHoles.name",
    description: "scenarios.fillHoles.description",
    taskId: "fill-holes",

    setup(exercise) {
      const ex = exercise as FixWallExercise;
      ex.setupBackground("/static/images/exercise-assets/fix-wall/wall-to-fix.webp");
      ex.setupStroke(0.4, "#7f3732");
      ex.setDrawDelayMs(200);
    },

    expectations(exercise) {
      const ex = exercise as FixWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(10, 10, 20, 10),
          errorHtml: ex.t("checks.topHole")
        },
        {
          pass: ex.hasRectangleAt(70, 30, 20, 10),
          errorHtml: ex.t("checks.middleHole")
        },
        {
          pass: ex.hasRectangleAt(20, 60, 20, 10),
          errorHtml: ex.t("checks.bottomHole")
        }
      ];
    }
  }
];
