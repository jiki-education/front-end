import type { Task, VisualScenario } from "../types";
import type { FixWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "fill-holes" as const,
    name: "Fill the holes in the wall",
    description: "Cover each hole with a rectangle using the rectangle function.",
    hints: ["Draw three rectangles to cover the holes", "Each hole is 20 wide and 10 tall"],
    requiredScenarios: ["fill-holes"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "fill-holes",
    name: "Fill the holes",
    description: "Cover each hole with a rectangle.",
    taskId: "fill-holes",

    setup(exercise) {
      const ex = exercise as FixWallExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/wall-to-fix.png");
      ex.setupStroke(0.4, "#7f3732");
    },

    expectations(exercise) {
      const ex = exercise as FixWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(10, 10, 20, 10),
          errorHtml: "The top hole isn't filled correctly."
        },
        {
          pass: ex.hasRectangleAt(70, 30, 20, 10),
          errorHtml: "The middle hole isn't filled correctly."
        },
        {
          pass: ex.hasRectangleAt(20, 60, 20, 10),
          errorHtml: "The bottom hole isn't filled correctly."
        }
      ];
    }
  }
];
