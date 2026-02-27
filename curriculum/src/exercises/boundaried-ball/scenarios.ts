import type { Task, VisualScenario } from "../types";
import type BoundarieBallExercise from "./Exercise";

export const tasks = [
  {
    id: "bounce-ball" as const,
    name: "Make the ball bounce around",
    description: "Create a ball and make it bounce off all four walls of the game area.",
    hints: [],
    requiredScenarios: ["add-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "add-ball",
    name: "Add the ball",
    description: "Add the ball and make it bounce around the game area.",
    taskId: "bounce-ball",

    expectations(exercise) {
      const ex = exercise as BoundarieBallExercise;
      return [
        {
          pass: ex.getState().moveBallCallCount === 376,
          errorHtml: "We expected the ball to move twice around the game area and land back in the same starting place."
        },
        {
          pass: ex.didBallAppearAt(3, 50),
          errorHtml: "The ball didn't seem to touch the middle of the left hand side."
        },
        {
          pass: ex.didBallAppearAt(97, 50),
          errorHtml: "The ball didn't seem to touch the middle of the right hand side."
        },
        {
          pass: ex.didBallAppearAt(50, 3),
          errorHtml: "The ball didn't seem to touch the top middle."
        },
        {
          pass: ex.didBallAppearAt(50, 97),
          errorHtml: "The ball didn't seem to touch the bottom middle."
        }
      ];
    }
  }
];
