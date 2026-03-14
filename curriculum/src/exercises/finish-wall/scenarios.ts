import type { Task, VisualScenario } from "../types";
import type { FinishWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "finish-wall" as const,
    name: "Finish the wall",
    description: "Add a top layer to the wall!",
    hints: [],
    requiredScenarios: ["finish-wall"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "finish-wall",
    name: "Finish off the wall",
    description: "Add a top layer to the wall!",
    taskId: "finish-wall",

    setup(exercise) {
      const ex = exercise as FinishWallExercise;
      ex.setupBackground("/static/images/exercise-assets/finish-wall/topless-wall.png");
      ex.setupStroke(0.4, "#7f3732");
    },

    expectations(exercise) {
      const ex = exercise as FinishWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 20, 10),
          errorHtml: "The left brick isn't correct."
        },
        {
          pass: ex.hasRectangleAt(20, 0, 20, 10),
          errorHtml: "The second brick isn't correct."
        },
        {
          pass: ex.hasRectangleAt(40, 0, 20, 10),
          errorHtml: "The middle brick isn't correct."
        },
        {
          pass: ex.hasRectangleAt(60, 0, 20, 10),
          errorHtml: "The fourth brick isn't correct."
        },
        {
          pass: ex.hasRectangleAt(80, 0, 20, 10),
          errorHtml: "The right brick isn't correct."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("rectangle") === 1,
        errorHtml:
          "You are using the <code>rectangle</code> function in multiple places in your code. It should only appear once!"
      }
    ]
  }
];
