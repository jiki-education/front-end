import type { Task, VisualScenario } from "../types";
import type { RainbowSplodgesExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-splodges" as const,
    name: "tasks.drawSplodges.name",
    description: "tasks.drawSplodges.description",
    hints: [],
    requiredScenarios: ["rainbow-splodges"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "rainbow-splodges",
    name: "scenarios.rainbowSplodges.name",
    description: "scenarios.rainbowSplodges.description",
    taskId: "draw-splodges",
    randomSeed: true,
    expectations(exercise) {
      const ex = exercise as RainbowSplodgesExercise;

      return [
        {
          pass: ex.checkUniqueColoredCircles(50),
          errorHtml: ex.t("checks.uniqueColoredCircles")
        },
        {
          pass: ex.checkUniquePositionedCircles(30),
          errorHtml: ex.t("checks.uniquePositionedCircles")
        },
        {
          pass: ex.checkAllRadiiInRange(1, 30),
          errorHtml: ex.t("checks.radiiRange")
        },
        {
          pass: ex.checkAllCirclesInsideBox(),
          errorHtml: ex.t("checks.insideBox")
        },
        {
          pass: ex.checkCirclesTouchEdges(),
          errorHtml: ex.t("checks.touchEdges")
        },
        {
          pass: ex.checkSaturationAndLightnessInRange(20, 80),
          errorHtml: ex.t("checks.saturationLightnessRange")
        }
      ];
    }
  }
];
