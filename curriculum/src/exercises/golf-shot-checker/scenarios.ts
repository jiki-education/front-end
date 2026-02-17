import type { Task, VisualScenario } from "../types";
import type GolfShotCheckerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-shot" as const,
    name: "Check if the shot lands in the hole",
    description:
      "Roll the ball based on the shot length, and if it lands over the hole (shot length 56-65), sink it! Then fire fireworks.",
    hints: [
      "Use get_shot_length() to find out how far the ball travels",
      "Roll the ball right by updating x in a repeat loop",
      "Check if the shot lands between 56 and 65 inclusive",
      "If it does, roll the ball down 9 times by updating y"
    ],
    requiredScenarios: ["too-short", "too-long", "just-inside-left", "just-inside-right"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "too-short",
    name: "Shot too short (23)",
    description: "The golfer hits the ball 23 — it doesn't reach the hole.",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(23);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 53,
          errorHtml: `The ball should be at x=53 (29 + 24), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay at y=75 (not over the hole), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "You should fire the fireworks at the end."
        }
      ];
    }
  },
  {
    slug: "too-long",
    name: "Shot too long (70)",
    description: "The golfer hits the ball 70 — it goes past the hole.",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(70);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 100,
          errorHtml: `The ball should be at x=100 (29 + 71), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay at y=75 (overshot the hole), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "You should fire the fireworks at the end."
        }
      ];
    }
  },
  {
    slug: "just-inside-left",
    name: "Just in the hole (56)",
    description: "The golfer hits the ball 56 — it just reaches the hole!",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(56);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 86,
          errorHtml: `The ball should be at x=86 (29 + 57), but it's at x=${ex.ballX}.`
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
    name: "Just in the hole (65)",
    description: "The golfer hits the ball 65 — it just about stays in the hole!",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(29, 75);
      ex.setupShotLength(65);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 95,
          errorHtml: `The ball should be at x=95 (29 + 66), but it's at x=${ex.ballX}.`
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
  }
];
