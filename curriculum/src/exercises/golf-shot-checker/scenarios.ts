import type { Task, VisualScenario } from "../types";
import type GolfShotCheckerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-shot" as const,
    name: "Check if the shot lands in the hole",
    description: "Roll the ball based on the shot length, and if it lands over the hole, sink it! Then fire fireworks.",
    hints: [],
    requiredScenarios: [
      "too-short",
      "just-too-short",
      "too-long",
      "just-inside-left",
      "just-inside-right",
      "just-too-far"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "too-short",
    name: "Shot too short",
    description: "The golfer hits the ball 23 — it doesn't reach the hole.",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(23);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 51,
          errorHtml: `The ball should be at x=53 (28 + 24), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay at y=75 (not over the hole), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "You shouldn't have fired the fireworks."
        }
      ];
    }
  },
  {
    slug: "just-too-short",
    name: "Just too short",
    description: "The golfer hits the ball 57 and it just doesn't quite roll in.",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(57);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 85,
          errorHtml: `The ball should be at x=95 (28 + 66), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should have sunk to y=84 (75 + 9), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "You shouldn't have fired the fireworks"
        }
      ];
    }
  },
  {
    slug: "just-inside-left",
    name: "Just in the hole",
    description: "The golfer hits the ball 56 — it just reaches the hole!",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(58);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 86,
          errorHtml: `The ball should be at x=86 (28 + 57), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 84,
          errorHtml: `The ball should have sunk to y=84 (75 + 9), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "You should fire the fireworks at the end."
        }
      ];
    }
  },
  {
    slug: "just-inside-right",
    name: "Nearly too far but ok!",
    description: "The golfer hits the ball 62 — it just about stays in the hole!",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(62);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 90,
          errorHtml: `The ball should be at x=95 (28 + 66), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 84,
          errorHtml: `The ball should have sunk to y=84 (75 + 9), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "You should fire the fireworks at the end."
        }
      ];
    }
  },
  {
    slug: "just-too-far",
    name: "Just too far",
    description: "The golfer hits the ball 63 and it just pops out the other side",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(63);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 91,
          errorHtml: `The ball should be at x=95 (28 + 66), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should have sunk to y=84 (75 + 9), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "You shouldn't have fired the fireworks"
        }
      ];
    }
  },
  {
    slug: "too-long",
    name: "Shot too long",
    description: "The golfer hits the ball 68 — it goes past the hole.",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(68);
      ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 96,
          errorHtml: `The ball should be at x=100 (28 + 71), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay at y=75 (overshot the hole), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "You shouldn't have fired the fireworks at the end."
        }
      ];
    }
  }
];
