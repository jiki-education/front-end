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

    expectations(exercise) {
      const ex = exercise as SproutingFlowerExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 89, 0.4),
          errorHtml: "The first Flower Head isn't correct."
        },
        {
          pass: ex.hasCircleAt(50, 30, 24),
          errorHtml: "The final Flower Head isn't correct."
        },
        {
          pass: ex.hasCircleAt(50, 89, 0.1),
          errorHtml: "The first Pistil isn't correct."
        },
        {
          pass: ex.hasCircleAt(50, 30, 6),
          errorHtml: "The final Pistil isn't correct."
        },
        {
          pass: ex.hasRectangleAt(49.95, 89, 0.1, 1),
          errorHtml: "The first Stem isn't correct."
        },
        {
          pass: ex.hasRectangleAt(47, 30, 6, 60),
          errorHtml: "The final Stem isn't correct."
        },
        {
          pass: ex.hasEllipseAt(49.75, 89.5, 0.2, 0.08),
          errorHtml: "The first Left Leaf isn't correct."
        },
        {
          pass: ex.hasEllipseAt(35, 60, 12, 4.8),
          errorHtml: "The final Left Leaf isn't correct."
        },
        {
          pass: ex.hasEllipseAt(50.25, 89.5, 0.2, 0.08),
          errorHtml: "The first Right Leaf isn't correct."
        },
        {
          pass: ex.hasEllipseAt(65, 60, 12, 4.8),
          errorHtml: "The final Right Leaf isn't correct."
        }
      ];
    }
  }
];
