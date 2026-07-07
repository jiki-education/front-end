import type { Task, VisualScenario } from "../types";
import type { FoxyFaceExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-fox" as const,
    name: "Draw the fox face",
    description: "Use triangles to build a geometric fox face on the grey background.",
    hints: [],
    requiredScenarios: ["draw-fox"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-fox",
    name: "Draw the fox face",
    description: "Build a geometric fox face using triangles.",
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
          errorHtml: "The left cheek should be a white triangle in the right place."
        },
        {
          pass: ex.hasTriangleAtWithColor(90, 40, 95, 60, 50, 95, "white"),
          errorHtml: "The right cheek should be a white triangle in the right place."
        },
        {
          pass: ex.hasTriangleAtWithColor(10, 40, 10, 5, 50, 40, "brown"),
          errorHtml: "The left ear should be a brown triangle in the right place."
        },
        {
          pass: ex.hasTriangleAtWithColor(90, 40, 90, 5, 50, 40, "brown"),
          errorHtml: "The right ear should be a brown triangle in the right place."
        },
        {
          pass: ex.hasTriangleAtWithColor(50, 30, 50, 95, 10, 40, "orange"),
          errorHtml: "The left face should be an orange triangle in the right place."
        },
        {
          pass: ex.hasTriangleAtWithColor(50, 30, 50, 95, 90, 40, "orange"),
          errorHtml: "The right face should be an orange triangle in the right place."
        },
        {
          pass:
            (ex.hasTriangleAtWithColor(40, 90, 50, 85, 60, 90, "charcoal") &&
              ex.hasTriangleAtWithColor(50, 95, 40, 90, 60, 90, "charcoal")) ||
            (ex.hasTriangleAtWithColor(40, 90, 50, 85, 50, 95, "charcoal") &&
              ex.hasTriangleAtWithColor(60, 90, 50, 85, 50, 95, "charcoal")),
          errorHtml: "The nose needs two charcoal triangles. You can split it top/bottom or left/right."
        },
        {
          pass: ex.triangleDrawnBefore([10, 40, 10, 5, 50, 40], [50, 30, 50, 95, 10, 40]),
          errorHtml: "The left face should be drawn **on top of** the left ear."
        },
        {
          pass: ex.triangleDrawnBefore([90, 40, 90, 5, 50, 40], [50, 30, 50, 95, 90, 40]),
          errorHtml: "The right face should be drawn **on top of** the right ear."
        },
        {
          pass: ex.trianglesColorDrawnAbove("charcoal", "orange"),
          errorHtml: "The nose should sit **on top of** the face."
        }
      ];
    }
  }
];
