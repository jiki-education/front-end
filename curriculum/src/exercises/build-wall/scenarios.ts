import type { Task, VisualScenario } from "../types";
import type { BuildWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-wall" as const,
    name: "tasks.buildWall.name",
    description: "tasks.buildWall.description",
    hints: [],
    requiredScenarios: ["build-wall"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-wall",
    name: "scenarios.buildWall.name",
    description: "scenarios.buildWall.description",
    taskId: "build-wall",

    setup(exercise) {
      const ex = exercise as BuildWallExercise;
      ex.setupStroke(0.4, "#7f3732");
      ex.setDrawDelayMs(20);
    },

    expectations(exercise) {
      const ex = exercise as BuildWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 90, 20, 10),
          errorHtml: ex.t("checks.bottomLeft")
        },
        {
          pass: ex.hasRectangleAt(80, 90, 20, 10),
          errorHtml: ex.t("checks.bottomRight")
        },
        {
          pass: ex.hasRectangleAt(-10, 80, 20, 10),
          errorHtml: ex.t("checks.secondRowFirst")
        },
        {
          pass: ex.hasRectangleAt(90, 80, 20, 10),
          errorHtml: ex.t("checks.secondRowLast")
        },
        {
          pass: ex.hasRectangleAt(40, 70, 20, 10),
          errorHtml: ex.t("checks.thirdRowMiddle")
        },
        {
          pass: ex.hasRectangleAt(30, 60, 20, 10),
          errorHtml: ex.t("checks.fourthRowMiddle")
        },
        {
          pass: ex.hasRectangleAt(-10, 0, 20, 10),
          errorHtml: ex.t("checks.topLeft")
        },
        {
          pass: ex.hasRectangleAt(90, 0, 20, 10),
          errorHtml: ex.t("checks.topRight")
        },
        {
          pass: ex.numElements() === 55,
          errorHtml: ex.t("checks.brickCount")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("rectangle") === 1,
        errorKey: "checks.codeQuality.rectangleCalledOnce"
      }
    ]
  }
];
