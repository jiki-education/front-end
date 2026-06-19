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
    description: "In this scenario, `getShotLength()` will return 20. Roll the ball 20 steps from the tee.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(20);
      ex.setupBackground("/static/images/exercise-assets/golf-scenarios/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      const requiredPositions = [29, 38, 48];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 48,
          errorHtml: `The ball didn't end up in the right place for this shot. Check it travels the full shot length.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time, not jump straight to the end.`
        }
      ];
    }
  },
  {
    slug: "medium-shot",
    name: "Medium shot (35)",
    description: "In this scenario, `getShotLength()` will return 35. Roll the ball 35 steps from the tee.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(35);
      ex.setupBackground("/static/images/exercise-assets/golf-scenarios/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      const requiredPositions = [29, 45, 63];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 63,
          errorHtml: `The ball didn't end up in the right place for this shot. Check it travels the full shot length.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time, not jump straight to the end.`
        }
      ];
    }
  },
  {
    slug: "long-shot",
    name: "Long shot (50)",
    description: "In this scenario, `getShotLength()` will return 50. Roll the ball 50 steps from the tee.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(50);
      ex.setupBackground("/static/images/exercise-assets/golf-scenarios/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      const requiredPositions = [29, 53, 78];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 78,
          errorHtml: `The ball didn't end up in the right place for this shot. Check it travels the full shot length.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time, not jump straight to the end.`
        }
      ];
    }
  },
  {
    slug: "very-long-shot",
    name: "Very long shot (60)",
    description: "In this scenario, `getShotLength()` will return 60. Roll the ball 60 steps from the tee.",
    taskId: "roll-and-celebrate",

    setup(exercise) {
      const ex = exercise as GolfScenariosExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(60);
      ex.setupBackground("/static/images/exercise-assets/golf-scenarios/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfScenariosExercise;
      const requiredPositions = [29, 58, 88];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 88,
          errorHtml: `The ball didn't end up in the right place for this shot. Check it travels the full shot length.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time, not jump straight to the end.`
        }
      ];
    }
  }
];
