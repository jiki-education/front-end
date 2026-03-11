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
      ex.setupBackground("/static/images/exercise-assets/foxy-face/background.png");
    },

    expectations(exercise) {
      const ex = exercise as FoxyFaceExercise;

      return [
        {
          pass: ex.hasTriangleAt(10, 40, 5, 60, 50, 95),
          errorHtml: "The left cheek triangle isn't right."
        },
        {
          pass: ex.hasTriangleAt(90, 40, 95, 60, 50, 95),
          errorHtml: "The right cheek triangle isn't right."
        },
        {
          pass: ex.hasTriangleAt(10, 40, 10, 5, 50, 40),
          errorHtml: "The left ear triangle isn't right."
        },
        {
          pass: ex.hasTriangleAt(90, 40, 90, 5, 50, 40),
          errorHtml: "The right ear triangle isn't right."
        },
        {
          pass: ex.hasTriangleAt(50, 30, 50, 95, 10, 40),
          errorHtml: "The left face triangle isn't right."
        },
        {
          pass: ex.hasTriangleAt(50, 30, 50, 95, 90, 40),
          errorHtml: "The right face triangle isn't right."
        },
        {
          pass:
            (ex.hasTriangleAt(40, 90, 50, 85, 60, 90) && ex.hasTriangleAt(50, 95, 40, 90, 60, 90)) ||
            (ex.hasTriangleAt(40, 90, 50, 85, 50, 95) && ex.hasTriangleAt(60, 90, 50, 85, 50, 95)),
          errorHtml: "The nose needs two charcoal triangles. You can split it top/bottom or left/right."
        }
      ];
    }
  }
];
