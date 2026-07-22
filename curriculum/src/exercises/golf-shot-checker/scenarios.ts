import type { Task, VisualScenario } from "../types";
import type GolfShotCheckerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-shot" as const,
    name: "tasks.checkShot.name",
    description: "tasks.checkShot.description",
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
    name: "scenarios.tooShort.name",
    description: "scenarios.tooShort.description",
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
          errorHtml: ex.t("checks.wrongDistance")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        },
        {
          pass: ex.ballY === 75,
          errorHtml: ex.t("checks.stayOnGrassPlain")
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: ex.t("checks.noFireworksPeriod")
        }
      ];
    }
  },
  {
    slug: "just-too-short",
    name: "scenarios.justTooShort.name",
    description: "scenarios.justTooShort.description",
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
          errorHtml: ex.t("checks.wrongDistance")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        },
        {
          pass: ex.ballY === 75,
          errorHtml: ex.t("checks.stayOnGrassPlain")
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: ex.t("checks.noFireworksNoPeriod")
        }
      ];
    }
  },
  {
    slug: "just-too-far",
    name: "scenarios.justTooFar.name",
    description: "scenarios.justTooFar.description",
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
          errorHtml: ex.t("checks.wrongDistance")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        },
        {
          pass: ex.ballY === 75,
          errorHtml: ex.t("checks.stayOnGrassOvershot")
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: ex.t("checks.noFireworksNoPeriod")
        }
      ];
    }
  },
  {
    slug: "too-long",
    name: "scenarios.tooLong.name",
    description: "scenarios.tooLong.description",
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
          errorHtml: ex.t("checks.wrongDistance")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        },
        {
          pass: ex.ballY === 75,
          errorHtml: ex.t("checks.stayOnGrassOvershot")
        },
        {
          pass: ex.fireworksFired === false,
          errorHtml: ex.t("checks.noFireworksAtEnd")
        }
      ];
    }
  },
  {
    slug: "just-inside-left",
    name: "scenarios.justInsideLeft.name",
    description: "scenarios.justInsideLeft.description",
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
          errorHtml: ex.t("checks.wrongDistance")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        },
        {
          pass: ex.ballY === 84,
          errorHtml: ex.t("checks.droppedIncorrectly")
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: ex.t("checks.shouldFireFireworks")
        }
      ];
    }
  },
  {
    slug: "just-inside-right",
    name: "scenarios.justInsideRight.name",
    description: "scenarios.justInsideRight.description",
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
          errorHtml: ex.t("checks.wrongDistance")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        },
        {
          pass: ex.ballY === 84,
          errorHtml: ex.t("checks.droppedIncorrectly")
        },
        {
          pass: ex.fireworksFired === true,
          errorHtml: ex.t("checks.shouldFireFireworks")
        }
      ];
    }
  }
];
