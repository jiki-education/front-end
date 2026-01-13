import type { Task, VisualScenario } from "../types";
import type { FinishWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "finish-wall" as const,
    name: "Finish the wall",
    description: "Add a top layer of 5 bricks to complete the wall using a repeat loop.",
    hints: [
      "Use repeat 5 times to draw the bricks",
      "Each brick is 20 wide and 10 tall",
      "Bricks are positioned at x = 0, 20, 40, 60, 80"
    ],
    requiredScenarios: ["finish-wall"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "finish-wall",
    name: "Finish off the wall",
    description: "Add a top layer of 5 bricks to the wall.",
    taskId: "finish-wall",

    setup(exercise) {
      const ex = exercise as FinishWallExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/topless-wall.png");
      ex.setupStroke(0.4, "#7f3732");
    },

    expectations(exercise) {
      const ex = exercise as FinishWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 20, 10),
          errorHtml: "The first brick (at x=0) isn't correct."
        },
        {
          pass: ex.hasRectangleAt(20, 0, 20, 10),
          errorHtml: "The second brick (at x=20) isn't correct."
        },
        {
          pass: ex.hasRectangleAt(40, 0, 20, 10),
          errorHtml: "The middle brick (at x=40) isn't correct."
        },
        {
          pass: ex.hasRectangleAt(60, 0, 20, 10),
          errorHtml: "The fourth brick (at x=60) isn't correct."
        },
        {
          pass: ex.hasRectangleAt(80, 0, 20, 10),
          errorHtml: "The right brick (at x=80) isn't correct."
        }
      ];
    }
  }
];
