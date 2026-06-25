import type { Task, VisualScenario } from "../types";
import type RockPaperScissorsDetermineWinnerExercise from "./Exercise";

export const tasks = [
  {
    id: "determine-winner" as const,
    name: "Determine the winner",
    description: 'Get both players\' choices and announce the correct result: "Yuki", "Ando", or "tie".',
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
    name: "Paper vs Paper",
    description: "It's a draw. Announce it correctly!",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "tie",
          errorHtml: `Paper vs Paper should be a tie but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "paper-vs-rock",
    name: "Paper vs Rock",
    description: "Yuki's paper beats Ando's rock. Announce Yuki as the winner!",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "Yuki",
          errorHtml: `Paper vs Rock should be a win for Yuki but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "paper-vs-scissors",
    name: "Paper vs Scissors",
    description: "Ando's scissors beat Yuki's paper. Announce Ando as the winner.",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "Ando",
          errorHtml: `Paper vs Scissors should be a win for Ando but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "rock-vs-paper",
    name: "Rock vs Paper",
    description: "Ando's paper beats Yuki's rock. Announce Ando as the winner.",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "Ando",
          errorHtml: `Rock vs Paper should be a win for Ando but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "rock-vs-rock",
    name: "Rock vs Rock",
    description: "It's a draw. Announce it correctly!",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "tie",
          errorHtml: `Rock vs Rock should be a tie but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "rock-vs-scissors",
    name: "Rock vs Scissors",
    description: "Yuki's rock beats Ando's scissors. Announce Yuki as the winner.",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "Yuki",
          errorHtml: `Rock vs Scissors should be a win for Yuki but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "scissors-vs-paper",
    name: "Scissors vs Paper",
    description: "Yuki's scissors beat Ando's paper. Announce Yuki as the winner.",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "Yuki",
          errorHtml: `Scissors vs Paper should be a win for Yuki but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "scissors-vs-rock",
    name: "Scissors vs Rock",
    description: "Ando's rock beats Yuki's scissors. Announce Ando as the winner.",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "Ando",
          errorHtml: `Scissors vs Rock should be a win for Ando but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "scissors-vs-scissors",
    name: "Scissors vs Scissors",
    description: "It's a draw. Announce it correctly!",
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
          errorHtml: "You didn't announce a result!"
        },
        {
          pass: ex.result === "tie",
          errorHtml: `Scissors vs Scissors should be a tie but it was "${ex.result}".`
        }
      ];
    }
  }
];
