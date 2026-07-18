import type { Task, VisualScenario } from "../types";
import type { FoxyFaceExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-fox" as const,
    name: "tasks.drawFox.name",
    description: "tasks.drawFox.description",
    hints: [],
    requiredScenarios: ["draw-fox"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-fox",
    name: "scenarios.drawFox.name",
    description: "scenarios.drawFox.description",
    taskId: "draw-fox",

    setup(exercise) {
      const ex = exercise as FoxyFaceExercise;
      ex.setupBackground("/static/images/exercise-assets/foxy-face/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as FoxyFaceExercise;

      return [
        {
          pass: ex.hasTriangleAtWithColor(10, 40, 5, 60, 50, 95, "white"),
          errorHtml: ex.t("checks.leftCheek")
        },
        {
          pass: ex.hasTriangleAtWithColor(90, 40, 95, 60, 50, 95, "white"),
          errorHtml: ex.t("checks.rightCheek")
        },
        {
          pass: ex.hasTriangleAtWithColor(10, 40, 10, 5, 50, 40, "brown"),
          errorHtml: ex.t("checks.leftEar")
        },
        {
          pass: ex.hasTriangleAtWithColor(90, 40, 90, 5, 50, 40, "brown"),
          errorHtml: ex.t("checks.rightEar")
        },
        {
          pass: ex.hasTriangleAtWithColor(50, 30, 50, 95, 10, 40, "orange"),
          errorHtml: ex.t("checks.leftFace")
        },
        {
          pass: ex.hasTriangleAtWithColor(50, 30, 50, 95, 90, 40, "orange"),
          errorHtml: ex.t("checks.rightFace")
        },
        {
          pass:
            (ex.hasTriangleAtWithColor(40, 90, 50, 85, 60, 90, "charcoal") &&
              ex.hasTriangleAtWithColor(50, 95, 40, 90, 60, 90, "charcoal")) ||
            (ex.hasTriangleAtWithColor(40, 90, 50, 85, 50, 95, "charcoal") &&
              ex.hasTriangleAtWithColor(60, 90, 50, 85, 50, 95, "charcoal")),
          errorHtml: ex.t("checks.nose")
        },
        {
          pass: ex.triangleDrawnBefore([10, 40, 10, 5, 50, 40], [50, 30, 50, 95, 10, 40]),
          errorHtml: ex.t("checks.leftFaceAboveEar")
        },
        {
          pass: ex.triangleDrawnBefore([90, 40, 90, 5, 50, 40], [50, 30, 50, 95, 90, 40]),
          errorHtml: ex.t("checks.rightFaceAboveEar")
        },
        {
          pass: ex.trianglesColorDrawnAbove("charcoal", "orange"),
          errorHtml: ex.t("checks.noseAboveFace")
        }
      ];
    }
  }
];
