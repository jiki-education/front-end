import type { Task, VisualScenario } from "../types";
import type { SproutingFlowerExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-scene" as const,
    name: "tasks.drawScene.name",
    description: "tasks.drawScene.description",
    hints: [],
    requiredScenarios: ["draw-sprouting-flower"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-sprouting-flower",
    name: "scenarios.drawSproutingFlower.name",
    description: "scenarios.drawSproutingFlower.description",
    taskId: "draw-scene",

    expectations(exercise) {
      const ex = exercise as SproutingFlowerExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 89, 0.4),
          errorHtml: ex.t("checks.firstFlowerHeadWrong")
        },
        {
          pass: ex.hasCircleAt(50, 30, 24),
          errorHtml: ex.t("checks.finalFlowerHeadWrong")
        },
        {
          pass: ex.hasCircleAt(50, 89, 0.1),
          errorHtml: ex.t("checks.firstPistilWrong")
        },
        {
          pass: ex.hasCircleAt(50, 30, 6),
          errorHtml: ex.t("checks.finalPistilWrong")
        },
        {
          pass: ex.hasRectangleAt(49.95, 89, 0.1, 1),
          errorHtml: ex.t("checks.firstStemWrong")
        },
        {
          pass: ex.hasRectangleAt(47, 30, 6, 60),
          errorHtml: ex.t("checks.finalStemWrong")
        },
        {
          pass: ex.hasEllipseAt(49.75, 89.5, 0.2, 0.08),
          errorHtml: ex.t("checks.firstLeftLeafWrong")
        },
        {
          pass: ex.hasEllipseAt(35, 60, 12, 4.8),
          errorHtml: ex.t("checks.finalLeftLeafWrong")
        },
        {
          pass: ex.hasEllipseAt(50.25, 89.5, 0.2, 0.08),
          errorHtml: ex.t("checks.firstRightLeafWrong")
        },
        {
          pass: ex.hasEllipseAt(65, 60, 12, 4.8),
          errorHtml: ex.t("checks.finalRightLeafWrong")
        }
      ];
    }
  }
];
