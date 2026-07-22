import type { Task, VisualScenario } from "../types";
import type { CloudRainSunExercise } from "./Exercise";

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

    setup(exercise) {
      const ex = exercise as CloudRainSunExercise;
      ex.setupBackground("/static/images/exercise-assets/cloud-rain-sun/template.webp");
    },

    expectations(exercise) {
      const ex = exercise as CloudRainSunExercise;

      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.sun")
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.cloudBody")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.leftPuff")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.leftCenterPuff")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.rightCenterPuff")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.rightPuff")
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.rainDrop")
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: ex.t("checks.rainDrop")
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: ex.t("checks.rainDrop")
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: ex.t("checks.rainDrop")
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: ex.t("checks.rainDrop")
        }
      ];
    }
  }
];
