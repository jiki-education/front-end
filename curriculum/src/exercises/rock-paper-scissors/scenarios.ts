import type { Task, VisualScenario } from "../types";
import type RockPaperScissorsDetermineWinnerExercise from "./Exercise";

export const tasks = [
  {
    id: "determine-winner" as const,
    name: "tasks.determineWinner.name",
    description: "tasks.determineWinner.description",
    hints: [],
    requiredScenarios: [
      "paper-vs-paper",
      "paper-vs-rock",
      "paper-vs-scissors",
      "rock-vs-paper",
      "rock-vs-rock",
      "rock-vs-scissors",
      "scissors-vs-paper",
      "scissors-vs-rock",
      "scissors-vs-scissors"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "paper-vs-paper",
    name: "scenarios.paperVsPaper.name",
    description: "scenarios.paperVsPaper.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("paper", "paper");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "tie",
          errorHtml: ex.t("checks.paperVsPaperResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "paper-vs-rock",
    name: "scenarios.paperVsRock.name",
    description: "scenarios.paperVsRock.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("paper", "rock");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "Yuki",
          errorHtml: ex.t("checks.paperVsRockResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "paper-vs-scissors",
    name: "scenarios.paperVsScissors.name",
    description: "scenarios.paperVsScissors.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("paper", "scissors");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "Ando",
          errorHtml: ex.t("checks.paperVsScissorsResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "rock-vs-paper",
    name: "scenarios.rockVsPaper.name",
    description: "scenarios.rockVsPaper.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("rock", "paper");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "Ando",
          errorHtml: ex.t("checks.rockVsPaperResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "rock-vs-rock",
    name: "scenarios.rockVsRock.name",
    description: "scenarios.rockVsRock.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("rock", "rock");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "tie",
          errorHtml: ex.t("checks.rockVsRockResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "rock-vs-scissors",
    name: "scenarios.rockVsScissors.name",
    description: "scenarios.rockVsScissors.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("rock", "scissors");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "Yuki",
          errorHtml: ex.t("checks.rockVsScissorsResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "scissors-vs-paper",
    name: "scenarios.scissorsVsPaper.name",
    description: "scenarios.scissorsVsPaper.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("scissors", "paper");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "Yuki",
          errorHtml: ex.t("checks.scissorsVsPaperResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "scissors-vs-rock",
    name: "scenarios.scissorsVsRock.name",
    description: "scenarios.scissorsVsRock.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("scissors", "rock");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "Ando",
          errorHtml: ex.t("checks.scissorsVsRockResult", { got: ex.result })
        }
      ];
    }
  },
  {
    slug: "scissors-vs-scissors",
    name: "scenarios.scissorsVsScissors.name",
    description: "scenarios.scissorsVsScissors.description",
    taskId: "determine-winner",

    setup(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      ex.setupChoices("scissors", "scissors");
    },

    expectations(exercise) {
      const ex = exercise as RockPaperScissorsDetermineWinnerExercise;
      return [
        {
          pass: ex.result !== null,
          errorHtml: ex.t("checks.noResult")
        },
        {
          pass: ex.result === "tie",
          errorHtml: ex.t("checks.scissorsVsScissorsResult", { got: ex.result })
        }
      ];
    }
  }
];
