import type { Task, VisualScenario } from "../types";
import type GolfRollingBallManualExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-ball" as const,
    name: "Roll the ball into the hole",
    description: "Call move_ball_right() 20 times to get the ball to the hole.",
    hints: [
      "The ball needs to move 20 times to the right",
      "Each move_ball_right() call moves it one step",
      "Write move_ball_right() on 20 separate lines"
    ],
    requiredScenarios: ["roll-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "roll-ball",
    name: "Roll the ball into the hole",
    description: "Move the ball 20 units to the right.",
    taskId: "roll-ball",

    setup(exercise) {
      const ex = exercise as GolfRollingBallManualExercise;
      ex.setupBallPosition(28, 75);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-rolling-ball.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallManualExercise;
      return [
        {
          pass: ex.ballX === 48,
          errorHtml: `The ball didn't reach the hole. It's at position ${ex.ballX}, but needs to be at position 48.`
        }
      ];
    }
  }
];
