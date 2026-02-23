import type { Task, VisualScenario } from "../types";
import type RockPaperScissorsDetermineWinnerExercise from "./Exercise";

export const tasks = [
  {
    id: "determine-winner" as const,
    name: "Determine the winner",
    description: 'Get both players\' choices and announce the correct result: "player_1", "player_2", or "tie".',
    hints: [
      "Store both choices in variables using getPlayer1Choice() and getPlayer2Choice()",
      "Check if the choices are the same first — that's always a tie",
      "There are three cases where player 1 wins: rock vs scissors, scissors vs paper, paper vs rock",
      "If it's not a tie and player 1 didn't win, player 2 must have won"
    ],
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
    description: "Player 1's paper beats player 2's rock. Announce player 1 as the winner!",
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
          pass: ex.result === "player_1",
          errorHtml: `Paper vs Rock should be a win for player 1 but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "paper-vs-scissors",
    name: "Paper vs Scissors",
    description: "Player 2's scissors beat player 1's paper. Announce player 2 as the winner.",
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
          pass: ex.result === "player_2",
          errorHtml: `Paper vs Scissors should be a win for player 2 but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "rock-vs-paper",
    name: "Rock vs Paper",
    description: "Player 2's paper beats player 1's rock. Announce player 2 as the winner.",
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
          pass: ex.result === "player_2",
          errorHtml: `Rock vs Paper should be a win for player 2 but it was "${ex.result}".`
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
    description: "Player 1's rock beats player 2's scissors. Announce player 1 as the winner.",
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
          pass: ex.result === "player_1",
          errorHtml: `Rock vs Scissors should be a win for player 1 but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "scissors-vs-paper",
    name: "Scissors vs Paper",
    description: "Player 1's scissors beat player 2's paper. Announce player 1 as the winner.",
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
          pass: ex.result === "player_1",
          errorHtml: `Scissors vs Paper should be a win for player 1 but it was "${ex.result}".`
        }
      ];
    }
  },
  {
    slug: "scissors-vs-rock",
    name: "Scissors vs Rock",
    description: "Player 2's rock beats player 1's scissors. Announce player 2 as the winner.",
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
          pass: ex.result === "player_2",
          errorHtml: `Scissors vs Rock should be a win for player 2 but it was "${ex.result}".`
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
