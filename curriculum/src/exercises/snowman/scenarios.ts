import type { Task, VisualScenario } from "../types";
import type { SnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-snowman" as const,
    name: "Build the snowman",
    description: "Set the variable values so the snowman matches the target image.",
    hints: [],
    requiredScenarios: ["build-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-snowman",
    name: "Build the snowman",
    description: "Set the correct variable values to draw the snowman.",
    taskId: "build-snowman",

    setup(exercise) {
      const ex = exercise as SnowmanExercise;
      ex.setupBackground("/static/images/exercise-assets/snowman/background.png");
    },

    expectations(exercise) {
      const ex = exercise as SnowmanExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 70, 20),
          errorHtml: "The base (bottom) circle isn't right. Check snowmanCx, baseCy, and baseRadius."
        },
        {
          pass: ex.hasCircleAt(50, 40, 15),
          errorHtml: "The body (middle) circle isn't right. Check snowmanCx, bodyCy, and bodyRadius."
        },
        {
          pass: ex.hasCircleAt(50, 20, 10),
          errorHtml: "The head (top) circle isn't right. Check snowmanCx, headCy, and headRadius."
        }
      ];
    }
  }
];
