import type { Task, VisualScenario } from "../types";
import type MazeAutomatedSolveExercise from "./Exercise";

export const tasks = [
  {
    id: "straight-path" as const,
    name: "A straight path",
    description: "Move forward to the end of the maze.",
    hints: ["Just move forward each iteration"],
    requiredScenarios: ["maze-1"],
    bonus: false
  },
  {
    id: "turn-left" as const,
    name: "Turn left if you can",
    description: "If there's a path to the left, take it!",
    hints: ["Check can_turn_left() first", "If it's true, turn left then move"],
    requiredScenarios: ["left-turn"],
    bonus: false
  },
  {
    id: "turn-right" as const,
    name: "Turn right if you can't move straight or left",
    description: "If there's not a path to the left or straight ahead, take the path to the right.",
    hints: ["Use else if to check can_turn_right()", "Remember to turn right before moving"],
    requiredScenarios: ["right-turn", "forks"],
    bonus: false
  },
  {
    id: "turn-around" as const,
    name: "Turn around if needed",
    description:
      "Handle dead ends by turning around. If you can't go left, straight, or right, turn around and move forward.",
    hints: ["Turning around means turning left twice", "This goes in the final else block"],
    requiredScenarios: ["turn-around", "forks-2"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "Guide person to the end of the maze",
    description: "A straight path down",
    taskId: "straight-path",

    setup(exercise) {
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 0, 0, 0, 1],
        [0, 1, 1, 0, 0, 1, 0, 1, 1],
        [0, 1, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 4, 1, 1, 0, 1, 1, 0, 1],
        [1, 4, 4, 4, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 3, 1, 1, 1, 1]
      ]);
      ex.setupPosition(0, 0);
      ex.setupDirection("down");
    },

    expectations(exercise) {
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 8 && ex.characterCol === 4,
          errorHtml: "You didn't reach the end of the maze."
        }
      ];
    }
  }
];
