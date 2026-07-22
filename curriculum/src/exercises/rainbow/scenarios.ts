import type { Task, VisualScenario } from "../types";
import type { RainbowExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-rainbow" as const,
    name: "tasks.drawRainbow.name",
    description: "tasks.drawRainbow.description",
    hints: [],
    requiredScenarios: ["draw-rainbow"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-rainbow",
    name: "scenarios.drawRainbow.name",
    description: "scenarios.drawRainbow.description",
    taskId: "draw-rainbow",

    expectations(exercise) {
      const ex = exercise as RainbowExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 1, 100),
          errorHtml: ex.t("checks.firstRectangle")
        },
        {
          pass: ex.hasRectangleAt(99, 0, 1, 100),
          errorHtml: ex.t("checks.lastRectangle")
        },
        {
          pass: ex.allRectanglesHaveMinSaturationAndLightness(20, 20),
          errorHtml: ex.t("checks.minSaturationLightness")
        },
        {
          pass: ex.checkUniqueColoredRectangles(100),
          errorHtml: ex.t("checks.uniqueColors")
        },
        {
          pass: ex.hasRectangleWithHue(0),
          errorHtml: ex.t("checks.hueRed")
        },
        {
          pass: ex.hasRectangleWithHue(300),
          errorHtml: ex.t("checks.huePurple")
        }
      ];
    }
  }
];
