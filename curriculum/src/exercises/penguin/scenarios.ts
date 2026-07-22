import type { Task, VisualScenario } from "../types";
import type { PenguinExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-penguin" as const,
    name: "tasks.drawPenguin.name",
    description: "tasks.drawPenguin.description",
    hints: [],
    requiredScenarios: ["make-penguin-symmetrical"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "make-penguin-symmetrical",
    name: "scenarios.makePenguinSymmetrical.name",
    description: "scenarios.makePenguinSymmetrical.description",
    taskId: "draw-penguin",

    expectations(exercise) {
      const ex = exercise as PenguinExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 100),
          errorHtml: ex.t("checks.sky")
        },
        {
          pass: ex.hasRectangleAt(0, 70, 100, 30),
          errorHtml: ex.t("checks.ground")
        },
        {
          pass: ex.hasEllipseAt(28, 55, 10, 25),
          errorHtml: ex.t("checks.leftWing")
        },
        {
          pass: ex.hasEllipseAt(72, 55, 10, 25),
          errorHtml: ex.t("checks.rightWing")
        },
        {
          pass: ex.hasEllipseAt(50, 53, 25, 40),
          errorHtml: ex.t("checks.outerBody")
        },
        {
          pass: ex.hasEllipseAt(50, 50, 21, 39),
          errorHtml: ex.t("checks.innerBody")
        },
        {
          pass: ex.hasCircleAt(50, 31, 23),
          errorHtml: ex.t("checks.head")
        },
        {
          pass: ex.hasEllipseAt(41, 32, 11, 14),
          errorHtml: ex.t("checks.leftFace")
        },
        {
          pass: ex.hasEllipseAt(59, 32, 11, 14),
          errorHtml: ex.t("checks.rightFace")
        },
        {
          pass: ex.hasEllipseAt(50, 40, 16, 11),
          errorHtml: ex.t("checks.lowerFace")
        },
        {
          pass: ex.hasCircleAt(42, 33, 3),
          errorHtml: ex.t("checks.leftEye")
        },
        {
          pass: ex.hasCircleAt(43, 34, 1),
          errorHtml: ex.t("checks.leftIris")
        },
        {
          pass: ex.hasCircleAt(58, 33, 3),
          errorHtml: ex.t("checks.rightEye")
        },
        {
          pass: ex.hasCircleAt(57, 34, 1),
          errorHtml: ex.t("checks.rightIris")
        },
        {
          pass: ex.hasEllipseAt(40, 93, 7, 4),
          errorHtml: ex.t("checks.leftFoot")
        },
        {
          pass: ex.hasEllipseAt(60, 93, 7, 4),
          errorHtml: ex.t("checks.rightFoot")
        },
        {
          pass: ex.hasTriangleAt(46, 38, 54, 38, 50, 47),
          errorHtml: ex.t("checks.nose")
        }
      ];
    }
  }
];
