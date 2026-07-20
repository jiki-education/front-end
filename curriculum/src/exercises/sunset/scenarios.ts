import type { Task, VisualScenario } from "../types";
import type { SunsetExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-scene" as const,
    name: "tasks.drawScene.name",
    description: "tasks.drawScene.description",
    hints: [],
    requiredScenarios: ["draw-scene"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-scene",
    name: "scenarios.drawScene.name",
    description: "scenarios.drawScene.description",
    taskId: "draw-scene",

    expectations(exercise) {
      const ex = exercise as SunsetExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 11, 5.2),
          errorHtml: ex.t("checks.sunWrongBeginning")
        },
        {
          pass: ex.hasCircleAt(50, 20, 7),
          errorHtml: ex.t("checks.sunWrongMiddle")
        },
        {
          pass: ex.hasCircleAt(50, 109, 24.8),
          errorHtml: ex.t("checks.sunWrongEnd")
        },
        {
          pass: ex.checkUniqueColoredRectangles(10),
          errorHtml: ex.t("checks.skyNotChangingColor")
        },
        {
          pass: ex.checkUniqueColoredCircles(10),
          errorHtml: ex.t("checks.sunNotChangingColor")
        }
      ];
    }
  }
];
