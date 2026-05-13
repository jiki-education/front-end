import type { Task, VisualScenario } from "../types";
import type GolfScenariosExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-and-celebrate" as const,
    name: "Roll the ball",
    description: "Get the shot length and roll the ball right by that amount.",
    hints: [],
    requiredScenarios: ["short-shot", "medium-shot", "long-shot", "very-long-shot"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "short-shot",
    name: "Short shot (20)",
    description: "The golfer hits the ball 20 units.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(20);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      return [
        {
          pass: ex.ballX === 50,
          errorHtml: `The ball should be at x=50 (29 + 21), but it's at x=${ex.ballX}.`
        }
      ];
    }
  },
  {
    slug: "medium-shot",
    name: "Medium shot (35)",
    description: "The golfer hits the ball 35 units.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(35);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      return [
        {
          pass: ex.ballX === 65,
          errorHtml: `The ball should be at x=65 (29 + 36), but it's at x=${ex.ballX}.`
        }
      ];
    }
  },
  {
    slug: "long-shot",
    name: "Long shot (50)",
    description: "The golfer hits the ball 50 units.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(50);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      return [
        {
          pass: ex.ballX === 80,
          errorHtml: `The ball should be at x=80 (29 + 51), but it's at x=${ex.ballX}.`
        }
      ];
    }
  },
  {
    slug: "very-long-shot",
    name: "Very long shot (60)",
    description: "The golfer hits the ball 60 units.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(60);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      return [
        {
          pass: ex.ballX === 90,
          errorHtml: `The ball should be at x=90 (29 + 61), but it's at x=${ex.ballX}.`
        }
      ];
    }
  }
];
