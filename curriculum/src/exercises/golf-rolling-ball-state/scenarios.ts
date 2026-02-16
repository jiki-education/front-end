import type { Task, VisualScenario } from "../types";
import type GolfRollingBallStateExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-ball" as const,
    name: "Roll the ball into the hole",
    description:
      "Track the ball's x position in a variable and use a repeat loop to move it from position 28 to position 88.",
    hints: [
      "Set a variable x to 28",
      "Use repeat 60 times do ... end",
      "Inside the loop, increase x by 1 and call move_ball_to(x)"
    ],
    requiredScenarios: ["roll-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "roll-ball",
    name: "Roll the ball into the hole",
    description: "Move the ball from position 28 to position 88 using a variable and a loop.",
    taskId: "roll-ball",

    setup(exercise) {
      const ex = exercise as GolfRollingBallStateExercise;
      ex.setupBallPosition(28, 75);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-rolling-ball.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallStateExercise;
      return [
        {
          pass: ex.ballX === 88,
          errorHtml: `The ball didn't reach the hole. It's at position ${ex.ballX}, but needs to be at position 88.`
        }
      ];
    }
  }
];
