import type { Task, VisualScenario } from "../types";
import type GolfScenariosExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-and-celebrate" as const,
    name: "tasks.rollAndCelebrate.name",
    description: "tasks.rollAndCelebrate.description",
    hints: [],
    requiredScenarios: ["short-shot", "medium-shot", "long-shot", "very-long-shot"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "short-shot",
    name: "scenarios.shortShot.name",
    description: "scenarios.shortShot.description",
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
          errorHtml: ex.t("checks.wrongShotEnd")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        }
      ];
    }
  },
  {
    slug: "medium-shot",
    name: "scenarios.mediumShot.name",
    description: "scenarios.mediumShot.description",
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
          errorHtml: ex.t("checks.wrongShotEnd")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        }
      ];
    }
  },
  {
    slug: "long-shot",
    name: "scenarios.longShot.name",
    description: "scenarios.longShot.description",
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
          errorHtml: ex.t("checks.wrongShotEnd")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        }
      ];
    }
  },
  {
    slug: "very-long-shot",
    name: "scenarios.veryLongShot.name",
    description: "scenarios.veryLongShot.description",
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
          errorHtml: ex.t("checks.wrongShotEnd")
        },
        {
          pass: missingPositions.length === 0,
          errorHtml: ex.t("checks.missingPositions")
        }
      ];
    }
  }
];
