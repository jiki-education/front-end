import type { Task, VisualScenario } from "../types";
import type { JumbledHouseExercise } from "./Exercise";

export const tasks = [
  {
    id: "arrange-house" as const,
    name: "tasks.arrangeHouse.name",
    description: "tasks.arrangeHouse.description",
    hints: [],
    requiredScenarios: ["draw-the-house"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-the-house",
    name: "scenarios.drawTheHouse.name",
    description: "scenarios.drawTheHouse.description",
    taskId: "arrange-house",

    expectations(exercise) {
      const ex = exercise as JumbledHouseExercise;

      return [
        {
          pass: ex.hasRectangleAt(20, 50, 60, 40),
          errorHtml: ex.t("checks.frame")
        },
        {
          pass: ex.hasTriangleAt(16, 50, 50, 30, 84, 50),
          errorHtml: ex.t("checks.roof")
        },
        {
          pass: ex.hasRectangleAt(30, 55, 12, 13),
          errorHtml: ex.t("checks.leftWindow")
        },
        {
          pass: ex.hasRectangleAt(58, 55, 12, 13),
          errorHtml: ex.t("checks.rightWindow")
        },
        {
          pass: ex.hasRectangleAt(43, 72, 14, 18),
          errorHtml: ex.t("checks.door")
        },
        {
          pass: ex.hasCircleAt(55, 81, 1),
          errorHtml: ex.t("checks.doorKnob")
        }
      ];
    }
  }
];
