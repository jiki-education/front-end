import type { Task, VisualScenario } from "../types";
import type GolfRollingBallLoopExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-ball" as const,
    name: "Roll the ball into the hole",
    description: "Use a repeat loop to move the ball 60 times to the right so it reaches the hole.",
    hints: [
      "The ball needs to move 60 times to the right",
      "Use repeat 60 times do ... end",
      "You only need one function call inside the loop"
    ],
    requiredScenarios: ["roll-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "roll-ball",
    name: "Roll the ball into the hole",
    description: "Move the ball 60 units to the right using a repeat loop.",
    taskId: "roll-ball",

    setup(exercise) {
      const ex = exercise as GolfRollingBallLoopExercise;
      ex.setupBallPosition(28, 75);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-rolling-ball.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfRollingBallLoopExercise;
      return [
        {
          pass: ex.ballX === 88,
          errorHtml: `The ball didn't reach the hole. It's at position ${ex.ballX}, but needs to be at position 88.`
        }
      ];
    },

    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 2 : 3;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorHtml: "Your solution has too many lines of code. Try using a repeat loop to make it shorter!"
      }
    ]
  }
];
