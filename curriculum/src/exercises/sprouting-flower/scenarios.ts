import type { Task, VisualScenario } from "../types";
import type { SproutingFlowerExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-scene" as const,
    name: "Draw the scene",
    description: "Make the flower sprout. Take it one step at a time!",
    hints: [],
    requiredScenarios: ["draw-sprouting-flower"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-sprouting-flower",
    name: "Make the flower sprout",
    description: "Take it one step at a time!",
    taskId: "draw-scene",

    setup(_exercise) {
      // No setup needed - this is a drawing exercise
    },

    expectations(exercise) {
      const ex = exercise as SproutingFlowerExercise;

      // The retriever methods require InterpretResult as first param but don't use it
      // Pass null as a placeholder
      const result = null as any;

      return [
        {
          type: "visual" as const,
          pass: ex.getCircleAt(result, 50, 89, 0.4) !== undefined,
          actual: ex.getCircleAt(result, 50, 89, 0.4) ? "found" : "not found",
          expected: "found",
          errorHtml: "The first Flower Head isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getCircleAt(result, 50, 30, 24) !== undefined,
          actual: ex.getCircleAt(result, 50, 30, 24) ? "found" : "not found",
          expected: "found",
          errorHtml: "The final Flower Head isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getCircleAt(result, 50, 89, 0.1) !== undefined,
          actual: ex.getCircleAt(result, 50, 89, 0.1) ? "found" : "not found",
          expected: "found",
          errorHtml: "The first Pistil isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getCircleAt(result, 50, 30, 6) !== undefined,
          actual: ex.getCircleAt(result, 50, 30, 6) ? "found" : "not found",
          expected: "found",
          errorHtml: "The final Pistil isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getRectangleAt(result, 49.95, 89, 0.1, 1) !== undefined,
          actual: ex.getRectangleAt(result, 49.95, 89, 0.1, 1) ? "found" : "not found",
          expected: "found",
          errorHtml: "The first Stem isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getRectangleAt(result, 47, 30, 6, 60) !== undefined,
          actual: ex.getRectangleAt(result, 47, 30, 6, 60) ? "found" : "not found",
          expected: "found",
          errorHtml: "The final Stem isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getEllipseAt(result, 49.75, 89.5, 0.2, 0.08) !== undefined,
          actual: ex.getEllipseAt(result, 49.75, 89.5, 0.2, 0.08) ? "found" : "not found",
          expected: "found",
          errorHtml: "The first Left Leaf isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getEllipseAt(result, 35, 60, 12, 4.8) !== undefined,
          actual: ex.getEllipseAt(result, 35, 60, 12, 4.8) ? "found" : "not found",
          expected: "found",
          errorHtml: "The final Left Leaf isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getEllipseAt(result, 50.25, 89.5, 0.2, 0.08) !== undefined,
          actual: ex.getEllipseAt(result, 50.25, 89.5, 0.2, 0.08) ? "found" : "not found",
          expected: "found",
          errorHtml: "The first Right Leaf isn't correct."
        },
        {
          type: "visual" as const,
          pass: ex.getEllipseAt(result, 65, 60, 12, 4.8) !== undefined,
          actual: ex.getEllipseAt(result, 65, 60, 12, 4.8) ? "found" : "not found",
          expected: "found",
          errorHtml: "The final Right Leaf isn't correct."
        },
      ];
    }
  }
];
