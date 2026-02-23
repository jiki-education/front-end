import type { Task, VisualScenario } from "../types";
import type { TicTacToeExercise } from "./Exercise";

export const tasks = [
  {
    id: "play-tic-tac-toe" as const,
    name: "Build the Tic Tac Toe game",
    description:
      "Create a runGame(moves) function that draws a board, places pieces, handles invalid moves, detects wins and draws, and implements basic AI for '?' moves.",
    hints: [
      "Start with drawing the grid using rectangle() and line()",
      "Create helper functions like drawCross() and drawNaught()",
      "Use a 2D list to track board state",
      "Check all 8 winning lines (3 rows, 3 columns, 2 diagonals) after each move",
      "For AI moves, try winning first, then blocking, then any open square"
    ],
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
    name: "The first few moves of a game",
    description: "Draw the grid and place the first few pieces correctly. The game is still in progress.",
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
        { pass: ex.hasRectangleAt(5, 5, 90, 90), errorHtml: "The game outline is wrong or missing." },
        { pass: ex.hasLineAt(5, 35, 95, 35), errorHtml: "The grid line from 5,35 to 95,35 is wrong or missing." },
        { pass: ex.hasLineAt(5, 65, 95, 65), errorHtml: "The grid line from 5,65 to 95,65 is wrong or missing." },
        { pass: ex.hasLineAt(35, 5, 35, 95), errorHtml: "The grid line from 35,5 to 35,95 is wrong or missing." },
        { pass: ex.hasLineAt(65, 5, 65, 95), errorHtml: "The grid line from 65,5 to 65,95 is wrong or missing." },
        { pass: ex.writeCallCount() === 0, errorHtml: "You wrote to the screen when the game is still going." },
        // Crosses at (2,3) -> cx=80,cy=50 and (2,2) -> cx=50,cy=50
        { pass: ex.hasLineAt(70, 10, 90, 30), errorHtml: "The cross line from 70,10 to 90,30 is wrong or missing." },
        { pass: ex.hasLineAt(70, 30, 90, 10), errorHtml: "The cross line from 70,30 to 90,10 is wrong or missing." },
        { pass: ex.hasLineAt(40, 40, 60, 60), errorHtml: "The cross line from 40,40 to 60,60 is wrong or missing." },
        { pass: ex.hasLineAt(40, 60, 60, 40), errorHtml: "The cross line from 40,60 to 60,40 is wrong or missing." },
        // Noughts at (1,3) -> 80,20 and (3,1) -> 20,80
        { pass: ex.hasCircleAt(80, 50, 10), errorHtml: "The nought at 80,50 is missing or wrong." },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: "The nought at 20,80 is missing or wrong." },
        { pass: !ex.hasRectangleAt(0, 0, 100, 100), errorHtml: "You drew a results screen but the game hasn't ended." }
      ];
    }
  },

  {
    slug: "draw",
    name: "A drawn game",
    description: "Play a full game that ends in a draw. All pieces should be greyed out with a draw message.",
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
        { pass: ex.hasRectangleAt(5, 5, 90, 90), errorHtml: "The game outline is wrong or missing." },
        { pass: ex.hasLineAt(5, 35, 95, 35), errorHtml: "The grid line from 5,35 to 95,35 is wrong or missing." },
        { pass: ex.hasLineAt(5, 65, 95, 65), errorHtml: "The grid line from 5,65 to 95,65 is wrong or missing." },
        { pass: ex.hasLineAt(35, 5, 35, 95), errorHtml: "The grid line from 35,5 to 35,95 is wrong or missing." },
        { pass: ex.hasLineAt(65, 5, 65, 95), errorHtml: "The grid line from 65,5 to 65,95 is wrong or missing." },
        { pass: ex.hasCircleAt(20, 20, 10), errorHtml: "The nought at 20,20 is missing or wrong." },
        {
          pass: ex.hasLineAt(40, 40, 60, 60),
          errorHtml: "The cross line from 40,40 to 60,60 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(40, 60, 60, 40),
          errorHtml: "The cross line from 40,60 to 60,40 is missing or wrong."
        },
        { pass: ex.hasCircleAt(50, 20, 10), errorHtml: "The nought at 50,20 is missing or wrong." },
        {
          pass: ex.hasLineAt(70, 10, 90, 30),
          errorHtml: "The cross line from 70,10 to 90,30 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(70, 30, 90, 10),
          errorHtml: "The cross line from 70,30 to 90,10 is missing or wrong."
        },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: "The nought at 20,80 is missing or wrong." },
        {
          pass: ex.hasLineAt(10, 40, 30, 60),
          errorHtml: "The cross line from 10,40 to 30,60 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(10, 60, 30, 40),
          errorHtml: "The cross line from 10,60 to 30,40 is missing or wrong."
        },
        { pass: ex.hasCircleAt(80, 80, 10), errorHtml: "The nought at 80,80 is missing or wrong." },
        {
          pass: ex.hasLineAt(40, 70, 60, 90),
          errorHtml: "The cross line from 40,70 to 60,90 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(40, 90, 60, 70),
          errorHtml: "The cross line from 40,90 to 60,70 is missing or wrong."
        },
        { pass: ex.hasCircleAt(80, 50, 10), errorHtml: "The nought at 80,50 is missing or wrong." },
        {
          pass: ex.wasWriteCalledWith("The game was a draw!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: "You didn't draw the overlay correctly." },
        {
          pass: ex.checkUniqueColoredLines(2),
          errorHtml: "We expected the crosses to be greyed out."
        },
        {
          pass: ex.checkUniqueColoredCircles(2),
          errorHtml: "We expected the noughts to be greyed out."
        }
      ];
    }
  },

  {
    slug: "double-placement-duplicate",
    name: "Placing an 'o' on an 'o'",
    description: "Placing a piece on an already occupied square should show an error.",
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
          errorHtml: "You didn't write the invalid move on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: "You didn't draw the overlay correctly." }
      ];
    }
  },

  {
    slug: "double-placement-on-top",
    name: "Placing an 'x' on an 'o'",
    description: "Placing a piece on top of an opponent's piece should show an error.",
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
          errorHtml: "You didn't write the invalid move on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: "You didn't draw the overlay correctly." }
      ];
    }
  },

  {
    slug: "win-x",
    name: "The crosses win!",
    description: "Play a game where the crosses win. The winning line should be highlighted.",
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
          errorHtml:
            "We expected to see black crosses during the game, then once the game was won, light-grey crosses and purple winning crosses."
        },
        {
          pass: ex.wasWriteCalledWith("The x's won!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: "You didn't draw the overlay correctly." }
      ];
    }
  },

  {
    slug: "win-o",
    name: "The noughts win!",
    description: "Play a game where the noughts win. The winning circles should be highlighted.",
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
        { pass: ex.hasCircleAt(20, 20, 10), errorHtml: "The nought at 20,20 is missing or wrong." },
        {
          pass: ex.hasLineAt(40, 10, 60, 30),
          errorHtml: "The cross line from 40,10 to 60,30 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(40, 30, 60, 10),
          errorHtml: "The cross line from 40,30 to 60,10 is missing or wrong."
        },
        { pass: ex.hasCircleAt(80, 20, 10), errorHtml: "The nought at 80,20 is missing or wrong." },
        {
          pass: ex.hasLineAt(10, 40, 30, 60),
          errorHtml: "The cross line from 10,40 to 30,60 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(10, 60, 30, 40),
          errorHtml: "The cross line from 10,60 to 30,40 is missing or wrong."
        },
        { pass: ex.hasCircleAt(50, 50, 10), errorHtml: "The nought at 50,50 is missing or wrong." },
        {
          pass: ex.hasLineAt(70, 40, 90, 60),
          errorHtml: "The cross line from 70,40 to 90,60 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(70, 60, 90, 40),
          errorHtml: "The cross line from 70,60 to 90,40 is missing or wrong."
        },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: "The nought at 20,80 is missing or wrong." },
        {
          pass: ex.checkUniqueColoredCircles(3),
          errorHtml:
            "We expected to see normal noughts during the game, then light-grey noughts and purple winning noughts."
        },
        {
          pass: ex.wasWriteCalledWith("The o's won!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." },
        { pass: ex.hasRectangleAt(0, 0, 100, 100), errorHtml: "You didn't draw the overlay correctly." }
      ];
    }
  },

  {
    slug: "ai-o-finish",
    name: "AI 'o' finish",
    description: "Can your AI finish the game successfully?",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 2], [1, 2], [1, 3], [3, 1], [2, 1], [3, 3], [3, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasLineAt(70, 10, 90, 30), errorHtml: "Did you add the blocking cross?" },
        { pass: ex.hasLineAt(70, 30, 90, 10), errorHtml: "Did you add the blocking cross?" },
        {
          pass: ex.wasWriteCalledWith("The game was a draw!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." }
      ];
    }
  },

  {
    slug: "ai-x-win",
    name: "AI 'x' win",
    description: "Can your AI win a game for crosses?",
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
          errorHtml: "Did you add the cross to the winning spot?"
        },
        {
          pass: ex.hasLineAt(70, 60, 90, 40),
          errorHtml: "Did you add the cross to the winning spot?"
        },
        {
          pass: ex.wasWriteCalledWith("The x's won!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." }
      ];
    }
  },

  {
    slug: "ai-o-win",
    name: "AI 'o' win",
    description: "Can your AI win a game for noughts?",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 1], [2, 2], [3, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasCircleAt(80, 80, 10), errorHtml: "Did you add the nought to the winning spot?" },
        {
          pass: ex.wasWriteCalledWith("The o's won!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." }
      ];
    }
  },

  {
    slug: "ai-x-block",
    name: "AI 'x' block",
    description: "Can your AI block the opponent's win?",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[3, 1], [2, 1], [2, 2], "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasLineAt(70, 10, 90, 30), errorHtml: "Did you add the blocking cross?" },
        { pass: ex.hasLineAt(70, 30, 90, 10), errorHtml: "Did you add the blocking cross?" },
        {
          pass: ex.writeCallCount() === 0,
          errorHtml: "You wrote to the screen when the game is still going."
        }
      ];
    }
  },

  {
    slug: "ai-game",
    name: "AI game",
    description: "Can your AI play this game out to a draw?",
    taskId: "play-tic-tac-toe",
    functionCall: {
      name: "run_game",
      args: [[[1, 1], [2, 2], [1, 2], "?", "?", "?", "?", "?", "?"]]
    },
    expectations(exercise) {
      const ex = exercise as TicTacToeExercise;
      return [
        { pass: ex.hasCircleAt(20, 20, 10), errorHtml: "The nought at 20,20 is missing or wrong." },
        {
          pass: ex.hasLineAt(40, 40, 60, 60),
          errorHtml: "The cross line from 40,40 to 60,60 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(40, 60, 60, 40),
          errorHtml: "The cross line from 40,60 to 60,40 is missing or wrong."
        },
        { pass: ex.hasCircleAt(50, 20, 10), errorHtml: "The nought at 50,20 is missing or wrong." },
        {
          pass: ex.hasLineAt(70, 10, 90, 30),
          errorHtml: "The cross line from 70,10 to 90,30 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(70, 30, 90, 10),
          errorHtml: "The cross line from 70,30 to 90,10 is missing or wrong."
        },
        { pass: ex.hasCircleAt(20, 80, 10), errorHtml: "The nought at 20,80 is missing or wrong." },
        {
          pass: ex.hasLineAt(10, 40, 30, 60),
          errorHtml: "The cross line from 10,40 to 30,60 is missing or wrong."
        },
        {
          pass: ex.hasLineAt(10, 60, 30, 40),
          errorHtml: "The cross line from 10,60 to 30,40 is missing or wrong."
        },
        { pass: ex.hasCircleAt(80, 50, 10), errorHtml: "The nought at 80,50 is missing or wrong." },
        {
          pass: ex.wasWriteCalledWith("The game was a draw!"),
          errorHtml: "You didn't write the result on the screen correctly."
        },
        { pass: ex.writeCallCount() === 1, errorHtml: "You wrote to the screen multiple times." }
      ];
    }
  }
];
