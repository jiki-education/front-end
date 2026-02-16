import type { Task, VisualScenario } from "../types";
import type GolfShotCheckerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-shot" as const,
    name: "Check if the shot lands in the hole",
    description:
      "Move the ball based on the shot length, and if it lands over the hole (shot length 56-63), sink it and celebrate!",
    hints: [
      "Use get_shot_length() to find out how far the ball travels",
      "Move the ball right by the shot length using a repeat loop",
      "Check if the shot lands between 56 and 63 inclusive",
      "If it does, move the ball down 9 times and fire fireworks"
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
      ex.setupBallPosition(30, 75);
      ex.setupShotLength(23);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 53,
          errorHtml: `The ball should be at x=53 (30 + 23), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay at y=75 (not over the hole), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "Fireworks should not fire when the ball doesn't reach the hole."
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
      ex.setupBallPosition(30, 75);
      ex.setupShotLength(70);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 100,
          errorHtml: `The ball should be at x=100 (30 + 70), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay at y=75 (overshot the hole), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "Fireworks should not fire when the ball overshoots the hole."
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
      ex.setupBallPosition(30, 75);
      ex.setupShotLength(56);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 86,
          errorHtml: `The ball should be at x=86 (30 + 56), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 84,
          errorHtml: `The ball should have sunk to y=84 (75 + 9), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "The ball is in the hole! You should fire the fireworks."
        }
      ];
    }
  },
  {
    slug: "just-inside-right",
    name: "Just in the hole (63)",
    description: "The golfer hits the ball 63 — it just about stays in the hole!",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(30, 75);
      ex.setupShotLength(63);
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/golf-shot-checker.png");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      return [
        {
          pass: ex.ballX === 93,
          errorHtml: `The ball should be at x=93 (30 + 63), but it's at x=${ex.ballX}.`
        },
        {
          pass: ex.ballY === 84,
          errorHtml: `The ball should have sunk to y=84 (75 + 9), but it's at y=${ex.ballY}.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "The ball is in the hole! You should fire the fireworks."
        }
      ];
    }
  }
];
