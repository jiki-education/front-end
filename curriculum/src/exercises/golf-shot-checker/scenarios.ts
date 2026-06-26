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
      "just-too-far",
      "too-long",
      "just-inside-left",
      "just-inside-right"
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
      ex.setupBackground("/static/images/exercise-assets/golf-shot-checker/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      const requiredPositions = [29, 40, 51];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 51,
          errorHtml: `The ball didn't roll the right distance for this shot. It should travel exactly the shot length from the tee.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay on the grass for this shot — it shouldn't drop into the hole.`
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
      ex.setupBackground("/static/images/exercise-assets/golf-shot-checker/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      const requiredPositions = [29, 57, 85];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 85,
          errorHtml: `The ball didn't roll the right distance for this shot. It should travel exactly the shot length from the tee.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball should stay on the grass for this shot — it shouldn't drop into the hole.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "You shouldn't have fired the fireworks"
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
      ex.setupBackground("/static/images/exercise-assets/golf-shot-checker/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      const requiredPositions = [29, 60, 91];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 91,
          errorHtml: `The ball didn't roll the right distance for this shot. It should travel exactly the shot length from the tee.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball overshot the hole, so it should stay on the grass — it shouldn't drop in.`
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
      ex.setupBackground("/static/images/exercise-assets/golf-shot-checker/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      const requiredPositions = [29, 62, 96];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 96,
          errorHtml: `The ball didn't roll the right distance for this shot. It should travel exactly the shot length from the tee.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time.`
        },
        {
          pass: ex.ballY === 75,
          errorHtml: `The ball overshot the hole, so it should stay on the grass — it shouldn't drop in.`
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: "You shouldn't have fired the fireworks at the end."
        }
      ];
    }
  },
  {
    slug: "just-inside-left",
    name: "Just in the hole",
    description: "The golfer hits the ball 58 — it just reaches the hole!",
    taskId: "check-shot",

    setup(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      ex.setupBallPosition(28, 75);
      ex.setupShotLength(58);
      ex.setupBackground("/static/images/exercise-assets/golf-shot-checker/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      const requiredPositions = [29, 57, 86];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 86,
          errorHtml: `The ball didn't roll the right distance for this shot. It should travel exactly the shot length from the tee.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time.`
        },
        {
          pass: ex.ballY === 84,
          errorHtml: `The ball reached the hole but didn't drop down into it correctly.`
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
      ex.setupBackground("/static/images/exercise-assets/golf-shot-checker/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as GolfShotCheckerExercise;
      const requiredPositions = [29, 60, 90];
      const missingPositions = requiredPositions.filter((p) => !ex.visitedPositions.includes(p));
      return [
        {
          pass: ex.ballX === 90,
          errorHtml: `The ball didn't roll the right distance for this shot. It should travel exactly the shot length from the tee.`
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: `The ball must roll through each position one step at a time.`
        },
        {
          pass: ex.ballY === 84,
          errorHtml: `The ball reached the hole but didn't drop down into it correctly.`
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: "You should fire the fireworks at the end."
        }
      ];
    }
  }
];
