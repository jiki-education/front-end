import type { Task, VisualScenario } from "../types";
import type LookAroundExercise from "./Exercise";

export const tasks = [
  {
    id: "straight-path" as const,
    name: "A straight path",
    description: "Implement canMove() so the character can move forward to the end of the maze.",
    hints: [
      "Use look(\"ahead\") to check what's in front",
      "A space is safe if it's not \"fire\", \"wall\", or \"poop\""
    ],
    requiredScenarios: ["maze-1"],
    bonus: false
  },
  {
    id: "turn-left" as const,
    name: "Turn left if you can",
    description: "Implement canTurnLeft() so the character turns left when there's a path.",
    hints: ['Use look("left") to check what\'s to the left', "Return true if the space is safe to enter"],
    requiredScenarios: ["left-turn"],
    bonus: false
  },
  {
    id: "turn-right" as const,
    name: "Turn right if you can't move straight or left",
    description:
      "Implement canTurnRight() so the character turns right when it can't go left or straight.",
    hints: ['Use look("right") to check what\'s to the right', "Consider writing a shared helper function"],
    requiredScenarios: ["right-turn", "forks"],
    bonus: false
  },
  {
    id: "turn-around" as const,
    name: "Turn around if needed",
    description:
      "Handle dead ends by turning around. All three sensing functions should now work together to solve any maze.",
    hints: [
      "You should already have all three functions working",
      "The existing turn_around and loop code handles the rest"
    ],
    requiredScenarios: ["turn-around", "forks-2", "cover-old-ground"],
    bonus: false
  },
  {
    id: "bonus-challenges" as const,
    name: "Bonus challenges",
    description:
      "Can you only use the look() function once in the whole program? And can you solve it by only adding 13 lines of code?",
    hints: [
      "Write a single checkDirection(direction) function that uses look()",
      "Have canTurnLeft(), canTurnRight() and canMove() all call checkDirection()"
    ],
    requiredScenarios: ["bonus-1", "bonus-2"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "Guide person to the end of the maze",
    description: "A straight path down",
    taskId: "straight-path",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [1, 1, 1, 1, 2, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 3, 1, 1]
      ]);
      ex.setupPosition(0, 4);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 6 && ex.characterCol === 4,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "left-turn",
    name: "A single left turn",
    description: "Navigate a left turn",
    taskId: "turn-left",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 3],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 8,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: ex.direction === "right",
          errorHtml: "You seem to have done an extra unnecessary turn at the end."
        }
      ];
    }
  },
  {
    slug: "right-turn",
    name: "A single right turn",
    description: "Navigate a right turn",
    taskId: "turn-right",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [1, 1, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 8);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 0,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "forks",
    name: "Choose left if you can, otherwise choose right",
    description: "A maze with forks that tests left-priority",
    taskId: "turn-right",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 0, 0, 0, 3],
        [0, 1, 1, 1, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 4, 1, 1, 4, 1, 1, 1, 1],
        [1, 4, 4, 4, 4, 1, 1, 1, 1],
        [1, 1, 1, 1, 4, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 2 && ex.characterCol === 8,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "turn-around",
    name: "Turn around at a dead end",
    description: "A maze that requires turning around",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [1, 1, 1, 2, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 1],
        [1, 4, 4, 0, 1, 1, 0, 1, 1],
        [1, 4, 1, 0, 1, 1, 0, 1, 1],
        [1, 4, 4, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 1],
        [3, 0, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 3);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 7 && ex.characterCol === 0,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "forks-2",
    name: "Complex maze with forks and dead ends",
    description: "A complex maze testing the full algorithm",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 0, 0, 0, 1],
        [0, 1, 1, 0, 0, 1, 0, 1, 1],
        [0, 1, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 4, 1, 1, 0, 1, 1, 5, 1],
        [1, 4, 4, 4, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 3, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 8 && ex.characterCol === 4,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertFunctionDefined("can_turn_left"),
        errorHtml: "You should define a <code>canTurnLeft</code> function."
      },
      {
        pass: (result) => result.assertors.assertFunctionDefined("can_turn_right"),
        errorHtml: "You should define a <code>canTurnRight</code> function."
      },
      {
        pass: (result) => result.assertors.assertFunctionDefined("can_move"),
        errorHtml: "You should define a <code>canMove</code> function."
      },
      {
        pass: (result) => result.assertors.assertFunctionDefined("turn_around"),
        errorHtml: "You should define a <code>turnAround</code> function."
      }
    ]
  },
  {
    slug: "cover-old-ground",
    name: "Cover old ground if you need to",
    description: "A maze where you must backtrack to find the exit",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [3, 1, 0, 0, 2, 1, 1, 1, 1],
        [0, 1, 0, 1, 0, 1, 1, 1, 1],
        [0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0, 1, 4, 1, 1],
        [0, 1, 4, 1, 0, 1, 4, 1, 1],
        [5, 0, 0, 1, 0, 1, 4, 1, 1],
        [1, 4, 1, 1, 0, 4, 4, 1, 1],
        [1, 4, 4, 4, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 4);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 0 && ex.characterCol === 0,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "bonus-1",
    name: "Only write look() once",
    description: "Solve the maze with look() appearing only once in your code",
    taskId: "bonus-challenges",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [4, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 1, 0, 0, 0, 0, 1, 0, 1],
        [0, 1, 0, 1, 1, 3, 1, 0, 1],
        [0, 5, 0, 1, 1, 1, 1, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 5, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 2]
      ]);
      ex.setupPosition(8, 8);
      ex.setupDirection("left");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 4 && ex.characterCol === 5,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  },
  {
    slug: "bonus-2",
    name: "Add only 13 lines",
    description: "Solve the maze by adding only 13 lines of code",
    taskId: "bonus-challenges",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupGrid([
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [4, 0, 0, 0, 0, 0, 0, 0, 4],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 5, 0, 0, 0, 0, 0, 5, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 1, 1, 1]
      ]);
      ex.setupPosition(8, 4);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 0 && ex.characterCol === 0,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  }
];
