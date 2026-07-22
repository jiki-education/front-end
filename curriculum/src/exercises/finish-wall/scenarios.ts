import type { Task, VisualScenario } from "../types";
import type { FinishWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "finish-wall" as const,
    name: "tasks.finishWall.name",
    description: "tasks.finishWall.description",
    hints: [],
    requiredScenarios: ["finish-wall"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "finish-wall",
    name: "scenarios.finishWall.name",
    description: "scenarios.finishWall.description",
    taskId: "finish-wall",

    setup(exercise) {
      const ex = exercise as FinishWallExercise;
      ex.setupBackground("/static/images/exercise-assets/finish-wall/topless-wall.webp");
      ex.setupStroke(0.4, "#7f3732");
      ex.setDrawDelayMs(150);
    },

    expectations(exercise) {
      const ex = exercise as FinishWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 20, 10),
          errorHtml: ex.t("checks.leftBrick")
        },
        {
          pass: ex.hasRectangleAt(20, 0, 20, 10),
          errorHtml: ex.t("checks.secondBrick")
        },
        {
          pass: ex.hasRectangleAt(40, 0, 20, 10),
          errorHtml: ex.t("checks.middleBrick")
        },
        {
          pass: ex.hasRectangleAt(60, 0, 20, 10),
          errorHtml: ex.t("checks.fourthBrick")
        },
        {
          pass: ex.hasRectangleAt(80, 0, 20, 10),
          errorHtml: ex.t("checks.rightBrick")
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
