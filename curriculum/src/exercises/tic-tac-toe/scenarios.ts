import type { Task, VisualScenario } from "../types";
import type { TicTacToeExercise } from "./Exercise";

export const tasks = [
  {
    id: "play-tic-tac-toe" as const,
    name: "tasks.playTicTacToe.name",
    description: "tasks.playTicTacToe.description",
    hints: [],
    requiredScenarios: [
      "partial-game",
      "draw",
      "double-placement-duplicate",
      "double-placement-on-top",
      "win-x",
      "win-o",
      "ai-o-finish",
      "ai-x-win",
      "ai-o-win",
      "ai-x-block",
      "ai-game"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "partial-game",
    name: "scenarios.partialGame.name",
    description: "scenarios.partialGame.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [
        [
          [2, 3],
          [1, 3],
          [3, 1],
          [2, 2]
        ]
      ]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasRectangleAt(5, 5, 90, 90), errorHtml: ex.t("checks.gameOutlineWrongOrMissing") },
        { pass: ex.hasLineAt(5, 35, 95, 35), errorHtml: ex.t("checks.gridLine535To9535WrongOrMissing") },
        { pass: ex.hasLineAt(5, 65, 95, 65), errorHtml: ex.t("checks.gridLine565To9565WrongOrMissing") },
        { pass: ex.hasLineAt(35, 5, 35, 95), errorHtml: ex.t("checks.gridLine355To3595WrongOrMissing") },
        { pass: ex.hasLineAt(65, 5, 65, 95), errorHtml: ex.t("checks.gridLine655To6595WrongOrMissing") },
        { pass: ex.writeCallCount() === 0, errorHtml: ex.t("checks.wroteWhileGameInProgress") },
        // Crosses at (2,3) -> cx=80,cy=50 and (2,2) -> cx=50,cy=50
        { pass: ex.hasLineAt(70, 10, 90, 30), errorHtml: ex.t("checks.crossLine7010To9030WrongOrMissing") },
        { pass: ex.hasLineAt(70, 30, 90, 10), errorHtml: ex.t("checks.crossLine7030To9010WrongOrMissing") },
        { pass: ex.hasLineAt(40, 40, 60, 60), errorHtml: ex.t("checks.crossLine4040To6060WrongOrMissing") },
        { pass: ex.hasLineAt(40, 60, 60, 40), errorHtml: ex.t("checks.crossLine4060To6040WrongOrMissing") },
        // Noughts at (1,3) -> 80,20 and (3,1) -> 20,80
        { pass: ex.hasCircleAt(80, 50, 10), errorHtml: ex.t("checks.nought8050MissingOrWrong") },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: ex.t("checks.nought2080MissingOrWrong") },
        { pass: !ex.hasRectangleAt(0, 0, 100, 100), errorHtml: ex.t("checks.drewResultsScreenGameNotEnded") }
      ];
    }
  },

  {
    slug: "draw",
    name: "scenarios.draw.name",
    description: "scenarios.draw.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [
        [
          [1, 1],
          [2, 2],
          [1, 2],
          [1, 3],
          [3, 1],
          [2, 1],
          [3, 3],
          [3, 2],
          [2, 3]
        ]
      ]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasRectangleAt(5, 5, 90, 90), errorHtml: ex.t("checks.gameOutlineWrongOrMissing") },
        { pass: ex.hasLineAt(5, 35, 95, 35), errorHtml: ex.t("checks.gridLine535To9535WrongOrMissing") },
        { pass: ex.hasLineAt(5, 65, 95, 65), errorHtml: ex.t("checks.gridLine565To9565WrongOrMissing") },
        { pass: ex.hasLineAt(35, 5, 35, 95), errorHtml: ex.t("checks.gridLine355To3595WrongOrMissing") },
        { pass: ex.hasLineAt(65, 5, 65, 95), errorHtml: ex.t("checks.gridLine655To6595WrongOrMissing") },
        { pass: ex.hasCircleAt(20, 20, 10), errorHtml: ex.t("checks.nought2020MissingOrWrong") },
        {
          pass: ex.hasLineAt(40, 40, 60, 60),
          errorHtml: ex.t("checks.crossLine4040To6060MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(40, 60, 60, 40),
          errorHtml: ex.t("checks.crossLine4060To6040MissingOrWrong")
        },
        { pass: ex.hasCircleAt(50, 20, 10), errorHtml: ex.t("checks.nought5020MissingOrWrong") },
        {
          pass: ex.hasLineAt(70, 10, 90, 30),
          errorHtml: ex.t("checks.crossLine7010To9030MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(70, 30, 90, 10),
          errorHtml: ex.t("checks.crossLine7030To9010MissingOrWrong")
        },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: ex.t("checks.nought2080MissingOrWrong") },
        {
          pass: ex.hasLineAt(10, 40, 30, 60),
          errorHtml: ex.t("checks.crossLine1040To3060MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(10, 60, 30, 40),
          errorHtml: ex.t("checks.crossLine1060To3040MissingOrWrong")
        },
        { pass: ex.hasCircleAt(80, 80, 10), errorHtml: ex.t("checks.nought8080MissingOrWrong") },
        {
          pass: ex.hasLineAt(40, 70, 60, 90),
          errorHtml: ex.t("checks.crossLine4070To6090MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(40, 90, 60, 70),
          errorHtml: ex.t("checks.crossLine4090To6070MissingOrWrong")
        },
        { pass: ex.hasCircleAt(80, 50, 10), errorHtml: ex.t("checks.nought8050MissingOrWrong") },
        {
          pass: ex.wasWriteCalledWith("The game was a draw!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: ex.t("checks.didntDrawOverlayCorrectly") },
        {
          pass: ex.checkUniqueColoredLines(2),
          errorHtml: ex.t("checks.expectedCrossesGreyedOut")
        },
        {
          pass: ex.checkUniqueColoredCircles(2),
          errorHtml: ex.t("checks.expectedNoughtsGreyedOut")
        }
      ];
    }
  },

  {
    slug: "double-placement-duplicate",
    name: "scenarios.doublePlacementDuplicate.name",
    description: "scenarios.doublePlacementDuplicate.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [
        [
          [2, 3],
          [1, 1],
          [2, 3]
        ]
      ]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        {
          pass: ex.wasWriteCalledWith("Invalid move!"),
          errorHtml: ex.t("checks.didntWriteInvalidMoveCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: ex.t("checks.didntDrawOverlayCorrectly") }
      ];
    }
  },

  {
    slug: "double-placement-on-top",
    name: "scenarios.doublePlacementOnTop.name",
    description: "scenarios.doublePlacementOnTop.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [
        [
          [2, 3],
          [2, 3]
        ]
      ]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        {
          pass: ex.wasWriteCalledWith("Invalid move!"),
          errorHtml: ex.t("checks.didntWriteInvalidMoveCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: ex.t("checks.didntDrawOverlayCorrectly") }
      ];
    }
  },

  {
    slug: "win-x",
    name: "scenarios.winX.name",
    description: "scenarios.winX.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [
        [
          [1, 1],
          [2, 2],
          [1, 3],
          [2, 1],
          [3, 3],
          [1, 2],
          [3, 1],
          [2, 3]
        ]
      ]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        {
          pass: ex.checkUniqueColoredLines(3),
          errorHtml: ex.t("checks.expectedCrossColorProgression")
        },
        {
          pass: ex.wasWriteCalledWith("The x's won!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: ex.t("checks.didntDrawOverlayCorrectly") }
      ];
    }
  },

  {
    slug: "win-o",
    name: "scenarios.winO.name",
    description: "scenarios.winO.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [
        [
          [1, 1],
          [1, 2],
          [1, 3],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 1]
        ]
      ]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasCircleAt(20, 20, 10), errorHtml: ex.t("checks.nought2020MissingOrWrong") },
        {
          pass: ex.hasLineAt(40, 10, 60, 30),
          errorHtml: ex.t("checks.crossLine4010To6030MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(40, 30, 60, 10),
          errorHtml: ex.t("checks.crossLine4030To6010MissingOrWrong")
        },
        { pass: ex.hasCircleAt(80, 20, 10), errorHtml: ex.t("checks.nought8020MissingOrWrong") },
        {
          pass: ex.hasLineAt(10, 40, 30, 60),
          errorHtml: ex.t("checks.crossLine1040To3060MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(10, 60, 30, 40),
          errorHtml: ex.t("checks.crossLine1060To3040MissingOrWrong")
        },
        { pass: ex.hasCircleAt(50, 50, 10), errorHtml: ex.t("checks.nought5050MissingOrWrong") },
        {
          pass: ex.hasLineAt(70, 40, 90, 60),
          errorHtml: ex.t("checks.crossLine7040To9060MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(70, 60, 90, 40),
          errorHtml: ex.t("checks.crossLine7060To9040MissingOrWrong")
        },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: ex.t("checks.nought2080MissingOrWrong") },
        {
          pass: ex.checkUniqueColoredCircles(3),
          errorHtml: ex.t("checks.expectedNoughtColorProgression")
        },
        {
          pass: ex.wasWriteCalledWith("The o's won!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: ex.t("checks.didntDrawOverlayCorrectly") }
      ];
    }
  },

  {
    slug: "ai-o-finish",
    name: "scenarios.aiOFinish.name",
    description: "scenarios.aiOFinish.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 2], [1, 2], [1, 3], [3, 1], [2, 1], [3, 3], [3, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasLineAt(70, 10, 90, 30), errorHtml: ex.t("checks.addedBlockingCross") },
        { pass: ex.hasLineAt(70, 30, 90, 10), errorHtml: ex.t("checks.addedBlockingCross") },
        {
          pass: ex.wasWriteCalledWith("The game was a draw!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") }
      ];
    }
  },

  {
    slug: "ai-x-win",
    name: "scenarios.aiXWin.name",
    description: "scenarios.aiXWin.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 2], [1, 3], [2, 1], [3, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        {
          pass: ex.hasLineAt(70, 40, 90, 60),
          errorHtml: ex.t("checks.addedWinningCross")
        },
        {
          pass: ex.hasLineAt(70, 60, 90, 40),
          errorHtml: ex.t("checks.addedWinningCross")
        },
        {
          pass: ex.wasWriteCalledWith("The x's won!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") }
      ];
    }
  },

  {
    slug: "ai-o-win",
    name: "scenarios.aiOWin.name",
    description: "scenarios.aiOWin.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 1], [2, 2], [3, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasCircleAt(80, 80, 10), errorHtml: ex.t("checks.addedWinningNought") },
        {
          pass: ex.wasWriteCalledWith("The o's won!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") }
      ];
    }
  },

  {
    slug: "ai-x-block",
    name: "scenarios.aiXBlock.name",
    description: "scenarios.aiXBlock.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[3, 1], [2, 1], [2, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasLineAt(70, 10, 90, 30), errorHtml: ex.t("checks.addedBlockingCross") },
        { pass: ex.hasLineAt(70, 30, 90, 10), errorHtml: ex.t("checks.addedBlockingCross") },
        {
          pass: ex.writeCallCount() === 0,
          errorHtml: ex.t("checks.wroteWhileGameInProgress")
        }
      ];
    }
  },

  {
    slug: "ai-game",
    name: "scenarios.aiGame.name",
    description: "scenarios.aiGame.description",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 2], [1, 2], "?", "?", "?", "?", "?", "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasCircleAt(20, 20, 10), errorHtml: ex.t("checks.nought2020MissingOrWrong") },
        {
          pass: ex.hasLineAt(40, 40, 60, 60),
          errorHtml: ex.t("checks.crossLine4040To6060MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(40, 60, 60, 40),
          errorHtml: ex.t("checks.crossLine4060To6040MissingOrWrong")
        },
        { pass: ex.hasCircleAt(50, 20, 10), errorHtml: ex.t("checks.nought5020MissingOrWrong") },
        {
          pass: ex.hasLineAt(70, 10, 90, 30),
          errorHtml: ex.t("checks.crossLine7010To9030MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(70, 30, 90, 10),
          errorHtml: ex.t("checks.crossLine7030To9010MissingOrWrong")
        },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: ex.t("checks.nought2080MissingOrWrong") },
        {
          pass: ex.hasLineAt(10, 40, 30, 60),
          errorHtml: ex.t("checks.crossLine1040To3060MissingOrWrong")
        },
        {
          pass: ex.hasLineAt(10, 60, 30, 40),
          errorHtml: ex.t("checks.crossLine1060To3040MissingOrWrong")
        },
        { pass: ex.hasCircleAt(80, 50, 10), errorHtml: ex.t("checks.nought8050MissingOrWrong") },
        {
          pass: ex.wasWriteCalledWith("The game was a draw!"),
          errorHtml: ex.t("checks.didntWriteResultCorrectly")
        },
        { pass: ex.writeCallCount() === 1, errorHtml: ex.t("checks.wroteToScreenMultipleTimes") }
      ];
    }
  }
];
